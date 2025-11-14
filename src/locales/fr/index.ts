import type { LocalesSchema } from "../types";

import * as Common from "./common";
import NavBar from "./NavBar";
import Cloudflared from "./Cloudflared";
import Uniserverz from "./Uniserverz";
import DNS from "./DNS";
import Settings from "./Settings";

export default {
    common: {
        locale: Common.localeTL,
        theme: Common.themeTL,
        refresh: Common.refreshTL,
    },
    navBar: NavBar,
    cloudflared: Cloudflared,
    uniserverz: Uniserverz,
    dns: DNS,
    settings: Settings,
} satisfies LocalesSchema;
