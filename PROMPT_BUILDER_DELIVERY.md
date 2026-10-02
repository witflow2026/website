# 外贸 Prompt 生成器与免费工作表

新增独立页面，提供价格谈判、长询盘审查、报价后跟进、付款条件四个场景。表单生成提示词，支持复制和 TXT 下载，并提供三份 A4 PDF 工作表。

输入仅在当前页面处理；页面不连接 AI、不调用外部服务、不使用本地存储。修改输入后必须重新生成才能复制或下载。已有主页和公共样式未修改。

## 本地预览

在此目录运行 `python3 -m http.server 8765 --bind 127.0.0.1`，访问 `http://127.0.0.1:8765/prompt-builder.html`。

## 添加到线上网站

GitHub 主分支与 2026-10-02 线上版本不一致，缺少现有工具箱与文章，因此不能用此仓库整体覆盖线上网站。

只新增以下六个文件，保持相同目录关系：

- `prompt-builder.html`
- `prompt-builder.css`
- `prompt-builder.js`
- `downloads/pre-quote-clarification.pdf`
- `downloads/negotiation-planner.pdf`
- `downloads/quote-follow-up.pdf`

上传后，页面地址为 `https://witflow.trade/prompt-builder.html`。在实际线上最新版的工具箱或免费资源区域加入以下入口：

```html
<a href="prompt-builder.html">外贸 Prompt 生成器 · 填写业务信息后生成完整提示词</a>
```

建议在已有工具箱顶部增加这个入口，保留四个现有模板。独立页已有三个工作表下载入口，无需替换原工具箱。

发布前应备份实际线上最新版，验证新增页与三个 PDF 地址正常；上线只添加新文件，不覆盖原页面、样式、脚本或服务器配置。当前交付尚未发布。

## 维护

场景文本与示例位于 `prompt-builder.js`，工作表生成源位于 `scripts/build-worksheets.py`。PDF 生成脚本使用 ReportLab 与 macOS Arial Unicode 字体；生成后的 PDF 可在其他设备直接使用。

## 已完成的检查

- 四种场景示例、场景专属字段和输出任务匹配。
- 必填字段为空或仅有空格时拒绝生成；清空后场景与字段同步。
- 修改输入后禁用旧结果的复制和下载，重新生成后恢复。
- 浏览器剪贴板内容与页面输出逐字一致；下载 TXT 已读取并确认业务信息与语言设置。
- 390px 手机布局与 1280px 桌面布局无横向溢出。
- 三份 PDF 均为一页 A4，渲染检查完成；下载地址均返回 HTTP 200。
- 页面未产生浏览器错误日志，JavaScript 语法检查通过。
