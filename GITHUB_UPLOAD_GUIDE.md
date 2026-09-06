# witflow 威特流 · 代码上传至 GitHub 详细指引

本文档指导你如何将 `D:\witflow\website` 目录下的所有网站代码上传至你的 GitHub 仓库，并开启免费的全球公网访问（GitHub Pages）。

---

## 🎯 准备工作：在 GitHub 网页新建仓库

1. 浏览器打开 [github.com](https://github.com) 并登录你的账号。
2. 点击右上角的 **`+`** 号，选择 **New repository**（新建仓库）。
3. 填写仓库信息：
   * **Repository name（仓库名）**：建议填写 `witflow` 或 `witflow-website`
   * **Public / Private**：选择 **Public**（公开，后续开启免费 GitHub Pages 必备）
   * **Initialize this repository with**：**不要勾选**任何选项（不要勾选 Add a README file，保持完全为空的全新仓库）
4. 点击绿色的 **Create repository** 按钮创建成功。
5. 创建后，复制该仓库的 HTTPS 地址（类似：`https://github.com/你的用户名/witflow.git`）。

---

## 🚀 三种上传方式（任选其一）

---

### 方式一：使用 GitHub Desktop 上传（最推荐 · 图形化最省心）

你的电脑已安装了 GitHub Desktop，直接使用即可：

1. 打开桌面上的 **GitHub Desktop** 软件。
2. 点击顶部菜单 **File** ➔ **Add Local Repository...**（添加本地仓库）。
3. 在弹出的窗口中：
   * 点击 **Choose...**，浏览并选中文件夹：`D:\witflow\website`
   * 如果提示 *This directory does not appear to be a Git repository*，点击下方蓝色的 **create a repository** 链接。
   * 在弹出的对话框中，保持 Name 为 `website` 或改为 `witflow`，然后点击 **Create Repository**。
4. 在 GitHub Desktop 左侧：
   * 左下角 Summary 输入：`Initial commit: witflow website`
   * 点击下方蓝色的 **Commit to main** 按钮。
5. 点击顶部导航栏的 **Publish repository** 按钮：
   * 去掉勾选 *Keep this code private*（公开代码以供网站展示）
   * 点击 **Publish repository**，代码就会自动全部同步到你的 GitHub 仓库！

---

### 方式二：GitHub 网页端直接拖拽上传（极速 · 适合首次）

如果你不想配置任何客户端，网页拖拽最快：

1. 在刚刚建好的 GitHub 空仓库页面中，找到有一行小字：
   > *“...or upload an existing file”* （或者点击上方菜单 **Add file** ➔ **Upload files**）
2. 打开电脑文件管理器，进入 `D:\witflow\website\` 文件夹。
3. **全选里面的所有文件与文件夹**（包括 `index.html`、`styles.css`、`main.js`、`assets` 文件夹等）。
4. 直接**鼠标拖拽**到 GitHub 网页中间的虚线框里。
5. 页面下方输入提交说明（比如 `Upload witflow website`），点击绿色的 **Commit changes** 按钮即可完成上传！

---

### 方式三：通过命令行一键推送（适合熟悉终端操作）

在 Windows PowerShell 中逐行执行以下命令（注意将 `你的用户名` 替换为你真实的 GitHub 用户名）：

```powershell
# 1. 进入网站目录
cd D:\witflow\website

# 2. 调用电脑内置的 Git 执行初始化
& "$env:LOCALAPPDATA\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe" init

# 3. 添加所有文件
& "$env:LOCALAPPDATA\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe" add .

# 4. 提交版本
& "$env:LOCALAPPDATA\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe" commit -m "feat: initial release of witflow website"

# 5. 重命名分支为主分支 main
& "$env:LOCALAPPDATA\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe" branch -M main

# 6. 关联你的远程仓库 (请替换下面的链接为你自己的仓库地址)
& "$env:LOCALAPPDATA\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe" remote add origin https://github.com/你的用户名/witflow.git

# 7. 推送到 GitHub
& "$env:LOCALAPPDATA\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe" push -u origin main
```

---

## 🌐 进阶福利：开启免费公网访问（GitHub Pages）

代码上传成功后，你可以让全世界任何人通过链接直接打开你的网站，**完全免费且自带 HTTPS**：

1. 进入你的 GitHub 仓库页面，点击顶部的 **Settings**（设置）。
2. 在左侧边栏找到并点击 **Pages**。
3. 在 **Build and deployment** 下方：
   * **Source**：选择 `Deploy from a branch`
   * **Branch**：选择 `main` 分支，目录保持 `/ (root)`，点击右侧的 **Save**。
4. 等待约 1~2 分钟，刷新该页面，顶部就会出现一行绿色提示：
   > **Your site is live at `https://你的用户名.github.io/witflow/`**
5. 点击该链接，你的 **witflow 威特流** 网站就正式在全网发布上线了！
