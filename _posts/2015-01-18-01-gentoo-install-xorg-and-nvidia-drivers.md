---
layout: post
title: Gentoo安装Xorg server和nvidia官方闭源驱动
pid: 2015011801
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Linux, Gentoo]
---
接上篇文章, 将console的分辨率提高后, 接下来要做的就是把Xorg server以及显卡驱动装上, 为后面安装xfce桌面做准备.

阅读Gentoo Wiki中的[NVidia/nvidia-drivers](https://wiki.gentoo.org/wiki/NVidia/nvidia-drivers)章节, 以及[Xorg/Configuration](https://wiki.gentoo.org/wiki/Xorg/Configuration)章节, 按照步骤安装.

1. 按照NVidia/nvidia-drivers中的步骤对内核进行配置. 去掉内核中默认的nvidia framebuffer以及其它的framebuffer的支持
2. 按照Xorg/Configuration中的步骤对内核进行配置. 在最后一个对内核的配置中, 不选择任何的开源显卡驱动. 因为后面我们会安装nvidia官方的驱动. 这两个驱动会冲突.
3. 修改`/etc/portage/make.conf`, 设置显卡及输入设备.在文件后添加如下内容

        ## (For mouse, keyboard, and Synaptics touchpad support)
        INPUT_DEVICES="evdev synaptics"
        ## (For nVidia cards)
        VIDEO_CARDS="nvidia"

4. 配置`/etc/portage/package.use`

        echo "x11-base/xorg-server udev" >> /etc/portage/package.use

5. 安装oxrg-server

        emerge --ask xorg-server

6. 安装完毕后, 执行如下命令, 进行系统变量的更新

        env-update
        source /etc/profile

7. 生成默认的`xorg.conf`

        nvidia-xconfig

8. 设置默认的opengl为nvidia

        eselect opengl set nvidia

9. 安装`x11-wm/twm`和`x11-terms/xterm`, 测试xorg-server是否正常工作.

        emerge --ask x11-wm/twm
        emerge --ask x11-terms/xterm
    然后执行`startx`, 查看是否显示了图形化的终端界面. 如果已经显示, 刚将上面的两个包删除

        emerge --unmerge twm xterm

10. 回到nvidia显卡驱动安装章节中. 如果对xorg的设置正确的话, 此时应该已经安装了`x11-drivers/nvidia-drivers`, 我们要做的是检查一下.

        lsmod | grep nvidia
    如果显示了内容, 说明显示驱动安装成功. 为了每次系统启动后, 显示驱动模块能够自动加载, 在`/etc/conf.d/modules`中添加显卡驱动模块

        modules="nvidia agpgart"

11. 为`/etc/portage/make.conf`添加全局nvidia USE标记, 并更新系统

        USE="-gnome -kde -minimal -qt4 dbus jpeg lock session startup-notification thunar udev X dvd alsa cdr -ipv6 -cups nvidia"
    然后使新的全局USE生效

        emerge -uD --newuse @world