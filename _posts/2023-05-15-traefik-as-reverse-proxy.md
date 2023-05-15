---
title: traefik 作为反向代理
pid: 20230515
tags: [traefik, Synology]
---

### 优点
- 不需要集中维护代理配置文件
- 和 docker 完美配合
- docker label 自动更新时, 服务自动发现
- docker 各个服务启动顺序没有强制关系, 只要 label 中有 traefik 相关配置, 当 traefik 服务启动时, 都可以自动配置对应的反向代理服务
### 缺点
- docker 版本的 traefik 不好像群晖中的 nginx 反向代理一样, 可以方便的向局域网中的其它 IP 进行反向代理

# traefik 配置
traefik 配置分为两类, 静态配置和动态配置
## 静态配置
静态配置一般在两个地方配置, ① traefik 启动时的命令行参数, ②静态配置文件.
静态配置一般是用来定义 provider 和 entrypoint 用的. 另外, 在 entrypoint 的配置中, 还可以配置全局的 middleware 以及 tls 选项.
动态配置的配置项就比较多, 除了静态配置之外的都可以配置.

# 群晖docker中使用 traefik
traefik 启动配置就不再啰嗦, 但是有个地方需要重点注意.

docker 中的 traefik 无法方便的访问宿主机(也就是群晖)所在的局域网, 最多只能从容器中访问宿主机, 此时需要在 `docker-compose.yml` 中添加如下配置, 使容器内部可以请求到宿主机
```yml
extra_hosts:
  - host.docker.internal:host-gateway
```
此时 traefik 可以将请求转发给宿主机, 但是仍然无法转发给局域网中的其它机器. 解决这个问题有两个方案.

### 方案一: 搭配使用 traefik
对, 就是再搭配使用一个 traefik 实例(以下就叫实例 2, 前面说的 traefik 服务叫做实例 1), 但是启动时选择的网络模式是 host 模式, 实例 2 就可以自由访问到局域网中的其它IP.

此时实例 1 中通过动态配置新增一个服务, 服务IP为 `host.docker.internal`, 将请求转发给宿主机. 实例 2 在宿主机中监听所有请求, 然后再通过路由规则代理到对应的局域网IP.

但是这里有个问题是
1. 如果实例2启动时使用了 providers.docker, 那么两个实例都会尝试读取 docker label 中的信息, 并且由于两个 traefik 实例的dashboard 服务名字都叫 `api@internal`, 势必会造成冲突.
2. 如果实例2未启用 providers.docker, 那么就需要在实例2的动态配置中定义好 dashboard 服务.

但是我倾向于 dashboard 这种内建服务还是使用 docker label 动态化配置比较好. 而且实例 1 也无法在 docker label 中定义到宿主机的代理配置, 需要一个专门的动态配置才行(试验了一下, `loadbalancer.servers.url` 只能在动态配置文件中定义, 如果放在 docker label 中会提示 `servers` 字段不存在)

所以如果使用两个 traefik 实例的话, 配置文件会变多, 并且容易造成冲突.  而我的倾向是能放在 docker label 中的配置尽量不使用动态配置文件来实现.

所以我尝试了使用其它的方案.

### 方案二: 搭配使用 nginx + 群晖反向代理
我尝试的另一个方案是再加一个 nginx 实例, 但是需要和群晖的反向代理功能配合.

nginx 实例的唯一作用是将 traefik 的请求转发给宿主机, 然后由宿主机也就是群晖的反向代理将请求转发给对应的服务上去. 

和方案一对比起来不一样的就是, 方案一是把到局域网的转发配置维护在 traefik 中, 方案二是把到局域网的转发配置维护在群晖中.(相对来说, 其实上面的方案更优, 但是在实践的过程中, 上面的方案总是会报错)

