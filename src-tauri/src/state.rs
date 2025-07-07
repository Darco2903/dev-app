use crate::uniserverz::uni::Uni;
use tokio::sync::Mutex;

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
