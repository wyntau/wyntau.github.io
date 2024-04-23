---
title: PVE LXC 非特权容器挂载宿主目录权限 nobody 问题解决方案
pid: 2024042301
tags: [PVE, lxc]
---

之前写过一篇文章 [PVE lxc 容器挂载宿主目录]({% post_url 2024-04-14-lxc-mount-host-dir %}) 介绍如何在 lxc 容器中挂载宿主目录.

在安装 jellyfin 时需要将宿主机中的 cifs 目录挂载到 lxc 容器中, 但是在 lxc 容器中通过 `ls -al` 命令查看挂载的目录, 可以发现权限属于 `nobody:nogroup`, 所以在 lxc 容器中是无法对挂载的目录中的文件进行修改的.

那么出现这种情况的原因是什么呢. lxc 非特权容器使用了新内核特性 user namespaces, 所有的容器内部 UID（用户 ID）和 GID（组 ID）都被映射到了宿主机上不同的ID，通常 root（UID 0）变成了 100000，1 变成了 100001, 依此类推. 挂载的目录在宿主机中的权限为 `0:0`, 而 lxc 容器在宿主中的权限实际为 `100000:100000`, 当然 lxc 容器就没有权限对目录中的内容进行修改了.

下面介绍如何配置能在 lxc 容器中对挂载的目录进行修改.

**首先** 在宿主机中创建用户和用户组 `lxc_root`, 方便后面使用. 由于在宿主机中新建用户默认是从 1000 开始. 为了防止和普通用户冲突我这里设置 `lxc_root` 使用的 uid 和 gid 都是 2000.

```shell
groupadd -u 2000 lxc_root
useradd lxc_root -u 2000 -g 2000
```

**然后** 在宿主机中修改挂载 cifs 时的 uid 和 gid

```shell
# 设置 cifs 挂载时的uid和gid
pvesm set <storagename> -options uid=2000,gid=2000
pvesm set <storage> -disable 1 # 先停止
pvesm set <storage> -disable 0 # 再启用
```

修改 `/etc/subuid` 和 `/etc/subgid` 文件, 添加 `lxc_root` 用户的 uid 和 gid 映射.

LXC非特权容器绑定宿主机目录nobody

http://www.icharm.me/unprivileged-lxc/index.zh-cn.html


lxc 容器的 uid 和 gid 映射到 host 中
```
lxc.idmap
```