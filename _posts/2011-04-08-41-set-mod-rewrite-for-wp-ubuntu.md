---
layout: post
title: 本地wordpress设置固定链接无效的解决办法
pid: 41
comments: true
tags: [Linux, Ubuntu]
categories: [学习笔记]
---
由于我平常使用的是ubunu10.04系统.安装的是大名鼎鼎的LAMP(Linux+Apache+MySQL+PHP),用来本地测试wordpress以及对wordpress的修改作试验.所以对于服务器上的wordpress的修改很少有出现错误的情况.

前两天 ubuntu系统突然进不去了.于是重装了一下.把从服务器上下载的备份文件导入到本地,然后一个全新的本地测试服务器就出来了 :lol:

可是本地的wordpress的固定链接是个问题.设置完后总是说我要更新.htaccess文件.到网上一找才知道是因为系统没有开启**Mod Rewrite**功能.因此使得固定链接的功能无效.

使用如下方法解决.
将 rewrite.load 添加到 /etc/apache2/mods-enabled
使用如下命令

    sudo ln -s /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/

然后编辑 apache 的配置文件

    sudo gedit /etc/apache2/sites-enabled/000-default

将与wordpress存放目录相关的那两个 AllowOverride None 修改为：AllowOverride All，另外两个可以不改。
最后重启apache,

    sudo /etc/init.d/apache2 restart

这样rewrite.load功能就添加成功了.这是在设置固定链接的时候.如果你的.htaccess文件可写的话,会自动设置完毕.如果不可写的话,系统会提示你一段文字,将给的那段文字 粘贴到.htaccess文件里面就好了.

.htaccess文件位于wordpress的根目录里面.别放错了位置.最好粘贴后再修改一下这个文件的权限.

    sudo chmod 777 .htaccess

这样以后再更换固定连接的时候就会自动设置好了.

虽然网上有好多地方都有,可是真正用到的时候可能还是会找不到.所以还是在这里再贴一下.
