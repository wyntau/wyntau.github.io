---
layout: post
title: Gentoo xfce桌面安装fcitx 以及firefox
pid: 2015011803
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Linux, Gentoo]
---

接上篇文章, 安装完xfce桌面后, 现在还没有浏览器和输入法, 所以接下来的工作是安装一个浏览器和输入法.

浏览器选择firefox, 因为官方源里面有firefox-bin二进制包, 可以不用编译.

输入法, 选择一直在Linux中使用的Fcitx输入法, 用着比较习惯.

1. 安装必要的中文字体

        mergem --ask media-fonts/wqy-microhei media-fonts/wqy-zenhei

2. 修改`/etc/portage/make.conf`, 添加语言设置. 这样的话, 在安装firefox时, 就会安装中文语言包.

        LINGUAS="en_US zh_CN zh_TW"

3. 安装firefox

        emerge --ask www-client/firefox-bin

4. 安装fcitx

        emerge --ask fcitx fcitx-configtool

5. 配置`~/.xinitrc`,在启动桌面环境的时候启动fcitx

        export XMODIFIERS="@im=fcitx"
        export GTK_IM_MODULE="fcitx"

    并在`~/.xinitrc`的开头加入如下内容

        eval "$(dbus-launch --sh-syntax --exit-with-session)"
