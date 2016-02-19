---
layout: post
title: "[PhilNa2]some chinese please"
pid: 120
comments: true
tags: [PhilNa2, WordPress, 原创]
categories: [WordPress]
---
今天又看到了垃圾评论.自从我使用wp之后,虽然来的垃圾评论不多,但是也挺烦人的.都是些纯英文评论,关于loan的,关于credit的,干嘛的都有.
但是邮箱 网址神马的都是无效的.所以打算把这些英文评论挡在外面.

![](/uploads/2011/05/08_02.png)

网上人用的最多的是willin kan大师的 anti spam小墙,无奈此主题不能使用.况且我的垃圾评论不像其他人那样一来几百条的规模.
我只想把 那些纯英文评论挡住就行了.

记得原来在网上闲逛的时候 看到过some chinese please之类的东西.所以我就去搜了下,看到了some chinese please这个插件.下载到本地后试验了一下.挺好用的.但是我不太喜欢插件.于是想找代码实现的方法.

网上搜到的代码,有修改wp源文件的.有添加functions.php的.代码是找到了,但是我好像都不能用,或者说和我用的主题结合的不好

原因:像我现在的主题.如果评论框里面不输入任何东西提交的话,就会弹出对话框提醒.但是用上那些代码后,就只是在评论下方列上一个标记.
如下图,感觉不太好看.

![](/uploads/2011/05/08_03.png)

所以看看怎么改一下.既然不输入东西的时候会提示.那么就按照那个提示代码的形式改一下.

好像此主题提交评论用不到wp文件夹里面的wp-comments-post.php,我不是很确定,但是确定的是,会用到主题文件中的commentajax.php.
我看到主题的commentajax.php中有好多提示.而且用的是

    fail(__('The post is in trash box', YHL));

这样的格式.
所以依葫芦画瓢,将代码更改.原来的代码中提示前面用的是wp_die,原代码如下:

    function scp_comment_post( $incoming_comment ) {
        $pattern = '/[一-龥]/u';

        // 禁止全英文评论
        if(!preg_match($pattern, $incoming_comment['comment_content'])) {
            wp_die( "You should type some Chinese word (like "你好") in your comment to pass the spam-check, thanks for your patience! 您的评论中必须包含汉字!" );
        }
        return( $incoming_comment );
    }
    add_filter('preprocess_comment', 'scp_comment_post');

我改成此主题中特有的fail的样式
*注意:*我改成了此主题特有的格式.因此下面的代码就只有philna2主题可以使用了,*各位注意!!*

    function scp_comment_post( $incoming_comment ) {
        $pattern = '/[一-龥]/u';
        // 禁止全英文评论
        if(!preg_match($pattern, $incoming_comment['comment_content'])) {
             fail(__( "You should type some Chinese word (like "你好") in your comment to pass the spam-check, thanks for your patience! 您的评论中必须包含汉字!" ));
        }
        return( $incoming_comment );
    }
    add_filter('preprocess_comment', 'scp_comment_post');

*具体使用方法:*将上面的代码放到functions.php中,然后就可以啦.试验一下.只输入英文字符,点击提交就会提示你要输入英文.

*效果如下图*

![](/uploads/2011/05/08_04.png)

那个提示语你可以自己看着修改.

原插件还有后台设置神马的,现在我弄完后,也没有后台设置,评论框下面也没有提示,感觉还不错.嘿嘿.

呵呵.也算是弄了一个东西.以后大家再评论的时候就不能只输入表情或者英文啦.要注意哦 :eek:  :evil:

*注:*本文中的代码来源 [露兜博客](http://www.ludou.org/wordpress-simple-way-to-anti-spam.html),表示感谢,同样感谢some chinese please插件的作者[冰古](http://bingu.net),因为所有的这些代码都是从some chinese please插件中提取出来的.
