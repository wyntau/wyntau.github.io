---
layout: post
title: wget中文乱码
pid: 195
comments: true
tags: [C, Linux, Wget]
categories: [互联网络]
---
wget 是一个命令行的下载工具。对于很多Linux 用户来说，几乎每天都在使用它.用处大大的,不仅可以平常 的下载,而且可以镜像整个网站.最关键的一点是,它不会像windows中的webZIP一样,因为你不交钱,就在下载回来的网页中嵌入广告.呵呵

wget非常高效,但是国际化程度显然还不够.在下载过程中,如果遇到文件名中有中文的话,十有八九下载回来的文件会是一堆乱码.

当时在镜像codex.wordpress.org和w3school的时候我就遇到了.但是经过google之后解决了.

今天我又查了一下,网上有人已经找到了原因,原文情点击[此处](http://cocobear.info/blog/2008/04/19/wget-chinese-encode/)
在wget的源代码中,url.c这个文件中有wget如何处理文件名的函数`url_file_name()`

`url_file_name()`在根据url的形式判断该保存为什么样的文件名，并进行了多方面的考虑，最终该函数调用了`append_uri_pathel()`，该函数会判断url中的特殊字符，例如空格等，如果遇到这些字符wget把它进行转义，而问题就出在这里，`append_uri_pathel()`函数是通过`FILE_CHAR_TEST (*p, mask)`这一句来判断该字符是否为特殊字符，而同时它会认为中文也是特殊字符，然后按照转换空格之类的方式对中文进行转义，这样就会造成中文乱码的情况，知道了问题所在,就可以在`append_uri_pathel()`函数对特殊字符的判断中排除中文字符。

解决方法呢,倒是找到不止一种,但是我看了,基本上都是对这个`url_file_name`函数或者是`FILE_CHAR_TEST` 这个宏定义进行修改.

**方法一**,修改`url_file_name()`函数

wget1.12版本源代码中 url.c文件 第1402行的

    for (p = b; p < e; p++)
        if (FILE_CHAR_TEST (*p, mask))
          ++quoted;
修改为

    for (p = b; p < e; p++)
        if (FILE_CHAR_TEST (*p, mask) && !((*p | 0x0fffffff) == 0xffffffff))
          ++quoted;
**方法二**,修改`FILE_CHAR_TEST`宏定义

将url.c中的

    #define FILE_CHAR_TEST(c, mask)
        ((opt.restrict_files_nonascii && !c_isascii ((unsigned char)(c))) ||
        (filechr_table[(unsigned char)(c)] & (mask)))</pre></code>
修改为:

    #define FILE_CHAR_TEST(c, mask)
        (((opt.restrict_files_nonascii && !c_isascii ((unsigned char)(c))) ||
        (filechr_table[(unsigned char)(c)] & (mask)))
        && !((c|0x0fffffff) == 0xffffffff)) /* 排除中文 */</pre></code>
然后再重新编译即可

看上面两个方法,都是排除中文,而且处理的方法都很类似.明眼的你肯定看出来了吧.呵呵

原来在镜像网站的时候不记得找到的是哪种方法了.而且还找到一个人家编译好的wget文件,下载下来直接覆盖就好了.这里给大家分享一下.

将下载下来的文件,覆盖到`/usr/bin/`就好了.
如果在使用命令的时候提示没有权限,就使用命令

    sudo chmod a+x /usr/bin/wget
增加执行权限即可
防乱码wget文件 点击[此处](http://u.115.com/file/clobyk52)下载
