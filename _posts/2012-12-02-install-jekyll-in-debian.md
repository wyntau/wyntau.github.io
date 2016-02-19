---
layout: post
title: 在Debian中安装jekyll
pid: 252
comments: true
tags: [GitHub, Jekyll]
categories: [也来推荐, 互联网络]
---
首先简单介绍一下jekyll是什么东西.
Jekyll是一个静态网站生成工具。它允许用户使用HTML、Markdown或Textile来建立静态页面，然后通过模板引擎Liquid（Liquid Templating Engine）来运行.

使用Jekyll的好处：

- 可以在各种文字编辑器中通过Markdown或者Textile来写博文。
- 可以在本地预览博客。
- 写作无需Internet连接。
- 可以通过Git进行发布。
- 可以在静态Web服务器上构建博客站点。
- 可以通过Github Pages服务免费构建博客。
- 无需数据库。

所以准备自己也搞一个玩玩,可能的话,会弄一个子域名放github上面

前阵子在CentOS上安装jekyll的时候就遇到不少问题，现在换了Debian再安装还是遇到不少困难，但是因为已经安装过一次,所以有了不少经验.遇到问题很容易就解决了.

系统 Debian 6.0.6 Stable

首先安装ruby,在安装ruby之前,还是安装rvm.也可以直接用apt安装但是考虑到rvm(ruby version manager)的便捷,所以还是用rvm.

    curl -L https://get.rvm.io | bash -s stable

安装完之后,首先安装zlib,防止安装jekyll的时候提示找不到zlib的错误使安装过程进行不下去

    rvm pkg install zlib --verify-downloads 1

然后安装ruby

    rvm install 1.9.2

将ruby1.9.2设为默认版本

    rvm alias create default ruby-1.9.2-p320

然后将gem源改为国内的源

    gem sources --remove http://rubygems.org/
    gem sources -a http://ruby.taobao.org/

然后输入如下命令

    gem sources -l

应该会返回

    *** CURRENT SOURCES ***
    http://ruby.taobao.org/

接下来安装jekyll

    gem install jekyll

安装之后直接在终端输入jekyll可能会提示找不到jekyll,可能是因为jekyll不在PATH路径中的问题,手动添加一下

编辑`~/.bashrc`文件,在最后添加

    PATH=~/.rvm/gems/ruby-1.9.2-p320/bin:$PATH #for jekyll

打开终端,输入`jekyll -v`,应该会返回`Jekyll 0.11.2`,表示安装成功了

如果要把wordpress数据库中的文章导出来,要安装jekyll WIKI中说的

    gem install sequel mysqlplus
但是在这之前,可能需要安装 mysql头文件,否则在安装过程中会提示错误

    Debian中 安装 apt-get install libmysql++-dev
    CentOS中 安装 yum install mysql-devel

然后就能按照官方WIKI中的方法从数据库中转化文章了
