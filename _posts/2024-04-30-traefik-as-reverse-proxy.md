---
title: 使用 traefik 作为反向代理工具
pid: 20240403002
tags: [traefik]
---

很久之前写过一篇使用 traefik 的文章 [traefik 作为反向代理]({% post_url 2023-05-15-traefik-as-reverse-proxy %}). 但是现在回过头来看, 发现当时由于刚开始使用 traefik 一些理解其实是有问题的, 而且也走了一些弯路. 正值 traefik 正式发布 3.0 版本之际, 所以这次重新写这篇文章, 也是对 traefik 的使用作一些总结.

在写具体的使用之前, 先说下从开始使用 traefik 到现在的一些感受.

最大的一个感受是, 如果服务是通过 docker 部署的, 使用 traefik 配合 docker 可以极大减少反向代理配置的维护成本. 体现在两个地方, ① docker 容器的 IP traefik 可以自动感知, 所以也就不需要启动容器时指定固定IP, 让 docker 随机分配就好, 也不需要在转发规则中指定某个域名指向具体的 IP, traefik 会统一维护好. ② traefik 通过读取 docker 容器的 label 确定转发规则, 所以可以将转发配置和容器本身的配置集中在一起, 比如可以放在 `docker-compose.yml` 中. 而像 nginx 这样的工具, 容器服务的配置是在容器侧. 转发规则的配置是在 nginx 侧, 时间久了就不容易维护了.

说一下我使用 traefik 的场景, 我使用 docker 部署 traefik, 同时会在 docker 中部署一些其它的服务, 比如 vaultwarden 等. 用 docker 部署的服务会通过 label 的方式配置转发规则. 除了 docker 配置的服务外, 我还会在 traefik 中配置一些静态的转发规则, 转发到一些非 docker 部署的服务上, 比如 pve 管理端, openwrt 等.

traefik 启动时的配置文件分为静态配置和动态配置.
- 静态配置是配置监听端口、动态配置目录、docker 容器和网络等全局性的配置, 可以写在配置文件中, 也可以写在 traefik 启动时的参数中.
- 动态配置基本上就是转发规则相关的配置, 可以写在配置文件中, 也可以写在 docker label 中.

所以我把静态配置文件写在静态配置文件中, docker 容器的配置写在 label 中, 非 docker 容器的配置写在动态配置文件中.

