---
title: 使用 traefik 代理 aria2
pid: 2023052401
tags: [traefik, aria2]
---

aria2-pro 搭配 traefik 使用, 主要是利用 traefik 对 aria2 的 jsonrpc 请求, 以及 tcp/udp 端口进行代理.
网上很多教程都是直接启动 docker, 很少有涉及到 traefik 的使用.

在 traefik 配置中, udp 配置中没有 rule 相关配置, 所以只能 aria2 独自占用一个端口.
tpc 配置中, 如果未启用 tls 配置, rule 只能配置为 "HostSNI(\`*\`)", 如果启用了 https, 就可以和其它需要使用 tcp 的服务共用一个端口.

完整的 docker-compose 内容如下, 环境变量通过 `docker-compose --env-file [file]` 进行指定

```yml
version: '3'
services:
  aria2-pro:
    image: p3terx/aria2-pro
    container_name: aria2-pro
    restart: unless-stopped
    volumes:
      - ${ARIA2_CONFIG_DIR}:/config
      - ${ARIA2_DOWNLOADS_DIR}:/downloads
    environment:
      - RPC_SECRET=${ARIA2_RPC_SECRET}
    networks:
      - traefik
    labels:
      - traefik.enable=true

      - traefik.http.routers.aria2-pro.entrypoints=websecure
      - traefik.http.routers.aria2-pro.rule=Host(`${ARIA2_DOMAIN}`)
      - traefik.http.services.aria2-pro.loadbalancer.server.port=6800

      - traefik.tcp.routers.aria2-pro.entrypoints=aria2tcp
      - traefik.tcp.routers.aria2-pro.rule=HostSNI(`*`)
      - traefik.tcp.services.aria2-pro.loadbalancer.server.port=6888

      - traefik.udp.routers.aria2-pro.entrypoints=aria2udp
      - traefik.udp.services.aria2-pro.loadbalancer.server.port=6888
networks:
  traefik:
    external: true

```

traefik 除正常的 http 配置外, 还需要新增 tcp 以及 udp 的配置

```toml
[entryPoints.aria2tcp]
  address = ":6888/tcp"
[entryPoints.aria2udp]
  address = ":6888/udp"
```
