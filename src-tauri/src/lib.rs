mod commands;
mod state;
mod uniserverz;

use crate::commands::uniserverz::init_uni;
use state::AppState;
use tauri::{
    path::BaseDirectory,
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Manager, WindowEvent,
};
use tauri_plugin_window_state::{AppHandleExt, StateFlags, WindowExt};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .on_window_event(|window, event| {
            // listen on minimize, maximize, and close events
            match event {
                WindowEvent::CloseRequested { api, .. } => {
                    // Save the window state before closing
                    api.prevent_close();
                    let app = window.app_handle();
                    app.save_window_state(StateFlags::all())
                        .expect("Failed to save window state");

                    std::process::exit(0);
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
            // commands::uniserverz::get_uni,
        ])
        .setup(|app| {
            let windows = app.webview_windows();
            let window = windows.get("main").unwrap();
            window
                .restore_state(StateFlags::all())
                .expect("Failed to restore window state");

            window
                .set_maximizable(false)
                .expect("Failed to set window minimizable");

            window
                .set_resizable(false)
                .expect("Failed to set window resizable");

            let pb = app
                .path()
                .resolve("config", BaseDirectory::Resource)
                .expect("Failed to get app data directory");

            println!("App data directory: {}", pb.to_string_lossy());

            let p = pb.to_str().expect("Failed to convert path to string");
            let uni = init_uni(p).expect("Failed to initialize Uni instance");
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
