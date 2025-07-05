use std::process::Command;

#[derive(serde::Serialize, serde::Deserialize)]
pub enum TTTT {
    RUNNING,
    STOPPED,
    ERROR,
    UNKNOWN,
}

impl From<&str> for TTTT {
    fn from(status: &str) -> Self {
        match status {
            "RUNNING" => TTTT::RUNNING,
            "STOPPED" => TTTT::STOPPED,
            "ERROR" => TTTT::ERROR,
            _ => TTTT::UNKNOWN,
        }
    }
}

#[tauri::command]
pub fn toggle(eanble: bool) -> Result<(), String> {
    let status = if eanble { "start" } else { "stop" };
    let arg: String = format!(
        "Start-Process cmd -Verb RunAs -ArgumentList '/c sc {} cloudflared' -WindowStyle Hidden",
        status
    );

    let output = Command::new("powershell")
        .arg("-Command")
        .arg(arg)
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
pub fn status() -> Result<TTTT, String> {
    let output = Command::new("sc")
        .arg("query")
        .arg("cloudflared")
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

    Ok(TTTT::from(status))
}
