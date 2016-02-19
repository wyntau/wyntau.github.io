---
layout: post
title: 单PHP文件原生js版PhilnaSay
pid: 250
comments: true
tags: [PhilNa2, JavaScript]
categories: [学习笔记]
---
刚有个朋友问我博客右上角的PhilnaSay,想让我帮忙提取出来,所以弄了一下,先是给那位朋友弄了一个用jq库的.然后我又弄了一下,搞了一个原生js版单PHP文件版的

如果想用的话,直接把PHP文件包含到想展示PhilnaSay的地方就行了,其它的都不用动.

把以下代码随便保存一个名字,比如 `PhilnaSay.php`在想展示PhilnaSay的地方输入以下内容,
&lt;?php include 'PhilnaSay.php';?>

<script src="https://gist.github.com/Treri/7098144.js"></script>
