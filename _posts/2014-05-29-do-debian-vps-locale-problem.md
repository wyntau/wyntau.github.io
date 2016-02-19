---
layout: post
title: DO vps locale错误
pid: 2014052901
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [VPS]
---

每次登录DigitalOcean的vps后都会提示

    manpath: can't set the locale; make sure $LC_* and $LANG are correct

网上寻找后, 找到解决办法

首先, 执行`locale`, 会提示

    locale: Cannot set LC_CTYPE to default locale: No such file or directory
    locale: Cannot set LC_ALL to default locale: No such file or directory
    LANG=en_US.UTF-8
    LANGUAGE=en_US:en
    LC_CTYPE=zh_CN.UTF-8
    LC_NUMERIC="en_US.UTF-8"
    LC_TIME="en_US.UTF-8"
    LC_COLLATE="en_US.UTF-8"
    LC_MONETARY="en_US.UTF-8"
    LC_MESSAGES="en_US.UTF-8"
    LC_PAPER="en_US.UTF-8"
    LC_NAME="en_US.UTF-8"
    LC_ADDRESS="en_US.UTF-8"
    LC_TELEPHONE="en_US.UTF-8"
    LC_MEASUREMENT="en_US.UTF-8"
    LC_IDENTIFICATION="en_US.UTF-8"
    LC_ALL=

此处的LC_CTYPE被设置成了`zh_CN.UTF-8`, 但是本机上还没有这个环境, 因此需要重新`locale-gen`一下.

修改`/etc/locale.gen`文件,将`zh_CN.UTF-8`前的注释去掉. 然后执行

    sudo locale-gen zh_CN.UTF-8

此时再执行`locale`, 应该就不会再出现上面的提示.

可能还有其它解决方法, 但是这个方法我实验后可行, 而且比较简单, 所以记录一下.
