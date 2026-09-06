# witflow 威特流 · 官方网站项目

> 本网站为 **witflow 威特流** 官方品牌落地页，融合 Awwwards、Land-book、shadcn/ui、Magic UI、Aceternity UI 等现代设计美学，专注**数字工作流、自动化工具链与全网自媒体矩阵**（Wit in, Flow out. 智慧进入，结果流出）。

---

## 📂 文件目录

```text
D:\witflow\website\
├── index.html        # 网页主体结构（SEO 友好、全语义化 HTML5）
├── styles.css        # 现代设计样式表（自适应、Bento Grid、微动效、双主题）
├── main.js          # 交互脚本（深浅色切换、聚光灯光效、微信二维码弹窗、Toast）
└── README.md         # 项目文档与 VPS 部署指南
```

---

## 🖥️ 1. 本地快速预览

* **直接打开**：进入 `D:\witflow\website\`，直接**双击 `index.html`**，即可在 Chrome / Edge / 任意浏览器中浏览。
* **本地 HTTP 服务预览（可选）**：
  ```powershell
  cd D:\witflow\website
  python -m http.server 8080
  ```
  在浏览器访问 `http://localhost:8080`。

---

## 🚀 2. 部署至 Ubuntu VPS（`195.72.189.137`）

你的 VPS 已经具备完整的部署条件，且与当前的 WireGuard（UDP 51821）互不干扰。

### 方式 A：使用 Caddy 极速部署（推荐，全自动申请 HTTPS 证书）

1. **登录 VPS 安装 Caddy**：
   ```bash
   sudo apt update
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   sudo apt update
   sudo apt install -y caddy
   ```

2. **从 Windows 本地上传网站文件到 VPS**：
   在 Windows PowerShell 中执行（带上已验证的 SSH 算法参数）：
   ```powershell
   scp -o KexAlgorithms=diffie-hellman-group14-sha256 -r D:\witflow\website\* root@195.72.189.137:/var/www/witflow/
   ```

3. **配置域名与 HTTPS**：
   在 VPS 上编辑 `/etc/caddy/Caddyfile`：
   ```caddy
   your-domain.com {
       root * /var/www/witflow
       file_server
       encode gzip zstd
   }
   ```
   然后执行 `systemctl reload caddy`，Caddy 会自动帮你的域名申请 Let's Encrypt 免费 SSL 证书，支持 HTTPS 访问！

---

## ⚙️ 3. 核心功能与后续修改

* **修改微信号 / 邮箱**：在 `index.html` 中的 `data-email` 与 `data-copy` 属性处直接替换。
* **替换社媒链接**：在 `index.html` 的 `#matrix` 区域将各卡片的 `href` 替换为你的真实自媒体主页链接。
* **切换主题**：点击导航栏右上角图标，支持在**自然温暖（Warm Linen）**与**暗黑科技（Slate Dark）**之间无缝切换。
