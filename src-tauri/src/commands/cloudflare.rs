use crate::{
    cloudflare::{cloudflare::Cloudflare, dns_record_type::DnsRecordType, CLOUDFLARE_CONFIG},
    state::AppState,
};
use cloudflare::{
    endpoints::dns::dns::{ListDnsRecords, ListDnsRecordsParams},
    framework::{
        auth::Credentials,
        client::{async_api::Client, ClientConfig},
        Environment,
    },
};
use tauri::Manager;

pub fn init_cloudflare() -> Result<Cloudflare, String> {
    let json: serde_json::Value = serde_json::from_str(&CLOUDFLARE_CONFIG)
        .map_err(|e| format!("Failed to parse config file: {}", e))?;

    let api_token = json["api_token"]
        .as_str()
        .ok_or_else(|| format!("Missing api_token in config file"))?;

    let zone_id = json["zone_id"]
        .as_str()
        .ok_or_else(|| format!("Missing zone_id in config file"))?;

    let credentials = Credentials::UserAuthToken {
        token: api_token.to_string(),
    };

    let client = Client::new(
        credentials,
        ClientConfig::default(),
        Environment::Production,
    )
    .map_err(|e| format!("Failed to create CLoudflare Client: {}", e))?;

    Ok(Cloudflare::new(client, zone_id.to_string()))
}

#[tauri::command]
pub async fn cloudflare_dns_list_dev(
    handle: tauri::AppHandle,
) -> Result<Vec<DnsRecordType>, String> {
    let state = handle.state::<AppState>();
    let cloudflare = state.cloudflare.lock().await;

    let req = ListDnsRecords {
        zone_identifier: &cloudflare.zone_id,
        params: ListDnsRecordsParams {
            per_page: Some(100),
            page: Some(1),
            ..Default::default()
        },
    };

    let res = cloudflare
        .client
        .request(&req)
        .await
        .map_err(|e| format!("Error fetching DNS records: {}", e))?;

    Ok(res
        .result
        .into_iter()
        .filter_map(|r| {
            if r.name.contains("dev-") {
                Some(DnsRecordType::from_dns_record(r))
            } else {
                None
            }
        })
        .collect())
}
