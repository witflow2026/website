# Prompt 工具箱白天模式修正

基于 2026-10-02 从 https://witflow.trade/tools.html 获取的线上页面制作。

修正：白天模式下，选中分类与复制按钮改用浅色文字；提示词框使用暖灰底与深色文字；辅助说明提高对比度。选择器限定在工具箱页面，夜间配色保持原值。

## 发布文件

1. 新增 `tools-theme.css`。
2. 将当前线上 `tools.html` 的 `<body>` 改为 `<body class="tools-page">`，并在原样式链接后添加：

```html
<link rel="stylesheet" href="tools-theme.css?v=1">
```

文件包也包含已做上述两处修改的线上 `tools.html` 快照。发布前若线上页面没有后续改动，可使用它；如有后续内容修改，优先只应用以上两处编辑。

无需替换共享的 `styles.css` 或 `main.js`。GitHub 原有版本仍落后于线上版本，不能用整个仓库覆盖线上站点。

## 预览

在本地服务下打开 `/tmp/theme-review/tools.html`。该目录使用当前线上样式和脚本副本，仅用于检查，本身不属于发布文件。

当前交付为本地修正，尚未上线。
