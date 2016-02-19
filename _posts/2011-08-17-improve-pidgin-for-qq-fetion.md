---
layout: post
title: 让pidgin威力大增,添加QQ和Fetion
pid: 205
comments: true
tags: [Linux, Pidgin]
categories: [互联网络]
---
用Linux的人就是苦,想和人家聊天都不是容易的事,QQ for Linux相当的垃圾,没法用.还好有人开发了一个能用的QQ 好友列表可以获取完整,QQ群也有.是pidgin的插件形式.

用Linux的人应该很熟悉pidgin的,MSN Gtalk IRC ICQ好多协议都支持.开一个IM就可以挂N个号,挺方便.再加上现在的QQ 还有Fetion 就更完美了

说明一下,本人使用环境 Debian Stable 6.0.2 源是使用的163的源
Ubuntu用户也可以安装,下有说明

**一.libqq-pidgin**

项目地址 <http://code.google.com/p/libqq-pidgin/>
debian用户 下载download目录里面的`libqq.so_0.71_i386.7z`文件放入家目录,解压后,得到`libqq.so`文件,将此文件复制到`/usr/lib/purple-2/`目录

    cd /usr/lib/purple-2/
    sudo mv libqq.so libqq.so.bak
    sudo mv ~/libqq.so ./
然后重启pidgin,添加帐号的时候就可以看到QQ的协议图标了

初次登录后几分钟,可能会让你去激活,没事.老实的去激活,然后再登录就好了.
Ubuntu用户,可以使用PPA源的方法安装,更方便

    sudo add-apt-repository ppa:lainme/libqq
    sudo apt-get update
    sudo apt-get install libqq-pidgin

**二,pidgin-fetion**

项目地址 <http://code.google.com/p/pidgin-fetion/>

一般源中都有的,我用的debian stable源中都有,ubuntu中肯定也会有的.
或者你先查找一下看看(debian源中的名字是叫`pidgin-openfetion`,ubuntu中叫什么不知道,如果不是`pidgin-openfetion`应该就是`pidgin-ofetion`或者`pidgin-fetion` 多找找看吧)

    apt-cache search pidgin-openfetion
返回结果

    pidgin-openfetion - Fetion protocol plugin for libpurple
证明源里有,因此你就可以安装了

    sudo apt-get install pidgin-openfetion
装完,重启pidgin ,添加帐号就可以看到openfetion协议了

现在我的pidgin同时开着QQ MSN Gtalk IRC Fetion 很安逸哦.哈哈
