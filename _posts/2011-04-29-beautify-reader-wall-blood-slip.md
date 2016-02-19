---
layout: post
title: 读者墙血条显示
pid: 106
comments: true
tags: [WordPress, 转载]
categories: [WordPress]
---
今天逛博客的时候到了冰剑博客,看到了他的一篇文章[水榜之血条](http://www.binjoo.net/2011/04/most-active-life) 具体的作用就是给读者墙添加一个美化吧.让每个人的头像下方增加一个"血条"显示,看起来很带感.但是冰剑博客上的代码是给typecho用的,wordpress的我不会修改.

还好在评论部分找到了 有人修改了适合于wordpress用的代码,就是[不亦乐乎](http://www.happyet.org/)的[<a target="_blank" href="http://www.happyet.org/621.html">[读者墙血条之jq版本和php版本](http://www.happyet.org/621.html)
我在本地试验了一下,完全可以使用.就直接copy过来了.具体效果点击[留言|读者墙](http://isayme.com/message/)

在这里记录一下,以后可能还会弄别的,但是别让这么优秀的代码与我错过了,顺便给大家点好玩的东西.如果大家感觉好的话,同样可以给自己的博客用上.
直接在需要显示读者墙的地方放上如下代码即可.

    <?php
        $query="SELECT COUNT(comment_ID) AS cnt, comment_author, comment_author_url, comment_author_email FROM (SELECT * FROM $wpdb->comments LEFT OUTER JOIN $wpdb->posts ON ($wpdb->posts.ID=$wpdb->comments.comment_post_ID) WHERE comment_date > date_sub( NOW(), INTERVAL 24 MONTH ) AND user_id='0' AND comment_author_email != 'a@b.com' AND post_password='' AND comment_approved='1' AND comment_type='') AS tempcmt GROUP BY comment_author_email ORDER BY cnt DESC LIMIT 48";//最后的这个40是选取多少个头像，我一次让它显示40个。
        $wall = $wpdb->get_results($query);
        $maxNum = $wall[0]->cnt;
        foreach ($wall as $comment)
        {
            $width = round(40 / ($maxNum / $comment->cnt),2);//这个40是我设置头像的宽度，和下面&size=40里的40一个概念，如果你头像宽度32，这里就是32了。
            if( $comment->comment_author_url )
            $url = $comment->comment_author_url;
            else $url="#";
            $tmp = "<li title='".$comment->comment_author." (".$comment->cnt."次重要讲话)'><a href='".$comment->comment_author_url."' target='_blank'><img src='http://www.gravatar.com/avatar.php?gravatar_id=".md5($comment->comment_author_email)."&size=60&d=identicon&r=G' /></a><div class='active-bg'><div class='active-degree' style='width:".$width."px'></div></li>";
            $output .= $tmp;
         }
        $output = "<div id='readerswall'><ul class='gavaimg'>".$output."</ul></div>";
        echo $output ;
    ?>

**你需要做的**就是把那个邮箱换成你自己的邮箱,这样就不会显示你自己滴头像啦.
说明一下血条,评论最多的人为满血,然后根据第一名计算其他的人的血量.

然后是css美化代码

    #readerswall li{width:40px;height:46px;margin:0 10px 10px 0;padding:5px;
    float:left;list-style:none;border: 1px solid #DFDFDF;
    -moz-border-radius:2px;-khtml-border-radius: 2px;
    -webkit-border-radius: 2px;border-radius: 2px;}
    #readerswall img{width:40px;height:40px;display:block;}
    #readerswall .active-bg{width:40px;height:2px;_font-size:0;margin-top:5px;background:#DFDFDF; }
    #readerswall .active-degree{background:red;width:40px;height:2px;_font-size:0;}

如果你需要更改两个图片之间以及两行之间的间距的话,只需要更改一下**#readerswall li**的margin就可以了.我是把他们都改成了0,因为我觉得还是紧凑一点比较好.

哦 忘记说了,不亦乐乎那里还有一个是jq代码的版本,但是我比较喜欢用这个php版本的,感觉服务器处理速度会更快一点.jq版本的需要用户的浏览器进行处理,感觉速度有点慢.

唉,刚刚和宿舍的人出去吃烧烤了,喝了点酒就晕晕的....看来还要多多努力.哈哈. 没什么好东西要鼓捣,就直接弄一篇现成的吧.
各位看着也美化一下自己的读者墙?
