---
layout: post
title: Centos6.3 LiveCD安装手记
pid: 249
comments: true
tags: [CentOS, Linux]
categories: [学习笔记]
---
#### 原因 ####
一直用的是debian系统,时间长了就想换点新鲜的.曾经用过fedora一段时间,但是感觉不习惯rpm系的使用习惯,所以又换回了debian,这次决定使用centos系统试试.经过一番权衡,选用centos LiveCD版.因为这个感觉最清爽,没有多余的软件,想用什么可以自己安装

#### 安装系统 ####
在windows里面用UltraISO刻录的光盘总是不能启动成功,所以进入原来的Debian系统用dd命令刻录.但是这个方法有个不好的地方就是整个U盘只用了一点,我4G的U盘,只用了700MB,在windows里面还识别不出来,不管了,反正我平时不用U盘.

	dd if=`/CentOSLiveCD ISO file Path` of=/dev/sdb bs=1M

如果用dev/sdb4的话,很可能会启动失败,所以要用整个sdb进行刻录

#### 配置更新源 ####
重启进行安装,安装完成后,首先配置一下网络.然后更新源,我使用的是中国科技大学的源,这个因人而异.
首先备份CentOS-Base.repo

	mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup

然后新建CentOS-Base.repo文件,将如下内容放到文件中

	# CentOS-Base.repo
	#
	# The mirror system uses the connecting IP address of the client and the
	# update status of each mirror to pick mirrors that are updated to and
	# geographically close to the client.  You should use this for CentOS updates
	# unless you are manually picking other mirrors.
	#
	# If the mirrorlist= does not work for you, as a fall back you can try the
	# remarked out baseurl= line instead.
	#
	#
	[base]
	name=CentOS-$releasever - Base - mirrors.ustc.edu.cn
	baseurl=http://mirrors.ustc.edu.cn/centos/$releasever/os/$basearch/
	#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os
	gpgcheck=1
	gpgkey=http://mirrors.ustc.edu.cn/centos/RPM-GPG-KEY-CentOS-6

	#released updates
	[updates]
	name=CentOS-$releasever - Updates - mirrors.ustc.edu.cn
	baseurl=http://mirrors.ustc.edu.cn/centos/$releasever/updates/$basearch/
	#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=updates
	gpgcheck=1
	gpgkey=http://mirrors.ustc.edu.cn/centos/RPM-GPG-KEY-CentOS-6

	#additional packages that may be useful
	[extras]
	name=CentOS-$releasever - Extras - mirrors.ustc.edu.cn
	baseurl=http://mirrors.ustc.edu.cn/centos/$releasever/extras/$basearch/
	#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=extras
	gpgcheck=1
	gpgkey=http://mirrors.ustc.edu.cn/centos/RPM-GPG-KEY-CentOS-6

	#additional packages that extend functionality of existing packages
	[centosplus]
	name=CentOS-$releasever - Plus - mirrors.ustc.edu.cn
	baseurl=http://mirrors.ustc.edu.cn/centos/$releasever/centosplus/$basearch/
	#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=centosplus
	gpgcheck=1
	enabled=0
	gpgkey=http://mirrors.ustc.edu.cn/centos/RPM-GPG-KEY-CentOS-6

	#contrib - packages by Centos Users
	[contrib]
	name=CentOS-$releasever - Contrib - mirrors.ustc.edu.cn
	baseurl=http://mirrors.ustc.edu.cn/centos/$releasever/contrib/$basearch/
	#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=contrib
	gpgcheck=1
	enabled=0
	gpgkey=http://mirrors.ustc.edu.cn/centos/RPM-GPG-KEY-CentOS-6

然后用

	su -c 'yum makecache'

更新缓存

#### 安装rpmforge源 ####
安装完这个源才能安装ntfs-3g来支持win的NTFS分区读写.

	wget http://pkgs.repoforge.org/rpmforge-release/rpmforge-release-0.5.2-2.el6.rf.i686.rpm

然后

	su -c 'rpm -ivh rpmforge*.rpm'

这样就行了

#### 安装配置sudo ####

	su -c 'yum install sudo'

安装完成后 将/etc/sudoers 文件更改权限

	su -c 'chmod 744 /etc/sudoers'

编辑sudoers文件,将你的用户名添加到root用户组,这样以后就可以使用sudo命令了
找到

	root ALL=(ALL) ALL

一行,在下面添加(username改为你的用户名)

	username ALL=(ALL) ALL

编辑后退出,再次更改sudoers文件权限

	su -c 'chmod 0440 /etc/sudoers'

然后用`exit`退出root权限再试试吧

	sudo whoami

如果正常的话,应该会返回

	root

#### 安装ntfs-3g ####

	sudo yum install ntfs-3g

然后就可以挂载NTFS分区了.如果你愿意的话,可以更改`/etc/fstab`文件,将NTFS分区写到这里达到开机自动挂载.

	UUID=000C28CA000A356A      /media/Sys     ntfs-3g    defaults,utf8,uid=500  0	0

前面的是NTFS的uuid,怎么看NTFS分区的uuid

	cd /dev/disk/by-uuid
	ls -al

然后就可以看到不同的分区的uuid了,按照上面的例子,首先在/media目录新建你想要的文件夹,然后将各个分区写入fstab文件对应的文件夹即可
然后执行

	sudo mount -a

即可.上面有个小地方要注意,centos默认的用户uid和Debian的不同,这里是uid=500,如果你是用的debian的话,应该改成1000,否则会造成自动挂载NTFS分区后无法将文件删除到回收站而是直接永久删除的情况

#### 安装google-chrome浏览器 ####
在/etc/yum.repo.d文件夹中,新建一个google-chrome.repo或者在CentOS-Base.repo中加入如下内容

	[google]
	name=Google – i386
	baseurl=http://dl.google.com/linux/rpm/stable/i386
	enabled=1
	gpgcheck=1
	gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub

然后

	yum makecache
	sudo yum install google-chrome-stable

即可

#### 安装file-roller ####
安装完centos后发现一个问题,像zip包这种东西,竟然不是双击打开,而是用archive mounter先挂载到/media目录后再打开.具体原因是centos LiveCD没有安装常用的归档管理器,那我们就安装一下吧,顺带安装一下unrar

	sudo yum install file-roller unrar

#### 修复bash自动补全 ####
安装LiveCD版后bash没有自动补全功能,所以进行一下修复
首先到

	http://www.caliban.org/files/redhat/RPMS/noarch/

下载最新的`bash-completion-20060301-1.noarch.rpm`,
然后安装一下,然后在~/.bashrc找个地方添加

	[ -f /etc/bash_completion ] && . /etc/bash_completion

重启bash就可以了

#### 安装配置编辑器 ####

	sudo yum install gconf-editor

安装完成后可以进行简单的配置.
因为我喜欢桌面干净一点.另外不希望挂载的卷 home目录 还有我的电脑出现在桌面,所以进行更改

具体的更改选项如下,可按个人喜好进行更改

	窗口标题的按钮的布局
	Gconf键 /app/metacity/general/button_layout
	当计算机一定时间后激活屏幕保护程序
	/apps/gnome-screensaver/idle_acivation_enable
	当屏幕保护程序激活时锁定屏幕
	/apps/gnome-screensaver/lock_enabled
	在休眠后锁定屏幕
	/apps/gnome-power-manager/lock/hibernate
	在挂起后锁定屏幕
	/apps/gnome-power-manager/lock/suspend
	图标
	显示桌面内容
	/apps/nautilus/preferences/show_desktop
	显示挂载的卷的图标
	/apps/nautilus/desktop/volumes_visible
	显示我的计算机图标
	/apps/nautilus/desktop/computer_icon_visible
	显示主目录图标
	/apps/nautilus/desktop/home_icon_visible
	显示网络服务器图标
	/apps/nautilus/desktop/network_icon_visible
	显示垃圾桶图标
	/apps/nautilus/desktop/trash_icon_visible

#### 安装输入法 ####

	sudo yum install ibus ibus-table-wubi


#### 安装audacious播放器 ####
新建一个repo文件,内容为

	[linuxtech]
	#audacious install
	name=LinuxTECH
	baseurl=http://pkgrepo.linuxtech.net/el6/release/
	enabled=1
	gpgcheck=1
	gpgkey=http://pkgrepo.linuxtech.net/el6/release/RPM-GPG-KEY-LinuxTECH.NET

然后安装即可

播放列表乱码 首选项-在"播放列表"中，把标题格式改为"Custom",再把自定格式改为"%f"（不要引号）.

皮肤位置皮肤位置 ~/.local/share/audacious/Skins

状态栏图标 选项 插件 里面的 一般 status icon 勾选即可

其它的就没有什么了,想要什么自己安装即可
