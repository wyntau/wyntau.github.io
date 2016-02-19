---
layout: post
title: Gentoo安装手记
pid: 2015011601
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Linux, Gentoo]
---

自己有一台macbook air, 还有一台台式机, 平时工作的时候用air, 所以台式机就一直空着. 一直对Linux
很喜欢, 所以本着折腾就是乐趣的原则, 这次在台式机上安装Gentoo. 相传是比LFS容易一些的Linux.

### 准备工作
1. 下载ios镜像. 因为台式机有8G内存, 所以下载了amd64架构的mininal镜像.
2. 提前阅读Gentoo Handbook中的Install一节, 对安装中要遇到的问题提前了解

### 安装基本系统

1. 将iso镜像刻录到U盘中. 因为原来台式机中使用是的window8, 所以很方便.
2. 从U盘启动, 进入Gentoo LiveCD.

        gentoo
3. 设置LiveCD的root密码, 方便使用ssh方式进行安装

        passwd

4. 启动sshd, 使用ssh方式进行安装

        /etc/init.d/sshd start

5. 因为电脑已经连接了网线, 而且使用dhcp方式已经获取到IP, 所以跳过网络设置步骤
6. 使用fdisk对硬盘进行分区, 只分了两个区, 一个swap(/dev/sda3), 一个root分区(/dev/sda4). 而且使用的是BIOS + MBR方式进行安装
7. 对分区进行格式化

        mkfs.ext4 /dev/sda4
        mkswap /dev/sda3
        swapon /dev/sda3
8. 将新分好的区进行挂载.

        mount /dev/sda4 /mnt/gentoo

9. 从163的源里下载stage3 tar包, 解压后进行安装

        cd /mnt/gentoo
        links http://mirrors.163.com/gentoo # 选择tar包, 进行下载.
        tar xvjpf stage3-*.tar.bz2

10. 修改`/mnt/gentoo/etc/portage/make.conf`, 设置CFLAGS, 添加`-march=native`

        CFLAGS="-march=native -O2 -pipe"
    并在`make.conf`中添加`MAKEOPTS`

        MAKEOPTS="-j2" # 电脑双核, 所以设置为2

11. 选择源, 选择中国的源, 163 sohu的这些都可以. copy DNS, 挂载必要系统

        mirrorselect -i -o >> /mnt/gentoo/etc/portage/make.conf
        mirrorselect -i -r -o >> /mnt/gentoo/etc/portage/make.conf
        cp -L /etc/resolv.conf /mnt/gentoo/etc/
        mount -t proc proc /mnt/gentoo/proc
        mount --rbind /sys /mnt/gentoo/sys
        mount --make-rslave /mnt/gentoo/sys
        mount --rbind /dev /mnt/gentoo/dev
        mount --make-rslave /mnt/gentoo/dev

12. chroot, 进入新的Gentoo, Installing a portage snapshot

        chroot /mnt/gentoo /bin/bash
        source /etc/profile
        export PS1="(chroot) $PS1"
        emerge-webrsync

13. 选择profile, 选择desktop, 但是不要选择gnome或者kde, 因为后面需要安装xfce. 我的list中
destop序号为3, 所以将3设置为使用

        eselect profile list
        eselect profile set 3

14. 修改`make.conf`中的USE flag, 参照了xfce HOWTO中的提示, 使用xfce的基本USE flag, 同时
添加dvd alsa cdr等flag, 将ipv6 cups等去掉

        USE="-gnome -kde -minimal -qt4 dbus jpeg lock session startup-notification thunar udev X dvd alsa cdr -ipv6 -cups"

15. 设置时区

        echo "Asia/Shanghai" > /etc/timezone
        emerge --config sys-libs/timezone-data

16. 修改`/etc/locale.gen`设置locale. 使用`en_US.UTF-8 UTF-8`, `zh_CN.UTF-8 UTF-8` 和 `zh_TW.UTF-8 UTF-8`, 然后生成cache

        locale-gen
    选择正确的locale. 我选择的`en_US.UTF-8 UTF-8`

        eselect locale list
        eselect locale set 2
    修改`/etc/env.d/02locale`, 设置为以下内容

        LANG="en_US.UTF-8"
        LC_COLLATE="C"
    更新一下

        env-update && source /etc/profile

17. 安装内核源码

        emerge --ask sys-kernel/gentoo-sources

18. 设置内核, 并编译安装

        emerge --ask sys-apps/pciutils
        cd /usr/src/linux
        make menuconfig
    按照wiki上的指导, 将一些必要的配置选中, 但是我将Reiserfs, JFS, XFS 文件系统, 还有PPP拨号支持去掉了. 额外添加的一个选项是FUSE文件系统. 因为选中这个可以添加ntfs文件系统的支持, 后续可以通过`sys-fs/ntfs3g`添加对ntfs文件系统的读写支持
    然后执行如下命令, 开始编译内核

        make && make modules_install
        make install

19. 生成initramfs

        emerge genkernel
        genkernel --install initramfs

20. 设置`/etc/fstab`, 将对应的设置位置修改正确, 方便后面安装grub

        # <fs>                  <mountpoint>    <type>          <opts>          <dump/pass>

        # NOTE: If your BOOT partition is ReiserFS, add the notail option to opts.
        /dev/sda4               /               ext4            noatime         0 1
        /dev/sda3               none            swap            sw              0 0
        /dev/cdrom              /mnt/cdrom      auto            noauto,ro       0 0
        /dev/fd0                /mnt/floppy     auto            noauto          0 0

21. 设置`/etc/conf.d/hostname`, `/etc/hosts`文件, 将hostname修改成想要的, 我修改成了`gentoo`
22. 配置网络. 首先安装`net-misc/netifrc`

        emerge --ask --noreplace net-misc/netifrc
    然后使用`ifconfig`检查当前使用的网络接口的名字. 比如我的网络接口的名字叫做`enp3s0`. 然后我就修改`/etc/conf.d/net`, 配置使用dhcp服务

        config_enp3s0="dhcp"
    开机自动启动enp3s0

        cd /etc/init.d
        ln -s net.lo net.enp3s0
        rc-update add net.enp3s0 default

23. 安装`sys-apps/pcmciautils`, 及`app-portage/gentoolkit`. 在gentoolkit中, 包含了euse, equary等很有用的工具, 后面会经常用到

        emerge --ask sys-apps/pcmciautils
        emerge --ask app-portage/gentoolkit

24. 重设root密码

        passwd

25. 修改`/etc/conf.d/hwclock`文件, 将clock设置为`local`
26. 安装必要package

        emerge --ask app-admin/syslog-ng
        rc-update add syslog-ng default
        emerge --ask sys-process/cronie
        rc-update add cronie default
        emerge --ask sys-apps/mlocate
        rc-update add sshd default
        emerge --ask net-misc/dhcpcd

27. 安装grub2

        emerge --ask sys-boot/grub
        emerge --ask sys-boot/os-prober
        emerge --ask sys-fs/ntfs3g
        grub2-install /dev/sda
        grub2-mkconfig -o /boot/grub/grub.cfg

28. 收尾

        exit
        cd
        umount -l /mnt/gentoo/dev{/shm,/pts,}
        umount /mnt/gentoo{/boot,/sys,/proc,}
        reboot

上面的这些步骤是看了官方的Handbook, 总结出的适合我个人的安装步骤, 有些官方的步骤跳过了, 因为不需要.
有些东西修改了, 因为再往后面会用到.

仅做后面再次安装时参考之用.