---
layout: post
title: "Angular.js与animate.css集成"
pid: 2014071501
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Angular, Animate]
---

animate.css经过很多css高手的贡献, 现在已经有很多的动画了. 如果能够在angular中使用这些动画, 将会非常美妙.

通过对angular-animate的学习, 可以尝试将animate.css上的动画移植到angular中, 使之能够按照angular的方式来使用.

通过观察, 可以知道, animate.css基本有两大类动画, 一类为入场和离场动画, 另一类则是可以重复执行的普通动画.

入场和离场动画,可以经过处理之后,变成angular-route或者angular-ui-router的过场动画.

而重复执行的动画, 则就可以作为angular中的普通动画, 重复执行.

本人制作的一个demo如下 <http://Treri.github.io/me-animate.css>

欢迎大家感兴趣的一起来探讨.
