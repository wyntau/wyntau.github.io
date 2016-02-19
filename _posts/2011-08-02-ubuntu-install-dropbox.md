---
layout: post
title: ubuntu安装dropbox失败 解决方法
pid: 199
comments: true
tags: [Dropbox, Ubuntu]
categories: [互联网络]
---
dropbox响当当的大名,想必大家都知道吧? 好久之前,就听说了这个网盘.但是一直都没有尝试.前几天安装ubuntu的时候,就把dropbox装上试了一下.发现,速度很快,而且使用起来很好用.

但是在安装的过程中发现,不行. 即使安装上deb包,但是在首次使用的时候还是会无法链接等等.
网上找了一番,原因是,我们安装的那个deb包是一个壳,真正的东西,是要你首次登录后才下载的.而那个地址恰恰被墙了.因此我们就无法使用这个优秀的网盘服务了.

**详细原理:[Dropbox for ubuntu无法安装](http://freedomhui.com/?p=149)**

网上也有好多人,发了解决方法.就是使用vpn链接,将那个真正的文件下载下来,然后就可以正常使用了.
这里就把这个文件分享一下.

放到了115网盘上,压缩包内最新版的deb包,还有首次登录时需要的真正的文件的压缩包.
使用方法(方法来自IT不倒翁,详情请点击[此处](http://yungbo.com/php-ubuntu/ubuntu-the-solution-can-not-be-installed-dropbox.html)):

1. 解压后，双击 `nautilus-dropbox_0.6.8_i386.deb` 文件安装。
2. 安装完成后，解压缩 dropbox-linux.tar.gz 到当前目录，将解压出来的 .dropbox-dist 文件夹放入你的家目录(就是/home/你的用户名).
.dropbox-dist文件夹是隐藏文件夹,你可以点击查看->显示隐藏文件 来查看它
3. 点击 应用程序->互联网->Dropbox  登录你的帐号即可。
3.
**注:**压缩包内dropbox-linux.tar.gz以及使用说明来自IT不倒翁,本人只是更新了其中deb包的版本,在此表示感谢.

最后,我的邀请链接<http://db.tt/8YwQ8TE>

点击此链接进行注册后,你和我都可以得到系统赠送的250MB免费空间,也即,你注册成功后,就可以有2G+250MB空间.当然,你也可以去官网注册,但是那样的话,注册成功后,你得到的就只有2G免费空间.一举两得的事,干嘛不做呢.哈哈(囧,我承认这是为我自己拉的广告.....)

当然,如果你不是用的ubuntu同样也可以点击我的邀请链接哟 嘻嘻
邀请链接,<http://db.tt/8YwQ8TE> 别忘了点哟

最后是压缩包下载地址<http://u.115.com/file/e6r7jr8c>
