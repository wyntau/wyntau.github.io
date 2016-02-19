---
layout: post
title: wordpress的feed输出版权信息
pid: 9
comments: true
tags: [WordPress]
categories: [WordPress]
---
自从 使用上了wordpress 就在一直寻找优化,修改模板的文章.原来在blogger里面的文章版权也只是在模板里面加了一句话而已.

刚上来使用wordpress的时候.我也是在主题文件的single.php里面正文的后面添加了版权信息.但是我在看feed输出的时候.发现并没有版权信息.看人家的feed输出就有.我很纳闷.所以还是要多问问网络啊.呵呵

于是网上搜索一番,真的找到了.他们的做法不是修改single.php文件.而是修改*functions.php*文件.实现的途径不一样啊.

下面说说实现的方法.换主题的时候好直接拿来使用.

到后台点击主题里面的编辑.选择functions.php文件.然后拉到最后.如果不出意外的话.最后应该是以*?&gt;*结尾的.

在*?&gt;*之前插入如下信息(其中的内容按照自己的内容做适当修改):

    //feed版权输出
    function feed_copyright($content) {
    if(is_single() or is_feed()) {
    $content.= "<blockquote>";
    $content.= '<div> 　&raquo; <b>原创文章如转载请注明来源：<a title="左上极限" href="http://lueeon.com">左上极限</a> &raquo; <a rel="bookmark" title="'.get_the_title().'" href="'.get_permalink().'">《'.get_the_title().'》</a></b></div>';
    $content.= '<div>　&raquo; <b>本文链接地址：<a rel="bookmark" title="'.get_the_title().'" href="'.get_permalink().'">'.get_permalink().'</a></b></div>';
    $content.= '<div> 　&raquo; <b>订阅本站：<a title="左上极限" href="http://feeds2.feedburner.com/lueeon">http://feeds2.feedburner.com/lueeon</a></b></div>';
    $content.= "</blockquote>";        }
    return $content;}
    add_filter ('the_content', 'feed_copyright');
    //feed版权输出

*你可以把博客标题还有网址什么的弄成动态的函数调用,也可以直接修改成想要的地址或者是文字.*

做完这些.保存一下.然后再看看文章.是不是就有了版权信息呢?再看看feed输出.也有了版权信息了吧.呵呵

**Update:**最终版详见[PhilNa2主题feed输出版权最终版](/2011/04/42-final-version-feed-output-copyright-information.html)
