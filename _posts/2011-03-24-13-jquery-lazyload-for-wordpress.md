---
layout: post
title: 给wordpress添加图片渐显效果
pid: 13
comments: true
tags: [WordPress]
categories: [WordPress]
---
本文参考了KuKi的懒懒窝,只不过在调用地址的地方.稍微修改了一下.呵呵

看到人家的wordpress都有那个什么图片渐显.很酷.同时对网页加载效果也好.所以也在网上热心人的帮助下.弄出了这个效果下面记录一下.以后换主题的时候直接就拿来用了.

1. 下载 [jquery.lazyload.zip](http://u.115.com/file/f05d729f24)（包含 jquery.lazyload.js 和 fill.gif ）
2. 将上面2文件，放到 wordpress 的某个目录，比如放在 domain.com/js 目录下
3. 在当前主题的  header.php 中适当位置(*我是加在了head.php文件的&lt;!– javascript START –&gt;后面,感觉这里统一加载js文件.效果会更好点*)添加下面 JS调用代码：

        <script type="text/javascript" src="/js/jquery.lazyload.js"></script>
        <script type="text/javascript">
        jQuery(document).ready(
            function($){
            $("img").lazyload({
            placeholder : "/js/fill.gif",
            effect      : "fadeIn"
            });
        });
        </script>

*网上讲的还要改路径.其实在路径上没有必要添加上自己的网址.直接用相对路径就可以了. 看我上面写的.没有我的网址.直接用目录就可以.*

**注意**！！本文中使用的jQ库不能使用google的1.3.2版的mini的jQ库，1.4.2到是可以使用，不过太新太大，不推荐使用。

推荐使用 WordPress 自带的jQ库，文件位于：/wp-includes/js/jquery/jquery.js。

调用方法（可将此段代码加到上面第3步代码之前）：

    <script type='text/javascript' src='/wp-includes/js/jquery/jquery.js?ver=1.3.2'></script>

这样就做完了.保存文件之后重新打开网页就可以看到效果了.呵呵.速度确实快了一点.不知道是不是我的心理原因.呵呵.总之效果挺好的
