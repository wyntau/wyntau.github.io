---
layout: post
title: 我瞎弄的帅哥认证
pid: 169
comments: true
tags: [Blog, WordPress, 原创]
categories: [WordPress]
---
在别人博客上看到的这个创意.就想弄到自己的博客上.自己刚看了一点php语句,结合着我学的C,自己鼓捣了一段代码.可惜得手动更新帅哥名单.木办法.没时间看书,等考试结束后再说吧.

各个主题有各自的结构,俺也不多说什么,会看的一看就知道该怎么往自己的主题上添加,不会看的就只能先等等了.呵呵

    <?php $handsome=array(  //前面加上 评论者的名字是为了更新的时候好知道那个人对应的邮箱是哪个.
    '某人甲'=>'a@b.com', //不加也可以,但是我会分不清哪个邮箱是谁的.
    '某人乙'=>'c@d.com', //那样就不知道该继续让谁当帅哥啦.哈哈
    '某人丙'=>'e@f.com',
    '某人丁'=>'g@h.com');
    $adminEmail = get_option('admin_email');
    if($comment->comment_author_email==$adminEmail)
    echo " <span class='admin' title='博主'> Admin</span>";
    elseif(in_array($comment->comment_author_email,$handsome))//用邮箱判定是为了避免冒名顶替.呵呵
    echo " <span class='admin' title='帅哥✔'> 帅哥认证</span>";
    ?>