相比方案一是在 traefik 实例中访问宿主机, 在方案二里是由 nginx 实例访问宿主机, nginx 作为 traefik 的一个承接服务, 这样就可以把 nginx 相关配置放在 docker label 中. nginx 实例的 `docker-compose.yml` 配置如下
```yml
traefik-proxy:
  image: nginx:stable-alpine
  container_name: traefik-proxy
  volumes:
    - /volume2/docker/traefik/nginx-templates:/etc/nginx/templates:ro
  networks:
    - traefik
  environment:
    - NGINX_HOST_PORT=51080
  extra_hosts:
    - host.docker.internal:host-gateway
  labels:
    - traefik.enable=true

    # routers
    - traefik.http.routers.openwrt.entrypoints=websecure
    - traefik.http.routers.openwrt.rule=Host(`domain.com`)
```

nginx 反向代理配置如下
```nginx
server {
  listen 80 default_server;

  location / {
    proxy_pass http://host.docker.internal:${NGINX_HOST_PORT};

    proxy_redirect off;

    # proxy_http_version 1.1定义用于代理的HTTP协议版本，默认情况下将其设置为1.0。对于Websocket和keepalive连接，您需要使用1.1版。
    proxy_http_version 1.1;

    # proxy_cache_bypass $http_upgrade设置websocket不从缓存中获取响应，而是直接通过应用。
    proxy_cache_bypass $http_upgrade;

    # Upgrade $http_upgrade和Connection "upgrade"如果您的应用程序使用Websockets，则这些字段是必填字段。
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    proxy_set_header Host $host;
    # X-Real-IP $remote_addr 将真实的客户端地址转发到应用，如果没有设置，你应用获取到将会是Nginx服务器IP地址。
    proxy_set_header X-Real-IP $remote_addr;
    # X-Forwarded-For $proxy_add_x_forwarded_for转发客户端请求头的X-Forwarded-For字段到应用。
    # 如果客户端请求头中不存在X-Forwarded-For字段，则$proxy_add_x_forwarded_for变量等同于$remote_addr变量
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    # X-Forwarded-Proto $scheme这将会转发客户端所使用的HTTP协议或者是HTTPS协议。
    proxy_set_header X-Forwarded-Proto $scheme;
    # X-Forwarded-Host $host转发客户端请求的原始主机到应用。X-Forwarded-Port $server_port定义客户端请求的原始端口。
    proxy_set_header X-Forwarded-Host $server_name;
    proxy_set_header X-Forwarded-Port $server_port;
  }
}
```

### 重回方案一
当我在写这篇总结的时候, 突然我意识到方案一我错在哪里了.

实例2的docker labels 是给实例1看的, 但是我误认为实例2可以看到. 并且我在实例2的labels中定义的 dashboard router 名字和在实例 1 中的一样导致冲突, 结果实例 1 的 dashboard 也进入不了了, 所以我误认为是两个 traefik 一起使用的话会出现问题.

仔细思考可以得出, 正确的做法应该是
1. 实例1开启 `providers.docker` 以及 `providers.file`. 前者是用来自动发现其它的 docker 服务, 并提供反向代理服务. 后者是用来定义 https 以及从实例 1 到实例 2 的转发配置.
2. 实例2只开启 `providers.file`, 所以它的 dashboard 以及其它各种配置只能在动态配置文件中定义.
3. 由于实例 2 和实例 1 根本不在一个网络中, 并且实例 2 也没有开启 `providers.docker`, 所以实例2中的 docker label 没有意义, 所以不需要任何 docker label.

通过前面的总结, 按照最新的方案一, 使用两个 traefik 终于完成了群晖中的 traefik 配置, 并且所有的配置都维护在 traefik 内部, 这样的话也方便迁移到非群晖的系统中去.

