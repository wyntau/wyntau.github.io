---
layout: post
title: 友情链接页面修复
pid: 47
comments: true
tags: [WordPress, 原创]
categories: [WordPress]
---
一直都想做到IM路人博客上的链接页面那样的效果,也同样向luren请教了很多.但是一直没有效果.即使是同样的代码,在我的电脑上就出不来效果.
直到今天我才知道了原因.原来是我的问题.同时要在这里向Japhia童鞋表示一下不好意思,哈哈.是我的原因才连带着他也弄不成(具体原因往下看就知道啦.)

首先要说说我原来写的一篇文章.[侧栏友链3栏显示](/2011/04/33-three-column-friends-sidebar.html).问题就是出在这里啊.就是因为这个才连累了japhia童鞋.哈哈.这里鄙视一下自己. :jiong:

先说解决方案吧. 在那片文章里面我说的让侧栏友链3栏显示,需要给侧栏的友链一个css样式.

    .blogroll{
    width:243px; //这里我修改成了243.因为我看到css里面的widget的宽度好像是243.
    display:block;
    /*记得清除浮动*/
    overflow:auto;
    /*兼容IE6*/
    zoom:1;
    }
    .blogroll li{
    float:left;
    width:30%;//这里我也修改了
    display:block;
    }
解决方法就是在每个点前面增加一个**#sidebar**(对侧栏的三栏友链没有任何影响.劝你赶紧这么做),变成如下样式

    #sidebar .blogroll{
    width:243px; //这里我修改成了243.因为我看到css里面的widget的宽度好像是243.
    display:block;
    /*记得清除浮动*/
    overflow:auto;
    /*兼容IE6*/
    zoom:1;
    }
    #sidebar .blogroll li{
    float:left;
    width:30%;//这里我也修改了
    display:block;
    }

为什么这么做.我刚刚看了书.知道是什么原因,但是我思路很乱,讲不清楚,有兴趣的可以借书看看.或者等我整理整理思路,写一哈子,咱也来个学习笔记啥的.

这样再 把luren的那些代码神马的放在一个单独的页面里面就不会出现友链竖直显示的效果(我试验的时候是这样的,如果你没出现过这样的情况,我猜是你还没有改正确. :lol: )了.

这样问题的根本就解决了,接着就可以按照luren的方法设置自己的友链单独页面了.

如果你还想知道的更具体一点的话,可以听听我这个说话很没有逻辑性的人讲一讲.哈哈.最近也是因为这个问题很上火,所以到图书馆借了一本《css入门与提高》,大体上看了看,还真是学到了不少东西.所以下面说的也不能算是胡说八道.呵呵.

讲讲加#sidebar的问题.我讲到的是直接使用 **.blogroll** 来给侧栏友链添加css样式.因此这样的样式就是全局的了.在那个css样式中有两个地方的语句是**display:block;** 这句话的意思是什么呢?就是使用 **盒子** 的显示方式.一个盒子占用一行,blogroll是一个大盒子,这其中的li元素是小盒子.因此就会出现一个友情链接就占用一整行的问题.而在前面加上#sidebar后 只限制了 id=sidebar中的blogroll样式.所以对单独页面的样式没有影响,

给大家看看我现在的  友链页面的样式吧.我把边框改成了虚线. luren还设置了 鼠标放上去的背景色.我感觉效果不是很好.就去掉了(加注释的那行就是给背景加灰色).还有那个链接的灰色颜色.我也没要,使用了默认的蓝色.(可以对比着luren的代码,添加自己想要的效果)
我的linkpage的css样式

    /* Links Page */
    .linkpage ul{padding-right:10px;overflow:auto;}
    .linkpage ul li {list-style-type: none;}
    .linkpage ul li ul li {line-height:150%;margin: 5px 5px; float:left; text-align: center;display:block;width:124px!important;width:93px; height:22px;border:1px #6699CC dashed;  overflow:hidden;}
    /*.linkpage ul li ul li a {color: gray;display: block;}*/
    .linkpage IMG {PADDING-BOTTOM: 3px;PADDING-LEFT: 0px;WIDTH: 16px;PADDING-RIGHT: 0px;FLOAT: left;HEIGHT: 16px;PADDING-TOP: 3px;}

具体使用方法就是在style.css中添加如上的代码(**更改#sidebar的前提下,实现在链接前面加小图标的方法,去luren的博客上看吧**),然后把如下的代码自己看着放到一个新建的模板里面的合适位置,**该替换的替换,该添加的添加**.

    <div class="linkpage">
                    <ul>
                        <?php my_list_bookmarks('title_li=&categorize=1&orderby=rand&title_before=<h3 style="background:#cccccc;font-size:14px;padding:5px;">&title_after=</h3>&category_before=<li>&category_after=</li>'); ?>
                    </ul>
                </div>
            <div class="clear"></div>
    <?php the_content(__('Read more...', YHL)); ?>

不要小看了那个`<div class="clear"></div>`,这句话还是在《css入门与提高》中学到的.这句话的作用就是使float(浮动)停止,因为我们设置了一个**float:left;**即是左浮动.如果不加`<div class="clear"></div>`这句话的话,会使得在编辑器里面输入的内容紧跟链接,造成页面上的很不和谐.加上这句话后,新内容就会另起一行了.
(不知道为什么,我再删掉,又不会出现这个问题了.但是还是建议加上.如果出现了紧跟 链接的情况,加上这句话试试效果)

    .linkpage ul{padding-right:10px;overflow:auto;}

这句话中的padding 是填充的意思.右填充10个像素.具体效果就是友情链接标题灰色延伸到距离右边10px.
.overflow:auto也不可少,缺少的话会是什么效果,你可以删掉试试.哈哈.保证让你好玩.

    .linkpage ul li {list-style-type: none;}

这句话中的list-style-type: none是说 友链前面没有 序号显示.如果你想再每个友链前面添加一个小原点的话,可是换成disc,具体效果可以看我的归档页面的效果(看了一点css就有这么大用处,真不赖啊  :evil: ).其他的效果可以找本css书,里面讲的都很详细.
再下面那一句就是虚线边框什么的了.更改后效果怎么样,可以试试看.
最后一句就是友链前面的那个小图标了.建议别动.

大体上就是这样啦.现在都零点了.说的很乱,如果有什么不懂的,可以再问我.
