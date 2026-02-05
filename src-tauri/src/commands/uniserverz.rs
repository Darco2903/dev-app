use crate::state::AppState;
use crate::uniserverz::{info::UniServerzInfo, uni::Uni};
use std::path::Path;
use tauri::Manager;

#[tauri::command]
pub fn init_uni(handle: tauri::AppHandle, name: String, path: &str) -> Result<(), String> {
    let uni = Uni::create_uni(name, Path::new(path))
        .map_err(|e| format!("Failed to create Uni instance: {}", e))?;

    let state = handle.state::<AppState>();
    let mut uni_option = state.uni.blocking_lock();
    *uni_option = Some(uni);

    Ok(())
}

#[tauri::command]
pub fn unset_uni(handle: tauri::AppHandle) -> Result<(), String> {
    let state = handle.state::<AppState>();
    let mut uni_option = state.uni.blocking_lock();
    *uni_option = None;

    Ok(())
}

#[tauri::command]
pub async fn uniserverz_info(handle: tauri::AppHandle) -> Result<UniServerzInfo, String> {
    println!("Checking Uni server status...");

    let state = handle.state::<AppState>();
    let uni_option = state.uni.lock().await;

    if uni_option.is_none() {
        return Err("Uni server is not initialized.".to_string());
    }

    let uni = uni_option.as_ref().unwrap();

    let status = uni
        .info()
        .await
        .map_err(|e| format!("Failed to get Uni server info: {}", e))?;

    Ok(status)
}

#[tauri::command]
pub async fn uniserverz_toggle_both(handle: tauri::AppHandle, enable: bool) -> Result<(), String> {
    let state = handle.state::<AppState>();
    let mut uni_option = state.uni.lock().await;

    if uni_option.is_none() {
        return Err("Uni server is not initialized.".to_string());
    }

    let uni = uni_option.as_mut().unwrap();

    if uni.is_busy() {
        eprintln!("Uni server is currently busy.");
        Err("Uni server is currently busy.".to_string())
    } else {
        if enable {
            println!("Starting Uni server...");
            uni.start_both().await?;
        } else {
            println!("Stopping Uni server...");
            uni.stop_both().await?;
        }
        println!("Uni server toggled successfully.");
        Ok(())
    }
}

#[tauri::command]
pub async fn uniserverz_toggle_apache(
    handle: tauri::AppHandle,
    enable: bool,
) -> Result<(), String> {
    let state = handle.state::<AppState>();
    let mut uni_option = state.uni.lock().await;

    if uni_option.is_none() {
        return Err("Uni server is not initialized.".to_string());
    }

    let uni = uni_option.as_mut().unwrap();

    if uni.is_busy() {
        eprintln!("Uni server is currently busy.");
        Err("Uni server is currently busy.".to_string())
    } else {
        if enable {
            uni.start_apache().await?;
        } else {
            uni.stop_apache().await?;
        }
        Ok(())
    }
}

#[tauri::command]
pub async fn uniserverz_toggle_mysql(handle: tauri::AppHandle, enable: bool) -> Result<(), String> {
    let state = handle.state::<AppState>();
    let mut uni_option = state.uni.lock().await;

    if uni_option.is_none() {
        return Err("Uni server is not initialized.".to_string());
    }

    let uni = uni_option.as_mut().unwrap();

    if uni.is_busy() {
        eprintln!("Uni server is currently busy.");
        Err("Uni server is currently busy.".to_string())
    } else {
        if enable {
            uni.start_mysql().await?;
        } else {
            uni.stop_mysql().await?;
        }
        Ok(())
    }
}
