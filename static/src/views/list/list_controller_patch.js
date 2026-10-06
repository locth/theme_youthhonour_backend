/** @odoo-module **/
// List view: hàng chip lọc nhanh + phân trang dạng số + "Xuất Excel" cho thanh tiêu đề nhóm.
//
// Chip lọc nhanh: mọi <filter> trong search view có name bắt đầu bằng "yh_quick_".
//   - filter thường: chọn một (bấm lại để bỏ); chip "Tất cả" bỏ hết.
//   - filter group_by: chip viền đứt, bấm để bật/tắt nhóm.

import { Component, useState, useSubEnv } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { unique } from "@web/core/utils/arrays";
import { patch } from "@web/core/utils/patch";
import { useBus } from "@web/core/utils/hooks";
import { ListController } from "@web/views/list/list_controller";

const QUICK_PREFIX = "yh_quick_";

function isGrouped(env) {
    return Boolean(env.searchModel?.groupBy?.length);
}

export class YhQuickFilters extends Component {
    static template = "theme_youthhonour_backend.QuickFilters";
    static props = {};

    setup() {
        this.searchModel = this.env.searchModel;
        this.pager = useState(this.env.config.pagerProps || {});
        useBus(this.searchModel, "update", () => this.render());
    }

    get items() {
        if (!this.searchModel) {
            return [];
        }
        return this.searchModel.getSearchItems(
            (item) =>
                ["filter", "groupBy"].includes(item.type) &&
                typeof item.name === "string" &&
                item.name.startsWith(QUICK_PREFIX)
        );
    }

    get filters() {
        return this.items.filter((item) => item.type === "filter");
    }

    get groupBys() {
        return this.items.filter((item) => item.type === "groupBy");
    }

    get noneActive() {
        return !this.filters.some((item) => item.isActive);
    }

    get countLabel() {
        const total = this.pager.total;
        return typeof total === "number" && !isGrouped(this.env) ? String(total) : "";
    }

    clearFilters() {
        const groupIds = new Set(this.filters.filter((i) => i.isActive).map((i) => i.groupId));
        for (const groupId of groupIds) {
            this.searchModel.deactivateGroup(groupId);
        }
    }

    toggleFilter(item) {
        const wasActive = item.isActive;
        this.clearFilters();
        if (!wasActive) {
            this.searchModel.toggleSearchItem(item.id);
        }
    }

    toggleGroupBy(item) {
        this.searchModel.toggleSearchItem(item.id);
    }
}

export class YhNumberPager extends Component {
    static template = "theme_youthhonour_backend.NumberPager";
    static props = {};

    setup() {
        this.pager = useState(this.env.config.pagerProps || {});
    }

    get visible() {
        const { total, limit } = this.pager;
        return typeof total === "number" && limit && total > limit && !isGrouped(this.env);
    }

    get current() {
        return Math.floor((this.pager.offset || 0) / this.pager.limit);
    }

    get pageCount() {
        return Math.ceil(this.pager.total / this.pager.limit);
    }

    /** Danh sách trang hiển thị: 1 … (cur-1) cur (cur+1) … last; null = dấu "…" */
    get pages() {
        const last = this.pageCount - 1;
        const cur = this.current;
        const wanted = new Set([0, last, cur - 1, cur, cur + 1].filter((p) => p >= 0 && p <= last));
        if (cur <= 2) {
            [1, 2].forEach((p) => p <= last && wanted.add(p));
        }
        if (cur >= last - 2) {
            [last - 1, last - 2].forEach((p) => p >= 0 && wanted.add(p));
        }
        const sorted = [...wanted].sort((a, b) => a - b);
        const out = [];
        sorted.forEach((p, i) => {
            if (i && p - sorted[i - 1] > 1) {
                out.push(null);
            }
            out.push(p);
        });
        return out;
    }

    get summary() {
        const { offset = 0, limit, total } = this.pager;
        const end = Math.min(offset + limit, total);
        return _t("Hiển thị %(start)s–%(end)s trong %(total)s", {
            start: offset + 1,
            end,
            total,
        });
    }

    async goTo(page) {
        if (page === this.current || !this.pager.onUpdate) {
            return;
        }
        await this.pager.onUpdate({ offset: page * this.pager.limit, limit: this.pager.limit }, true);
    }
}

patch(ListController, {
    components: { ...ListController.components, YhQuickFilters, YhNumberPager },
});

patch(ListController.prototype, {
    setup() {
        super.setup(...arguments);
        // cho ListRenderer (thanh tiêu đề nhóm) gọi "Xuất Excel": xuất mọi bản ghi theo các cột của view,
        // kể cả cột ẩn (column_invisible) đang được widget gộp hiển thị chung ô; bỏ cột ảnh/nhị phân.
        useSubEnv({
            yhCanExport: () => Boolean(this.isExportEnable),
            yhExportAll: () => this.downloadExport(this.yhExportFields, false, "xlsx"),
        });
    },

    get yhExportFields() {
        return unique(
            this.props.archInfo.columns
                .filter((col) => col.type === "field")
                .map((col) => this.props.fields[col.name])
                .filter((field) => field && field.exportable !== false && field.type !== "binary")
        );
    },
});
