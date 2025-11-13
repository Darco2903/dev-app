use cloudflare::framework::client::async_api::Client;

pub struct Cloudflare {
    pub client: Client,
    pub zone_id: String,
}

impl Cloudflare {
    pub fn new(client: Client, zone_id: String) -> Self {
        Cloudflare { client, zone_id }
    }
}
