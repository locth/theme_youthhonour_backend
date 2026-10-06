/** @odoo-module **/
// Navbar: đánh dấu mục menu của app ứng với action đang mở (Odoo Community không có sẵn).

import { useEffect } from "@odoo/owl";
import { patch } from "@web/core/utils/patch";
import { useBus, useService } from "@web/core/utils/hooks";
import { NavBar } from "@web/webclient/navbar/navbar";

function containsAction(section, actionId) {
    if (section.actionID === actionId) {
        return true;
    }
    return (section.childrenTree || []).some((child) => containsAction(child, actionId));
}

patch(NavBar.prototype, {
    setup() {
        super.setup(...arguments);
        this.yhAction = useService("action");
        useEffect(() => this.yhMarkActiveSection());
        useBus(this.env.bus, "ACTION_MANAGER:UI-UPDATED", () => this.yhMarkActiveSection());
    },

    yhMarkActiveSection() {
        const root = this.root?.el;
        if (!root) {
            return;
        }
        const actionId = this.yhAction.currentController?.action?.id;
        const active = new Set(
            (this.currentAppSections || [])
                .filter((section) => actionId && containsAction(section, actionId))
                .map((section) => String(section.id))
        );
        for (const el of root.querySelectorAll(".o_menu_sections [data-section]")) {
            const on = active.has(el.dataset.section);
            el.classList.toggle("yh_active", on);
            if (on) {
                el.setAttribute("aria-current", "page");
            } else {
                el.removeAttribute("aria-current");
            }
        }
    },
});
