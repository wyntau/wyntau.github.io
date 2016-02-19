---
layout: post
title: IE浏览器中Image对象onload失效的解决办法
pid: 256
comments: true
tags: [JavaScript]
categories: [学习笔记]
---

接昨天的上篇文章,设置图片的宽高到窗口的宽高.

在chrome firefox safari中都没有问题,但是在IE中就不行了.
会出现不管怎么弄,图片的宽高都不会被设置.

测试了一下,是因为在IE中 img的onload事件不会被触发.网上搜索了一下找到了办法.

具体原因是 图片下载时，浏览器会把图片缓存起来，再次加载此图片时就会从缓冲区里加载

在上次文章中的代码是这样写的

    var img = new Image();
    img.src = "test.gif";
    img.onload = function(){
        alert(this.src);
        //other
    };

修改之后的代码是这样写的

    var img = new Image();
    img.onload = function(){
        alert(this.src);
        //other
    };
    img.src = "test.gif";

是的 只是把onload的定义放到了设置img src之前就行了.

所以IE中img onload事件加载不了的原因是,不是因为IE浏览器不会触发onload事件，而是因为加载缓冲区的速度太快，在没有告诉它加载完要怎么办时，它已经加载完了。
