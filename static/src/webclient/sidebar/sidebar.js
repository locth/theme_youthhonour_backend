/** @odoo-module **/
// Sidebar danh sách ứng dụng bên trái.
// Ý tưởng lấy từ muk_web_appsbar (MuK IT, LGPL-3), viết lại gọn để thay thế module đó.

import { Component, onWillUnmount } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { user } from "@web/core/user";
import { computeAppsAndMenuItems, reorderApps } from "@web/webclient/menus/menu_helpers";

export class YhSidebar extends Component {
    static template = "theme_youthhonour_backend.Sidebar";
    static props = {};

    setup() {
        this.menuService = useService("menu");
        const rerender = () => this.render();
        this.env.bus.addEventListener("MENUS:APP-CHANGED", rerender);
        onWillUnmount(() => this.env.bus.removeEventListener("MENUS:APP-CHANGED", rerender));
    }

    get apps() {
        const { apps } = computeAppsAndMenuItems(this.menuService.getMenuAsTree("root"));
        // Giữ thứ tự app mà người dùng đã sắp trong menu ứng dụng (nếu có)
        const config = JSON.parse(user.settings?.homemenu_config || "null");
        if (config) {
            reorderApps(apps, config);
        }
        return apps;
    }

    get currentAppId() {
        return this.menuService.getCurrentApp()?.id;
    }

    onAppClick(app) {
        return this.menuService.selectMenu(app);
    }
}
