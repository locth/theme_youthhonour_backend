{
    "name": "YouthHonour Backend Theme",
    "summary": "Giao diện backend YouthHonour (ĐHQG-HCM): xanh dương, cam, glow; sidebar ứng dụng",
    "version": "18.0.1.2.2",
    "category": "Themes/Backend",
    "author": "Đoàn TNCS Hồ Chí Minh ĐHQG-HCM",
    "license": "LGPL-3",
    # Thay thế toàn bộ bộ muk_web_* (sidebar, favicon, màu) — không phụ thuộc module theme nào khác.
    "depends": ["web"],
    "data": [
        "views/webclient_templates.xml",
    ],
    "assets": {
        "web._assets_primary_variables": [
            # Hai file chèn ngay trước primary_variables.scss của web (và sau mọi file `prepend`
            # của module khác), nên phép gán của theme thắng các giá trị `!default` của Odoo.
            (
                "before",
                "web/static/src/scss/primary_variables.scss",
                "theme_youthhonour_backend/static/src/scss/yh_tokens.scss",
            ),
            (
                "before",
                "web/static/src/scss/primary_variables.scss",
                "theme_youthhonour_backend/static/src/scss/yh_icons.scss",
            ),
            (
                "before",
                "web/static/src/scss/primary_variables.scss",
                "theme_youthhonour_backend/static/src/scss/primary_variables.scss",
            ),
        ],
        # Giao diện tối (cookie color_scheme=dark, bật từ menu người dùng): ghi đè token ngay sau yh_tokens
        "web.assets_web_dark": [
            (
                "after",
                "theme_youthhonour_backend/static/src/scss/yh_tokens.scss",
                "theme_youthhonour_backend/static/src/scss/yh_tokens.dark.scss",
            ),
        ],
        "web.assets_backend": [
            "theme_youthhonour_backend/static/src/webclient/**/*.js",
            "theme_youthhonour_backend/static/src/webclient/**/*.xml",
            "theme_youthhonour_backend/static/src/views/**/*.js",
            "theme_youthhonour_backend/static/src/views/**/*.xml",
            "theme_youthhonour_backend/static/src/scss/fonts.scss",
            "theme_youthhonour_backend/static/src/scss/base.scss",
            "theme_youthhonour_backend/static/src/scss/navbar.scss",
            "theme_youthhonour_backend/static/src/scss/sidebar.scss",
            "theme_youthhonour_backend/static/src/scss/control_panel.scss",
            "theme_youthhonour_backend/static/src/scss/list.scss",
            "theme_youthhonour_backend/static/src/scss/form.scss",
            "theme_youthhonour_backend/static/src/scss/statusbar.scss",
            "theme_youthhonour_backend/static/src/scss/notebook.scss",
            "theme_youthhonour_backend/static/src/scss/dialog.scss",
            "theme_youthhonour_backend/static/src/scss/components.scss",
            "theme_youthhonour_backend/static/src/scss/widgets.scss",
            "theme_youthhonour_backend/static/src/scss/honour.scss",
        ],
    },
    "installable": True,
    "application": False,
}
