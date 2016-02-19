---
layout: post
title: Gentoo使用uvesafb配置Framebuffer
pid: 2015011701
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Linux, Gentoo]
---

接上篇安装Gentoo的文章, 安装完Gentoo后, 是没有桌面环境的. 进入系统后, 只有console, 而且此console
的分辨率很差, 一个屏幕都放不下几个字. 所以本篇的目标是启用framebuffer, 以便调整console的分辨率.

阅读完Gentoo Wiki中的Framebuffer章节后, 决定使用uvesafb. 因为只有uvesafb可以和nvidia官方闭源驱动共同使用.
其它的或者或少都会有问题, 或者冲突.

1. 按照uvesafb安装中的说明, 对内核进行配置, 使之支持uvesafb, 同时禁用掉默认的vesafb. 然后编译一遍内核并安装
2. 安装`dev-libs/klibc`和`sys-apps/v86d`, 为再次编译内核做准备

        emerge --ask --oneshot klibc
        emerge --ask v86d

3. 再次配置内核, 让v86d起作用.
4. 再次编译安装内核, 并用genkernel生成initramfs
5. 修改grub的默认配置`/etc/default/grub`, 将`GRUB_CMDLINE_LINUX_DEFAULT`前的注释去掉, 并修改为如下内容

        GRUB_CMDLINE_LINUX_DEFAULT="video=uvesafb:1024x768-32,mtrr:3,ywrap"

6. 生成grub.cfg

        grub2-mkconfig -o /boot/grub/grub.cfg