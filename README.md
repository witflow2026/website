# witflow 威特流 · 个人外贸网站

网站：https://witflow.trade/ 。内容包括外贸实战文章、作者介绍、Prompt 工具箱、提示词生成器和免费工作表。

此维护版本以 2026-10-02 线上公开的静态文件为基线，整合了此前本地生成器与浅色主题修正。工作电脑上可能仍有未发布原始文件；托管账户和后台配置尚未完整回收。

## 修改、构建与预览

需要 Python 3.10 或以上；日常网页构建使用标准库，不需要安装 npm 包。

```sh
python3 scripts/build-site.py
python3 scripts/preview-site.py --port 8766
```

打开 http://127.0.0.1:8766/ 。预览支持无扩展名 URL、旧 HTML 地址永久跳转和 404。在另一个终端验证：

```sh
python3 scripts/check-site.py
node --check homepage.js
node --check main.js
node --check prompt-builder.js
```

日常流程：同步 GitHub 分支 → 修改源文件 → 构建 → 验证与预览 → 提交 Git → 经预览确认后发布。不要在两台电脑上各自维护未同步的唯一版本。

## 文件组织

- `index.html`、`homepage.css`、`homepage.js`：主页。
- `about.html`、`articles/`、`privacy.html`：作者介绍、文章与使用说明。
- `tools.html`、`styles.css`、`main.js`、`tools-theme.css`：原工具箱与子页。
- `prompt-builder.*`、`downloads/`：生成器与三份 PDF。
- `site-pages.json`：页面首选 URL、标题、描述和日期的唯一登记处。
- `scripts/generate-metadata.py`：生成 canonical、分享信息、JSON-LD 和 sitemap。
- `scripts/build-site.py`：仅复制允许公开的文件到 `dist/`。
- `_headers`：根据线上安全响应头整理的 Cloudflare Pages 配置。

修改文章正文或配套资源时，更新真实修改日期，不要仅因重新部署而刷新日期。新增页面时登记 URL，并添加适当内链。文件保留 `.html` 名称，对外统一使用无扩展名地址。

PDF 可直接使用。重新制作 PDF 才需要 ReportLab 和生成脚本指定的中文字体；日常发布无需运行 PDF 脚本。

## 发布与恢复

发布目录必须是 `dist/`，不要上传整个仓库。该目录不包含开发脚本、说明文档、临时截图、Git 文件或历史配置。

线上由 Cloudflare 提供服务，具体项目与发布方式尚未通过后台确认。若使用 Cloudflare Pages，可设置构建命令 `python3 scripts/build-site.py`、输出目录 `dist`；其他托管方式需要等效配置无扩展名路由、跳转与安全响应头。先核对实际项目再发布，不凭旧 VPS 文档猜测环境。

上线与账户步骤见 [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)。标签 `snapshot/online-20261002` 标记恢复后的线上展示基线，不是托管后台备份。原始静态文件另有本地备份。历史说明已移入 `docs/legacy/`，仅作历史参考。

## 阅读入口与订阅

首页提供按询盘、谈判和跟进划分的阅读路线及最近更新。`feed.xml` 由 `scripts/generate-feed.py` 从 `site-pages.json` 的 Article 页面生成，构建时自动更新；新增文章只需登记真实标题、摘要和发布日期。RSS GUID 使用稳定的正式网址。

账户与本人素材步骤见 `PERSONAL_NEXT_STEPS.md`。
