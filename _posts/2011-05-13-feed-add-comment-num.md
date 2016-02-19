---
layout: post
title: 给feed输出 添加评论条数
pid: 131
comments: true
tags: [PhilNa2, WordPress]
categories: [WordPress]
---
**update:**刚刚在网上转了一圈,发现这个玩意已经被人用烂了,无奈我一直没有看到....
想看的就凑活着看,反正我是不想看了....一点新意都没有了....
下面的就是我刚刚写的了,但是现在有种想隐藏这篇文章的冲动了...

****

今天又到主题作者yinheli的博客上又转了转,看到了好多的技术文,可惜咱神马都不懂,只能看看热闹.可是我看到了好玩的东西.在rss中 输出评论条数.增强和读者的交互性.就像这样.
---
![](/uploads/2011/05/13_02.png)

当时在winysky的文章[WordPress订阅源里显示评论数](http://winysky.com/show-feeds-in-wordpress-comments)就看到winysky说代码参考自 philna2主题.这里说的代码应该就是我看到的这个.但是不知道为什么,在我用的主题里面没有,只在yinheli的博文中看到了.于是我就弄过来放到了rss输出里面.恰好feedburner抓取rss,就看到了上图的结果.

原来为了在rss中输出 版权信息.我修改了philna2自带的在feed中插入相关文章的函数.因此这个我还是拿这个函数修改.再加上评论数输出.原来的修改方法请点击[此处](/2011/04/42-final-version-feed-output-copyright-information.html)

这次按照yinheli的博文[给feed输出内容添加些'个性'](http://philna.com/2009/02/get-feed-add-some-personality)中的代码,先通过文章ID获取评论数目.然后判断评论的数目,输出不同的提示语.

下面将我的修改的方法说说,你可以放到别的地方,也可以放到我放的这个地方.

打开**app/relatedposts.php**文件,找到那个**philnaFeedRelatedPost**s函数.在开始的大括号后面添加如下内容

    global $id;
    $comment_num = get_comments_number($id);
    if($comment_num==0):
    $rss_comment_tip="截至您的阅读器抓取时还没有评论.想抢沙发?那得赶快呀";
    elseif($comment_num>=1 && $comment_num<30):
    $rss_comment_tip="截至您的阅读器抓取时已有评论** ".$comment_num." **条,欢迎您也过来留下您的意见 !";
    elseif($comment_num>=30):
    $rss_comment_tip="截至您的阅读器抓取时已有评论** ".$comment_num." **条,大家讨论的如此激烈,你为什么不过去瞧瞧?!";
    endif;

然后在

    $content .= philnaRelatedPosts('limit=8&excerpt_length=0');

的前面或者是后面添加如下内容(别忘了等于号前面的点".")

    $content .=$rss_comment_tip;

这样等你新发表一篇文章,在feed中就可以看到评论的条数啦.
