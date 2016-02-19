---
layout: post
title: 关于Ajax加载首页文章的想法
pid: 135
comments: true
tags: [Ajax, WordPress, 点滴]
categories: [唠唠叨叨 ]
---
刚用上这个主题没多少时间后,我就看到了木木的那篇关于ajax加载首页文章的博文[AJAX动态加载文章内容](http://immmmm.com/ajax-loading-post-content.html)当时我也尝试了,可以用那个ajax请求的网址输出文章内容.只是默认是输出全文发现效果不好,并且当时也不会修改木木的jquery函数.所以就放下了.
后来看到了[自由的风](http://loosky.net) 博客上的ajax加载(后来我发现那个仍然是加载全文),感觉不错.

下载了loosky主题,看了一下其中的函数,又看了winysky的关于ajax应用的[jQuery+Ajax在wordpress中的应用（一）](http://winysky.com/jquery-ajax-in-the-wordpress-application-1),发现可以加载摘要,也可以加载全文.

经过一番尝试,结合木木的文章还有loosky中的函数等等,在本地实现了ajax加载首页文章,但是我又有点想法了.

这个ajax加载用在我的主题上值不值得,现在用的是木木的jquery首页文章收缩,自己感觉效果不错.

如果换上了ajax加载的话,无非两种选择.加载全文或者是加载摘要.加载全文我不喜欢, 现在我首页是输出8篇文章,要是用ajax加载全文的话,我估计要是全部打开的话,会把首页拉的很长.不美观.
要是加载摘要的话,我的摘要并不是很长,现在是8篇文章的摘要全部加载,然后css隐藏.如果用ajax加载的话,感觉对于速度方便没有什么提升的空间.

所以我在犹豫要不要换上ajax加载... :zzz:
