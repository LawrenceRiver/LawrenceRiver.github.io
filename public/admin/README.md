# Admin

本项目的 `/admin` 使用 Decap CMS。

GitHub Pages 纯静态无法直接完成 GitHub OAuth，因此需要一个独立的 OAuth 代理（推荐 Cloudflare Worker）。

你需要做两件事：

1) 在 GitHub 创建 OAuth App（Developer settings → OAuth Apps）
2) 部署 OAuth Proxy，并把 `public/admin/config.yml` 的 `backend.repo` 与 `backend.base_url` 指向你的 Proxy

参考：Decap CMS 文档 “Using Github with an OAuth Proxy”。

