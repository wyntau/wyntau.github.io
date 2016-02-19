---
layout: post
title: Gentoo安装networkmanager以及配置vpn
pid: 2015011805
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Linux, Gentoo]
---

进入桌面环境后, 能有一个网络管理工具很必要, 所以这次安装一个网络配置管理工作, 同时还可以添加vpn, 方便必要时刻能够畅通网络.

1. 将原来使用的dhcpcd卸载, 使用dhcp-client. 因为networkmanager和dhcpcd提供了相同的功能, 可能会产生冲突.

        emerge --unmerge dhcpcd
        rc-update del dhcpcd default
        rc-update del net.enp3s0 default

2. 为networkmanager设置USE标记, 并使系统更新到新USE标记

        euse -p net-misc/networkmanager -D dhcpcd && euse -p net-misc/networkmanager -E dhclient
        euse -E networkmanager
        emerge --ask --changed-use --deep @world

3. 配置内核, 将ppp相关的选项全部选中.
4. 安装networkmanager, 此时会自动安装上`dhcp-client`, 在安装pptp插件的时候, 会自动安装`gnome-extra/nm-applet`

        emerge --ask net-misc/networkmanager
        emerge --ask net-misc/networkmanager-pptp

5. 将当前用户添加到networkmanager的用户组中

        gpasswd -a $USER plugdev

6. 开机自动启动networkmanager

        rc-update add NetworkManager default

7. 为dhcp-client配置`/etc/dhcp/dhclient.conf`设置hostname

        send host-name "Gentoo";

8. 启动X时, 自动启动networkmanager的`nm-applet`, 修改`~/.xinitrc`文件

        eval $(gnome-keyring-daemon --components=pkcs11,secrets,ssh,gpg)
        export GNOME_KEYRING_PID
        export GNOME_KEYRING_SOCKET
        export SSH_AUTH_SOCK
        export GPG_AGENT_INFO

        dbus-launch nm-applet &