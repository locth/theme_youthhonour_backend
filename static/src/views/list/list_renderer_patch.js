/** @odoo-module **/
// List view: dòng nhóm có ô mã + pill số lượng + thanh tỷ trọng; thanh tiêu đề khi nhóm
// (tên trường nhóm, "N nhóm · M bản ghi", Mở/Thu gọn tất cả, Xuất Excel).
//
// Ô mã của nhóm: action đặt context `yh_group_codes` = {model quan hệ: trường mã},
// vd. {'unit.info': 'unit_code'} -> nhóm theo một many2one tới unit.info thì hiện unit_code.
// Nhãn bản ghi trong "N nhóm · M …": context `yh_record_label` (mặc định "bản ghi").

import { onWillUnmount, useEffect, useState } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { ListRenderer } from "@web/views/list/list_renderer";

patch(ListRenderer.prototype, {
    setup() {
        super.setup(...arguments);
        this.yhOrm = useService("orm");
        this.yhCodes = useState({});
        let alive = true;
        onWillUnmount(() => (alive = false));
        useEffect(
            (key) => {
                const req = this.yhCodeRequest();
                if (!key || !req) {
                    return;
                }
                const missing = req.ids.filter((id) => !(`${req.model}:${id}` in this.yhCodes));
                if (!missing.length) {
                    return;
                }
                this.yhOrm
                    .read(req.model, missing, [req.field])
                    .then((rows) => {
                        if (!alive) {
                            return;
                        }
                        for (const row of rows) {
                            this.yhCodes[`${req.model}:${row.id}`] = row[req.field] || "";
                        }
                    })
                    .catch(() => {
                        // trường mã không tồn tại / không có quyền: bỏ qua ô mã
                        for (const id of missing) {
                            this.yhCodes[`${req.model}:${id}`] = "";
                        }
                    });
            },
            () => [this.yhCodeRequest()?.key]
        );
    },

    /** Có hiện thanh tiêu đề/ dòng nhóm kiểu YouthHonour không (chỉ list chính, không phải x2many). */
    get yhIsMainGroupedList() {
        return !this.isX2Many && this.props.list.isGrouped;
    },

    yhGroupId(group) {
        const value = group.value;
        return Array.isArray(value) ? value[0] : value;
    },

    yhCodeRequest() {
        const list = this.props.list;
        const codeFields = list.context?.yh_group_codes;
        if (!codeFields || !list.isGrouped || !list.groups.length) {
            return null;
        }
        const groupByField = list.groups[0].groupByField;
        if (!groupByField || groupByField.type !== "many2one") {
            return null;
        }
        const field = codeFields[groupByField.relation];
        if (!field) {
            return null;
        }
        const ids = list.groups.map((g) => this.yhGroupId(g)).filter((id) => typeof id === "number");
        return {
            model: groupByField.relation,
            field,
            ids,
            key: `${groupByField.relation}:${field}:${ids.join(",")}`,
        };
    },

    yhGroupCode(group) {
        if (this.getGroupLevel(group) !== 0) {
            return "";
        }
        const req = this.yhCodeRequest();
        if (!req) {
            return "";
        }
        return this.yhCodes[`${req.model}:${this.yhGroupId(group)}`] || "";
    },

    /** Màu xoay vòng xanh / cam / xanh lá / đỏ theo thứ tự nhóm. */
    yhGroupTone(group) {
        const index = this.props.list.groups.indexOf(group);
        return ["blue", "orange", "green", "red"][(index < 0 ? 0 : index) % 4];
    },

    /** Tỷ trọng (%) so với nhóm lớn nhất cùng cấp; chỉ cho nhóm cấp 1. */
    yhGroupShare(group) {
        if (this.getGroupLevel(group) !== 0) {
            return null;
        }
        const max = Math.max(...this.props.list.groups.map((g) => g.count), 0);
        return max ? Math.max(4, Math.round((group.count / max) * 100)) : 0;
    },

    get yhHeaderInfo() {
        const list = this.props.list;
        const groups = list.groups || [];
        const total = groups.reduce((sum, g) => sum + g.count, 0);
        const label = list.context?.yh_record_label || _t("bản ghi");
        return {
            title: groups[0]?.groupByField?.string || "",
            summary: _t("%(groups)s nhóm · %(records)s %(label)s", {
                groups: groups.length,
                records: total,
                label,
            }),
            anyFolded: groups.some((g) => g.isFolded),
        };
    },

    async yhToggleAllGroups() {
        const groups = this.props.list.groups || [];
        const open = groups.some((g) => g.isFolded);
        for (const group of groups) {
            if (group.isFolded === open) {
                await group.toggle();
            }
        }
    },
});
