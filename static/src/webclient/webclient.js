/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { WebClient } from "@web/webclient/webclient";
import { YhSidebar } from "./sidebar/sidebar";

patch(WebClient, {
    components: { ...WebClient.components, YhSidebar },
});
