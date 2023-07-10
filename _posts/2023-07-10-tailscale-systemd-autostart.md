---
title: tailscale 使用 systemd 开机自动启动
pid: 2023071001
tags: [Tailscale, Systemd]
---

上篇讲了如何在 lxc 容器中安装 tailscale 并运行. 由于 tailscale 安装后没有自带自启动脚本, 所以本篇介绍如何使用 systemd 自动启动 tailscale, 防止服务器重启后 tailscale 断连.

**首先**创建 systemd unit 文件内容如下

```
[Unit]
Description=AutoStart tailscale
After=tailscaled.service
Requires=tailscaled.service

[Service]
EnvironmentFile=/path/to/envfile
Type=oneshot
ExecStart=/usr/bin/tailscale up --authkey=${TAILSCALE_AUTHKEY} --accept-routes --advertise-routes=${TAILSCALE_ROUTES} --hostname=${TAILSCALE_HOSTNAME}
ExecStop=/usr/bin/tailscale down
RemainAfterExit=yes
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

`EnvironmentFile` 文件中定义的是 `ExecStart` 命令中用到的一些环境变量, 上面的例子中有 `TAILSCALE_AUTHKEY`, `TAILSCALE_ROUTES` 和 `TAILSCALE_HOSTNAME` 3 个变量.

systemd unit 文件的写法参考了阮一峰博客中关于 systemd 的讲解, 文章链接 [Systemd 入门教程：实战篇](https://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-part-two.html)

**然后** 是配置步骤

1. 将 systemd unit 文件链接到正确的位置上, `/path/to/tailscale.service` 就是 system unit 文件所在的位置
    ```
    ln -s /path/to/tailscale.service /etc/systemd/system/
    ```
2. 启用自动运行
    ```
    systemctl enable tailscale.service
    ```
3. 由于自动运行只有在下次启动后才生效, 所以本次使用 start 命令先启动.
    ```
    systemctl start tailscale.service
    ```