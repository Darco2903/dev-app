import { invoke } from "@tauri-apps/api/core";
import type { DnsRecordType } from "@/types/DnsRecordType";

export async function dns_list_dev(): Promise<DnsRecordType[]> {
    return invoke<DnsRecordType[]>("cloudflare_dns_list_dev");
}
