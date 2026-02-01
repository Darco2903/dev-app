use crate::dns::browser::Browser;
use std::{os::windows::process::CommandExt, process::Command};

#[tauri::command]
pub fn dns_open_url_in_browser(browser: Browser, url: String) -> Result<(), String> {
    let cmd = browser.command(&url);
    println!("Executing command: {}", cmd);
    Command::new("powershell")
        .arg("-Command")
        .arg(cmd)
        .creation_flags(0x08000000) // CREATE_NO_WINDOW
        .spawn()
        .map_err(|err| format!("Failed to open URL in browser: {}", err))?;
    Ok(())
}
