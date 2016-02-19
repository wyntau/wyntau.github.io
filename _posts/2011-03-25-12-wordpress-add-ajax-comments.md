---
layout: post
title: wordpress添加AJAX评论效果(非插件版)
pid: 12
comments: true
tags: [WordPress]
---
**由于此 篇文章倍受  Spam喜爱,所以关闭 评论,如有问题,请在其他任何地方留言.谢谢**

本文参考了[FORECE'S BLOG](http://www.forece.net/post/2466.htm),在这里表示十分感谢.因为我在网上找了很多的实现评论AJAX效果的代码或者是插件.效果都不理想.只有这一个让我真正的实现了AJAX效果.

唯一不同的是.我把代码提到的那个google的js文件下载到了本地.然后上传到了服务器上.感觉这样比较奥保险一点吧.呵呵.

下面说说我按照文章中提到的做法.由于我使用的是wordpress3.1.所以就直接下载了文章中提到的[comments-ajax-1.3.zip](http://u.115.com/file/f0fc5193ce).

1.下载上面说的zip文件.

2.下载后将里面的文件上传到当前使用的模板所在的目录里面.然后修改模板文件*head.php*.找到以下内容

    <?php if ( is_singular() ) wp_enqueue_script( 'comment-reply' ); ?>
    <?php wp_head(); ?>

用下面的几行代码代替(*我前面说了.我直接把google的那个js文件下载下来放在了服务器上,所以要在调用地址那里改一下,其实.下面的那个comments-ajax.js文件也可以放在一个专门放第三方js文件的地方,这样便于以后管理.*)

    <script type="text/javascript" src="/js/jquery.min.js"></script>
    <?php wp_head(); ?>
    <?php if ( is_singular() ){ ?>
    <script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/comments-ajax.js"></script>
    <?php } ?>

原文中的话(*我不知道什么意思.所以直接粘过来了*):因为 comments-ajax.js 已合併了 WP 的 comment-reply.js, 所以不必再叫用原來的 wp\_enqueue_script( ‘comment-reply’ )
如果你的模板够标准, 这样就可以正常工作了

*Lue注:*"做到这里我保存后,再看效果就可以了.我使用的是mg12的 elegant box主题.感觉还是很标准的.呵呵."

但是原文还给出了 如果不成功的解决方法.应该对有些人很有帮助.所以顺便拿过来.可能以后换主题的时候能用的到.

***以下为原文的文章.我直接粘过来了.***

**如果有任何運行不正常, 請繼續看以下注意事項:**

1.安裝前, 請先確認 WordPress 內置嵌套評論已正常運作. 如果不是內置嵌套評論, 會出問題的.(*注:我的主题支持嵌套评论.所以我没有遇到这个问题*)

2.各式模板設計不同, 請檢查 comments.php 是否夠標準, 儘量不修改模板, 只要對應修改本文件, 以免 css 亂套.

    ◎標準模板是指:
    "評論數" id="comments" (WP 3.0 用的是 id="comments-title")
    例: <h3 id="comments"><?php comments_number( ...有%條評論... </h3>
    已知有不少模板用的不是 "comments", 它的 "comments" 已用到別地方,
    如果評論提交後, 評論數位置出現很多源代碼, 通常是這問題, 要特別留意!
    ps. WP 3.0 用的是 id="comments-title", 新版我已將 "comments" 改 "comments-title",
    如果你要用以前的 "comments", 請在 comments-ajax.js 第 25 行更改.
    "評論列表" id="commentlist"
    例: <ol id="commentlist"> 注意是 ol 不是 ul.
    "表單" id="commentform"
    例: <form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post"id="commentform">
    "評論框" id="respond" (是含 author, email, url, comment)
    例: <div id="respond" ... >
    "評論區" id="comment"
    例: <textarea name="comment" id="comment" ... >
    "提交" id="submit"
    例: <input ... id="submit" ... >
    ※以上所用的 id 標簽是 js 運作的重要關鍵! 請確認與模板對應無誤!

3.本程式主要提供 Ajax comments 功能, css 已儘量配合原模板輸出. 如果還有 css 需求, 請自行修改.

4.在 comments-ajax.php 最下方有評論格式, 若你的 functions.php 有 mytheme_comment(), 請對應覆蓋, 且拿掉 “回覆” 鏈接.

发现自己的模板就不是标准版的。。。修改了一下才搞定了~
