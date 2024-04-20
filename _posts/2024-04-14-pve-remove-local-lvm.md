---
title: PVE删除local-lvm，并把空间合并到local
pid: 2024041402
tags: [PVE]
---

PVE 安装完系统后, 会自动把系统所在硬盘划分为 `local` 和 `local-lvm` 两个部分, 但是有时候并不需要 `local-lvm`, 那么应该如何删掉 `local-lvm`, 然后把原来 `local-lvm` 占用的空间和 `local` 进行合并呢.

**提醒**: 由于 `local-lvm` 默认是用来存储虚拟机镜像的, 所以如果已经有存在的虚拟机并且存储位置正好是 `local-lvm`, 就需要先进行虚拟机备份, 待操作完成后再进行恢复.
因为删掉 `local-lvm` 后, 原来的虚拟机都会消失.

下面开始进行操作.

**首先**编辑 `local`, 将原来 `local-lvm` 存储的内容和 `local` 进行合并.

可以直接通过 webui 进行操作, 如下图

![](/uploads/2024/04/140201.jpg)

也可以直接编辑 `/etc/pve/storage.cfg` 文件, 将 `local-lvm` 部分的 content 内容 `rootdir,images` 两项与 `local` 的 content 内容进行合并, 然后删掉 `local-lvm` 相关配置.

```
$ cat /etc/pve/storage.cfg
dir: local
        path /var/lib/vz
        content vztmpl,backup,iso,rootdir,images
```

**然后**执行如下命令, 删掉 `local-lvm`

```
lvremove pve/data
```

**然后**将剩余空间全部扩充到 local 中

```
lvextend -l+100%FREE /dev/mapper/pve-root
resize2fs /dev/mapper/pve-root
```

**然后**到数据中心中, 删掉 `local-lvm` 所在的目录配置即可.
![](/uploads/2024/04/140202.jpg)

**最后** 可以通过 `lvs` 或者 `df -h` 命令确认新的空间分布情况.

```
$ lvs
  LV   VG  Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  root pve -wi-ao---- <25.25g
  swap pve -wi-ao----   3.50g
```

```
$ df -h
Filesystem                    Size  Used Avail Use% Mounted on
udev                          7.7G     0  7.7G   0% /dev
tmpfs                         1.6G  1.3M  1.6G   1% /run
/dev/mapper/pve-root           25G  5.4G   19G  23% /
tmpfs                         7.8G   46M  7.7G   1% /dev/shm
tmpfs                         5.0M     0  5.0M   0% /run/lock
efivarfs                      512K  115K  393K  23% /sys/firmware/efi/efivars
```

参考文章: [https://gist.github.com/dergachev/6828967](https://gist.github.com/dergachev/6828967)
