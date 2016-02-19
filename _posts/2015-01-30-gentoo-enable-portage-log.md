---
layout: post
title: Gentoo开启portage log
pid: 2015013001
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Linux, Gentoo]
---

每次使用Linux console安装软件后, 总是会有很多的log 或者 warn, 但是console的一个屏幕显示不下来,
也不能身上滚动. 如果能有一个方法能把这些log和warn保存到本地, 这样安装完软件后就能使用less或者more
之类的软件进行查看了.

经过搜索后, 发现了gentoo是支持这个的, 叫做portage log

修改`/etc/portage/make.conf`, 添加如下内容

    PORT_LOGDIR="/var/log/portage"
    PORTAGE_ELOG_CLASSES="log warn error"
    PORTAGE_ELOG_SYSTEM="save"

更详细的解释在`/usr/share/portage/config/make.conf.example`文件中.
