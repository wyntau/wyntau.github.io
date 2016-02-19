---
layout: post
title: 安装完fedora13我要干的几件事
pid: 20
comments: true
tags: [Linux, 原创]
categories: [学习笔记]
---
此文章系本人发在 红联Linux论坛上的文章,现在把它转过来.

安装fedora之后要干嘛呢？

首先当然是配置sudo了,要不然什么事都不好干啊
首先打开终端 输入

    su -

然后输入密码，接着输入

    visudo

然后按光标，往下走，找到如下代码

    ## Allow root to run any commands anywhere
    root ALL=(ALL) ALL

然后在此代码下按A,然后添加如下代码

    你的用户名’ ALL=(ALL) ALL

比如我的用户名为ripflowers，则添加代码为：

    ripflowers ALL=(ALL) ALL

**注意**网上有很多地方说这样你就拥有了sudo权限，但是别急，你还没有保存呢，我就是因为这里没保存，好几次没有配置成功。还以为是网上的人说错了呢
添加完以上代码后 按ESC键退出 ，然后 再次输入

    ：wq

三个字符，然后按回车，是不是就回到了你输入visudo的界面，那样就表示你成功了。
然后验证以下身份，输入

    sudo whoami

回车后输出 root
呵呵 已经是管理员权限了。
以后再想执行权限高的指令时只要输入sudo 然后再输入你想要的指令就可以了

**接下来就是上网了**
到目前为止，我只用过两种网络，一种事学校里的校园网，win下面是城市热点的那个dr.com,很不给力,还好找到了上网方法,用h3c可以上网,具体的上网方法可以看我发的另一个帖子

