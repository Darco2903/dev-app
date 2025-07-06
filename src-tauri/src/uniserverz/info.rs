#[derive(serde::Serialize)]
pub struct UniServerzInfo {
    name: String,
    apache: bool,
    mysql: bool,
}

impl UniServerzInfo {
    pub fn new(name: String, apache: bool, mysql: bool) -> Self {
        UniServerzInfo {
            name,
            apache,
            mysql,
        }
    }
}
