---
layout: post
title: 折腾之编译安装wget 1.13
pid: 212
comments: true
tags: [Linux, Wget]
categories: [学习笔记]
---
**安装原因:**

想要镜像Archlinux的wiki,但是用系统自带的wget的话,会出现中文乱码的情况.
原来曾经弄过修改一次,是修改一个源代码中的函数,然后重新编译一个可执行文件.
本想直接把原来编译的拿过来用,但是上次编译的个版本有点低了.不支持https,而Archlinux的wiki貌似只支持https,这样就没法了,重新编译一个吧.

so,下载了源码,按照原来写过的方法,修改源码.
然后`configure`,但是`configure`的时候出错了.提示说,编译选项中有ssl但是缺少一个对这个的编译支持.我想,既然缺少就不加这个支持呗.

但是又不知道怎么去掉这个支持.看了INSTALL文档还有网上的一些东西,自以为是的用了个 `--disable-ssl`参数,结果不行.
还是又到网上搜索了一番,才知道使用 `configure --help`这个参数.

于是乎,help一下.出来帮助了.

原来这个用的是 `--without-ssl`选项.OK,加上`--without-ssl`后,`configure`通过了.于是`make`,然后程序出来了.可是竟然还不支持https.

于是又看了一下 `--version`输出.原来ssl和https是同时被编译的.要么就编译ssl而支持https,要么就不编译ssl不支持https.
哎,只好老实的加上ssl选项吧,看看configure错误吧.

结果是缺少一个叫做GNUTLS的可以说是组件吧.就是编译的时候需要这个东西的头文件什么的.
使用超级牛力(apt系列)搜一下,哈哈.

使用

    aptitude search GNUTLS

可以发现有好多包

    p   dsyslog-module-gnutls - advanced modular syslog daemon - GnuTLS support
    p   gnutls-bin            - GNU TLS library - commandline utilities
    v   gnutls-dev            -
    p   gnutls-doc            - GNU TLS library - documentation and examples
    p   guile-gnutls          - GNU TLS library - GNU Guile bindings
    p   libapache2-mod-gnutls - Apache module for SSL and TLS encryption with GnuTLS
    i A libcurl3-gnutls       - Multi-protocol file transfer library (GnuTLS)
    v   libcurl3-gnutls-dev   -
    p   libcurl4-gnutls-dev   - Development files and documentation for libcurl (Gn
    p   libgnutls-dev         - GNU TLS library - development files
    c   libgnutls-openssl27   - GNU TLS library - OpenSSL wrapper
    i   libgnutls26           - GNU TLS library - runtime library
    p   libgnutls26-dbg       - GNU TLS library - debugger symbols
    c   libgnutlsxx27         - GNU TLS library - C++ runtime library
    c   libneon27-gnutls      - HTTP and WebDAV client library (GnuTLS enabled)
    p   libneon27-gnutls-dbg  - Detached symbols for libneon27 (GnuTLS enabled)
    p   libneon27-gnutls-dev  - Header and static library files for libneon27 (GnuTL
    p   libxmlsec1-gnutls     - Gnutls engine for the XML security library
    p   python-gnutls         - Python wrapper for the GNUTLS library
    v   python2.6-gnutls      -
    v   python2.7-gnutls      -
    p   rsyslog-gnutls        - TLS protocol support for rsyslog
然后又到debian官网上搜了一下,我看中了这个叫`gnutls-bin`的包,
使用如下命令安装.

    aptitude install gnutls-bin
结果configure还是提示缺少GNULTS.
然后我看到下面的东西了.

    p libneon27-gnutls-dev - Header and static library files for libneon27 (GnuTLS enabled)

这句话,就是重点.`Header and static library files`就是说的是头文件嘛,还有前面的dev,这样的东西一般都是给开发者用的才对.就是它了.

    aptitude install ibneon27-gnutls-dev

然后configure一下,通过了.Oh Yeah~~
make一下,就看到了生成的wget了.

然后就去镜像Archlinux的网站了.可是刚开始镜像,我又后悔了.我就看几个网页,没必要全部镜像啊.所以果断停止,把想看的那几个网页保存下来吧.

**总结:**

1. 我很蛋疼,
2. 不要想当然,要多看软件自带的INSTALL文档还有README文档.
3. 基本每个软件或命令都有 --help选项,没事多看看有好处.
