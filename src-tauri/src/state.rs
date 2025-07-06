use tokio::sync::Mutex;

use crate::uniserverz::uni::Uni;

pub struct AppState {
    pub uni: Mutex<Uni>,
}

impl AppState {
    pub fn new(uni: Uni) -> Self {
        AppState {
            uni: Mutex::new(uni),
        }
    }
}
