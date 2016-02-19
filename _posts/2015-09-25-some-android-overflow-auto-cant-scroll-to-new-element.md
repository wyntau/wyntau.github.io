---
layout: post
title: "部分安卓设备出现元素设置overflow为auto时, 无法滚动到动态加载的元素问题"
pid: 2015092502
comments: true
keywords: ""
description: ""
categories: [BUG]
tags: [CSS]
---

### 问题

部分安卓设备中, 如果一个元素设置为`overflow:auto`, 当其中内容很长, 并且是动态生成的时候, 会出现问题

问题表现为, 整个元素只能滚动到初始时的底部, 后续使用js或其它手段动态添加的元素, 无法滚动到.

但是通过js计算整个元素的scrollHeight, 发现是已经把动态添加的元素计算在内的.

### 出现设备

部分中低端Android设置

### 解决办法

使用js, 在每次动态生成元素并插入页面后, 将设置`overflow:auto`先设置为`overflow:hidden`, 然后再设置回`overflow:auto`即可解决.
此时整个元素就可以滚动到新添加的元素的位置上了