静态配置内容如下. 如果想看每个配置代表的含义, 可以参考 traefik 配置文件的模板 [`traefik.sample.toml`
](https://github.com/traefik/traefik/blob/master/traefik.sample.toml). 在下面的配置中, 我只开启了 https 端口, 所有 http 转发都启用了 `compress` middleware, 这个 middleware 会对所有响应的数据进行压缩, 如果响应的数据比较大, 可以提高响应速度.

> 下面的配置文件中, 有一些关于 entryPoint, router, service, middleware 等的概念, 这些概念的含义可以参考 traefik 的官方文档 [Concepts](https://doc.traefik.io/traefik/getting-started/concepts/)

```toml
[entryPoints]
  [entryPoints.websecure] # websecure 是这个 entryPoint 的名字
    address = ":443" # websecure 这个 entryPoint 监听的端口
    [entryPoints.websecure.http]
      middlewares = ["shared-compress@file"] # 所有请求都使用 shared-compress middleware
      tls = true # websecure 这个 entryPoint 开启 https
  # 如果同时监听 http 的话, 可以再定义一个 web entryPoint
  [entryPoints.web]
    address = ":80"
    [entryPoints.websecure.http]
      middlewares = ["shared-compress@file"] # 所有请求都使用 shared-compress middleware
[log] # 开启日志
[api] # 开启 traefik dashboard
[ping] # 开启 ping 接口
[providers.docker] # 监听 docker 容器
  # 默认不转发, 只有通过label `traefik.enable=true` 时才转发
  exposedByDefault = false
  network = "traefik"
[providers.file] # 监听动态配置文件
  # 动态配置文件目录
  directory = "/etc/traefik/dynamic"
  # 动态配置文件目录变化时, 自动更新 traefik 配置
  watch = true
[serversTransport]
  # 内部转发时, 跳过证书验证
  # 因为像 PVE 这种服务只支持 https 访问且使用是自签证书, 如果验证证书的话, 会导致转发失败.
  insecureSkipVerify = true
```

`shared-compress` middleware 配置如下
```toml
[http.middlewares.shared-compress]
  compress = true
```

traefik 本身服务的 docker-compose 配置及注释如下
```yaml
version: '3'
services:
  traefik:
    # The official v2 Traefik docker image
    image: traefik:2.11.2
    container_name: traefik
    restart: always
    ports:
      - "443:443"
      - "80:80" # 如果对外暴露多个端口的话, 这里可以定义多个端口. 冒号前是 host 端口, 冒号后是容器端口
    healthcheck:
      test: traefik healthcheck --ping
      interval: 3s
      retries: 10
    volumes:
      # So that Traefik can listen to the Docker events
      - /var/run/docker.sock:/var/run/docker.sock:ro
      # 静态配置映射
      - /path/to/static.toml:/etc/traefik/traefik.toml:ro
      # 动态配置映射
      - /path/to/dynamic:/etc/traefik/dynamic:ro
      # https 证书目录映射
      - /path/to/certs:/etc/traefik/certs:ro
    networks:
      - traefik # 加入已经提前创建好的 traefik 网络
    labels:
      - traefik.enable=true
      # 新增了一个 router, 名字叫 dashboard, 使用 websecure entryPoint
      - traefik.http.routers.dashboard.entrypoints=websecure
      # 转发规则, 匹配域名 traefik.example.com
      - traefik.http.routers.dashboard.rule=Host(`traefik.example.com`)
      # 转发到 traefik dashboard 服务
      - traefik.http.routers.dashboard.service=api@internal
networks:
  traefik:
    external: true # 这里声明 traefik 是外部已经已经创建好的网络
```

开启了 https, 那么证书应该怎么配置呢? 我是使用的 acme.sh 生成证书, 然后放在 traefik 中使用. 首先通过上面的目录映射, 将证书目录映射到 traefik 容器中, 然后在动态配置目录下增加对应的配置

```toml
[[tls.certificates]]
  certFile = "/etc/traefik/certs/foo.example.com/foo.example.com.cer"
  keyFile = "/etc/traefik/certs/foo.example.com/foo.example.com.key"

# 如果有多个配置, 可以继续增加
[[tls.certificates]]
  certFile = "/etc/traefik/certs/bar.example.com/bar.example.com.cer"
  keyFile = "/etc/traefik/certs/bar.example.com/bar.example.com.key"
```

traefik 本身的配置完了, 下面分别讲下 docker 容器动态配置, 以及非 docker 容器的静态配置.

docker 容器动态配置以 whoami 为例子
```yaml
version: '3'
services:
  whoami:
    image: traefik/whoami
    container_name: whoami
    restart: unless-stopped
    networks:
      - traefik # 使用 traefik 网络, 可以让 traefik 在容器网络内部进行转发
    labels:
      # 启用 traefik 转发
      - traefik.enable=true
      # 转发使用在上面静态配置中定义好的 websecure entryPoint, 也就是 443 端口
      - traefik.http.routers.whoami.entrypoints=websecure
      # 转发规则, 匹配域名 whoami.example.com
      - traefik.http.routers.whoami.rule=Host(`whoami.example.com`)
      # 转发到目标服务的端口, 如果 docker 容器 expose 了1个端口, 大多数情况是不需要这个配置的
      # 如果 expose 了多个端口, 可以显式告诉 traefik 转发到哪个端口上
      - traefik.http.services.whoami.loadbalancer.server.port=80
networks:
  traefik:
    external: true # 这里声明 traefik 是外部已经已经创建好的网络
```

非 docker 容器的静态配置, 以 pve 管理端为例子

```toml
[http.routers.pve] # 定义这个服务的名字
  entryPoints = ["websecure"] # 定义使用的 entryPoint, 如果要同时监听 http 和 https, 可以在这里定义多个 entryPoint
  rule = "Host(`pve.example.com`)" # 转发规则, 匹配域名 pve.example.com
  service = "pve@file" # 转发到 `pve@file` 服务上, 这个服务在下面的动态配置文件中定义. 这里的 `@file` `@docker` 是区分服务注册源是什么

# 定义 pve@file 服务, 名字不一定和上面的 routers 里的名字一样, 但是要和上面指向的 service 的名字一样
[[http.services.pve.loadBalancer.servers]] # 定义 pve@file 这个服务的 ip 地址
  url = "https://192.168.100.11:8006"
[[http.services.pve.loadBalancer.servers]] # 定义 pve@file 这个服务的 ip 地址
  url = "https://192.168.100.10:8006" # 如果有多个 ip 地址, 可以在这里定义多个, traefik 会负责做负载均衡
```

最后, 总结一下, 使用 traefik 作为反向代理工具, 可以极大减少反向代理配置的维护成本, 并且可以将转发规则集中在一起, 方便管理. 如果你之前使用的是 nginx, nginx proxy manager 之类的工具, 可以参考这篇文章, 看看如何使用 traefik 减少维护成本.
