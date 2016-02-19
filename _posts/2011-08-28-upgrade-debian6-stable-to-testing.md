---
layout: post
title: debian 6 stable蛋疼升级记
pid: 211
comments: true
tags: [debian, Linux, 原创]
categories: [学习笔记 ]
---
**升级前**

debian 6 squeeze (stable)
**升级后**

debian wheezy (testing)

**升级原因:**

stable太特么稳定了.好多的软件都是"非常非常"稳定,以致于太太太太旧.所以好多网上的软件都没法安装.比如exaile播放器的豆瓣插件.

原来一直用的是stable版本.所以没法安装这个.所以就一直用网页版的豆瓣FM.
这次问了红联论坛的资深人士,得知其实testing也是很稳定的版本.

ubuntu还是基于debian的unstable版来的,testing对unstable来说又稳定了不少.所以嘛大可放心使用testing版.于是乎就把stable升级到testing吧.

从stable升级我还遇到了问题了.

首先我是在一直使用的stable上更改source.list源文件,将其中的squeeze都改成wheezy,然后终端输入以下代码

    sudo aptitude update
    sudo aptitude dist-upgrade

然后就OK了.等着下载结束就可以更新了.

我遇到的问题是啥呢?

**第一次**,解压的时候出错了.有一个perl的包总是解压出错,无法配置成功.安装过程也没法停止,所以就进入了死循环了.没办法.这个系统就是完蛋了.我重装!!

**第二次**,我直接装的是testing版的镜像.可是可气的是,在安装的过程中,竟然没有地方让我选择安装桌面环境.有选项,可是有且只有一个选项,就是 安装基本系统.   然后,安装完就悲剧了,没有桌面环境.所以我也没法联网了.

我不放弃,再装.
这次先装stable版,然后不安装任何东西,直接升级试试.这次还好,终于给我装上了.呵呵.

进入 stable系统后,安装联网客户端,然后联上IPV6,修改source.list的源.改为中国科技大学的IPV6镜像.

因为IPV6镜像速度相当快.6--8MB/s 更新包一共大约600+MB,所以如果用IPV4更新的话,够呛.
IPV6嘛,分分钟的事,哈哈

下面是我加的,比较全了应该.

    deb http://mirrors6.ustc.edu.cn/debian wheezy main non-free contrib
    deb http://mirrors6.ustc.edu.cn/debian wheezy-proposed-updates main contrib non-free
    deb http://mirrors6.ustc.edu.cn/debian-security wheezy/updates main contrib non-free
    deb-src http://mirrors6.ustc.edu.cn/debian wheezy main non-free contrib
    deb-src http://mirrors6.ustc.edu.cn/debian wheezy-proposed-updates main contrib non-free
    deb-src http://mirrors6.ustc.edu.cn/debian-security wheezy/updates main contrib non-free
    deb http://http.us.debian.org/debian wheezy main contrib non-free
    deb http://security.debian.org wheezy/updates main contrib non-free

修改完源地址,然后就是

    sudo aptitude update
    sudo aptitude dist-upgrade

然后让它自己安装吧.安装过程中,解压包的时候出现错误,我一看,是因为联网客户端的问题.无奈.先卸载掉联网客户端,反正包都下载完了.安装完再装上吧.然后解压包的问题就解决了.

一段时间后,等它自己安装完毕,重启.看到了3.0的内核.

再安装联网客户端吧.可是又遇到问题了.新的系统缺少一个联网客户端需要的动态连接库文件.只好从同学那里复制一个.(幸亏昨天同学让我帮他安装了一个ubuntu,可以直接拿他的)
一切完好.现在已经安装了exaile的豆瓣插件了.很好用.哈哈.

折腾完毕.
现在系统,执行

    cat /etc/debian_version
显示结果

    wheezy/sid

最后,再给大家说一个,我感觉aptitude比apt-get好用.apt-get遇到依赖问题的时候处理没有aptitude好.
至于具体情况,还是要自己试试才好.呵呵.

我现在就只用aptitude了.最最后一句,aptitude和apt-get最好别混用.要么只用aptitude,要么只用apt-get.

为什么呢?不知道,呵呵.感觉吧.
