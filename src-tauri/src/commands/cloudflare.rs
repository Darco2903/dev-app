use crate::{
    cloudflare::{cloudflare::Cloudflare, dns_record_type::DnsRecordType},
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

#[tauri::command]
pub fn init_cloudflare(
    handle: tauri::AppHandle,
    api_token: String,
    zone_id: String,
) -> Result<(), String> {
    let credentials = Credentials::UserAuthToken { token: api_token };

    let client = Client::new(
        credentials,
        ClientConfig::default(),
        Environment::Production,
    )
    .map_err(|e| format!("Failed to create Cloudflare Client: {}", e))?;

    let state = handle.state::<AppState>();
    let mut cloudflare_option = state.cloudflare.blocking_lock();
    *cloudflare_option = Some(Cloudflare::new(client, zone_id.clone()));

    Ok(())
}

#[tauri::command]
pub fn unset_cloudflare(handle: tauri::AppHandle) -> Result<(), String> {
    let state = handle.state::<AppState>();
    let mut cloudflare_option = state.cloudflare.blocking_lock();
    *cloudflare_option = None;

    Ok(())
}

#[tauri::command]
pub async fn cloudflare_dns_list_dev(
    handle: tauri::AppHandle,
) -> Result<Vec<DnsRecordType>, String> {
    let state = handle.state::<AppState>();

    // unwrap or error
    let cloudflare_option = state.cloudflare.lock().await;

    if cloudflare_option.is_none() {
        return Err("Cloudflare client is not initialized.".to_string());
    }

    let cloudflare = cloudflare_option.as_ref().unwrap();

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
