---
layout: post
title: Typecho版 css3读者墙
pid: 243
comments: true
tags: [CSS3, Typecho, 读者墙]
categories: [学习笔记]
---
昨天换上typecho没有怎么弄就去玩跑跑了,留下好多工作没有做完,所以今天要解决掉.
第一个任务就是做完使用wordpress时候弄的css3读者墙.

首先感谢 冰剑博客 的[水榜之血条](http://www.binjoo.net/2011/04/most-active-life)给我的启示.因为我没弄过typecho,所以对typecho的函数什么的一点也不熟悉,就借用了冰剑博客的一段代码.

具体效果请看本人[留言板](http://isayme.com/message/)

下面就是主要的代码了.

在主题文件夹的function.php文件中添加以下代码

    <?php
    function get_most_active_friends(){
    $db = Typecho_Db::get();
    $sql = $db->select('COUNT(author) AS cnt','author', 'url', 'mail')
    ->from('table.comments')
    ->where('status = ?', 'approved')
    ->where('type = ?', 'comment')
    ->where('authorId = ?', '0')
    ->where('mail != ?', 'admin@localhost') //把这里的邮箱改成你自己的
    ->group('author')
    ->order('cnt', Typecho_Db::SORT_DESC)
    ->limit('45'); //这里面填写读取的用户数
    $result = $db->fetchAll($sql);
    $output='';
    $maxNum = $result[0]['cnt'];
    foreach ($result as $one)
    {
    $width = round(40 / ($maxNum / $one['cnt']),2);//这里是血条长度的计算公式
    if($one['url'])
    $url =$one['url'];
    else $url='#';
    $output .="<li><a target="_blank" href="".$one['url'].""><span class="pic" style="background: url(http://www.gravatar.com/avatar/".md5(strtolower($one['mail']))."?s=36&d=monsterid&r=G) no-repeat;">pic</span><span class="num">".$one['cnt']."</span><span class="name">".$one['author']."</span></a><div class='active-bg'><div class='active-degree' style='width:".$width."px'></div></div></li>";
    } //我这里直接用的是gravatar服务器上的头像,如果你想使用本地缓存的话,请自己修改代码即可.
    $output = "<div class="readerwall">".$output."<div class="clear"></div></div>";
    echo $output ;
    }
    ?>

新建一个页面模板,然后在

    <?php $this->content(); ?>

的前面位置添加

    <?php get_most_active_friends(); ?>

即可

最后是css代码,和我在wordpress版的css3读者墙的css代码一样.

    /*readerwall*/
    body{overflow-x:hidden}
    .readerwall{padding:12px;font-size:12px;overflow:visible}
    .readerwall li{width:40px;height:40px;margin:0;padding:5px 0 5px 5px;float:left;list-style:none;border:0px solid #DFDFDF;-moz-border-radius:2px;-khtml-border-radius:2px;-webkit-border-radius:2px;border-radius:2px}
    .readerwall .active-bg{width:40px;height:2px;_font-size:0;margin:0 0 -1px -2px;background:#DFDFDF}
    .readerwall .active-degree{background:red;width:40px;height:2px;_font-size:0}
    .readerwall a{width:36px;height:36px;display:inline-block;position:relative;margin:0 0 2px;text-decoration:none}
    .readerwall .pic{position:absolute;top:0;left:0;z-index:100;width:36px;height:36px;display:block;-webkit-transform-style:preserve-3d;-webkit-backface-visibility:hidden;-webkit-transition:all .4s ease-in-out;-moz-transition:all .4s ease-in-out;-o-transition:all .4s ease-in-out;border-radius:4px;text-indent:-9999px}
    .readerwall .num{position:absolute;top:0;left:0;z-index:99;width:34px;height:34px;line-height:34px;color:#E02523;font-size:18px;font-weight:bold;display:block;background:#fff;text-align:center;border:#bbb 1px solid;box-shadow:0 0 4px #ccc;-webkit-transform:rotateY(-180deg);-webkit-transform-style:preserve-3d;-webkit-backface-visibility:hidden;transition:all .4s ease-in-out;-webkit-transition:all .4s ease-in-out;-moz-transition:all .4s ease-in-out;-o-transition:all .4s ease-in-out;border-radius:4px}
    .readerwall .name{position:absolute;top:0;left:0;color:#333;display:block;width:1px;height:1px;overflow:hidden;-webkit-transform-style:preserve-3d;-webkit-backface-visibility:hidden;-webkit-transition:all .2s ease-in-out;-moz-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;text-align:center}
    .readerwall a:hover .pic{z-index:100;border-color:#eee;-webkit-transform:rotateY(180deg);-moz-transform:rotateY(180deg)}
    .readerwall a:hover .num{z-index:101;-webkit-transform:rotateY(0deg);-moz-transform:rotateY(0deg);opacity:.8}
    .readerwall a:hover .name{top:-28px;left:-38px;z-index:101;padding:4px 6px;height:20px;line-height:20px;overflow:hidden;background:#fff;border-radius:2px;box-shadow:0 0 3px #000;min-width:100px;opacity:.8}