[\[已解决，更新方法\]fedora h3c自动配置脚本的麻烦以及解决方法](http://www.linuxdiyf.com/bbs/thread-192543-1-1.html)

还有一种网络就是网通的ADSL了,我在家里,两台电脑共享路由上网.方法见我的另一篇贴子

[\[已解决\]fedora13如何通过路由上网,已附截图](http://www.linuxdiyf.com/bbs/thread-192724-1-1.html)

好了 有网络的,其他的事情就好干多了.
***NEXT--&gt;***
添加163源和上海交通大学源 和 rpmfusion源，然后播放一段mp3.自动搜索解码库

添加163源最简便的方法就是,
登录mirrors.163.com 找到fedora那一行最后有一个 fedora使用帮助 ,进入后
下载fedora-163.repo和fedora-updates-163.repo, 放入/etc/yum.repos.d

    su -
    cd ~weatny //-----此处进入的是下载repo文件的目录
    mv fedora-163.repo fedora-updates-163.repo /etc/yum.repos.d
    cd /etc/yum.repos.d
    mv fedora.repo fedora.repo.bak
    mv fedora-updates.repo fedora-updates.repo.bak

由于我平时都是在学校里上网,所以教育网用的时候最多,再添加一个上海交通大学的源

    [Fedora-ftp.sjtu.edu.cn]
    name=Fedora 13 –i386
    baseurl=http://ftp.sjtu.edu.cn/fedora/linux/releases/13/Fedora/i386/os/
    enabled=1
    gpgcheck=0
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-fedora
    [Everything-ftp.sjtu.edu.cn]
    name=Everything 13 – i386
    baseurl=http://ftp.sjtu.edu.cn/fedora/linux/releases/13/Everything/i386/os/
    enabled=1
    gpgcheck=0
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-fedora
    [updates-ftp.sjtu.edu.cn]
    name=Fedora updates
    baseurl=http://ftp.sjtu.edu.cn/fedora/linux/updates/13/i386/
    enabled=1
    gpgcheck=0

接下来是添加rpmfusion源,这样才可以播放mp3等等

    su -c 'yum localinstall --nogpgcheck http://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-stable.noarch.rpm http://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-stable.noarch.rpm'

其实有心的人可以看到,在163的镜像里面也是有rpmfusion的镜像的,用那个应该也是一样的.

***NEXT--&gt;***
添加完三个源后安装axel插件,到googcode里下载一个rpm包安装就好了
<http://code.google.com/p/yum-axelget/>
里面只有fc12的版本,但是fedora13仍然可以用,呵呵

***NEXT--&gt;***
再安装一个fastestmirror插件,但是我用不到,感觉用不用差别不大,因为我基本上都是达到满速,不用寻找最快镜像也可以

    sudo yum install yum-fastestmirror

***NEXT--&gt;***安装flash插件

    sudo yum install flash-plugin

***NEXT--&gt;***
安装浏览器.
个人喜欢用的浏览器不同,我喜欢用的是枫树浏览器,就是在谷歌浏览器的基础上添加了鼠标手势还有超级拖曳功能,感觉比单纯的谷歌好用,但是有一点不好的地方就是上webQQ的时候非常容易崩溃,但是后来我用QQ for linux的时候就不怕了,所以大家可以考虑考虑

***NEXT--&gt;***
安装输入法.
我感觉最好用的当然是 fcitx了,但是fedora13的库里面的fcitx有点旧 还是3.6.x版本的,所以想安装最新版的话,就得自己动手了

首先卸载ibus输入法

    sudo yum remove ibus

然后到fcitx的googlecode项目主页<http://code.google.com/p/fcitx/>可以看到

> 动态
> 2010-12-17fcitx 更新 4.0.1 fcitx-configtool 更新 0.2.0 fcitx-sunpinyin 更新 0.2.1  
> 2010-11-28fcitx-sunpinyin 更新 0.2.0   
> 2010-11-21版本管理改为 mercurial，将 fcitx-config 和 fcitx-sunpinyin 从 github 也迁移到了 google code。  
> 2010-11-19发布 3.6.4，4.0.0  
> 2010-11-09发布 4.0 rc1  
> 2010-11-02删除了 svn 里的原本打算用来存储码表的 /extra 目录，并将被删除的一个码表压缩包移到了下载列表里。在 svn 里存储压缩包等二进制文件不是一个好的实践。  
> 2010-10-12增加了 openSUSE 和 Fedora 的源，地址见右侧外部链接（External Links）(我要的就是这句话)  
> 2010-09-23增加 PPA 源，地址见右侧外部链接（External Links）Google code 上的 deb 包将不再更新

于是按照说的去找 源 看到了 home-csslayer.repo  
好 下载到~文件夹里面.
放到 /etc/yum.repos.d里面.

然后

    yum makecache

然后就可以

    sudo yum install fcitx

这样就可以安装最新版本的输入法了

***NEXT--&gt;***
安装libreoffice
<http://www.libreoffice.org/download/>

先下载所要的安装包.
一个140多M的安装包 还有一个语言包 还有一个帮助文件包.
下载到家目录里面,然后右键 解压缩到此处.
然后打开终端,进入里面的RPMS文件夹.

    sudo yum install *.rpm --nogpgcheck

然后进入里面的那个文件夹,再安装带有redhat字眼的那个rpm包就可以了.
接下来是安装语言包,
和这个方法一样

***NEXT--&gt;***
安装ailurus,
代码 然后进行一些设置 安装上chmsee软件

    sudo yum install ailurus

***NEXT--&gt;***
安装编辑主菜单的工具,因为主菜单太大了,好多功能我永远都用不到,
看着心烦

    yum install alacarte

这样在首选项里面就有了主菜单选项了,就可以编辑一下 把不想要的功能都去掉就好了

***NEXT--&gt;***
接下来就是卸载和关闭一些不需要的软件了,
首先是 首选项里面的首选应用程序里面的 什么蓝牙 打印机服务啦,都不需要,所以统统关闭,然后进入ailurus,卸载一些自己用不到的软件,当然,看个人喜好了.

好了,基本上,安装完系统,我都要干这么多,做个备份,以后再安装的时候好记得,省的忘记了.