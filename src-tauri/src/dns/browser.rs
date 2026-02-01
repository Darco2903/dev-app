use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub enum Browser {
    // The bool indicates whether to open in private mode
    Edge(bool),
    Opera(bool),
}

impl Browser {
    fn cmd_str(&self, exec: &str, private_flag: &str, url: &str) -> String {
        format!(
            "Start-Process {} -ArgumentList \"{} {}\"",
            exec, private_flag, url
        )
    }

    pub fn command(&self, url: &str) -> String {
        match self {
            Browser::Edge(private) => {
                let exec: &str = "msedge.exe";
                if *private {
                    self.cmd_str(exec, "-inprivate", url)
                } else {
                    self.cmd_str(exec, "", url)
                }
            }
            Browser::Opera(private) => {
                let exec: &str = "opera.exe";
                if *private {
                    self.cmd_str(exec, "-private", url)
                } else {
                    self.cmd_str(exec, "", url)
                }
            }
        }
    }
}