完整的 `docker-compose.yml` 配置如下
```yml
version: '3'
services:
  traefik-docker:
    # The official v2 Traefik docker image
    image: traefik:v2.9
    container_name: traefik-docker
    ports:
      # The HTTP port
      # - 52080:52080
      - 52443:52443
      # The Web UI (enabled by --api.insecure=true)
      # - "58080:8080"
    volumes:
      # So that Traefik can listen to the Docker events
      - /var/run/docker.sock:/var/run/docker.sock:ro
      # dynamic conf
      - /volume2/docker/traefik/traefik-docker:/etc/traefik/config:ro
    networks:
      - traefik
    extra_hosts:
      - host.docker.internal:host-gateway
    command:
      # - --entrypoints.web.address=:52080
      # - --entrypoints.web.http.middlewares=shared-compress@docker

      - --entrypoints.websecure.address=:52443
      # global config for response compress
      - --entrypoints.websecure.http.middlewares=shared-compress@docker
      # global config for https
      - --entrypoints.websecure.http.tls=true

      - --api=true

      # - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --providers.file.directory=/etc/traefik/config
      - --providers.file.watch=true
    labels:
      - traefik.enable=true

      # global shared middlewares
      ## response compress
      - traefik.http.middlewares.shared-compress.compress=true

      # service specific middlewares
      ## dashboard-auth
      # 在 labels 中配置密码时, 需要将 $ 进行转义变成 2 个
      - traefik.http.middlewares.dashboard-auth.basicauth.users=user:passwd

      # routers
      - traefik.http.routers.dashboard-traefik-docker.entrypoints=websecure
      - traefik.http.routers.dashboard-traefik-docker.rule=Host(`traefik.example.com`)
      - traefik.http.routers.dashboard-traefik-docker.service=api@internal
      - traefik.http.routers.dashboard-traefik-docker.middlewares=dashboard-auth@docker

      - traefik.http.routers.dashboard-traefik-host.entrypoints=websecure
      - traefik.http.routers.dashboard-traefik-host.rule=Host(`traefik-host.example.com`)
      - traefik.http.routers.dashboard-traefik-host.service=traefik-host@file
      - traefik.http.routers.dashboard-traefik-host.middlewares=dashboard-auth@docker

      - traefik.http.routers.openwrt.entrypoints=websecure
      - traefik.http.routers.openwrt.rule=Host(`op.example.com`)
      - traefik.http.routers.openwrt.service=traefik-host@file

  traefik-host:
    image: traefik:v2.9
    container_name: traefik-host
    # ports:
      # - 52081:52081
    volumes:
      - /volume2/docker/traefik/traefik-host:/etc/traefik/config:ro
    network_mode: host
    command:
      - --entrypoints.web.address=:52081
      # - --entrypoints.web.http.middlewares=shared-compress@docker

      # - --entrypoints.websecure.address=:52443
      # global config for response compress
      # - --entrypoints.websecure.http.middlewares=shared-compress@docker
      # global config for https
      # - --entrypoints.websecure.http.tls=true

      - --api=true

      # - --providers.docker=true
      # - --providers.docker.exposedbydefault=false
      - --providers.file.directory=/etc/traefik/config
      - --providers.file.watch=true

networks:
  traefik:
    external: true
```

实例1 的动态配置文件如下所示
动态配置的作用有两个
1. 定义 https 证书
2. 定义从 docker 转发请求到 host 的服务, 通过 host.docker.internal 指向宿主机.

```toml
[[tls.certificates]]
  certFile = "/path/to/tls.cer"
  keyFile = "/path/do/tls.key"

[[http.services.traefik-host.loadBalancer.servers]]
  url = "http://host.docker.internal:52081"
```

实例2 的动态配置文件如下所示, 动态配置的作用就是定义 dashboard 和转发请求到局域网中的其它IP.

```toml
# dashboard
[http.routers.dashboard]
  entryPoints = ["web"]
  rule = "Host(`traefik-host.example.com`)"
  service = "api@internal"

# openwrt
[http.routers.openwrt]
  entryPoints = ["web"]
  rule = "Host(`op.example.com`)"
  service = "openwrt@file"
[[http.services.openwrt.loadBalancer.servers]]
  url = "http://192.168.88.4:80"
```

# 思考
后续再思考一下
1. 如果使用方案一, 实例2使用 traefik 或者 nginx 都可以, 唯一的区别可能是 traefik 支持在不重启的情况下修改路由规则就可以生效, 而 nginx 必须要重启才可以生效.
2. 如果使用方案二, 局域网的转发配置也可以维护在 nginx 实例中, 此时就需要将 nginx 实例使用 `host` 网络模式启动, 和方案一中的 traefik 实例2 一样.