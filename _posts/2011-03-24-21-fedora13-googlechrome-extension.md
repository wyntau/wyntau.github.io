---
layout: post
title: fedora13安装chrome以及经典扩展程序推荐
pid: 21
comments: true
tags: [Chrome, Linux, 原创]
categories: [学习笔记]
---
此贴也是我首发在红联Linux论坛上的文章.

先说说为什么要装这个浏览器,在我的上一篇贴子
[安装完fedora13我要干的几件事](http://lueeon.com/2011/03/linux.html)中,我讲到了要装浏览器,当时给大家推荐的是枫树浏览器,但是用了一段时间感觉linux下面的枫树浏览器不给力,和google同步的很不及时,所以我就想着装原版的google-chrome吧

于是开装,到网上搜索了一下 官网 上有rpm包,但是看着好大,还不知道是什么版本的,所以不想用rpm包装,还是喜欢yum安装的方式,
所以到chrome的官网上看到了用yum安装的方式

下面就说说具体的步骤

<http://www.google.com/linuxrepositories/>

首先找到google linux软件仓库,可以看到说的话

>First, use rpm to install the key, as described in the RPM setup guide.As root, add the following to a file called google.repo in /etc/yum.repos.d/:

所以在/etc/yum.repos.d/中创建一个repo文件吧 里面填上下面的内容

    [google]name=Google - i386baseurl=http://dl.google.com/linux/rpm/stable/i386
    enabled=1gpgcheck=1gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub

然后就可以装chrome了

    yum makecachesu -c 'yum install google-chrome-stable'

这里说明一下,网上找到的很多都是说的是unstable,这unstable是什么意思,我就不说了.
大家都明白,所以还是用stable,虽然是7.0的浏览器,但是还是很好用的.
这样就装完了浏览器了,但是仅仅装完浏览器还远远不够啊,googlechrome的威力可不是一个浏览器就可以发挥出来的,还要靠众多的扩展程序才能完全展现chrome的魅力所在啊.

- - -

下面就介绍几个我正在使用的扩展程序,可以很好的发挥chrome的威力

[1  AdBlock](https://chrome.google.com/extensions/detail/gighmmpiobklfepjocnamgkkbiglidom)

最受欢迎的Google 浏览器扩充功能，拥有超过150 万位使用者！阻挡网路上所有的广告
下面就贴两张图对比一下

![](/uploads/2011/03/24_19.png)

![](/uploads/2011/03/24_20.png)

[2  Discuz! 论坛助手](https://chrome.google.com/extensions/detail/bpcbeglppddgdmmlcdbeigkhbmjnldme)

去除 Discuz! 论坛中的广告，支持Discuz! 和 Discuz!X.

![](/uploads/2011/03/24_21.png)

[3  Google Reader Auto Https](https://chrome.google.com/extensions/detail/kkeglijakjolgbmcbfhnmijhijgkmclh)

> 如果你和我一样，喜欢用Google Reader，并且喜欢直接在地址栏里敲入：<http://reader.google.com/>访问Google Reader,  
> 并且经常会因此撞墙,  
> 或者装了各类RSS订阅扩展，发现在点击鼠标把一个feed订阅到Google Reader时会撞墙,  
> 或者你点击一个使用http协议访问google reader的链接，而这个链接里带了墙不喜欢的关键字,  
> 然后你发现在以上各种情况下，你会被迫去修改URL成使用https协议，那么，这个Chrome扩展适合你.

[4  Mouse Stroke](https://chrome.google.com/extensions/detail/aeaoofnhgocdbnbeljkmbjdmhbcokfdb)

使用鼠标手势快速执行操作。支持超级托拽、组合手势、鼠标滚轮手势！

说明一下 Smooth Gestures 事大多数人推荐的,但是这个在linux中的chrome中不能用,因为这个插件要求chrome的版本&gt;=8.0,而linux中的stable版本只有7.0,所以就用Mouse Stroke 足够了

![](/uploads/2011/03/24_22.png)

[5  No BaiduAd](https://chrome.google.com/extensions/detail/amdhfoilnhpfanohkineenoakiffblec)

本扩展程序可以有效屏蔽或高亮百度竞价排名广告

![](/uploads/2011/03/24_23.png)

[6  One Number](https://chrome.google.com/extensions/detail/cfkohgkpafhkpdcnfadadcibfboapggi)

Check GMail, Google Reader, Google Voice, and Google Wave. Many sources, one number.让你一次就可以知道多个东西是否有了更新

![](/uploads/2011/03/24_24.png)

![](/uploads/2011/03/24_25.png)

[7  RSS Subscription Extension（由 Google 提供）](https://chrome.google.com/extensions/detail/nlbjncdgjeocebhnmkbbbdekmmmcbfjd)

在您的工具栏上添加一键订阅。谷歌浏览器本身没有RSS订阅功能,所以用这个扩展就可以随意订阅想要的网站了,只要这个网站支持RSS输出,此扩展程序就会在地址栏出现RSS订阅标志,

![](/uploads/2011/03/24_26.png)

[8  SearchPreview for Google](https://chrome.google.com/extensions/detail/hcjdanpjacpeeppdjkppebobilhaglfo)

Adds preview images (thumbnails) to your Google search results.就是可以看到搜索到的网页的缩略图,看看是不是被墙掉了,顺便大体了解一下网站上到底是什么内容.

![](/uploads/2011/03/24_27.png)

[9  Webmail Ad Blocker](https://chrome.google.com/extensions/detail/cbhfdchmklhpcngcgjmpdbjakdggkkjp)

在屏幕上时，使用雅虎邮件，Hotmail和Gmail的空间，从而扩大您的消息右边座广告

![](/uploads/2011/03/24_28.png)

[10  人人网改造器](https://chrome.google.com/extensions/detail/bafellppfmjodafekndapfceggodmkfc)

为人人网（[renren.com](http://renren.com/)，原校内网[xiaonei.com](http://xiaonei.com/)）清理广告、新鲜事、各种烦人的通告，增加更多功能……

![](/uploads/2011/03/24_29.png)

[11  自动回贴机](https://chrome.google.com/extensions/detail/lbkdfmcbclnoggeijjjakleeealgoncm)

帮助用户快速回复<http://bbs.chinaunix.net>的隐藏贴好像其他论坛也可以回复,因为我在雨林木风论坛上遇到的隐藏贴就自动回复了

![](/uploads/2011/03/24_30.png)

[12  百科抄抄](https://chrome.google.com/extensions/detail/agfhhcchechmgiabincfjdgolmpbnkkc)

可以自动删除掉百度百科里\[编辑本段\] 这个链接，可以更方便的复制。

![](/uploads/2011/03/24_31.png)

[13  回到顶部](https://chrome.google.com/extensions/detail/aadikfohengoplibnbfjhmhafjlgiooo)

点击跳到页面顶部

按:扩展程序的部分系本人亲自截图,说明部分一部分引自扩展程序主页,还有本人感想.

关于那几个去广告的扩展,我想说一句,建议大家一起使用,因为各自的去广告的功能不一样,就像adblock可以去掉百度绝大多数广告,但是不能去掉百度的推广链接  
但是 NO baiduad 可以去掉推广链接,还可以去掉百度搜索边上的广告,功能重叠了,但是其他的网站就要靠 adblock的作用了.  
还有那个论坛助手,和adblock也有重叠的功能,但是也有它没有的功能,由于我装的太多,所以希望大家试试,究竟可以把哪个去掉,可以给我说说,  
如果大家还有什么更好用的扩展程序,请给我说说 ,我也尝试尝试,因为我就用到这几个,所以也就不好给大家推荐什么别的了  
大家一定要给我推荐哦!!给我说说更好的!!
