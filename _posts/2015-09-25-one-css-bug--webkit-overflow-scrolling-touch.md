---
layout: post
title: "-webkit-overflow-scrolling设置为touch的一个bug"
pid: 2015092501
comments: true
keywords: ""
description: ""
categories: [BUG]
tags: [CSS]
---

### 问题

css属性为`overflow:auto`的元素, 设置`-webkit-overflow-scrolling:touch`, 如果此元素内容有`position:relative`的元素,
当页面加载过程中, 如果滚动页面, 有几率会触发bug.

bug表现为 页面内容消失, 但是查看DOM时, 所有DOM依然存在于页面中.

页面中的图片, 文本框什么的, 也依旧能够发挥作用. 如果在相应的位置长按, 依然能够呼起操作选项, 但是就是看不到.

### 出现设备
部分Webkit内核浏览器有机率出现

### 原因
`-webkit-overflow-scrolling:touch`的实现bug.

### 解决办法

StackOverflow <http://stackoverflow.com/questions/9807620/ipad-safari-scrolling-causes-html-elements-to-disappear-and-reappear-with-a-dela>

<http://cantina.co/thought_leadership/ios-5-native-scrolling-grins-and-gothcas/>

在设置了`position:relative`的子元素上, 使用`transform: translate3d(0,0,0)`, 或者省事的做法, 使用`*`将所有子元素都设置`transform: translate3d(0,0,0)`. 使用translate3d强制开启硬件加速解决问题
