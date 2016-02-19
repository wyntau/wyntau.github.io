---
layout: post
title: debian6再安装小记
pid: 197
comments: true
tags: [Debian, Linux]
categories: [互联网络]
---
曾经写过一篇debian6安装小记,感兴趣的可以点击[此处](/2011/05/debian6-install-note.html)

昨天蛋疼得又将debian6安装上了,但是这次安装的和上次安装的不一样.这次是又从debian官网上下载的更新之后的debian.并且此次,将lamp安装成功了.

还有一个我发现的是,新的debian自带了两个浏览器.一个是原先就有的iceweasel浏览器.另外这次又带了一个webkit内核的Epiphany 网络浏览器.感觉很好用,而且轻量级
因此才想再写一写.
在安装的时候仍然是遇到了不少的问题.再记录一下吧(命令前有# 则需要root或者是sudo)

**1,采取何种方式安装.**

一直我都是用光盘刻录安装的,因为我直接用ultroISO之类的软件将光盘刻录到U盘后总是会启动失败.
网上找了一番原因.但是昨天,成功的用U盘安装了debian6
方法 在我原先使用的ubuntu环境中,插入U盘,此时U盘对应的是`/dev/sdb` 因此,在终端输入

    sudo -sH(先获得root权限,必要不必要,我不知道)
    cat debian.iso > /dev/sdb
等待写入完毕,重启机器从U盘启动即可.非常非常简单.(为什么这么简单,我也不知道)
但是要注意的是,要确保/dev/sdb是对应的你的U盘,要不然有你哭的

**2,网络配置(这个是我第一次遇到,算是真正的学习到东西了)**

为了使用最快的速度安装,我将网线拔了下来.因为在插着网线的情况下,即使我选择不使用网络镜像,仍然会从网上下载一些更新包.所以我索性将网线拔掉.

但是这样的话,再配置网络的时候就会配置DHCP失败.但是我选择的是 暂时不配置网络.
安装完成后,死活上不去网.这时我才知道,是因为网络配置文件不对的原因.经过一番搜索.顺利解决.

配置文件位置 `/etc/network/interfaces`

打开此文件后,只有如下内容

    # This file describes the network interfaces available on your system
    # and how to activate them. For more information, see interfaces(5).

    # The loopback network interface
    auto lo
    iface lo inet loopback
按照网上说法,使用dhcp的话,只需再最后添加

    auto eth0
    iface eth0 inet dhcp
因此 最后interfaces文件内容如下

    # This file describes the network interfaces available on your system
    # and how to activate them. For more information, see interfaces(5).

    # The loopback network interface
    auto lo
    iface lo inet loopback
    auto eth0
    iface eth0 inet dhcp
然后重启network即可

    #/etc/init.d/networking restart
**3,乱码问题**

可以参见 我 的那一篇安装笔记[此处](/2011/05/debian6-install-note.html)

**4,安装fcitx输入法**

3.6X版本,可以看我的文章[我选择Fcitx 3.6.3](/2011/07/i-prefer-fcitx-363.html)

**5,**debian中的新立得软件管理软件

    sudo apt-get install synaptic
**6,**可以编辑主菜单的小软件

    sudo apt-get install alacarte
**7,**另外,还可以将ubuntu中的ailurus安装到debian中进行一些快速的配置等等.虽然不是完全可用.但是可以指导你安装一些软件.

**8,**最后一个就是我这个安装debian收获最大的地方.终于将LAMP环境搭建成功了.(现在,没有新立得的分组软件包标记,我也可以安装lamp了.呵呵)

**首先**安装MySQL(上次安装lamp的时候就是在配置mysql的时候出现各种问题 还好这次没有了,我猜应该是debian更新的原因.)

    #apt-get install mysql-server-5.1
然后安装apache2

    # apt-get install apache2
最后再安装php5,网上有人说,按照这个顺序,可以让软件自动安装好所需的组件包,不需要我们再手动指定了.我也确实是按照这个顺序安装的,而且成功了.

    # apt-get install php5
安装完成后,可以再安装一个mysql的图形管理界面 phpmyadmin

    # apt-get install phpmyadmin
至此,debian中的LAMP搭建完成

还有一个不能写入windows的ntfs分区的问题.挂载ntfs分区后,总是说我没有权限往分区中写入文件.我尝试将ubuntu中的ntfs-config文件安装一下.然后打开ntfs-config
虽然没有让我配置任何东西.但是重启机器后,就可以写入了.
令我很费解.没安装之前,重启多少遍机器都不行.
看来就是ntfs-config帮我解决了这个问题.因为在安装的时候,解决依赖关系,自动安装了ntfs-3g
