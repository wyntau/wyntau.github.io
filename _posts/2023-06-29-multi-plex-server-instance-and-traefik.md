---
title: 通过 Plex 自定义服务器访问 URL 搭配反向代理工具优化内外网访问
pid: 2023062901
tags: [traefik, plex]
---

安装Plex Media Server 后, 有几种方式可以访问到 plex
1. 可以直接使用局域网的方式, http://{局域网IP}:32400 的方式访问
2. 在未开启 plex 远程访问但是路由器中正确配置了端口转发后, 直接使用对应的公网 IP 加端口号32400 的方式访问
3. 在成功开启了 plex 远程访问功能并且路由器中正确配置了端口转发后, 直接使用 https://app.plex.tv 的访问

上面 2 和 3 的区别就是, 在开启了 plex 远程访问功能后, plex 会获取当前 plex 服务器的内网IP以及公网IP. 然后在使用 https://app.plex.tv 访问时, 会尝试使用公网IP及对应的端口号访问, 转发到内网的 plex 服务器.

但是在不开启 plex 的远程访问功能的情况下, 如果我们已经知道了公网IP, 也可以直接访问公网IP加端口号. 只是在通过 https://app.plex.tv 访问时, 由于 plex 并不知道这个公网IP, 所以会无法请求数据.

支持的访问方式多, 但是各自都有一些不方便及不完美的地方
1. 上面方式1只能在内网访问, 如果在外网就需要用方式2和方式3
2. 上面方式2, 需要记住公网IP, 如果有域名以及 ddns 配合的话就方便一些, 这是在只有一个 plex server 的情况下. 但是假如有多个 plex server 的话, 就需要频繁切换域名访问, 此时可能就需要使用方式3
3. 方式3的话, 则需要在路由器中为 plex 单独映射一个端口, 并且为了安全起见, 还需要单独配置 SSL 证书, 比较麻烦. 如果已经有了统一的 traefik 或者 nginx 等反向代理工具的话, 则显的有些多余.

那么有没有什么更好的方式能解决上面3点呢, 通过查看 plex 设置后台, 发现了 自定义服务器访问 URL 这个功能, 经过测试, 搭配本地的反向代理工具可以完美解决. 并且可以实现如下效果.
1. 不需要开启 plex 后台设置中的远程访问功能
2. 所有 plex 服务器都可以统一通过 https://app.plex.tv 访问
3. 当在内网时, 直接请求的是 plex 服务器的内网IP
4. 当在公网时, 请求的是路由器的公网IP, 并通过路由器及反向代理工具, 转发到内网对应的 plex 服务器
5. 统一由 traefik 或 nginx 等反向代理工具配置 SSL 证书
6. 除 app.plex.tv 外, 还可以使用自定义域名的方式访问, 并且由于统一配置了 SSL 证书, 请求类型也是 https 的, 更安全.

下面会以两个 plex 服务器实现来讲具体实现. 假设两个 plex 服务器分别为
1. Plex 服务器a, 对应内网IP 为 192.168.88.10, 路由器已配置了泛解析 ddns 域名 *.foo.example.com, 端口号 3456, 路由器转发所有请求到内网的 traefik 实例上
2. Plex 服务器b, 对应内网IP 为 192.168.100.47, 路由器已配置了泛解析 ddns 域名 *.bar.example.com, 端口号 5678, 路由器转发所有请求到内网的 traefik 实例上.

首先配置 traefik, 针对 plex-a 以及 plex-b 分别添加内网转发配置.

Plex-a 配置
```toml
[http.routers.plex]
  entryPoints = ["websecure"]
  rule = "Host(`plex.foo.example.com`)"
  service = "plex@file"

[[http.services.plex.loadBalancer.servers]]
  url = "http://192.168.88.10:32400"
```

Plex-b 配置
```toml
[http.routers.plex]
  entryPoints = ["websecure"]
  rule = "Host(`plex.bar.example.com`)"
  service = "plex@file"

[[http.services.plex.loadBalancer.servers]]
  url = "http://192.168.100.47:32400"
```

然后, plex 后台配置自定义服务器访问 URL, 具体设置位置为 设置=>网络=>自定义服务器访问URL

Plex-a 后台配置
```
http://192.168.88.10:32400,https://plex.foo.example.com:3456
```

Plex-b 后台配置
```
http://192.168.100.47:32400,https://plex.bar.example.com:5678
```

注意上面的自定义服务器访问 URL 分别设置了两个值, 一个内网, 一个外网.

当这样设置后, plex 会为当前 plex 服务器分配一个 https://192-168-100-47.xxxxxxx.plex.direct 这样的域名, 实际解析到的地址就是内网的 192.168.100.47.

具体这样做的原因是因为, https://app.plex.tv 是使用 https 方式访问, 浏览器安全策略会禁止在 https 页面访问 http 资源的行为. 所以 plex 为了解决这个问题, 为每个 plex 服务器的内网IP分配了一个单独 https 的地址并在 plex 服务器上为  https://192-168-100-47.xxxxxxx.plex.direct 这样的单独域名安装上对应的SSL证书.

此时, 当你的路由器端口转发正常, 并且 traefik 正确配置了 SSL 泛解析证书的情况下, 访问 app.plex.tv 页面可以同时看到你的 plex-a 以及 plex-b 两个服务器的数据.

- 当在 plex-a 所在的内网访问 app.plex.tv 时, 请求的是 plex-a 的内网IP, plex-b 的公网IP
- 当在 plex-b 所在的内网访问 app.plex.tv 时, 请求的是 plex-a 的公网IP, plex-b 的内网IP
- 当在公网访问 app.plex.tv 时, 请求的是 plex-a 的公网IP, plex-b 的公网IP

**注意**
如果你内网使用了 OpenWrt DNS 的话, 还需要多设置一步.

由于 https://192-168-100-47.xxx.plex.direct  这样的域名解析出的 IP 实际是内网IP, 会被 OpenWrt 的 DNS 策略拦截, 此时 app.plex.tv 页面在浏览器请求 https://192-168-100-47.xxx.plex.direct 这个地址会被报告 DNS 解析错误, 所以 app.plex.tv 会 fallback 到公网地址.

具体配置位置为 网络=> DHCP/DNS=>重绑定保护, 取消打勾后就可以了.