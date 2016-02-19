---
layout: post
title: 侧栏评论滑动显示的一点理解
pid: 189
comments: true
tags: [JavaScript, Study, WordPress]
categories: [WordPress]
---
前两天,我弄上了 loosky的 那个评论滑动显示的效果,也稍微写了一点东西,很多朋友很喜欢.

但是写的很笼统,好多朋友都看不懂.这也不奇怪.因为我也不是很懂原理,只是看了loosky的源代码还有他写的教程之后,按照自己的目的,修改了侧栏上的最新评论列表.我也是随便改的.没想到真的成功了.

今天在外面干了一天的铣床,还真有点累,回来看到有几个朋友让我写写详细的东西.说实话,我还真不会写.

但是算是这几天没更新的一个补救吧,我把我所认为的详细过程写写.同样附上最简单的demo.大家看不看得懂,我就不知道了.希望大家可以看懂.呵呵
请结合我最后的demo来看就好.

按照我的理解,那段javascript代码的作用就是可以控制如下结构中的若干li标签的隐藏和显示.然后再对li标签的位置进行一下控制就可以了.

    <ul id="slider">
    <li>自说Me话测试1</li>
    <li>自说Me话测试2</li>
    <li>自说Me话测试3</li>
    <li>自说Me话测试4</li>
    <li>自说Me话测试5</li>
    </ul>

如果你想做成我的侧栏的效果,我想你应该确定你想要实现的那部分的html应该是这个结构的. 你可以看看你的网页的源代码,是不是和这个一样.
我并不知道这段javascript代码是否可以用在其他的结构上.如果你尝试成功了,还请不吝告知.

那段javascript代码使用方法就是,在一个上面所说的列表后,加上如下内容.

    <script type="text/javascript">new slider({id:'slider'});</script>

其中的`id:'slider'`是上面的ul标签的id号.

这个应该就可以滚动了,但是还需要css来配合,将多余的部分隐藏掉.
比如,我的demo中,一共有9个li标签,我用chrome的审查元素工具看到,每个li标签的高度是21px,因此.把5后面的都隐藏掉,于是css代码就应该是

    #slider{height:105px;overflow:hidden;position: relative;}

`overflow:hidden`这个就是让多余的都隐藏,`position:relative`这个具体作用我不清楚,但是不加的话,li标签就不会向下滑动,而是一个一个的往下蹦,看了不舒服.具体什么效果你可以试试看.

关键部分好像就是这么多了,我好像也没有说什么实质性的东西.呵呵.具体的剩余的其他代码,还请去看demo源代码.

希望我的说的一些废话,能够给朋友们带来帮助.
最后附上我认为是最简单的demo地址,[此处](/demo/slider-comment/slider-comment-demo.html)
