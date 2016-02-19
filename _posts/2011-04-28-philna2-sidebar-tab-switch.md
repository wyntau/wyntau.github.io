---
layout: post
title: PhilNa2侧栏tab切换
pid: 105
comments: true
tags: [PhilNa2, WordPress]
categories: [WordPress]
---
先唠叨几句,这几天先是因为服务器的问题.导致连三天网站不能正常访问,昨天才刚刚恢复.可是又有一个英语测试,无奈本人英语能力实在是有限,所以只能加紧突击,希望能够碰上几个题目. 结果悲剧鸟,出来的问题还是不会....

不说了,过去就过去了.这几天一直憋着没写点东西,但是不写不代表没折腾,确实弄了点东西,也算是又给PhilNa2主题增加点好玩的东西吧.

该说正题了.就是我现在使用的侧栏的tab切换(效果见下图),大家试试感觉怎么样?我感觉还是挺好的.最起码节省空间,当侧栏的东西有点多的时候最起码不会把侧栏拉的太长,影响美观.

![](/uploads/2011/04/28_01.png)

起初在[自由的风](http://loosky.net) 博客上看到了 移植Hotnews Pro主题上的那个tab切换.只不过是上下切换的,当时我就有点心动了,只是不好意思向博主开口请教该怎么设置.前两天服务器出问题了,所以我只能到那些牛人的博客上去看看了,发现还是多多看看他们的博客才是王道啊.哈哈.这个tab切换就是从人家那里看到的源码,然后我又按照主题修改了一下,就OK啦.

开始,源代码地址,木木的[jQuery之Tab切换代码改进](http://immmmm.com/jquery-tab-switch-code-improved.html) 我发现,木木对于jQuery很有研究,好多东西我都可以从那里找到代码,可能昨天来这里的人都发现导航栏上的那个 LavaLamp 滑动效果 ,那也是从木木那里取经得来的,只是我发现那个效果对我现在的主题有点不合适,所以就撤下来了.所以建议大家,如果想要折腾jQuery的话,多去木木那里好好看看,你一定能找到自己想要的东西哦~~
学习一下木木的方式,

**首先**是 我的sidebar.php中的html结构,

    <div id="tab-title">
            <h3><span class="selected">最新评论</span> | <span>最新文章</span> | <span>随机文章</span></h3>
        </div>
        <div id="tab-content">
            <ul><?php philnaRecentcomments('number=7&status=approve'); ?></ul>
            <ul class="hide"><?php recentposts($limit = 9); // limit output ?></ul>
            <ul class="hide"><?php randomposts($limit = 9); // limit output ?></ul>
        </div>
**注意:那个 recentposts和randomposts是我修改了原作者yinheli的侧栏函数,方便同时调用最新文章和随机文章.你的主题力里面应该是没有这两个函数的,请按照你主题里面的函数进行替换**

css代码,我是在木木文章中的css代码 加以修改后使之更符合现在使用的主题.木木有给字体添加边框.我把边框什么的去掉了.

    #tab-title h3{font-size:14px;}
    #tab-title .selected{color:#356aa0;} /*标题被选中时的样式*/
    #tab-title span{padding:5px;cursor:pointer;}
    #tab-content .hide{display:none;} /*默认让第一块内容显示，其余隐藏*/
    #tab-content ul{overflow:hidden;}
    #tab-content ul li{padding-top:5px;overflow:hidden;}

希望大家按照自己对样式以及颜色等等的喜好进行一下修改.可能代码会有冗余,但是我能力有限,不会精简,只要能够使用我就OK了.

最后一个就是 jQuery代码.

    $('#tab-title span').mouseover(function(){
        $(this).addClass("selected").siblings().removeClass();
        $("#tab-content > ul").eq($('#tab-title span').index(this)).show(250).siblings().hide(250);
    });

show hide中的数字是时间参数,调节多长时间完成动作.

林木木原文 :

>稍微陈述下控制代码的运作过程：鼠标移到一个标题（#tab-title span）时，该标题添加被选中（.selected）的效果，其他标题移除被选中的效果；同时，获取标题被选择的序号（.eq()），让内容中对应的子项（#tab-content ul）显示，其余子项隐藏。

原文那里还有 **点击标题才切换**的效果,想要的童鞋去那里拿吧.

**ISayMe:** 具体的注释我也不会,基本上是看着html结构以及jQuery函数中要选择的东西进行更改的.最近准备网购一本<<锋利的jQuery>>,准备入门一下.省的以后看人家的代码看不懂还要去请教人家.

如果你用的是PhilNa2主题.并且只想实现我这样的效果的话,就直接copy吧 :lol: .但是推荐大家进行一下自我折腾~~~ 借[zwwooooo](http://zww.me)的一句话:因为喜欢, 所以折腾...无折腾不铁血!
