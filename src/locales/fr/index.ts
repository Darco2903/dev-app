import type { LocalesSchema } from "../types";

import { localeTL, themeTL } from "./common";
import NavBar from "./NavBar";
import DNS from "./DNS";
import Settings from "./Settings";

export default {
    common: {
        locale: localeTL,
        theme: themeTL,
    },
    navBar: NavBar,
    dns: DNS,
    settings: Settings,
} satisfies LocalesSchema;
