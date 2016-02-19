---
layout: post
title: Gentoo设置内核, 开启USB及蓝牙支持
pid: 2015012201
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Linux, Gentoo]
---

记录一下, 在gentoo中编译内核支持usb及蓝牙, 方便使用蓝牙鼠标的过程.

1. 完善内核对udev的支持, 下面带`*`号的都保证选中状态, 并保证`/etc/portage/make.conf`的USE中有`udev`flag

        General setup  --->
            [*] Configure standard kernel features (expert users)  --->
                [ ] Enable deprecated sysfs features to support old userspace tools
                [*] Enable signalfd() system call
        Enable the block layer  --->
            [*] Block layer SG support v4
        Networking support  --->
            Networking options  --->
                <*> Unix domain sockets
        Device Drivers  --->
            Generic Driver Options  --->
                ()  path to uevent helper
                [*] Maintain a devtmpfs filesystem to mount at /dev
            < > ATA/ATAPI/MFM/RLL support (DEPRECATED)  --->
        File systems  --->
            [*] Inotify support for userspace
            Pseudo filesystems --->
                [*] /proc file system support
                [*] sysfs file system support

2. 完善内核对USB的支持, 下面带`*`号的都会员证选中状态. 并保证`/etc/portage/make.conf`的USE中有`usb`flag

        Device Drivers --->
            [*] USB support  --->
                <*>   Support for Host-side USB

                Select a USB HCI driver, e.g.:
                <*> xHCI HCD (USB 3.0) support (xhci-hcd)
                <*> EHCI HCD (USB 2.0) support (ehci-hcd)
                <*> OHCI HCD support (ohci-hcd)
                <*> UHCI HCD (most Intel and VIA) support (uhci-hcd)

3. 更新一下已安装的软件的包, 使得新的USE标记生效

        emerge --ask --changed-use --deep @world

4. 保证`sys-apps/usbutils`已经安装

        emerge --ask usbutils

5. 完善内核对bluetooth的支持, 并保证`/etc/portage/make.conf`的USE中有`bluetooth`flag

        [*] Networking support --->
              <*>   Bluetooth subsystem support --->
                      <*>   RFCOMM protocol support
                      [ ]     RFCOMM TTY support
                      < >   BNEP protocol support
                      [ ]     Multicast filter support
                      [ ]     Protocol filter support
                      <*>   HIDP protocol support
                            Bluetooth device drivers --->
                              <*> HCI USB driver
                              <*> HCI UART driver
              <*>   RF switch subsystem support --->

6. 安装`net-wireless/bluez`

        emerge --ask --noreplace net-wireless/bluez

7. 保证用户在`plugdev`用户组中

        gpasswd -a $USER plugdev

8. 设置蓝牙服务开机启动

        rc-update add bluetooth default

9. 重启系统后, 使用`hciconfig -a`可以查看到蓝牙的信息. 如果蓝牙没有启动的话, 使用如下命令进行启动激活.

        hciconfig hci0 up

    hci0是使用`hciconfig -a`得到的interface的名字, 就像ifconfig中的eth0一样

10. 如果希望不用每次都使用`hciconfig -a`命令进行激活的话, 可以在`/etc/udev/rules.d/90-bluetooth.rules`中添加如下内容

        # Enable the Bluetooth controller

        # BlueZ 5
        ACTION=="add", KERNEL=="hci0", TEST=="/usr/bin/hciconfig", RUN+="/usr/bin/hciconfig hci0 up"

然后就可以使用`bluetoothctl`进入蓝牙的命令行界面, 进行配对连接等操作了.
<http://wiki.gentoo.org/wiki/Bluetooth#BlueZ_5>