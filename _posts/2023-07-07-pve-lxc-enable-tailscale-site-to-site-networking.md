---
title: PVE LXC 安装 Tailscale 并开启 site-to-site networking
pid: 2023070701
tags: [PVE, Tailscale, LXC]
---

Tailscale 是一个很方便的组网工具, 官方发布了文章介绍 tailscale 的工作原理是什么样的 [How Tailscale works](https://tailscale.com/blog/how-tailscale-works/).

本篇文章介绍如何在 PVE LXC 容器下安装 tailscale, 并在多个网络之间通过 tailscale 建立 `site-to-site networking` 连接.

安装 tailscale 时选择的是在 pve 的 lxc 容器而不是通过 docker 安装, 因为我在测试过程中发现使用 docker 安装后, 无法开启 `site-to-site networking`, 具体原因还没搞清楚.

**首先** 建立 lxc 容器, 并做好相应的配置
选择新建一个非特权CT容器, 模板我选择的是 `Debian 11(bullseye)`, 建立容器时, 网卡名称最好是叫 `eth0`, 因为后面配置 `site-to-site networking` 时会用到.

由于是非特权容器, 容器启动后会缺少 tailscale 运行需要的东西, 所以先不启动而是对容器作一些配置修改.

在 pve 宿主中, 确认 `/dev/net/tun` 存在并获取对应的信息, 具体命令和返回如下

```
root@pve:~# ls -al /dev/net/tun
crw-rw-rw- 1 root root 10, 200 Jun 30 23:08 /dev/net/tun
```

记录其中的 `10, 200` 这两个数字, 后面需要用到.

然后修改 `/etc/pve/lxc/CTID.conf` 文件, 新增如下两行

```
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

上面的 `10:200` 需要和前面使用 `ls -al /dev/net/tun` 获取的结果对应起来.

配置完成后启动容器, 然后按照 tailscale 官方的文档安装 tailscale. 具体文档可查看 [Setting up Tailscale on Debian Bullseye](https://tailscale.com/kb/1038/install-debian-bullseye/)

**然后** 是开启 lxc 的 IP 转发功能

编辑 `/etc/sysctl.conf` 文件, 将以下两行的注释去掉. 如果没有这两行, 需要添加

```
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
```

编辑完成后, 使用 `sysctl` 命令 reload

```
sysctl -p /etc/sysctl.conf
```

**然后** 是启动 tailscale
由于是两个网络之间建立 `site-to-site networking`, 所以我这边会以两个网络举例.

网络 A 为 `192.168.100.0/24`, 安装 tailscale 的机器 A IP 为 `192.168.100.16`, 网络 B 为 `192.168.88.0/24`, 安装 tailscale 的机器 B IP 为 `192.168.88.16`.

机器 A 执行命令
```
tailscale up --authkey=xxxxx --accept-routes --advertise-routes=192.168.100.0/24  --hostname=tailscale-A
```

机器 B 执行命令
```
tailscale up --authkey=xxxxx --accept-routes --advertise-routes=192.168.88.0/24  --hostname=tailscale-B
```

上面 `--autkey=xxx` 中的 `xxxxx` 需要替换为 tailscale 后台生成的 authkey. 如果 authkey 没有配置 `autoApprovers` 的话, 需要到 tailscale 后台开启`子网路由(subnet router)` 功能, 将各自所在的子网暴露给 tailscale 虚拟局域网. autoApprovers 可以查看文档 [Auto Approvers for routes and exit nodes](https://tailscale.com/kb/1018/acls/#auto-approvers-for-routes-and-exit-nodes).

此时机器 A 和 B 都已经处于 tailscale 虚拟局域网中, 机器 A 可以访问网络 B 中的所有设备, 机器 B 也可以访问网络 A 中的所有设备.

**然后** 是开启 `site-to-site networking`

`site-to-site networking` 能实现的效果是: 机器 A 和 B 安装了 tailscale, 他们就可以做为两个网络的桥梁, 允许两个网络中未安装 tailscale 的设备通过两个安装了 tailscale 设备的桥接, 实现互访. 官方文档 [Site-to-site networking](https://tailscale.com/kb/1214/site-to-site/).

机器 A 执行命令
```
iptables -t mangle -A FORWARD -i tailscale0 -o eth0 -p tcp -m tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu
```

机器 B 执行命令
```
iptables -t mangle -A FORWARD -i tailscale0 -o eth0 -p tcp -m tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu
```

然后需要做的就是在每个网络的网关配置到另一个网络的静态路由. 以我使用的 RouterOS 路由器为例

网络 A 网关执行命令
```
/ip route add dst-address=192.168.88.0/24 gateway=192.168.100.16
/ip route add dst-address=100.64.0.0/10 gateway=192.168.100.16
```

网络 B 网关执行命令
```
/ip route add dst-address=192.168.100.0/24 gateway=192.168.88.16
/ip route add dst-address=100.64.0.0/10 gateway=192.168.100.16
```

100.64.0.0/10 是 tailscale 固定的子网.

此时正常情况下, 网络 A 和 B 中未安装 tailscale 的设备就可以访问对方网络中的服务了.

**最后** 是一些说明

在官方的 [Site-to-site networking](https://tailscale.com/kb/1214/site-to-site/) 文档中, 有一个 `--snat-subnet-routes=false` 的选项, 我实践之后发现, 如果加了这个选项, 会导致所有请求都不通. 但是不加这个选项, 互访是正常的, 只是有一些小瑕疵. 网络 A 请求网络 B 中的服务时, 服务看到的来源 IP 会是网络 B 中安装了 tailscale 那台机器的 IP, 网络 B 请求网络 A 中的服务时, 服务看到的来源 IP 会是网络 A 中安装了 tailscale 那台机器的 IP. 如果对这个小的细节没有要求的话, 则不需要深究了.

