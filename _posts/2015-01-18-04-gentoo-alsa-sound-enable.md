---
layout: post
title: Gentoo开启声卡支持
pid: 2015011804
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Linux, Gentoo]
---

接上一篇, 安装完xfce及firefox, fcitx后, 我又安装了mplayer. 但是安装后, 发现没有声音. 所以按照Gentoo Wiki中的alsa章节, 将声卡设置好.

1. 设置内核, 我的很方便, 不需要再设置什么类型的声卡.

        Device Drivers --->
            <*> Sound card Support
                <*> Advanced Linux Sound Architecture --->
                    [*]   PCI sound devices  --->
                          <*>   HD Audio  ---> (snd-hda-intel)
                                [*] Enable generic HD-audio codec parser

2. 保证全局USE标记中, 存在`alsa`, 这也是为什么最开始安装系统时, 就在USE标记中加入alsa的原因
3. 安装`emerge --ask alsa-utils`

        emerge --ask alsa-utils

4. 保证使用的用户在audio用户组中
5. 开启alsa服务, 并开机自动启动

        /etc/init.d/alsasound start
        rc-update add alsasound boot

6. 可以使用`alsamixer`调节音量什么的.
7. 测试声音可用.

        speaker-test -t wav -c 2