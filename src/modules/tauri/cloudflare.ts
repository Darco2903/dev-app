import { invoke } from "@tauri-apps/api/core";
import type { DnsRecordType } from "@/types/bindings/DnsRecordType";

export async function init_cloudflare(apiToken: string, zoneId: string): Promise<void> {
    return invoke<void>("init_cloudflare", { apiToken, zoneId });
}

export async function unset_cloudflare(): Promise<void> {
    return invoke<void>("unset_cloudflare");
}

export async function dns_list_dev(): Promise<DnsRecordType[]> {
    return invoke<DnsRecordType[]>("cloudflare_dns_list_dev");
}
