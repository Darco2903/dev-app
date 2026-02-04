import type * as Common from "./common";
import type { NavBar } from "./NavBar";
import type { Cloudflared } from "./Cloudflared";
import type { Uniserverz } from "./Uniserverz";
import type { DNS } from "./DNS";
import type { Config } from "./Config";
import type { Settings } from "./Settings";

export type LocalesSchema = {
    common: {
        locale: Common.LocaleTL;
        theme: Common.ThemeTL;
        refresh: Common.RefreshTL;
    };
    navBar: NavBar;
    cloudflared: Cloudflared;
    uniserverz: Uniserverz;
    dns: DNS;
    config: Config;
    settings: Settings;
};

export enum Locale {
    EN = "en",
    FR = "fr",
}
