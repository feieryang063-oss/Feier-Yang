# feieryang.com

个人作品集网站的源码仓库。纯静态站点（HTML + CSS + JS），**没有后台、没有数据库、没有 CMS**。

## 仓库结构

```
site/                      # 网站本体，这个目录的内容 = 线上根目录
  index.html
  projects/*.html          # 每个项目一个页面（共 18 个）
  assets/css/style.css
  assets/js/main.js
  assets/images/<项目slug>/
  assets/images/deco/      # 兔子 / 眼睛等装饰素材
_build/                    # 生成器（不会被部署）
  manifest.json            # 每个项目的标题、标签、年份、署名、简介、分段文字、图片
  image_map.json           # 图片原始来源 → 本地路径对照表
  generate_site.py         # 读上面两个文件，生成 index.html 和全部 projects/*.html
```

`assets/js/main.js` 负责：导航栏眼睛跟随鼠标 + 眨眼、左侧兔子随滚动摇摆、卡片图片 hover 3D 倾斜 + 光扫、移动端菜单、项目分类筛选。

## 怎么改内容

### 方式 A：只改一两个字

直接编辑对应的 `site/projects/xxx.html`，提交推送即可。

### 方式 B：改动较大 / 新增项目（推荐）

改数据文件比手改 18 个 HTML 更不容易出错：

1. 编辑 `_build/manifest.json` 里对应项目的字段（新增项目就复制一段现有结构）
2. 新图片先放进 `site/assets/images/<项目slug>/`，再把路径写进 `_build/image_map.json`
3. 重新生成：
   ```bash
   cd _build
   python3 generate_site.py
   ```
   结果会写回 `site/`
4. 提交推送

> **注意**：不要对同一个文件混用两种方式。手改过的 `projects/xxx.html` 会在下次跑 `generate_site.py` 时被覆盖。

## 设计系统

颜色和字体都在 `site/assets/css/style.css` 顶部的 `:root{ }` 里，改变量整站生效：

- `--bg` 背景淡蓝灰 / `--salmon` 标签橘粉 / `--ink` 主文字黑
- 字体：标题 Archivo Black、正文 Space Grotesk、年份和标签 JetBrains Mono，走 Google Fonts CDN（断网会掉回系统默认字体）

## 部署

推送到 `main` 分支会自动触发 `.github/workflows/deploy.yml`，把 `site/` 的内容上传到 Hostinger。也可以在 Actions 页面手动点 "Run workflow"。

### 首次配置（只需做一次）

在 GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret，添加三条：

| Secret 名称 | 值 |
|---|---|
| `FTP_SERVER` | `82.29.199.87` |
| `FTP_USERNAME` | `u219717272.feieryang.com` |
| `FTP_PASSWORD` | Hostinger 的 FTP 密码 |

**FTP 密码不要写进这个仓库的任何文件。** 需要重置时：Hostinger hPanel → Websites → feieryang.com → Files → FTP Accounts → Change FTP password，改完同步更新上面的 `FTP_PASSWORD` secret。

如果部署报 TLS 相关的错误，把 `deploy.yml` 里的 `protocol: ftp` 改成 `protocol: ftps`。

### 手动上传（备用方案）

用 FileZilla / Cyberduck / `lftp` 连 `82.29.199.87:21`，登录后所在目录就是网站根目录（等同 public_html，不用再进一层），把 `site/` 里的文件传上去覆盖即可。

## 域名 & DNS

| 项目 | 值 |
|---|---|
| 域名 | feieryang.com |
| 注册商 | Cargo（$17/年，下次续费 2027-07-01）|
| 名称服务器 | `ns1.cargo.site` / `ns2.cargo.site`（Cargo 不支持换外部 NS）|
| 生效方式 | 在 Cargo 的 "Edit DNS" 里把根域名记录指向 Hostinger 的 `82.29.199.87` |

改 DNS 的路径：登录 feieryangdesign.cargo.site → 右上角设置 → Account Settings → Domain Names → feieryang.com 右侧 "…" → Edit DNS。

SSL/HTTPS 由 Hostinger 自动签发免费证书，域名切过来后一般几小时内生效。打不开就去 hPanel 搜 "SSL" 检查状态。

## 待办

- [ ] **About 板块头像**：目前是空的，把照片放进 `site/assets/images/about/portrait.jpg` 就会自动显示
- [ ] **简历 PDF 和几个项目文档**（Project Proposal、Gantt Chart 等）还挂在 Cargo 的文件存储（`files.cargocollective.com`）上。链接目前可用，但注销 Cargo 账号后会失效——建议下载后重新传到 Hostinger 并更新链接
- [ ] **Cargo 订阅**：网站内容已经不依赖 feieryangdesign.cargo.site 了，可以考虑降级或取消。但**域名注册是分开的**，取消前务必确认不会连带删掉域名
