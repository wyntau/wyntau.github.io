---
layout: post
title: 修改philna2主题之文章几处更新
pid: 103
comments: true
tags: [PhilNa2, WordPress, 原创]
categories: [WordPress]
---
## 第一个就是最重量级的更新
关于给philna2主题添加自定义导航菜单.此前在[PhilNa2增加自定义导航菜单](/2011/04/philna2-add-nav-menu.html)中讲到了怎么添加.但是由于我在取经的时候没有认真看.把修复bug的语句忘记.导致出现了一个很大的Bug,自由的风 在他的博文中已经给出了解决方案.即修改app/template.php中的philnaCreateTitle函数，注释掉以下语句即可

    add_filter('wp_insert_post_data','philnaCreateTitle');

否则在添加栏目的时候会出现意外情况.具体情况是什么,怪我嘴笨,不会说,你可以在本地环境试验一下.
这样基本上就达到了完美了.为什么说基本上完美呢?因为还有更新嘛,这篇文章的标题就是基础更新.当然要有点东西啦.

这个更新到灵感来自 木木(此木木为林木木)的[WordPress 3.0 导航菜单简易添加](http://immmmm.com/easy-use-wordpress-nav-menu.html)
在这篇文章中 木木提到使用了自定义参数,将导航菜单的ID变为`#menu`,而我看到给philna2主题添加导航菜单的时候也有类似的语句,那为什么我不能把导航菜单的css换成已经有的呢?因为在philna2主题的css文件中是有给*navigation*使用的预设css样式的,因为在没添加导航菜单之前就是用的这个样式.具体的样式自己在css中查找`#header .navigation`即可.

所以试验一下吧.结果真的可以.嘿嘿.而且效果和原来的导航菜单效果一模一样.那当然就用yinheli同学写的css了.原配的才好嘛.
少说废话.说说具体方法.
将[PhilNa2增加自定义导航菜单](/2011/04/philna2-add-nav-menu.html)中的一下代码

    <div id="menu">
        <?php wp_nav_menu(array( 'theme_location'=>'primary','container'=> 'ul','container_class' => 'primary','menu_class'=> 'menunav')); ?>
    </div>

换成

    <?php wp_nav_menu(array( 'theme_location'=>'primary','container_class' => 'navigation')); ?>

这样做完后,在[PhilNa2增加自定义导航菜单](/2011/04/philna2-add-nav-menu.html)中提到的那一大砣 css代码也可以扔掉了.

**注意** 经Japhia童鞋提醒.忘记说了一定要在后台重新添加一个菜单才可以.  具体步骤: 后台菜单->新建菜单->左侧的主题位置,选择头部导航栏.做完后记得保存哦.
感谢[Japhia](http://japhia.info)童鞋的白鼠试验 :evil:

呼呼,这次就更清爽了. 这样的导航菜单才可以成为**完美**的导航菜单嘛.
## jQuery上下浮动滚动
[jQuery上下浮动滚动](/2011/04/jquery-scroll-up-and-down.html)的小更新,也可以说是另外一种滑动导航了.
灵感来源同样是木木的文章[滑动导航终结版](http://immmmm.com/sliding-navigation-final-version.html)
在此文章中,木木实现的效果是 导航图标静止,鼠标放在图标上就会自动慢慢上升或者下降.点击一下后快速到达顶部或底部.我感觉这个显得更朴素一点吧,但是功能并不少,所以把我使用的滑动导航就换了.

将以下代码 取代 [jQuery上下浮动滚动](/2011/04/jquery-scroll-up-and-down.html) 中的相应代码.然后再修改一下导航图标对应的ID号,最后需要修改的是css文件部分.将**#updown**的position改为**fixed**,就可以固定在页面上了.其他具体的你可以试着改一下那些时间参数,让速度变得快些或者慢些

    jQuery(document).ready(function($){
    $body=(window.opera)?(document.compatMode=="CSS1Compat"?$('html'):$('body')):$('html,body');//修复Opera滑动异常地，加过就不需要重复加了。
    $('#shang').mouseover(function(){//鼠标移到id=shang元素上触发事件
            up();
        }).mouseout(function(){//鼠标移出事件
            clearTimeout(fq);
        }).click(function(){//点击事件
            $body.animate({scrollTop:0},400);//400毫秒滑动到顶部
    });
    $('#xia').mouseover(function(){
            dn();
        }).mouseout(function(){
            clearTimeout(fq);
        }).click(function(){
            $body.animate({scrollTop:$(document).height()},400);//直接取得页面高度，不再是手动指定页尾ID
    });
    $('#comt').click(function(){
        $body.animate({scrollTop:$('#comments').offset().top},400);//滑动到id=comments元素，遇到不规范的主题需调整
    });
    });
    //下面部分放jQuery外围，几个数值不妨自行改变试试
    function up(){
       $wd = $(window);
       $wd.scrollTop($wd.scrollTop() - 1);
       fq = setTimeout("up()", 50);
    }
    function dn(){
       $wd = $(window);
       $wd.scrollTop($wd.scrollTop() + 1);
       fq = setTimeout("dn()", 50);
    }

## 收缩功能
最后一个就是今天新加的效果,收缩功能.灵感同样来源于木木的博文[《WordPress 短代码之——Toggle 伸缩》](http://immmmm.com/wordpress-shortcodes-toggle.html),但是代码来源却并非此处.因为本来打算使用一下那里面的代码收缩功能,无奈本人能力有限,对文章中的代码无法领悟,不会使用,因此就作罢了.

可是这个效果很好.所以到网上收缩了一下toggle函数,所以就找到了今天的这个收缩功能的代码.来源网站 [一行代码实现WordPress评论折叠](http://hi.baidu.com/lht168/blog/item/b41c800a46091b1495ca6b1f.html) ,看题目就知道很简单.确实是只利用一行代码就实现了 折叠和展开.

按照那篇文章中说的,在**comments.php**中可以找到了**ol id="comments"**的语句.因此这行代码就可以在本主题使用.

    <a style="cursor:pointer" onclick="jQuery('#comments').toggle();">折叠评论</a>

找到地方,将这个代码放上.刷新一下.OK!效果很好嘛.

说说代码的参数.toggle是个函数,效果是我的**隐藏侧栏**(具体效果点击右上角的"关闭侧边栏")的类似效果,如果在括号中填写数值的话,就是以多少毫秒完成动作.
我没有使用这个效果,使用的是木木的《短代码之——Toggle 伸缩》中的上下伸缩效果.即slideToggle.

**注意**此处要区分大小写.否则函数会无效. 这样修改完,收缩评论的时候就是上下收缩了(点击评论上方的折叠评论看看效果?)

看着这代码如此简单.何不拿来多多用几个地方?所以更改一下,放到loop.php里面,将comments换成**#content .post_conten**t,然后刷新一下,首页的文章就有效果了.我在首页使用的是toggle函数.让他左右收缩.貌似效果很赞.嘿嘿.

做完这个我还想,要是首页文章 默认全部折叠不是更好吗? 记得在javascript教程里面有一个功能是,在body后面,添加onload="function"的功能,所以我把这行代码放到了这里面.
结果出来后,首页是全部收缩了.但是随之而来的是,所有的独立页面也全部收缩了.而且网速慢的情况下,会看到所有的文章先是展开状态.等网页文件加载完成后才收缩起来,和我要的结果不一样.所以先去掉吧.
如果谁知道该怎么实现这个效果,还请多多指教啊.
