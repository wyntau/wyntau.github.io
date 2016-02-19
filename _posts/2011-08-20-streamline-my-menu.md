---
layout: post
title: 精简了导航部分
pid: 207
comments: true
tags: [CSS, PhilNa2, WordPress]
categories: [WordPress]
---
昨天写的是suckerfish下拉菜单的demo,今天我就试着弄 了一下,效果还行,本着折腾别人先折腾自己的精神,所以我就把本站的导航部分换掉了.

由于我博客上原来用的是用js实现的,我又看了下css文件部分,代码也比较多,我改完后,比原来的css少了不少行呢.呵呵.同时我也把那部分js代码给删掉了.

书上讲的挺好的,基本原理就是先将子列表部分绝对定位到-999px,然后使用:hover伪类,上一级li元素hover的时候,再用left:auto让此级ul元素显示即可.

我试着修改的css代码,尽量与原主题的效果一样,只不过,子列表部分我用了横向的,也是想换个样子吧 呵呵

    ul.menu{padding-left:5px;}
    ul.menu,ul.menu ul,ul.menu li{list-style:none;float:left;}
    ul.menu li ul{position:absolute;left:-999px;}
    ul.menu li:hover ul{left:auto;}
    ul.menu a{display:block;color:#222;padding:0.3em 1em;}
    ul.menu li li a{background:#555;color:#fff;}
    ul.menu a:hover,ul.menu a:focus{color:#fff;background:#000;}
    ul li.current_page_item a,ul li.current-menu-item a{color:#fff;background:#000;}
比原来的css部分短了不少吧?

如果想使用的话,将css文件中以 #header .navigation 开头的那部分注释掉就行了.js代码中的导航部分,至于你删不删,我反正删了,节省空间嘛.现在即使禁用掉js,你也可以看到我完整的导航部分了

至于IE6什么的能不能使用非a元素的伪类,我就不知道了.大家赶快使用高级浏览器吧~~我去弄个 Let's kill IE6的脚本去.一来我就给你弹窗.哈哈

另外近期打算清理无用的功能和代码.例如关闭侧栏的功能,还有其它的多余的代码.

下面的是我原来用的css代码,很多吧 呵呵 纪念一下啦.

    #header .navigation{display:block!important;display:inline-block;padding-left:5px;}
    #header .navigation ul li{float:left;list-style:none;margin-right:1px;}
    #header .navigation ul li a{color:#222;padding:3px 6px;display:block;}
    #header .navigation ul ul{position:absolute;}
    #header .navigation ul li.current_page_item a{color:#fff;background:#000;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;}
    #header .navigation ul li.current-menu-item a{color:#fff;background:#000;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;}
    #header .navigation ul li a:hover{color:#fff;background:#222;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;}
    #header .navigation ul li ul{display:none;padding:0;margin:0;}
    #header .navigation ul li li{position:relative;}
    #header .navigation ul li li ul{top:0;left:100%;}
    #header .navigation ul li ul li{float:none;margin:0;padding:0;}
    #header .navigation ul li ul li a{background:#555;color:#fff;width:100px;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;}
    #header .navigation .hover a{background:#555;color:#fff;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;}
