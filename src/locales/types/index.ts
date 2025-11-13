import type { LocaleTL, ThemeTL } from "./common";
import type { NavBar } from "./NavBar";
import type { DNS } from "./DNS";
import type { Settings } from "./Settings";

export type LocalesSchema = {
    common: {
        locale: LocaleTL;
        theme: ThemeTL;
    };
    navBar: NavBar;
    dns: DNS;
    settings: Settings;
};

export enum Locale {
    EN = "en",
    FR = "fr",
}
