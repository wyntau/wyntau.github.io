---
layout: post
title: 本地wordpress后台需要FTP密码解决办法
pid: 182
comments: true
tags: [Linux, Ubuntu, WordPress]
categories: [学习笔记]
---
一直在本地安装一个wordpress用来测试主题和插件等等.但是本地大唯一不好的地方就是在后台安装主题,删除主题,安装插件,或者是删除插件的时候需要我输入一个FTP的账号和密码.FTP这玩意,我机子上本来都没有,我自己都不知道我的FTP账号是密码是什么,wordpress这货还来问我.

所以,一直以后都是从官方下载插件,然后手动移动到相应大目录来使用.

前几天在金刚那里看到了他 解决VPS需要FTP账号密码的问题.所以收藏了一下.
今天重新安装了一遍,然后就试试吧.按照金刚童鞋说的方法,果然成功了.

[金刚](http://jingang.info)童鞋的的方法(**表示灰常感谢**):

一、权限配置(我没用到,因为目录权限本来就是755了)
wordpress 目录的权限，755就可以在ssh下输入：

    #chmod 755 -R [目录名] #此条命令是将 wordpress目录全部的权限设置为755。如果出现上传图片失败的问题，那你可以把755改成777.

二、找到apache服务所使用的用户名和用户组。

金刚vps上安装的kloxo直接启用的apache。之前一直出问题是应为kloxo在新建域名时将文件夹所有权交给了admin账户，但是admin账户并非是apache的所有者。
我们可以通过命令：

    #chown apache:apache -R [目录名] #将wordpress的目录所有权交给apache用户即可。

很多朋友不清楚 apache 进程所有者是那个用户。下面大家可以用这么一条命令查看。

    #ps -aux #在结果中我们可以看到httpd 进程 所有者为apache用户。
    apache    6180  0.0  6.4  53488 33188 ?        S    Jun19   0:47 /usr/sbin/httpd

经过以上的步骤操作之后，回到wordpress后台大家就可以正常的安装插件，更新程序了。

不再为了wp-content 无法创建，而烦恼了。
* * *
说说俺的步骤吧.我没有弄权限,因为是本地嘛,权限本来就是正确的.
我的解决就是用的第二步,将wordpress的用户组改掉就好了.

我使用ps -aux命令,可以看到类似下面的运行情况如下(节选)

    www-data  1338  0.0  0.2  36112  4144 ?        S    18:07   0:00 /usr/sbin/apache2 -k start
    www-data  1339  0.0  0.3  36828  6472 ?        S    18:07   0:00 /usr/sbin/apache2 -k start
    www-data  1340  1.1  1.5  60984 32724 ?        S    18:07   0:10 /usr/sbin/apache2 -k start
    www-data  1341  0.6  0.9  47972 19916 ?        S    18:07   0:05 /usr/sbin/apache2 -k start
    www-data  1342  0.0  0.3  37348  6884 ?        S    18:07   0:00 /usr/sbin/apache2 -k start

这个最前面的用户名就是关键.
按照金刚童鞋说的,将wordpress文件夹的用户组和用户改成apache服务的用户组就好了.

    sudo chown www-data:www-data -R /var/www

完事了,OK!!现在去后台再安装插件就不需要 FTP的账号和密码了.HOHO~~

**最后再说明一下,本人使用的环境是**Ubuntu10.04.2 .php环境是使用新利得软件包管理器安装的LAMP套装
