---
layout: post
title: 获取豆瓣FM加红心列表
pid: 210
comments: true
tags: [DoubanFM, Python]
categories: [互联网络]
---
不记得从什么时候用的豆瓣FM了,听了不少次数了,感觉还不错,听到了不少好歌.好多都是自己在别的地方听过,但是不知道名字.现在我又重新听到了.呵呵.
所以就想把这些被我加过红心的歌曲的名字弄下来.以便我什么时候可以把这些歌下载下来.顺便更新一下我的电脑中的歌曲列表.

网上搜索一番,收获颇丰.找到了一个py脚本,可以将自己的豆瓣FM中的加红心列表下载下来.而且,还给了一个下载歌曲的脚本,这样就可以在歌曲列表下载下来之后,再从百度上把歌曲下载下来.
完全自动化.

我已经测试完毕.完全没有任何问题.所以给大家分享一下.
原文地址,非常感谢.
<http://www.moorekang.com/2011/06/07/554.html>

我就是下载下来试了一下.感觉不错.

**方法:**

1,将作者说的`fm_get_music.py`项目从GitHub上下载下来.
地址 <https://github.com/chenyukang/fmmusic> 解压并进入目录

    cd chenyukang-fmmusic*
2,修改`fm_get_music.py`文件,将用户名各密码换成你自己的.

3,运行这个py文件.Linux下命令为

    chmod +x fm_get_music.py (首先添加x权限,因为默认没有X权限)
    python ./fm_get_music.py
4,**我遇到的问题**,我的机器上没有py文件中说的一个**BeautifulSoup库**,所以又去自己下载了这个库

下载地址<http://www.crummy.com/software/BeautifulSoup/#Download> 我下载的是3.2版.下载后解压.然后给setup.py增加x权限.

    chmod +x setup.py
    sudo python ./setup.py install (此处需要sudo权限)
安装完BeautifulSoup库,就可以快乐的下载自己的加红心列表了.哈哈.

至于下载歌曲的脚本,我还没有试用.现在还不想下载这么多歌.先着吧,以后再试.
