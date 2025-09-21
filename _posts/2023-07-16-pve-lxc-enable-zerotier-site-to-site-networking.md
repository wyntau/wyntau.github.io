---
title: PVE LXC 安装 ZeroTier 并开启 site-to-site networking
pid: 20230701601
tags: [ZeroTier, PVE, LXC]
---

前面两篇介绍了如何在 PVE LXC 容器下安装 tailscale 并开启 `site-to-site networking`.

和 tailscale 齐名的就是 zerotier 了, 所以本篇来介绍一下在 PVE LXC 容器下怎么安装 zerotier, 标题中的 `site-to-site networking` 是我复用了 tailscale 里的名称, 因为我希望在 zerotier 中也实现一样的效果.

**首先** 建立 lxc 容器, 并做好相应的配置
选择新建一个非特权CT容器, 模板我选择的是 `Debian 11(bullseye)`, 建立容器时, 网卡名称最好是叫 `eth0`, 因为后面配置 `site-to-site networking` 时会用到.

由于是非特权容器, 容器启动后会缺少 zerotier 运行需要的东西, 所以先不启动而是对容器作一些配置修改.

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

**然后** 是开启 lxc 的 IP 转发功能

启动 lxc 容器后, 编辑 `/etc/sysctl.conf` 文件, 将以下两行的注释去掉. 如果没有这两行, 需要添加

```
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
```

编辑完成后, 使用 `sysctl` 命令 reload

```
sysctl -p /etc/sysctl.conf
```

**然后** 是安装 zerotier

```
apt update && apt install curl pgp iptables iptables-persistent
curl -s https://install.zerotier.com | bash
```

如果你的源速度比较慢, 可以先换成速度比较快的源再安装.

**然后** 是加入 zerotier 网络

```
zerotier-cli join <NETWORK ID>
```

如果是加入的一个 `private network`, 需要在 zerotier 后台点击允许, 可以按需分配一个IP地址. 至于 zerotier 如何创建网络并选择子网前缀这些我就不再讲了.

**然后** 是开启 `site-to-site networking`

zerotier 官方文档地址 [Route between ZeroTier and Physical Networks](https://docs.zerotier.com/route-between-phys-and-virt/), 下面的内容是结合官方文档以及个人的实际情况举例.

由于是两个网络之间建立 `site-to-site networking`, 所以我这边会以两个网络举例.

网络 A 为 `192.168.100.0/24`, 安装 zerotier 的机器 A IP 为 `192.168.100.17`, 网络 B 为 `192.168.88.0/24`, 安装 zerotier 的机器 B IP 为 `192.168.88.17`.

在 zerotier 后台配置到两个网络的静态路由, 我给两个 zerotier 客户端分配的IP分别为 `10.244.100.17` 和 `10.244.88.17`, 在 zerotier 后台配置静态路由如下

```
10.244.0.0/16 (LAN) # 这条是选择 zerotier 子网前缀后自动生成的
192.168.100.0/24 via 10.244.100.17
192.168.88.0/24 via 10.244.88.17
```

**然后** 是客户端配置 iptables

通过 `ip a` 命令可以查询到 zerotier 虚拟网卡的名称是什么, 这里假设 zerotier 网卡名称为 `ztabcdef`, 物理网卡名称为 `eth0`. 对以下变量进行赋值

```
PHY_IFACE=eth0; ZT_IFACE=ztabcdef
```

分别在两个 zerotier 客户端上运行下面 3 条 iptables 规则.

```
iptables -t nat -A POSTROUTING -o $PHY_IFACE -j MASQUERADE
iptables -A FORWARD -i $PHY_IFACE -o $ZT_IFACE -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -i $ZT_IFACE -o $PHY_IFACE -j ACCEPT
```

**然后** 是配置各个子网的静态路由.

在两个网络的网关(路由器)中, 分别添加一条到另一个网络的静态路由, 分别指向 `192.168.100.17` 以及 `192.168.88.17` 中. 我的网关是 RouterOS 路由器, 以 RouterOS 路由器举例

网络 A 网关执行命令
```
/ip route add dst-address=192.168.88.0 gateway=192.168.100.17
```

网络 B 网关执行命令
```
/ip route add dst-address=192.168.100.0 gateway=192.168.88.17
```

此时正常情况下, 网络 A 和 B 中未安装 zerotier 的设备就可以访问对方网络中的服务了.

**最后** 是固化 iptables 规则, 方便重启后规则仍然生效

由于之前已经安装了 iptables-persistent, 所以可以把 iptables 规则固化到 `/etc/iptables/rules.v4` 文件中, 重启后 iptables-persistent 会自动读取这个文件并执行相应的规则. 执行如下命令

```
iptables-save > /etc/iptables/rules.v4
```

执行命令后, 查看 `/etc/iptables/rules.v4` 文件就可以看到对应的内容.