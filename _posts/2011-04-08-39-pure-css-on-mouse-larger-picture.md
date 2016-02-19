---
layout: post
title: 纯css鼠标放上去图片变大
pid: 39
comments: true
tags: [WordPress, CSS]
categories: [WordPress]
---
前两天从网上找关于实现安读者墙的代码.找到了一段.放在博客上效果还可以.但是在使用的时候遇到了一点问题.
就是用jquery实现鼠标放上去图片放大的效果. 我使用那个jquery函数的时候总是会发生图片放大后回不到原来位置的问题.问了原文作者.他也不知道该具体怎么修改.别人用的好好的.可以我用的时候就是不行.郁闷.

我又自己看着改了一下那个函数,基本上可以让图片放大之后再还原的时候能够回到原位.但是还有一点不爽的是,每次把鼠标放到图片的右下角一点的时候,图片会突然向左快速移动一次然后再快速回到原位,然后才会执行函数的动作. 因此这样就显得非常不流畅.
所以权衡了一下,还是把那个图片放大的jquery函数删掉了.

今天google的时候(google的什么我忘记啦.哈哈),看到了一篇文章,题目就叫"[纯css鼠标放上去图片变大](http://yangsongmao.blogbus.com/logs/67429062.html)",我很好奇啊.点进去后,看到一段 网页代码.我把代码复制到文本里面,改了后缀,然后浏览器查看就3个图片.放上鼠标,图片确实放大啦.哈哈.这个太厉害啦(知道原理的给俺讲讲,俺小白,不懂).于是我就把那段 css代码拿下来,放在了 那个读者墙上边.
现在看看[效果](http://isayme.com/message)吧.

把我找到的读者墙的代码还有我找到的 css代码放上来 感兴趣的可以自己研究一下.

<del datetime="2011-04-29T08:59:26+00:00">首先是奋斗博客上的[WordPress添加JQuery效果读者墙](http://www.fendou.info/wordpress/wordpress-jquery-readerwall.html)</del>已经废弃不用了.采用我现在使用的读者墙

**php函数部分.**

    <!-- start 读者墙 -->
    <ul id="hovershow">
    <?php
        $query="SELECT COUNT(comment_ID) AS cnt, comment_author, comment_author_url, comment_author_email FROM (SELECT * FROM $wpdb->comments LEFT OUTER JOIN $wpdb->posts ON ($wpdb->posts.ID=$wpdb->comments.comment_post_ID) WHERE comment_date > date_sub( NOW(), INTERVAL 1 MONTH ) AND user_id='0' AND comment_author_email != 'a@gmail.com' AND post_password='' AND comment_approved='1' AND comment_type='') AS tempcmt GROUP BY comment_author_email ORDER BY cnt DESC LIMIT 48";
        $wall = $wpdb->get_results($query);
        foreach ($wall as $comment)
        {
            if( $comment->comment_author_url )
            $url = $comment->comment_author_url;
            else $url="#";
            $tmp = "<li><a href='".$url."' target='_blank' title='".$comment->comment_author." (".$comment->cnt.")'><img src='http://www.gravatar.com/avatar.php?gravatar_id=".md5(strtolower($comment->comment_author_email) )."&size=80&d=monsterid&r=G'/></a></li>";
            $output .= $tmp;
         }
        echo $output ;
    ?>
    </ul>
    <!-- end 读者墙 -->

**最后一个就是我找到的那个用css实现图片放大效果的代码了.**

**你可以把下面这段代码复制到文本里面,改一下后缀看看效果**

我觉得这个才是重点.呵呵.打算把这个代码也用到侧栏上的那个 active friends上.

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>a</title>
        <style type="text/css">
            ul#hovershow{
                list-style-type: none;
                margin: 50px;
                float: left;
                display: inline;
                clear: both;
            }
            ul#hovershow li{
                float: left;
                display: inline;
                width:64px;
                height: 64px;
                margin: 2px;
            }
            ul#hovershow li a {
                display: block;width:64px;
                height: 64px;
            }
            ul#hovershow li a img{
            border:1px #666 solid;
            width:100%;
                height:100%;

            }
            ul#hovershow li a:hover{

            z-index:100;
            margin: -32px 0 0 -32px;
         position: absolute;
            }
            ul#hovershow li a:hover img{
            width:128px;
            height:128px;
            border:1px red solid;

            }

        </style>
    </head>
    <body>
    <ul id="hovershow">
        <li><a href="1#" title="test"><img src="http://img3.cache.netease.com/auto/2009/11/12/2009111210415292664.jpg" width="128" height="128" alt="test" /></a></li>
        <li><a href="2#" title="test"><img src="http://img3.cache.netease.com/auto/2009/11/12/2009111210415292664.jpg" width="128" height="128" alt="test" /></a></li>
        <li><a href="2#" title="test"><img src="http://img3.cache.netease.com/auto/2009/11/12/2009111210415292664.jpg" width="128" height="128" alt="test" /></a></li>
        <li><a href="2#" title="test"><img src="http://img3.cache.netease.com/auto/2009/11/12/2009111210415292664.jpg" width="128" height="128" alt="test" /></a></li>
        <li><a href="2#" title="test"><img src="http://img3.cache.netease.com/auto/2009/11/12/2009111210415292664.jpg" width="128" height="128" alt="test" /></a></li>
    </ul>
    </body>
    </html>

我的css代码.备份一下.

    /*reader wall*/
    ul#hovershow{
                list-style-type: none;
                margin:15px;
                float: left;
                display: inline;
                clear: both;
            }
            ul#hovershow li{
                float: left;
                display: inline;
                width:30px;
                height: 45px;
                margin: 2px;
            }
            ul#hovershow li a {
                display: block;width:40px;
                height: 40px;
            }
           ul#hovershow li a img{
            border:1px #666 solid;
            width:100%;
                height:100%;

            }
            ul#hovershow li a:hover{

            z-index:20;
            margin: -9px 0px 0px -10px;
         position: absolute;
            }
            ul#hovershow li a:hover img{
            width:60px;
            height:60px;
            border:1px red solid;}