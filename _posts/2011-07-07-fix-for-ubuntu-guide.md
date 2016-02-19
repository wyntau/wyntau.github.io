---
layout: post
title: 重装windows后修复Ubuntu引导项
pid: 183
comments: true
tags: [Linux, Ubuntu, Windows]
categories: [学习笔记]
---
大家都知道,当重装windows后,windows安装程序默认会清空MBR记录,使得所有的引导项都丢失,因此原来安装的Linux系统就都没有了

今天也是这样,重装了windows后,我的Ubuntu没有了,但是我又不想重新安装ubuntu,所以还是修复一下比较好.
网上有好多中解决方法,我找了其中一个感觉最简单的方法,成功修复了Ubuntu的引导项.
现在使用grub引导ubuntu和windows.

虽然在windows中使用easyBCD可以修复,但是修复的结果是,windows里面有多系统选择菜单,当选择进入ubuntu后,仍然又出来一个多系统选择菜单,很不好看.所以我就一律用grun引导了

方法很简单.需要的就是一个安装ubuntu时候的光盘或者是刻录的U盘.

1. 选择试用ubuntu,进入桌面,

2. 看看你的Linux是安装在哪个盘里面,然后再看看这个盘对应的盘符是哪个,比如,我的Linux是安装在/dev/sda9里面,

3. 打开终端,输入`sudo -i`获得超级管理员权限.然后

        mount /dev/sda7 /mnt  (这里的sda7改成你的系统安装位置)
        mount /dev/sda6 /mnt/boot (如果没 /boot 单独分区这步跳过)

4. 然后输入如下内容

        grub-install --root-directory=/mnt /dev/sda
        (注意,root前面是两个减号,和directory前面的减号是一样的,只不过是两个,你可能看不清楚,所以我着重说一下)

然后就OK了,重启机器就可以看到ubuntu原生的引导菜单了,里面同样有windows的引导项
