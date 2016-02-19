---
layout: post
title: 自己写的几个js函数
pid: 232
comments: true
tags: [JavaScript, jQuery]
categories: [学习笔记]
---
前两天看的那个《犀利开发 jquery内核详解与实践》,里面有讲了一个domextend的函数.
我试验了一下,感觉挺好的.所以就拿来用了.

正好,前几天说的要自己重写主题中的js部分.所以就想要先练习一下.
我喜欢jquery的链式操作,但是jquery的一些功能我还是用不太多.所以就想模仿jquery的链式处理方式.用js写几个简单的dom操作函数.这样以后就可以更加熟悉一些操作了.

只写了几个简单的.因为大部分jquery的操作函数都是对jquery这样的类数组对象操作.没法模仿.

所以只写了几个可以对单个dom对象操作的函数.函数名和jquery中的名字一样

自己试着写了一个自我感觉还行的dom对象生成的小东西.将一个符合html结构的字符串生成dom结构.所以在自己写的那些函数中,一般也都可以接受字符串.就像jquery中的$("&lt;div>&lt;/div>")就能生成一个div结构.

自己刚学习js.好多不懂的.写这些东西也是练习一下.因为我对dom操作不熟悉.
都是一些基本的方法,所以写了就算是玩玩吧.我知道这些东西很简单,所以请大家多多指点我.
下面是我写的一个js,大家指点一下.

[js文件](/uploads/2011/10/domextend.js)

基本上用下面的函数可以完成这样的操作.

    var test=document.getElementById("test");
    test.addClass("test2")
    .removeClass("dd")
    .toggleClass("tog1 tog2")
    .attr({"id":"new","class":"newclass"})
    .append("<div></div>")
    ....

就是这样. 看着和jquery很像 呵呵.

__createDOM__ 通过一段符合html结构的字符串返回一个DocumentFragment对象.

__hasClass__ 检测指定的一个(多个)类名是否同时存在,类名之间用一个或多个空格分隔,当多个类同时存在时,返回true

__addClass__ 添加一个(多个)类名,类名之间用一个或多个空格分隔,存在的类名直接跳过,返回元素本身

__removeClass__ 移除某个元素的一个(多个)类名,类名之间用一个或多个空格分隔,当不给参数时,删除所有class类名,返回元素本身

__toggleClass__ toggle一个(多个)class名

__getElementsByClassName__ 依赖于hasclass函数 ,当一个(多个)类名同时存在时,元素满足条件,返回结果数组

__attr__ 依照jquery吧 接受一个字符串或者对象参数.但是没有jquery强大.返回元素本身或者返回查询的属性值

__fadeIn fadeOut__ 网上找的.

__append__ 接受单个dom对象或者字符串.

__appendTo__ 接受单个dom对象

__prepend__ 接受单个dom对象或者字符串.

__prependTo__ 接受单个dom对象

__after__ 接受单个dom对象或者字符串

__before__ 接受单个dom对象或者字符串

__insertafter__ 接受单个dom对象

__insertbefore__ 接受单个dom对象

__html__ 就是innerHTML包装

__text__ 书上找的

__clone__ 返回克隆的实例

__replaceWith__ 接受单个dom对象或者字符串.

__replace__ 接受单个dom对象

__remove__ 和jquery中的可能不一样.这个就是删除元素的.

__empty__
__wrap__ 使用字符串或者存在的dom对象,或者新生成的dom包围所有元素,返回元素本身

__wrapInner__ 模仿jquery的wrapInner方法,使用字符串或者dom对象,包围调用方法的元素的所有子节点,返回调用元素
