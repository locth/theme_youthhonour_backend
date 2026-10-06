/** @odoo-module **/
// Mục "Giao diện tối / sáng" trong menu người dùng. Odoo chọn bundle web.assets_web_dark khi
// cookie color_scheme=dark (webclient_templates.xml), nhưng bản Community không có nút chuyển.

import { browser } from "@web/core/browser/browser";
import { cookie } from "@web/core/browser/cookie";
import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";

function colorSchemeItem() {
    const isDark = cookie.get("color_scheme") === "dark";
    return {
        type: "item",
        id: "yh_color_scheme",
        description: isDark ? _t("Giao diện sáng") : _t("Giao diện tối"),
        callback: () => {
            cookie.set("color_scheme", isDark ? "light" : "dark");
            browser.location.reload();
        },
        sequence: 45,
    };
}

registry.category("user_menuitems").add("yh_color_scheme", colorSchemeItem);
