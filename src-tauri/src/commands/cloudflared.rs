use std::{os::windows::process::CommandExt, process::Command};

#[derive(serde::Serialize)]
pub enum Status {
    RUNNING,
    STOPPED,
    ERROR,
    UNKNOWN,
}

impl From<&str> for Status {
    fn from(status: &str) -> Self {
        match status {
            "RUNNING" => Status::RUNNING,
            "STOPPED" => Status::STOPPED,
            "ERROR" => Status::ERROR,
            _ => Status::UNKNOWN,
        }
    }
}

#[tauri::command]
pub fn cloudflared_toggle(enable: bool) -> Result<(), String> {
    let status = if enable { "start" } else { "stop" };
    let arg: String = format!(
        "Start-Process cmd -Verb RunAs -ArgumentList '/c sc {} cloudflared' -WindowStyle Hidden",
        status
    );

    let output = Command::new("powershell")
        .arg("-Command")
        .arg(arg)
        .creation_flags(0x08000000) // CREATE_NO_WINDOW
        .output()
        .map_err(|e| format!("Failed to execute cloudflared: {}", e))?;

    if !output.status.success() {
        return Err(format!(
            "cloudflared {} failed: {}",
            status,
            String::from_utf8_lossy(&output.stderr)
        ));
    }

    Ok(())
}

// #[tauri::command(rename = "cloudflared_status")]
#[tauri::command]
pub fn cloudflared_status() -> Result<Status, String> {
    let output = Command::new("sc")
        .arg("query")
        .arg("cloudflared")
        .creation_flags(0x08000000) // CREATE_NO_WINDOW
        .output()
        .map_err(|e| format!("Failed to query cloudflared status: {}", e))?;

    if !output.status.success() {
        return Err(format!(
            "Failed to query cloudflared status: {}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }

    let string_output = String::from_utf8_lossy(&output.stdout);
    let line = string_output
        .lines()
        .find(|line| line.trim().starts_with("STATE"))
        .unwrap_or("");
    let status = line.split_ascii_whitespace().last().unwrap_or("UNKNOWN");
    println!("State: {}", status);

    Ok(Status::from(status))
}
