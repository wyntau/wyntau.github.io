---
layout: post
title: 让评论者链接在新窗口打开
pid: 23
comments: true
tags: [WordPress]
categories: [WordPress]
---
最近发现,当我在查看评论者的网站链接的时候会是在当前窗口打开.

我一想.这怎么可以.要是一个人从当前窗口打开评论者的链接之后我的网页不是就没有了吗?  这么一来,他就很可能忘记再回来了啊.
看来要想点办法.让他没法从当前网页打开新链接.

我在[IM路人](http://imluren.com)的一篇文章上找到了方法.原来就是在一个文件上做做手脚就好啦.

找到wp-includes目录下的 comment-template.php,然后找到

    $return = "<a href='$url' rel='external nofollow' class='url'>$author</a>";

在a标签后面添加如下内容

    target='_blank'

*注意啦.*target后面一定要加 单引号. 万不可加双引号.要不然你博客进不去就不要赖我啦.
Update(5-10):上面讲到的方法会因为wp升级而被覆盖.下面的方法不受wp升级影响.

源代码地址 木木[新窗口中打开评论者链接](http://immmmm.com/jquery-notes-open-comment-link-new-window.html)

    $('.commentinfo a').attr({ target: "_blank"});
