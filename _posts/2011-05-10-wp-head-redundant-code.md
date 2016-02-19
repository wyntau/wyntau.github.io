---
layout: post
title: 转-去除wp头部代码中不需要的
pid: 124
comments: true
tags: [WordPress, 转载]
categories: [WordPress]
---
今天没事啦.[Microhu's Blog](http://www.microhu.com/) 的新主题更新发布.下载下来看了一下.确实既简洁又好用,非常符合我的审美观.
可是现在这主题鼓捣了这么长时间了,也不能说扔就扔啦.下载下来做个纪念,搞不好还可以从里面挖出来好多好东西.哈哈

更改wp默认表情图片位置 就是在看了willin kan大师的文章后,又看了一下Simple-M主题才知道怎么修改的.
在Simple-M主题中.我又看到了一大堆 remove_action ,我在路人的博文中看到过,知道这是去掉头部不需要的信息的.可惜,刚上来咱是小白,神马都不懂,也不敢胡鼓捣,现在咱可是都明白了, :lol:

按照路人说的,统统加上,头部信息确实清爽了不少.哈哈.又把wp_syntax插件的css加到主题的css里面,感觉头部更清爽啦.
不说了,转转 路人哥 的文章.原文地址[IM路人](http://imluren.com/) » [去除 wordpress 头部代码中不需要的](http://imluren.com/2011/03/wp-head-redundant-code.html)

 ***

趁着前几天折腾的劲头，接着博客清理工作。今天要搞的是博客头部代码，记得很久之前搞过一次“WordPress 优化头部信息”，最近又看到一些不顺眼的。

其实这些代码基本上都是在 wp_head() 函数里面的，而有些能够在主题中找到，有些则是在 wordpress 源程序中的，非常的繁琐。不过在网上找到了简单的方法，在 function.php 中 remove 掉不需要的项就行了。下面把找到的一些函数罗列下：

    remove_action( 'wp_head', 'feed_links_extra', 3 );//去除评论feed
    remove_action( 'wp_head', 'feed_links', 2 );//去除文章的feed
    remove_action( 'wp_head', 'rsd_link' );//针对Blog的离线编辑器开放接口所使用
    remove_action( 'wp_head', 'wlwmanifest_link' );//如上
    remove_action( 'wp_head', 'index_rel_link' );//当前页面的url
    remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 );//后面文章的url
    remove_action( 'wp_head', 'start_post_rel_link', 10, 0 );//最开始文章的url
    remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 );//相邻文章的url
    remove_action( 'wp_head', 'wp_generator' );//版本号
    remove_action( 'wp_head', 'wp_shortlink_wp_head', 10, 0 );//短地址
