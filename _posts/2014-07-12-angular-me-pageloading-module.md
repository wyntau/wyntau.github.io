---
layout: post
title: Angular 全局页面切换动画 me-pageloading
pid: 2014071201
comments: true
keywords: "Angular pageloading ui-router angular-route"
description: ""
categories: [学习笔记]
tags: [Angular]
---

最近看了Codrops的一篇文章, 里面讲到了一个页面切换的效果, 详情点击[此处](http://tympanus.net/codrops/2014/04/23/page-loading-effects/). 看了这个效果感觉很赞, 觉得这个效果可以用在angular的页面切换中, 所以将这个效果移植到angular中, 做成一个angular module, 方便以后添加类似效果时, 直接使用.

Github: <https://github.com/Treri/me-pageloading>

做好的demo效果

1. 配合 angular-ui-router使用, 效果<http://isay.me/me-pageloading/angular-ui-router.html>
2. 配合 angular-route使用, 效果<http://isay.me/me-pageloading/angular-route.html>

目前整个模块可以零配置工作, 但是由于angular-route的实现机制, `$routeChangeSuccess`在页面初始化后会触发两次, 因此会造成页面直接进入后就会触发一次效果. 这个问题可以通过禁用`me-pageloading`的自动加载解决.

在angular-ui-router中没有此问题.
