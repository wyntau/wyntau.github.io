---
layout: post
title: 侧栏友链3栏显示
pid: 33
comments: true
tags: [PhilNa2, WordPress, 原创]
categories: [WordPress]
---
**注:** 此文章针对我所使用的PhilNa2主题,不保证对所有主题有效. 喜欢钻研的童鞋可以再多问问google还有其他博客.

由于以前没有找到把分类目录还有归档放到导航栏上面的方法.所以一直都是在侧栏上显示.但是这两天这个问题已经解决了.
分类目录放到导航的方法.可以看[把PhilNa2分类添加到导航菜单](/2011/04/30-philna2-add-category-to-navigation-menu.html),把归档放到导航栏上的方法是使用了clean archive reload插件.然后新建了一个页面做成的,具体效果请看[归档](http://isayme.com/archive).

这两个问题解决了.所以侧栏上就空出了左右两个空位(使用PhilNa2主题的童鞋都知道是怎么回事吧),所以我就把友链放在了这里.同时学习了[醉酹寒香](http://japhia.info/博客的做法,把链接和友情分开来显示.但是我好像弄了太多了友情,链接里面只有两个wp官方的链接.所以具体效果就是左右两个侧栏不对称,一个很长,而另一个很短,严重影响美感.所以打算把所有的都放在一个链接目录里面,多栏显示.

说说具体的方法吧. css样式是在[三石映像](http://www.3anshi.com/links-a-variety-of-display.html)找到的,我只是稍微修改了一下宽度.

具体方法我还没弄太懂,好像就是wp\_list\_bookmarks()函数显示的时候的样式问题.看人家的链接总是有*xoxo blogroll*的样式,可是都找不到具体的样式是什么. 我还以为那个xoxo是和xxoo类似的东西呢( :evil:  :???:  好吧.我承认了,我邪恶了).

不说了.我也说不清楚,直接写出来方法吧.

    .blogroll{
    width:243px; //这里我修改成了243.因为我看到css里面的widget的宽度好像是243.
    display:block;
    /*记得清除浮动*/
    overflow:auto;
    /*兼容IE6*/
    zoom:1;
    }
    .blogroll li{
    float:left;
    width:30%;//这里我也修改了
    display:block;
    }

把这段css放到*style.css*里面就好了.然后修改自己的*sidebar.php*,在需要的地方调用*wp\_list\_bookmarks()*函数就行了.

我是在sidebar.php里面隐藏了左右两个侧栏的显示(*加判断只让它们在404页面显示,没直接删除.我怕以后还会用到*),然后再调用wp\_list\_bookmarks()函数就OK了.

**后注:**虽说是改成3栏显示,但是在确定每栏宽度的时候还是遇到了一点小问题.就是blogroll  li属性里面的宽度.要是选择33% 确实是1/3显示,但这是要在后台使用小工具调用链接才会是3栏.直接php文件里面函数调用的时候就成了2栏,而我还想要那个函数调用的时候的随机显示和限制显示数目,所以我才改成了30%,这样就都成了3栏,效果还可以.效果看我下面的侧栏吧.

*附:友情链接函数wp\_list\_bookmarks详解,原文地址请点击*[此处](http://www.wpbus.com/?p=173)

    'orderby' => 'name'
    'order' => 'ASC'
    'limit' => -1
    'category' => ''
    'category_name' => ''
    'hide_invisible' => 1
    'show_updated' => 0
    'echo' => 1
    'categorize' => 1
    'title_li' => __('Bookmarks')
    'title_before' => '<h2>'
    'title_after' => '</h2>'
    'category_orderby' => 'name'
    'category_order' => 'ASC'
    'class' => 'linkcat'
    'category_before' => '<li id="%id" class="%class">'
    'category_after' => '</li>'
    参数的用途：
    categorize
    用于设置连接是否按照各自的分类显示：
    1 （默认，根据链接的分类显示）
    0 （不按照分类，显示全部）
    category
    友情链接的分类ID，将只显示该友情链接分类下的链接，不填默认显示所有链接。
    category_name
    友情链接分类名称，也就是别名，必须用英文。不填默认显示所有链接。
    category_before
    位于链接分类之前的文字或代码。默认的设置是：
    	<li class="”linkcat”">
    category_after
    位于链接分类之后的文字或代码。默认的设置是：</li>
    class
    每一个链接的分类都会有一个 “class” 属性，默认是：linkcat
    category_orderby
    链接分类的排序方式，按照名词或者ID。
    'name' (默认)
    'id'
    category_order
    链接分类的升降序排列方式：
    ASC (默认)
    DESC
    title_li
    链接标题的头文字或代码，默认是：Bookmarks，并且它控制连接是否按照列表的方式排列。
    title_before 和 title_after
    顾名思义，它们就是连接标题头前后的文字或代码，默认是 h2 标签
    show_private
    是否显示私有链接。
    1 (是)
    0 (不是 – 默认)
    include
    输出指定 ID 的 Blogroll 的分类链接，各个 ID 之间用半角的 “,” 分开。默认显示所有的 Blogroll 分类。
    exclude
    将指定 ID 的 Blogroll 分类链接从整个链接列表中排除，各个 ID 之间用半角的 “,” 分开。默认是什么都不排除。
    orderby
    Blogroll 的排列方式（默认是根据名称排序，除非将这个值留空），即根据我们在 WP 后台链接设置界面下的那些参数来进行排序：
    1.'id'
    2. 'url'
    3. 'name'
    4. 'target'
    5. 'description'
    6. 'owner'
    7. 'rating'
    8. 'updated'
    9. 'rel' – 按设定的关系排列
    10. 'notes'
    11. 'rss'
    12. 'length' – 连接名称的长度设定
    13. 'rand' – 随机排列显示
    order
    设置升降序的排列方式
    ASC (默认)
    DESC
    limit
    设置输出链接条数的最大值。默认值是”-1″，输出全部。
    between
    字符串型，每个连接、图片和描述之间的文字或代码，默认是 “n” 换行。
    show_images
    是否允许显示 Blogroll 下链接的对应图片。
    1 (允许 – 默认)
    0 (不允许)
    show_description
    是否允许显示每个链接的描述。
    1 (允许)
    0 (不允许 – 默认)
    show_rating
    是否允许显示链接的等级。
    1 (允许)
    0 (不允许 – 默认)
    show_updated
    是否允许显示最近更新后的时间戳。
    1 (允许)
    0 (不允许 – 默认)
    hide_invisible
    是否显示所有的链接，甚至是被管理员设为不可见的链接，默认允许显示。
    1 (允许 – 默认)
    0 (不允许)
    例如：
    随机显示10条链接：
    <? php wp_list_bookmarks('orderby=rand&amp;limit=10'); ?>
    随机显示分类ID为1的链接：
    <? php wp_list_bookmarks('orderby=rand&amp;category=1'); ?>
