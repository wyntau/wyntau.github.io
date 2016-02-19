---
layout: post
title: 这两天博客不能评论的说明
pid: 231
comments: true
tags: [WordPress, 点滴]
categories: [唠唠叨叨]
---
这两天来我博客的朋友,对不起了.因为我的一时疏忽,导致大家不能评论.

具体原因是这样的

看完html5揭秘后,发现thml5的表单部分新增加的一些type属性,非常感兴趣,所以就把博客评论部分的type部分修改了.

改完后,chrome确实可以直接验证,提示也很友好.所以就直接用了.但是我没有注意的是,ajax评论的时候出了一点问题,会使得email一栏的信息无法发送到服务器.所以一直提示请输入有效的邮箱等等.

我猜想是因为这个type属性的问题.所以将type属性修改回来之后就正常了.但是我还是想用新属性的.
所以检查一下代码吧.

js的问题,由于我用的jquery是比较老的1.3.2版本的,对于type的支持还不够.所以在提交评论的时候,对评论表单序列化漏掉了url和email两项.

通过检查juqery1.3.2和1.6.4的源码中的serialize方法.可以看到1.3.2的版本是用的

    /text|hidden|password|search/i.test(this.type)

来验证type属性的.
而1.6.4是用的rinput.test( this.type ) 验证.
而rinput在上面定义过了.

    rinput=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,

所以依照这个,将email和url属性添加进去,就行了.
简单的改成

    /text|hidden|password|search|email|url/i.test(this.type)

这样就行了.jquery版本对我没有意义.不影响现有的功能就行,所以就不更新了.
