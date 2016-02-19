---
layout: post
title: Debian6安装小记
pid: 111
comments: true
tags: [Debian, Linux, 原创]
categories: [系统相关]
---
今天终于装上了 debian6,代号叫squeeze是吧?前几天的时候在[Microhu's Blog](http://www.microhu.com/) 中,正好遇到了博主问我用的是什么linx系统,于是聊起来了.当时Microhu说他用的是debian感觉速度很快的时候,我就心里痒痒了.

一直都听说debian很好,很稳定.虽然软件什么的都比较旧,但是我不是一个喜欢追新的人,即使是使用ubuntu的时候,我也从来没有更新过.想想吧,从10.04出来后我就没装过别的系统,一个连10.10都没用过的人,新出的11.04更是不鸟他阿.哈哈.这样想来,debian的稳定正是我需要的阿,于是马上行动,下载了安装光盘的CD1.话说debian的安装光盘真是多,CD有40多个,DVD有也有5.6个,不知道搞这么多干嘛的.

还好,可以只下载CD1进行安装.

安装过程的问题小点,毕竟我也用了ubuntu老长时间了,那些个分区的问题.设置东西的问题,一扫而过,但是进入系统之后还真是遇到了很多的问题.所以这里记录一下,如果有谁想要安装debian试试,我们可以交流交流哦.哈哈.
说说遇到的问题吧,
### 首先是乱码问题
安装过程中选择的是 简体中文,但是安装完系统,进入桌面后.我就郁闷了,一个个的麻将字,让我们这么看啊.还好网上有解决办法,是因为没有安装字体的原因.把win里面的宋体拿过来.

    su   //这里要使用su命令,因为还没有配置sudo,所以无法用普通用户转换root权限
    cp simsun.ttc /usr/share/fonts/truetype/
    chmod a+r simsun.ttc  //然后给字体增加读权限.
    fc-cache -f //刷新字体缓存
    fc-list  //查看是否已经安装上宋体了.

使用同样的方法,还可以给debian安装win里面的微软雅黑等等.
这样字体乱码的问题就解决了.
### 第二个就是解决网络问题了.
(以下均为root操作)

先激活网卡

    ifconfig eth0 up

然后就是安装你的网络客户端了,此处因个人而异,由于我们学校使用的是h3c客户端,所以过程就不说了.

连上网络后,先输入以下命令,将原来的源改了,

    gedit /etc/apt/sources.list

因为安装的时候使用的光盘,所以源里面默认的就是从光盘中读取东西,但是光盘中的东西毕竟有限,而且我已经将光盘拿出来了.所以用以下内容替换/etc/apt/sources.list 中的那个没加注释的那一行

    deb http://mirrors.163.com/debian squeeze main non-free contrib
    deb http://mirrors.163.com/debian squeeze-proposed-updates main contrib non-free
    deb http://mirrors.163.com/debian-security squeeze/updates main contrib non-free
    deb-src http://mirrors.163.com/debian squeeze main non-free contrib
    deb-src http://mirrors.163.com/debian squeeze-proposed-updates main contrib non-free
    deb-src http://mirrors.163.com/debian-security squeeze/updates main contrib non-free
    deb http://http.us.debian.org/debian squeeze main contrib non-free
    deb http://non-us.debian.org/debian-non-US squeeze/non-US main contrib non-free
    deb http://security.debian.org squeeze/updates main contrib non-free

我使用的是163的源,感觉速度还可以.

做完后进行一下apt源的更新.

    apt-get update

然后使用以下命令修复一下安装过程中的错误.

    apt-get -f install
//此命令因人而异,可能有的人不需要用,但是我遇到了,不用这句话.就不让安装别的软件.
### 最后就是添加root用户组了
接下来才是要命的东西.前面说了这么多都是使用su命令切换到root身份.我们都知道,可以
用普通用户切换到临时的root,但是当你真正试验的时候,就会发现,根本就找不到sudo这个
命令,于是网上有人说,要修改/etc/sudoers文件.在这里我就要向 网上那些到处教授配置debian的root用户组的人 问一下啦,他们到底真正安装过debian吗? /etc里面根本就没有sudoers文件,你编辑个屁啊!真想对他们说声,以后没真正做过就不要误人子弟!!

靠,说了就来气,都是那些人害的我到处找sudoers文件,可是这么也找不到.最后原因 就是debian里面根本就没有安装sudo,所以你找到天上也找不到这个文件.
解决方法(root命令)

    apt-get install sudo
    chmod u+w /etc/sudoers //给此文件增加写入权限
    gedit /etc/sudoers

找到

    root ALL=(ALL) ALL

一行,在下一行添加

    sayme ALL=(ALL) ALL

将sayme换成你的用户名
然后更改文件权限,

    chmod 0440 /etc/sudoers

不做这一步你的普通用户就无法使用sudo命令.
这样你再以普通用户身份使用sudo命令 时候就可以了.

自此,我安装debian的时候遇到的问题就基本解决了.当然安装输入法,就不算是问题了,还是在这里说一下.
此时又想说一下网上的那些人,我安装完debian,源里面根本就没有fcitx,还要人家使用apt-get的命令安装!

我是从fcitx的googlecode的项目主页上下载了deb包,然后安装的.

    sudo dpkg -i *.deb

这样就行了.为什么使用dpkg呢,因为debian里面双击deb不是默认安装的,而是使用归档管理器打开deb包.要想双击deb包安装软件的话,需要安装一个教gdebi的软件.

    sudo apt-get install gdebi

这样双击deb包,就会默认提示你安装了.

基本的问题解决了,但是肯定有更多的问题等着俺啊,没办法,使用debian的时候我就做好了
心里准备.遇到问题就说明是我进步到过程啊,呵呵.
大家有想使用debian的吗?可以交流交流哦.速度感觉非常快.适合于那些喜欢简洁的人哦~~
