---
title: PVE 重装后做的几件事
pid: 2024040801
tags: [PVE]
---

# 背景
小区楼要更新配电箱, 所以需要进行断电. 在断电前我把 PVE 关机. 但是在来电后, 重启 PVE 失败. 经过排查后发现是 PVE 的系统 U 盘损坏.
经过 fsck 检查后, 仍然无法启动. 正好手头有一个备用 U 盘, 所以只好重装 PVE 系统.

之前 PVE 系统是 7.x, 这次就趁机会直接安装最新的 8.x 版本. 安装后当然所有的虚拟机及相关配置都没有了.

但是因为所有的虚拟机及lxc 容器都单独放在了一个硬盘上, 接下来需要做的就是将这些虚拟机及 lxc 容器进行恢复.

# 恢复虚拟机数据磁盘及备份磁盘自动挂载
系统重装完成后, 共有 2 块 nvme 硬盘, 再加一个 sata 控制器下的两个 hdd 硬盘. 现在要做的是把这 2 块 nvme 硬盘挂载到 PVE 系统中作为镜像盘和备份盘.

如果是未使用的磁盘, 可以直接在 PVE 中配置挂载. 但是因为磁盘是已经使用过的, 所以就不能在 PVE 中配置自动挂载, 而要手动处理了.
![](/uploads/2024/04/080101.png)

PVE 配置自动挂载实际是使用的 systemd 的功能, 所以手动挂载也是一样的.

1. 在 `/mnt/pve/` 下新建 `nvme0` 及 `nvme1` 两个空目录作为挂载点.

    ```shell
    mkdir -p /mnt/pve/nvme0
    mkdir -p /mnt/pve/nvme1
    ```
2. 在 `/etc/systemd/system` 上分别新建 `mnt-pve-nvme0.mount` 及 `mnt-pve-nvme1.mount` 文件, 用于 systemd 挂载磁盘.

    `mnt-pve-nvme0.mount` 内容如下
    ```
    [Install]
    WantedBy=multi-user.target

    [Mount]
    Options=defaults
    Type=ext4
    What=/dev/disk/by-uuid/d9b8de77-2020-4b27-b213-8a3158acda69
    Where=/mnt/pve/nvme0

    [Unit]
    Description=Mount storage 'nvme0' under /mnt/pve
    ```

    `mnt-pve-nvme1.mount` 内容如下
    ```
    [Install]
    WantedBy=multi-user.target

    [Mount]
    Options=defaults
    Type=ext4
    What=/dev/disk/by-uuid/e6dc0972-1361-4502-b5cc-596e6eb7be88
    Where=/mnt/pve/nvme1

    [Unit]
    Description=Mount storage 'nvme1' under /mnt/pve
    ```

    上面文件中的 by-uuid 后面的一串 uuid 可以通过命令查到

    ```shell
    $ ls -al /dev/disk/by-uuid/
    total 0
    drwxr-xr-x 2 root root 180 Apr  7 20:00 .
    drwxr-xr-x 7 root root 140 Mar 28 22:56 ..
    lrwxrwxrwx 1 root root  15 Mar 28 22:52 d9b8de77-2020-4b27-b213-8a3158acda69 -> ../../nvme1n1p1
    lrwxrwxrwx 1 root root  15 Mar 28 22:52 e6dc0972-1361-4502-b5cc-596e6eb7be88 -> ../../nvme0n1p1
    ```

    可以看到两块硬盘的 uuid 分别是什么, 填写到上面的 systemd 配置文件中即可.

    那么如何确定上面的 `nvme1n1p1` 和 `nvme0n1p1` 分别是哪块硬盘呢. 这个可以到 PVE web ui 中查看. 可能通过磁盘大小, 以及型号确定对应的硬盘.

    ![](/uploads/2024/04/080102.png)
3. 设置自动挂载配置文件生效

    ```shell
    systemctl enable --now mnt-pve-nvme0.mount
    systemctl enable --now mnt-pve-nvme1.mount
    ```

    命令运行成功后, 正常情况下就可以在 PVE webui 中看到已经挂载好的目录了.

    ![](/uploads/2024/04/080105.png)

    通过 systemd 命令也可以查看状态

    ```
    $ systemctl status mnt-pve-nvme0.mount
    ● mnt-pve-nvme0.mount - Mount storage 'nvme0' under /mnt/pve
        Loaded: loaded (/etc/systemd/system/mnt-pve-nvme0.mount; enabled; preset: enabled)
        Active: active (mounted) since Thu 2024-03-28 22:52:33 CST; 1 week 3 days ago
          Where: /mnt/pve/nvme0
          What: /dev/nvme1n1p1
          Tasks: 0 (limit: 18888)
        Memory: 1008.0K
            CPU: 24ms
        CGroup: /system.slice/mnt-pve-nvme0.mount

    Mar 28 22:52:33 pve systemd[1]: mnt-pve-nvme0.mount: Directory /mnt/pve/nvme0 to mount over is not empty, mounting anyway.
    Mar 28 22:52:33 pve systemd[1]: Mounting mnt-pve-nvme0.mount - Mount storage 'nvme0' under /mnt/pve...
    Mar 28 22:52:33 pve systemd[1]: Mounted mnt-pve-nvme0.mount - Mount storage 'nvme0' under /mnt/pve.
    ```

4. 完成镜像盘和备份盘的挂载后, 下一步是配置数据中心的存储

    ![](/uploads/2024/04/080103.png)

    ![](/uploads/2024/04/080104.png)

    在添加目录时, id 我输入的是 `nvme0` 和 `nvme1`, 目录我输入的是 `/mnt/pve/nvme0` 和 `/mnt/pve/nvme1`. 内容选择好目录对应的存储类型即可. 我的 nvme0 负责硬盘映像和模板, nvme1 负责备份文件.


# 恢复 sata 控制器直通
恢复完了磁盘挂载, 正常来说下一步是恢复虚拟机和 lxc 容器了. 但是由于我的其中一个虚拟机直通了 sata 控制器, 所以还需要进行一些额外的处理

sata 控制器的直通, 可以查看之前已经写的文章 [PVE 启用 IOMMU 功能为虚拟机开启 sata 控制器直通]({% post_url 2023-05-16-pve-enable-iommu %})

# 恢复虚拟机及容器
