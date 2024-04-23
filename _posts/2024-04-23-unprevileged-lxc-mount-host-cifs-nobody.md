---
title: PVE LXC 非特权容器挂载宿主 cifs 目录权限 nobody 问题解决方案
pid: 2024042301
tags: [PVE, lxc]
---

之前写过一篇文章 [PVE lxc 容器挂载宿主目录]({% post_url 2024-04-14-lxc-mount-host-dir %}) 介绍如何在 lxc 容器中挂载宿主目录.

在安装 jellyfin 时需要将宿主机中的 cifs 目录挂载到 lxc 容器中, 但是在 lxc 容器中通过 `ls -al` 命令查看挂载的目录, 可以发现权限属于 `nobody:nogroup`, 所以在 lxc 容器中是无法对挂载的目录中的文件进行修改的.

那么出现这种情况的原因是什么呢. lxc 非特权容器使用了新内核特性 user namespaces, 所有的容器内部 UID（用户 ID）和 GID（组 ID）都被映射到了宿主机上不同的ID，通常 root（UID 0）变成了 100000，1 变成了 100001, 依此类推. 挂载的目录在宿主机中的权限为 `0:0`, 而 lxc 容器在宿主中的权限实际为 `100000:100000`, 当然 lxc 容器就没有权限对目录中的内容进行修改了.

下面介绍如何配置能在 lxc 容器中对挂载的目录进行修改, 参考了 PVE 官方文档 [Unprivileged LXC containers](https://pve.proxmox.com/wiki/Unprivileged_LXC_containers) 以及博客文章 [LXC非特权容器绑定宿主机目录nobody](http://www.icharm.me/unprivileged-lxc/index.zh-cn.html), 针对我的使用场景进行了一些细微的修改.

**首先** 在宿主机中创建用户和用户组 `lxc_root`, 方便后面使用. 由于在宿主机中新建用户默认是从 1000 开始. 为了防止和普通用户冲突我这里设置 `lxc_root` 使用的 uid 和 gid 都是 2000.

```shell
groupadd -u 2000 lxc_root
useradd lxc_root -u 2000 -g 2000
```

**然后** 映射宿主到容器的 uid, 编辑 `/etc/pve/lxc/ID.conf`, 添加如下内容
```
# uid map: from uid 0 map 2000 uids (in the ct) to the range starting 100000 (on the host), so 0..2000 (ct) → 100000..102000 (host)
lxc.idmap = u 0 100000 2000
lxc.idmap = g 0 100000 2000
# we map 1 uid starting from uid 2000 onto 2000, so 2000 → 2000
lxc.idmap = u 2000 2000 1
lxc.idmap = g 2000 2000 1
# we map the rest of 65535 from 2001 upto 102001, so 2001..65535 → 102001..165535
lxc.idmap = u 2001 102001 63535
lxc.idmap = g 2001 102001 63535
```

**然后**更新宿主机的配置文件 `/etc/subuid` 和 `/etc/subgid`

```shell
echo 'root:2000:1' >> /etc/subuid
echo 'root:2000:1' >> /etc/subgid
```

uid 和 gid 的映射完成后, **然后** 在宿主机中修改挂载 cifs 时的 uid 和 gid

```shell
# 设置 cifs 挂载时的uid和gid
pvesm set <storagename> -options uid=2000,gid=2000
```

此时, 查看宿主机 `/etc/pve/storage.cfg` 文件可以看到 options 已经被加入进去了

```shell
cat /etc/pve/storage.cfg

cifs: resources0
        path /mnt/pve/resources0
        server 192.168.100.21
        share resources0
        content iso
        options uid=2000,gid=2000
        username user
```

**接下来**是重新挂载目录, 应用新的 options

```shell
# 停止当前的 storage
pvesm set <storage> -disable 1

# 使用 umount 卸载目录挂载
umount /path/to/storage

# 最后重新挂载目录
pvesm set <storage> -disable 0
```

操作完成后, 可以通过 `mount` 命令进行确认新的挂载是否使用了 options `uid=2000,gid=2000`

```shell
$ mount
//192.168.100.21/resources0 on /mnt/pve/resources0 type cifs (rw,relatime,vers=3.1.1,cache=strict,username=user,uid=2000,noforceuid,gid=2000,noforcegid,addr=192.168.100.21,file_mode=0755,dir_mode=0755,soft,nounix,serverino,mapposix,rsize=4194304,wsize=4194304,bsize=1048576,echo_interval=60,actimeo=1,closetimeo=1)
```

在上面的输出中, 可以看到挂载 options 中有 `uid=2000,gid=2000`, 说明配置的 storage 挂载选项正确生效了. 也可以通过以下命令对挂载的目录进行确认.

```shell
ls -al /mnt/pve
drwxr-xr-x 8 root     root     4096 Apr 23 08:05 .
drwxr-xr-x 3 root     root     4096 Mar 27 22:54 ..
drwxr-xr-x 2 lxc_root lxc_root    0 Apr 23 21:51 resources0
```

可以从上面的输出中看到, `resources0` 目录权限属于 `lxc_root:lxc_root` 了.

**然后**把 lxc 容器重启. 如果一切正常的话, 在 lxc 容器中查看被挂载的目录权限应该是 `2000:2000`, 修改文件也可以成功了.

```shell
ls -al /media
root@DeamonLocal:~# ls -al /media/
total 8
drwxr-xr-x  4 root root 4096 Apr 22 14:13 .
drwxr-xr-x 19 root root 4096 Apr 23 15:00 ..
drwxr-xr-x  2 2000 2000    0 Apr 23 13:51 resources0
```

**最后**想说的是, 如果要挂载的目录不是 cifs 目录的话, 就不需要像上面这么麻烦, 修改权限直接使用 `chown -R lxc_root:lxc_root /path/to/storage` 就行了.
