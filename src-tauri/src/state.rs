use crate::{cloudflare::cloudflare::Cloudflare, uniserverz::uni::Uni};
use tokio::sync::Mutex;

pub struct AppState {
    pub uni: Mutex<Uni>,
    pub cloudflare: Mutex<Cloudflare>,
}

impl AppState {
    pub fn new(uni: Uni, cloudflare: Cloudflare) -> Self {
        AppState {
            uni: Mutex::new(uni),
            cloudflare: Mutex::new(cloudflare),
        }
    }
}
