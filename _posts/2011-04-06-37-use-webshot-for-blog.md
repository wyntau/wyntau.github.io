---
layout: post
title: 使用网页缩略图种种..
pid: 37
comments: true
tags: [PhilNa2, WordPress, 原创]
categories: [WordPress]
---
今天看到[IM路人](http://imluren.com/2010/12/webshot-for-blog.html)的博客上 说网页缩略图的功能没有停止.可是我前两天去willin大师的网站上去看的时候,明明说的是已经停止服务了. :han: 今天我又到那个服务网站上一看,确实没有停止.不知道willin大师是怎么搞的.
既然能用.这么眩的功能咱也得加上啊.哈哈.所以注册了一个号,然后下载了luren博文上的 *stw-webshot-cache*插件,配置一下.OK.确实够眩的. :lol:

看路人说还修改了一些地方.我装上插件不做任何修改的情况下.会发现狠多地方不符合要求.侧栏上基本上都会生成缩略图.
文章页上的作者链接竟然也会有缩略图 :mad: ,唉 和我想的差太远了.

我要的效果是 只有文章中的外链和友情链接有缩略图,又看到路人的 评论框里面的 来访者也有 缩略图,基本上这样就够了, 所以按照路人说的在必要的地方添加*no_webshot*标签.

**首先是**文章页的作者链接和底部的链接.作者链接要修改 loop.php(philna2主题)模板.底部的就要修改footer.php了.

**第二个**就是侧栏了.由于我先前既用了后台小工具,又用了函数调用,所以不是很好操作.

本来我的最新文章是用的后台小工具,随机文章用的主题本身的函数,可是发现那个最新文章没法添加no_webshot标签. 记得刚用主题的时候,侧栏是自带有最新文章的,所以又翻了下函数主体,果然发现了最新文章的函数段.原来我把那个判断是否显示最新文章的语句注释掉了.于是把那段单独函数弄出来,起个新名字,然后把小工具下岗 :lol: .用函数调用最新文章.这样就好了.

然后在每一个*class="widget box icon content"*的引号前面加一个*no_webshot*标签,

更为简便的方法是在侧栏的元素,`div id="sidebar"`后面添加一个`class="no_webshot"`,但是这样所有的侧栏都不会有缩略图了,这样不符合我友情链接有缩略图的目的.所以我还是需要在每个`class="widget box icon content"`后面添加.

**第三个**是评论框的链接.来访者发表评论之后会留下链接.这个应该要有缩略图. 看了下 原来下载的luren的主题,在*comment.php*里面可以修改.

**最后一个**就是主页的more标签了.我发现主页的more标签竟然还会有缩略图.太....那个了.我最不想要的就是它.赶紧想办法搞掉.网上转了一圈.都是修改more标签的文字的,这个还真帮不上忙.功夫不负有心人啊. :lol: 还是被我找到了.是在叫*happmaoo*的博客上找到的,这里表示下感谢.想看的点击[此处](http://happmaoo.com/html/wordpress/quchuwordpressdemorebiaoqianlianjie.html)咯.

具体位置是在*wp-includespost-template.php*,编辑这个文件,搜索如下内容

    $output .= apply_filters( 'the_content_more_link', ' <a href="' . get_permalink() . "#more-{$post->ID}" class="more-link">$more_link_text</a>", $more_link_text );
                $output = force_balance_tags($output);

然后在a标签的后面添加 class="no_webshot"就好啦.

修改完这个,还可以看到,那个more标签后面还会跟着*#more -{$post-&gt;ID}*,这个的作用就是点击more标签后跳到文章页,从more标签之后开始阅读.我不太喜欢这个功能,因为我看人家的文章都是 先预览一下,感觉好的话,再点击more标签进入,可是就是这个 "从more标签之后开始阅读",每次都要我用鼠标再拉到文章开头,很不爽,果断去掉.

去掉之后再点击 主页的more标签,就会单纯的进入单篇文章页啦. :smile:
呼呼.改个小东西,还改出来了这么大的收获. :lol:
