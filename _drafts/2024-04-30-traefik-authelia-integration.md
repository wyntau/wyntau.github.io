---
title: 使用 Authelia 为 traefik 提供统一登录认证
pid: 20240403001
tags: [traefik, Authelia]
---

在 traefik 中我一直使用的是 traefik 的 basicauth middleware, 但是这个方案有一个缺点就是输入密码时由于调用的是浏览器原生的弹窗, 所以像 vaultwarden 这类工具是没法自动填充密码的. 另外了解到 traefik 还有另一个 forwardauth middleware, 但是这个 middleware 使用时需要有已运行的 forwardauth 服务, 所以现在就需要找一个 forwarauth 服务.

通过搜索 traefik forward auth 关键字, 首先找到的是 github 上的项目 [thomseddon/traefik-forward-auth](https://github.com/thomseddon/traefik-forward-auth), 但是看这个项目已经 3 年没更新了, 所以再找找其它的项目.

又搜索了一番, 发现了 authentik 项目, 找到了 Authentik 相关链接如下

- 官方网站: <https://goauthentik.io/>
- ecwu 写的文档: [Authentik 教程系列：简介和安装配置](https://ecwuuuuu.com/post/authentik-tutorial-1-introduction-and-install/)
- ecwu 在 bilibili 发布的视频教程 [Authentik 教程系列](https://www.bilibili.com/video/BV1pm41167WK/)

看完上面的文档和视频后, 我对 Authentik 的感觉就是, Authentik 功能虽然很强大, 但是对于个人项目来说太重了. 所以作了一些搜索和对比后, 决定使用 Authelia. Authelia 轻量使用时, 可以不使用任何数据库的, 完全使用文件作为配置工具, 对于备份和维护很方便.

Authelia 相关链接如下

- 官方网站 <https://www.authelia.com/>
- Github <https://github.com/authelia/authelia>

下面介绍如何使用 Authelia 为 traefik 提供统一登录认证.

