---
layout: post
title: PhilNa2增加自定义导航菜单
pid: 86
comments: true
tags: [PhilNa2, WordPress]
categories: [Wordpress]
---
使用PhilNa2主题的人肯定一直都梦想着能够添加自定义导航菜单吧.这样我们就可以随便添加自己想要的栏目,不管是内链还是外链.据我所知,大部分童鞋使用的都是 新建一个页面,然后使用**page link to**插件改写那个页面的链接,然后连接到一个新的地方.
今天我就给你们一个解放.

再说方法之前,首先要万分感谢 此方法的发明者.[自由的风](http://loosky.net/),一位非常厉害的博主,大家可以去他的博客看看,自由的风大公无私的把自己修改的接近完美的私用PhilNa2主题贡献了出来.

当我在慢慢修改PhilNa2主题的时候无意间看到了 博主的主题,而且是功能异常强大的主题哟.侧栏可以关闭.而且还实现了我在[纠结于WP主题](/2011/04/46-entangled-in-the-wp-theme.html)中提到的想要把首页文章 隐藏以来,等到想要进一步看的时候才显示出来的效果.还有集成了[知更鸟](http://zmingcx.com/)的HotNews Pro 主题中侧栏上的最新文章,最近文章,热门文章的显示效果.还有好多新的页面模板.这些我们都可以积极学习一下哦.

好了,广告到此结束.有兴趣的同学可以去看看哦.你一定会喜欢的.

下面说说正题吧,就是给PhilNa2主题添加自定义导航菜单的问题.这个是我在自由的风的博文中看到的.但是博主没有在博文中提到是怎么添加的.于是我就接连给博主发了好几封邮件请求博主能够共享一下主题或者教一下修改主题的方法,可能是我感动了博主或者是博主被我问烦了吧, :jiong: ,正好博主在我发邮件前的几天在wp中文论坛上 发了一个帖子说准备发布自己修改的主题了.可能我的邮件起了加速的作用.所以博主就很快发布了自己修改的主题,同时给我发了邮件告知(看看这位博主多好.没有忘记俺.感动ing :cry: ).

于是我马上下载了主题进行一番研究.虽然新发布的主题里面有好多新鲜的功能.但是我感觉有些地方 我并不是很需要,而且有些地方不是很和我的口味.毕竟现在使用的主题是自己一点一点优化出来的,突然不用很是舍不得.所以打算把自己能用到的,有能力移植的,移植到自己使用的主题上.第一个需要的就是自定义导航菜单功能了.我想这也是众多使用这个主题的人想要急切知道的答案吧.

原来想Mod导航栏的时候费了不少劲,请教了 [路人](http://imluren.com) 童鞋,可是遇到了问题. 还是歪打正着才最终得以解决了.但是那个方法不能调整分类在导航菜单上的顺序和需要显示的条目.所以不是很好. 大家看我现在的导航菜单,是不是看不出什么异样?但是查看网页源代码就能看出和你们的导航菜单的源代码不一样了吧.就是使用了自定义导航菜单的原因.

汗,说了这么多还没有说到真正的方法, :cold: 请大家不要着急.我这人就是性子慢,感觉有好多想说的,不说难受.大家见谅.

正题开始咯.

首先是修改一下当前使用的主题文件,涉及到的文件好像是一个,也可能是多个.大家注意看看吧.
具体文件就是 template.php文件(可能还有那几个页面模板吧.像links.php,contact.php那样的,注意看看吧),这个template.php好像要用FTP工具在主题文件夹里面修改,在后台修改的话.好像看到的template.php的内容没有这句话.
把下面这句话注释掉.

    <?php wp_page_menu('show_home=1&menu_class=navigation'); ?>

变成如下或者直接删掉

    <?php //wp_page_menu('show_home=1&menu_class=navigation'); ?>

这样如果进入网站的时候会看到没有导航栏了,不用着急.解决方法在下面.
在和上面相同的位置添加如下内容

    <div id="menu">
        <?php wp_nav_menu(array( 'theme_location'=>'primary','container'=> 'ul','container_class' => 'primary','menu_class'=> 'menunav')); ?>
    </div>

然后向css中添加如下内容.

    /* Top Menu */
    div.wrapper {  height: 32px;z-index: 333;}
    #menu { margin:0; padding:0;height:32px;}
    #menu .menunav {position:relative;z-index:300; font-size:12px;}
    #menu .menunav li{padding:0;position:relative;z-index:1;height:30px;float:left;position:relative;width:auto; color:#000;display:inline-block;line-height:30px;}
    #menu .menunav li a{color:#000 !important;text-decoration:none;display:block;padding:0 10px; cursor:pointer;}
    #menu .menunav li.current-menu-item a{background-color:#000;color:#FFF !important;text-decoration:none;display:block;padding:0 12px; cursor:pointer;}
    #menu .menunav li a:hover{background-color:#222;color:#FFF !important;text-decoration:none;display:block; cursor:pointer;}
    #menu .menunav > a{display:block}
    #menu .menunav li:hover{text-decoration:none;background-color:#999;color:#FFF !important; cursor:pointer;display:block;}
    #menu .menunav li:hover ul,
    #menu .menunav li.over ul{display:block;overflow:hidden; margin:0px;}
    #menu .menunav ul{position:absolute;top:30px;display:none;padding:10px 0 0px;z-index:300}
    #menu .menunav li ul { margin:0; padding:0; width:100px;background:#999;}
    #menu .menunav li ul li{ width:100px; border-right:none;}

最后在functions.php顶部,即note上面添加如下内容.

    //激活菜单项
    if ( function_exists('register_nav_menus') ) {
        register_nav_menus(array('primary' => '头部导航栏'));
        //register_nav_menus(array('bottom' => '底部导航栏'));
    }

**UPdate:4-21**今天又到自由的风博客上看到了一点东西.怪我原来没有看清楚.呵呵.
修改了philna2中的一个小bug，这会导致在添加菜单的时候出错；
具体在app/template.php中的philnaCreateTitle函数，注释掉add\_filter(‘wp\_insert\_post_data’,'philnaCreateTitle’);即可；
这样到后台菜单看看 是不是就有了添加自定义 导航菜单了?

**OK!! Have a Enjoy!!**扔掉你的更改链接插件吧!!
还有什么不懂的可以问我.

再次感谢 [自由的风](http://loosky.net/)

最后再次做一下广告. [本人搭建的TwiTalker bot](/2011/04/set-twitalker-bot.html) ,免番羽墙发送推特,接收推特信息.欢迎大家Fo [@vinntoe](http://twitter.com/vinntoe)
