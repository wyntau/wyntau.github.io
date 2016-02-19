---
layout: post
title: 转-wp_list_categories详细介绍
pid: 32
comments: true
tags: [WordPress]
categories: [WordPress]
---
今天网上闲逛,又看到了关于我说的那个[把PhilNa2分类添加到导航菜单](/2011/04/30-philna2-add-category-to-navigation-menu.html)里面的wp\_list_categories()函数的一些文章.里面的很多参数 我都还不知道是 干嘛的.

今天碰到了一个我自认为讲的很全的.所以先转过来.以后可能还要继续折腾一下.
转载地址[SEO笔记](http://www.seonote.net/basic/details-wp_list_categories.html)

以下为原文内容.

Wordpress是用wp_list_categories这个函数来显示分类的，其用法是:

*wp\_list_categories基本介绍：*

&lt; ?php wp_list_categories('arguments'); ?&gt;

*arguments*即参数，默认参数设置为：

$defaults = array(

'show_option_all' =&gt; ”, 不列出分类链接

'orderby' =&gt; 'name', 按照分类名排序

'order' =&gt; 'ASC', 升序排列

'show_last_update' =&gt; 0, 不显示分类中日志的最新时间戳

'style' =&gt; 'list',列表显示分类

'show_count' =&gt; 0, 不显示分类日志数量

'hide_empty' =&gt; 1, 不显示没有日志的分类

'use_desc_for_title' =&gt; 1, 显示分类描述

'child_of' =&gt; 0, 不限制子分类

'feed' =&gt; ”, 不显示feed

'feed_image' =&gt; ”, 不显示feed图片

'exclude' =&gt; ”, 不显示该分类

'hierarchical' =&gt; true, 分层次显示父/子分类

'title_li' =&gt; __('Categories'), 用“Categories”为当前分类列表的标题

'echo' =&gt; 1, 显示(echos) 分类

'depth' =&gt; 0 不限制列表深度

);

*wp\_list_categories用法举例：*

- 按照分类名排序，并只显示 ID 为1、2、3和4的分类：  
    &lt; ?phpwp_list_categories('orderby=name&amp;include=1,2,3,4′); ?&gt;
- 按照分类名排序，并显示每个分类的日志数，但不显示 ID 为10的分类   
    &lt; ?phpwp_list_categories('orderby=name&amp;show_count=1&amp;exclude=10′); ?&gt;
- 显示或隐藏列表标题title\_li 这个参数用于显示或者隐藏分类列表的标题，它的默认值为'(\_\_('Categories')'，即显示分类列表的标题，如果不设置或设置为空，它将什么也不显示。下面的例子将不显示id为4和7的分类，并不显示list\_categories列表的标题：  
    &lt; ?phpwp\_list\_categories('exclude=4,7&amp;title\_li='); ?&gt;
- 接下来的例子是仅仅只显示 ID为5、9和23的分类，并且列表标题显示为“Poetry”表：  
    &lt; ?phpwp\_list\_categories('include=5,9,23&amp;title_li=' . \_\_('Poetry') . ” ); ?&gt;
- 仅显示某个分类下的子分类下面的示例代码生成了 ID 为8的父分类下的子分类根据其 ID 进行排序的链接列表，它会显示每个分类下的文章数，并且隐藏链接的 title 标签中的分类描述，注意：如果父分类下没有任何文章，那么父分类将不会显示（读起来貌似很难理解，不过照着做就理解了）  
    &lt; ?php wp\_list\_categories('orderby=id&amp;show\_count=1&amp;use\_desc\_for\_title=0&amp;child\_of=8′); ?&gt;
- 显示带有 RSS Feed 链接的分类列表面代码根据分类名对分类列表排序，并显示每个分类下的文章数和 RSS 的 Feed 链接：  
    &lt; ?phpwp\_list\_categories('orderby=name&amp;show\_count=1&amp;feed=RSS'); ?&gt;
- 还可以使用 RSS 图标代替 RSS 链接  
    &lt; ?phpwp_list_categories('orderby=name&amp;show\_count=1&nbsp;&amp;feed_image=/images/rss.gif'); ?&gt;

原文就是这么多.还想继续弄这个的童鞋麻烦去网上问问google去吧.

