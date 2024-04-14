---
title: PVE lxc 容器挂载宿主目录
pid: 2024041401
tags: [PVE, lxc]
---

**命令行方式**, 在 PVE shell 中运行以下命令

```
pct set PID -mp0 /path/to/host/dir0,mp=/path/to/lxc/dir0
pct set PID -mp1 /path/to/host/dir1,mp=/path/to/lxc/dir1
```

`-mp0`, `-mp1` 指对 lxc 容器设置的第几个文件夹. 从 `mp0` 开始, 依次递增.

`mp=` 后面的路径表示在 lxc 容器中的位置.

**直接修改配置文件方式**, 除命令行方式外, 还可以直接修改 lxc 窗口的配置文件

```
$ cat 510.conf
arch: amd64
cores: 1
hostname: JellyfinServer
memory: 512
mp0: /mnt/pve/path0/,mp=/mnt/path0
mp1: /mnt/pve/path1/,mp=/mnt/path1
```

返回结果中的 `mp0`, `mp1` 就是已经配置的内容.
