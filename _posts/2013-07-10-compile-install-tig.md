---
layout: post
title: "编译安装tig注意事项"
pid: 2013071001
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Git]
---

Tig 是一个 git 资源库浏览器,使用熟练的话,基本可以代替git的操作.

官方网址 <http://jonas.nitro.dk/tig/>

按照tig目录中的`INSTALL`文件中写的步骤,怎么安装都不成功,最后摸索一番,终于成功了,所以记录一下.

为了防止安装完成后,中文log显示乱码.需要提前安装`libncursesw5 libncursesw5-dev`


    sudo aptitude install libncursesw5 libncursesw5-dev
    git clone https://github.com/jonas/tig.git
    cd tig
    git checkout -t origin/release
    make configure
    ./configure --prefix=/usr
    make
    sudo make install install-release-doc

这样就安装完了.

执行`tig -v`显示如下结果

    $ tig -v
    tig version 1.1-97-g91a9cac

执行`whereis tig`显示如下结果

    $ whereis tig
    tig: /usr/bin/tig /usr/share/man/man1/tig.1

tig官方截图

1. **blame-view**

    ![blame-view](/uploads/2013/07/10_01-blame-view.png)

2. **diff-view**

    ![diff-view](/uploads/2013/07/10_02-diff-view.png)

3. **log-view**

    ![log-view](/uploads/2013/07/10_03-log-view.png)

4. **main-view-split**

    ![main-view-split](/uploads/2013/07/10_04-main-view-split.png)

5. **main-view**

    ![main-view](/uploads/2013/07/10_05-main-view.png)

6. **rev-graph**

    ![rev-graph](/uploads/2013/07/10_06-rev-graph.png)

7. **tree-view**

    ![tree-view](/uploads/2013/07/10_07-tree-view.png)
