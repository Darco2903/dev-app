use cloudflare::endpoints::dns::dns::{DnsContent, DnsRecord};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS)]
#[ts(export)]
pub struct DnsRecordType {
    pub id: String,
    pub record_type: String,
    pub name: String,
    pub content: String,
    pub ttl: u32,
    pub proxied: bool,
}

impl DnsRecordType {
    fn record_type(record: &DnsRecord) -> (String, String) {
        match &record.content {
            DnsContent::A { content } => (content.to_string(), "A".to_string()),
            DnsContent::AAAA { content } => (content.to_string(), "AAAA".to_string()),
            DnsContent::CNAME { content } => (content.to_string(), "CNAME".to_string()),
            DnsContent::TXT { content } => (content.to_string(), "TXT".to_string()),
            DnsContent::MX { content, .. } => (content.to_string(), "MX".to_string()),
            DnsContent::SRV { content } => (content.to_string(), "SRV".to_string()),
            DnsContent::NS { content } => (content.to_string(), "NS".to_string()),
        }
    }

    pub fn from_dns_record(record: DnsRecord) -> Self {
        let (content, record_type) = DnsRecordType::record_type(&record);
        DnsRecordType {
            id: record.id,
            record_type: record_type,
            name: record.name.clone(),
            content: content,
            ttl: record.ttl,
            proxied: record.proxied,
        }
    }
}
