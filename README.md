# Lawrence River — Personal Site

双线内容（歌手 / AI 科研）的纯静态站点：Markdown 内容驱动、列表筛选、全站搜索、详情页阅读。

## 本地开发

```bash
npm install
npm run dev
```

## 添加/更新内容（Markdown）

把 Markdown 文件放到对应目录即可：

- `src/content/research/papers/*.md`
- `src/content/singer/albums/*.md`
- `src/content/singer/merch/*.md`
- `src/content/singer/tours/*.md`

文件名会成为 URL 的 `slug`（例如 `riverlines-ep.md` → `#/item/album/riverlines-ep`）。

推荐 frontmatter 字段（示例）：

```md
---
title: "Your Title"
summary: "One-line summary"
tags: ["TagA", "TagB"]
publishedAt: "2026-03-01"
updatedAt: "2026-03-10"
pinned: true
---

正文 Markdown...
```

## GitHub Pages 部署

仓库已内置 GitHub Actions 工作流：推送到 `main` 会自动构建并发布到 GitHub Pages。

你需要在仓库 Settings → Pages 中把 Source 设为 **GitHub Actions**。

### 0) 我能不能帮你“直接部署”？

我这边拿不到你的 GitHub 账号权限，所以无法替你点击仓库设置或推送到你的远程仓库。
但仓库里的工作流已经就绪，你只要按下面步骤把代码推到 GitHub 并打开 Pages，就会自动上线。

### 1) 新建仓库并推送代码

1. 在 GitHub 新建一个仓库（建议 `lawrence-river` 或 `site`）
2. 本地在项目根目录执行：

```bash
cd /Users/lawrenceriver/Desktop/lawrenceriverhonglinliao

git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

### 2) 打开 Pages（关键）

1. 进入仓库 `Settings → Pages`
2. `Build and deployment → Source` 选择 **GitHub Actions**
3. 回到 `Actions` 标签页，等 `Deploy to GitHub Pages` 跑完

### 3) 访问地址

- 项目型仓库（最常见）：`https://<你的用户名>.github.io/<仓库名>/`
- 如果你用的是用户名仓库（`<你的用户名>.github.io`）：地址是 `https://<你的用户名>.github.io/`

本项目使用 `HashRouter`，所以子页面 URL 会长这样：`/#/singer`、`/#/research`。

### 4) 常见问题

- 404：通常是 Pages 的 Source 没设为 GitHub Actions，或 Actions 还没跑完
- 资源路径错乱：本项目 `vite.config.ts` 里已设置 `base: './'`，适配 GitHub Pages
