mod commands;
mod state;
mod uniserverz;

use crate::commands::uniserverz::init_uni;
use state::AppState;
use tauri::{
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Manager, WindowEvent,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            app.get_webview_window("main")
                .expect("Failed to get main window")
                .set_focus()
                .expect("Failed to focus main window");
        }))
        .on_window_event(|window, event| {
            // listen on minimize, maximize, and close events
            match event {
                WindowEvent::CloseRequested { .. } => {
                    // Wait for lock to be released before closing
                    let state = window.state::<AppState>();
                    let _ = state.uni.blocking_lock();
                }

                WindowEvent::Resized(new_inner_size) => {
                    if new_inner_size.height == 0 && new_inner_size.width == 0 {
                        window.hide().expect("Failed to hide window");
                    }
                }
                _ => {}
            }
        })
        .on_tray_icon_event(|app, event| match event {
            TrayIconEvent::Click { button, .. } => {
                if button == MouseButton::Left {
                    // Restore the window state when the tray icon is clicked
                    let windows = app.webview_windows();
                    if let Some(window) = windows.get("main") {
                        window.show().expect("Failed to show window");
                        window.unminimize().expect("Failed to unminimize window");
                        window.set_focus().expect("Failed to focus window");
                    }
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            commands::cloudflared::cloudflared_status,
            commands::cloudflared::cloudflared_toggle,
            commands::uniserverz::uniserverz_info,
            commands::uniserverz::uniserverz_toggle_both,
            commands::uniserverz::uniserverz_toggle_apache,
            commands::uniserverz::uniserverz_toggle_mysql,
        ])
        .setup(|app| {
            let uni = init_uni().expect("Failed to initialize Uni instance");
            let state = AppState::new(uni);
            app.manage(state);

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .build(app)?;

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
