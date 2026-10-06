{
    "name": "YouthHonour Backend Theme",
    "summary": "Giao diện backend YouthHonour (ĐHQG-HCM): xanh dương, cam, glow — chỉ SCSS",
    "version": "18.0.1.0.0",
    "category": "Themes/Backend",
    "author": "Đoàn TNCS Hồ Chí Minh ĐHQG-HCM",
    "license": "LGPL-3",
    # muk_web_colors: biến màu của theme phải được nạp SAU file colors_light.scss (đã tùy biến trong DB).
    # muk_web_appsbar: sidebar bên trái được restyle ở sidebar.scss.
    "depends": ["web", "muk_web_colors", "muk_web_appsbar"],
    "assets": {
        "web._assets_primary_variables": [
            # Hai file chèn ngay trước primary_variables.scss của web, nghĩa là sau các file của MuK,
            # nên phép gán của theme thắng còn các giá trị `!default` của Odoo thì nhường lại.
            (
                "before",
                "web/static/src/scss/primary_variables.scss",
                "theme_youthhonour_backend/static/src/scss/yh_tokens.scss",
            ),
            (
                "before",
                "web/static/src/scss/primary_variables.scss",
                "theme_youthhonour_backend/static/src/scss/primary_variables.scss",
            ),
        ],
        "web.assets_backend": [
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
        ],
    },
    "installable": True,
    "application": False,
}
