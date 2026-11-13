# Blog

https://qsbk.github.io 的源码（`source` 分支）。Hexo 4 + yilia 主题。
生成的网站在 `master` 分支，由 GitHub Actions 自动更新，不要手动改。

## 目录

- `content/`：Obsidian 笔记库（Hexo 的 source 目录）
  - `_posts/`：公开文章
  - `private/`：本地草稿，不上传
  - `images/`：文章里的图片
- `themes/yilia/`：主题及配置
- `tools/fill-frontmatter.mjs`：构建前给新文章补标题、日期、短链接、摘要截断
- `.github/workflows/deploy.yml`：推送后自动构建并发布

## 写文章

在 Obsidian 里写，写好后把文件从 `private/` 拖到 `_posts/`，执行 Git: Commit-and-sync，约 1~2 分钟后上线。

文件头可以不写：标题取文件名，日期取首次提交时间，首页摘要取第一段。想自己控制就写上：

```yaml
---
title: 标题
date: 2026-11-13 10:00:00
tags: [标签1, 标签2]
---
```

## 本地预览

```bash
npm ci
npx hexo server    # http://localhost:4000
```

说明：FlappyBird、今日校园自动提交体温这两篇的 Markdown 源文件已丢失，正文是 2026-11 从线上页面的 HTML 还原的。
