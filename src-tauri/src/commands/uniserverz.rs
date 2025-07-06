use crate::state::AppState;
use crate::uniserverz::UNI_CONFIG;
use crate::uniserverz::{info::UniServerzInfo, uni::Uni};
use tauri::Manager;

pub fn init_uni() -> Result<Uni, String> {
    let json: serde_json::Value = serde_json::from_str(&UNI_CONFIG)
        .map_err(|e| format!("Failed to parse config file: {}", e))?;

    let name = json["name"]
        .as_str()
        .ok_or("Name not found in config file")?;

    let path = json["path"]
        .as_str()
        .ok_or("Path not found in config file")?;

    let uni = Uni::create_uni(name.to_string(), &std::path::Path::new(path))
        .map_err(|e| format!("Failed to create Uni instance: {}", e))?;

    Ok(uni)
}

#[tauri::command]
pub async fn uniserverz_info(handle: tauri::AppHandle) -> Result<UniServerzInfo, String> {
    println!("Checking Uni server status...");

    let state = handle.state::<AppState>();
    let uni = state.uni.lock().await;

    let status = uni
        .info()
        .await
        .map_err(|e| format!("Failed to get Uni server info: {}", e))?;

    Ok(status)
}

#[tauri::command]
pub async fn uniserverz_toggle_both(handle: tauri::AppHandle, enable: bool) -> Result<(), String> {
    let state = handle.state::<AppState>();
    let mut uni = state.uni.lock().await;

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
    let mut uni = state.uni.lock().await;

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
    let mut uni = state.uni.lock().await;

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
