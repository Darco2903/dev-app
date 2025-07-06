use std::fs;
use std::os::windows::process::CommandExt;
use std::path::{Path, PathBuf};
use std::process::Command;

use crate::uniserverz::info::UniServerzInfo;

const APACHE_PATH: &str = "core/apache2/bin";
const MYSQL_PATH: &str = "core/mysql/bin";
const APACHE_EXEC_PREFIX: &str = "httpd_";
const MYSQL_EXEC_PREFIX: &str = "mysqld_";

enum Commands {
    StartApache,
    StopApache,
    StartMysql,
    StopMysql,
    StartBoth,
    StopBoth,
}

impl ToString for Commands {
    fn to_string(&self) -> String {
        match self {
            Commands::StartApache => "start_apache".to_string(),
            Commands::StopApache => "stop_apache".to_string(),
            Commands::StartMysql => "start_mysql".to_string(),
            Commands::StopMysql => "stop_mysql".to_string(),
            Commands::StartBoth => "start_both".to_string(),
            Commands::StopBoth => "stop_both".to_string(),
        }
    }
}

#[derive(Default)]
pub struct Uni {
    name: String,
    exec_path: String,
    apache_exec: String,
    mysql_exec: String,
    busy: bool,
}

impl Uni {
    pub fn new(name: String, exec_path: String, apache_exec: String, mysql_exec: String) -> Self {
        Uni {
            name,
            exec_path,
            apache_exec,
            mysql_exec,
            busy: false,
        }
    }

    fn get_exec_path(path: &Path, name: &str) -> Result<String, String> {
        let mut main_dir =
            fs::read_dir(path).map_err(|e| format!("Failed to read directory: {}", e))?;

        let main_exec = main_dir
            .find_map(|elem| match elem {
                Ok(entry) => {
                    let f_name = entry.file_name();
                    let filename = f_name.to_string_lossy();
                    if filename.starts_with(name) && filename.ends_with(".exe") {
                        Some(filename.to_string())
                    } else {
                        None
                    }
                }
                Err(_) => None,
            })
            .ok_or(format!(
                "No executable found starting with '{}' in {}",
                name,
                path.display()
            ))?;

        let main_path = Path::new(path).join(main_exec);
        Ok(main_path.to_string_lossy().to_string())
    }

    pub fn create_uni(name: String, path: &Path) -> Result<Self, String> {
        let exec_path = Uni::get_exec_path(path, "UniController")?;
        let apache_exec = Uni::get_exec_path(&path.join(APACHE_PATH), APACHE_EXEC_PREFIX)?;
        let mysql_exec = Uni::get_exec_path(&path.join(MYSQL_PATH), MYSQL_EXEC_PREFIX)?;

        Ok(Uni::new(name, exec_path, apache_exec, mysql_exec))
    }

    // pub fn get_name(&self) -> &str {
    //     &self.name
    // }

    pub fn is_busy(&self) -> bool {
        self.busy
    }

    fn is_running(process_path: &str) -> Result<bool, String> {
        let process_name = PathBuf::from(process_path)
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string();

        println!("Checking if process '{}' is running...", process_name);

        Command::new("tasklist")
            .arg("/FI")
            .arg(format!("IMAGENAME eq {}", process_name))
            .creation_flags(0x08000000) // CREATE_NO_WINDOW
            .output()
            .map(|output| {
                let stdout = String::from_utf8_lossy(&output.stdout);
                stdout.contains(&process_name)
            })
            .map_err(|e| format!("Failed to check process: {}", e))
    }

    pub fn is_apache_running(&self) -> Result<bool, String> {
        Uni::is_running(&self.apache_exec)
    }

    pub fn is_mysql_running(&self) -> Result<bool, String> {
        Uni::is_running(&self.mysql_exec)
    }

    // pub fn is_both_running(&self) -> Result<bool, String> {
    //     let apache_running = self.is_apache_running()?;
    //     let mysql_running = self.is_mysql_running()?;
    //     Ok(apache_running && mysql_running)
    // }

    async fn exec(&mut self, command: Commands) -> Result<(), String> {
        if self.busy {
            return Err("Uni instance is busy".to_string());
        }

        self.busy = true;
        let cmd = command.to_string();
        println!("Executing command: {}", cmd);

        let mut a = Command::new(&self.exec_path)
            .arg(&cmd)
            .creation_flags(0x08000000) // CREATE_NO_WINDOW
            .spawn()
            .map_err(|e| format!("Failed to execute command '{}': {}", cmd, e))?;

        let status = a
            .wait()
            .map_err(|e| format!("Failed to wait for command '{}': {}", cmd, e))?;

        println!("Command '{}' finished with status: {}", cmd, status);

        self.busy = false;

        println!("Command '{}' executed successfully.", cmd);

        Ok(())
    }

    pub async fn start_apache(&mut self) -> Result<(), String> {
        self.exec(Commands::StartApache).await
    }

    pub async fn stop_apache(&mut self) -> Result<(), String> {
        self.exec(Commands::StopApache).await
    }

    pub async fn start_mysql(&mut self) -> Result<(), String> {
        self.exec(Commands::StartMysql).await
    }

    pub async fn stop_mysql(&mut self) -> Result<(), String> {
        self.exec(Commands::StopMysql).await
    }

    pub async fn start_both(&mut self) -> Result<(), String> {
        self.exec(Commands::StartBoth).await
    }

    pub async fn stop_both(&mut self) -> Result<(), String> {
        self.exec(Commands::StopBoth).await
    }

    pub async fn info(&self) -> Result<UniServerzInfo, String> {
        let apache = self.is_apache_running()?;
        let mysql = self.is_mysql_running()?;
        Ok(UniServerzInfo::new(self.name.to_string(), apache, mysql))
    }
}
