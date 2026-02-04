use crate::{cloudflare::cloudflare::Cloudflare, uniserverz::uni::Uni};
use tokio::sync::Mutex;

pub struct AppState {
    pub uni: Mutex<Option<Uni>>,
    pub cloudflare: Mutex<Option<Cloudflare>>,
}

impl AppState {
    pub fn new() -> Self {
        AppState {
            uni: Mutex::new(None),
            cloudflare: Mutex::new(None),
        }
    }
}
