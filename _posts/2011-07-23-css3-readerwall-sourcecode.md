---
layout: post
title: css3读者墙 源代码
pid: 192
comments: true
tags: [CSS3, PHP, 原创, 读者墙]
categories: [WordPress]
---
这两天累死了,每天干活,快受不鸟了....囧

说说正事吧,这几天没有更新,不是个事啊 所以找点东西.
前一阵子,曾经写过一篇文章,[css3版读者墙](/2011/06/css3-readerwall.html)

那篇文章中就给大家看了一个效果,没有讲怎么弄.所以今天给大家说说怎么弄那个效果.

css翻转效果来源 [大前端](http://www.daqianduan.com/css3-wordpress-wall/)

大前端中的效果中只有一个 翻转效果,我看原来我使用的读者墙中还有血条显示,所以就把两个效果整合到一起了.现在看来,这个效果还不错.具体请围观[留言版|读者墙](http://isayme.com/message/)

还想说一句,**chrome**效果最好,可以看到翻转效果.**FF**好像看不到反转的效果.IE的话,你祈祷他不错位就大吉大利了.. :jiong:

下面说说实现步骤吧. 说起来也挺简单的.按照我的理解,在大前端的demo中,他是把评论者的头像作为了背景来显示.因此,只要对原来读者墙的php代码进行修改就好了.

上代码

    <!-- start 读者墙  Edited By iSayme-->
    <?php
        $query="SELECT COUNT(comment_ID) AS cnt, comment_author, comment_author_url, comment_author_email FROM (SELECT * FROM $wpdb->comments LEFT OUTER JOIN $wpdb->posts ON ($wpdb->posts.ID=$wpdb->comments.comment_post_ID) WHERE comment_date > date_sub( NOW(), INTERVAL 24 MONTH ) AND user_id='0' AND comment_author_email != 'admin@yourdomain.com' AND post_password='' AND comment_approved='1' AND comment_type='') AS tempcmt GROUP BY comment_author_email ORDER BY cnt DESC LIMIT 39";//大家把管理员的邮箱改成你的,最后的这个39是选取多少个头像，大家可以按照自己的主题进行修改,来适合主题宽度
        $wall = $wpdb->get_results($query);
        $maxNum = $wall[0]->cnt;
        foreach ($wall as $comment)
        {
            $width = round(40 / ($maxNum / $comment->cnt),2);//此处是对应的血条的宽度
            if( $comment->comment_author_url )
            $url = $comment->comment_author_url;
            else $url="#";
            $tmp = "<li><a target="_blank" href="".$comment->comment_author_url.""><span class="pic" style="background: url(http://www.gravatar.com/avatar/".md5(strtolower($comment->comment_author_email))."?s=36&d=monsterid&r=G) no-repeat;">pic</span><span class="num">".$comment->cnt."</span><span class="name">".$comment->comment_author."</span></a><div class='active-bg'><div class='active-degree' style='width:".$width."px'></div></div></li>";
            $output .= $tmp;
         }
        $output = "<div class="readerwall">".$output."<div class="clear"></div></div>";
        echo $output ;
    ?>
    <!-- end 读者墙 -->

上面中大家注意看那个获取评论者头像那部分就知道了.把获取到的头像作为了每个列表的背景来显示.然后再用css进行控制即可.获取头像是直接使用的地址,我感觉这里使用get_avatar函数的话,无法实现效果.

css代码部分

    body{overflow-x: hidden;}
    .readerwall{padding:12px 0 12px 15px; font-size:12px;overflow:visible;}
    .readerwall li{width:40px;height:40px;margin:0;padding:5px 0 5px 5px;float:left;list-style:none;border: 1px solid #DFDFDF;-moz-border-radius:2px;-khtml-border-radius: 2px;-webkit-border-radius: 2px;border-radius: 2px;}
    .readerwall .active-bg{width:40px;height:2px;_font-size:0;margin:-3px 0 0 -2px;background:#DFDFDF; }
    .readerwall .active-degree{background:red;width:40px;height:2px;_font-size:0;}
    .readerwall a{width:36px;height:36px;display:inline-block;position:relative;margin:0 0px 2px 0; text-decoration:none}
    .readerwall .pic{position:absolute;top:0;left:0;z-index:100;width:36px;height:36px;display:block;-webkit-transform-style:preserve-3d;-webkit-backface-visibility:hidden;-webkit-transition:all .4s ease-in-out;-moz-transition:all .4s ease-in-out;-o-transition:all .4s ease-in-out;border-radius:4px; text-indent:-9999px}
    .readerwall .num{position:absolute;top:0;left:0;z-index:99;width:34px;height:34px;line-height:34px;color:#E02523;font-size:18px;font-weight:bold;display:block;background:#fff;text-align:center;border:#bbb 1px solid;box-shadow:0 0 4px #ccc;-webkit-transform:rotateY(-180deg);-webkit-transform-style:preserve-3d;-webkit-backface-visibility:hidden;transition:all .4s ease-in-out;-webkit-transition:all .4s ease-in-out;-moz-transition:all .4s ease-in-out;-o-transition:all .4s ease-in-out;border-radius:4px}
    .readerwall .name{position:absolute;top:0;left:0;color:#333;display:block;width:1px;height:1px;overflow:hidden;-webkit-transform-style:preserve-3d;-webkit-backface-visibility:hidden;-webkit-transition:all .2s ease-in-out;-moz-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;text-align:center}
    .readerwall a:hover .pic{z-index:100;border-color:#eee;-webkit-transform:rotateY(180deg);-moz-transform:rotateY(180deg)}
    .readerwall a:hover .num{z-index:101;-webkit-transform:rotateY(0deg);-moz-transform:rotateY(0deg);opacity:.8}
    .readerwall a:hover .name{top:-28px;left:-38px;z-index:101;padding:4px 6px;height:20px;line-height:20px;overflow:hidden;background:#fff;border-radius:2px;box-shadow:0 0 3px #000;min-width:100px;opacity:.8}

就是这么简单了.还想说一下,这里的头像大小是36px的,由于修改头像大小的时候还要涉及到css部分的修改.我感觉很麻烦.况且,我感觉36px的大小也挺合适的了.我感觉没有必要再加大了.所以,各位按照自己的意愿吧.呵呵

上面的php代码和css就是我现在的读者墙的代码.因此,如果在你使用的过程中出现了什么问题的话,请大家自己根据主题找原因.....代码绝对没有问题~~

今天的任务到此结束~~
