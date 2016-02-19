---
layout: post
title: W1免费版无限翻页
pid: 147
comments: true
tags: [Ajax, jQuery, w1s, WordPress]
categories: [WordPress]
---
效果我这里没有了,想要看的,去winy博客上看吧,很给力哟~~

虽然我撤下了这个效果,但是我还是想说说方法,按照Winysky的博文[无限分页效果](http://winysky.com/unlimited-paging-effects)讲得很清楚了,只要稍微一改jquery的选择器就正常工作了,原因应该是 winy是按照他用的W1说的,此免费版的W1s和收费版的W1p大体结构应该是差不多的啦.

感谢winy最后给我的提示关于翻页后效果不好的修改.
附上Winy的原文,最后再附上我修改后的版本
原文开始

***
使用方法：

**首先**下载 jquery.infinitescroll.js and minified are now on GitHub（官方）
或者从我的站点下载 (大小5kb)

使用方法很简单，加载jQuery库（1.26以上），假设你的首页有如下结构：

    <div id="indexpost">
    <div id="post-xxx">xxx</div>
    <div id="post-xxx">xxx</div>
    ......
    </div>
    <div id="navigation"><a href=""../page/2>下一页</a></div>
当然，因为只需要下一页，分页插件是不需要了，在index.php对应的地方就用默认的分页：
next\_posts\_link(\_\_('MORE'))
在合适的地方加入一段js：（注意更改 对应的选择器适应自己的主题）

    $('#indexpost').infinitescroll({
       //#indexpost 是包括所有文章的div元素id
          navSelector  : "#navigation",
                         // 页面分页元素(成功后隐藏)
          nextSelector : "#navigation a",
                         // 需要点击的下一页链接
          itemSelector : "#indexpost div.post"   ,
                         // 返回后文章对应的插入位置
          loadingImg   : themeurl+"/images/ajax-loader.gif",
                         //加载图片路径（绝对路径）
          loadingText  : "加载中...",
                       //显示的提示文字
          animate      : true,
                       //加载完毕是否采用动态效果
          extraScrollPx: 150,
                      //向下滚动的像素，必须开启动态效果
          donetext     : "后面没有了" ,
                    //返回404，即到头了显示的文字
        },function(arrayOfNewElems){
           home_js();
                //成功后执行的自定义的函数，如页面javascript的重载

     });
这样应该可以实现无限滚屏，就像google reader，到底部自动ajax载入下一页。但这样有时候页面很多，而访客并不想翻页，那么需要一个点击后再加载下页的功能，就像twitter底部点击more的效果。
那么继续在上一段js后加入：

    // 取消scroll绑定
        $(window).unbind('.infscr');
      // 手动点击的元素
        $('#navigation a').click(function(){
          $(document).trigger('retrieve.infscr');
          return false;
        });
        // 如果没有下一页，去掉分页
        $(document).ajaxError(function(e,xhr,opt){
          if (xhr.status == 404) $('#navigation').remove();
        });
还需要设计more按钮的css，例如：

    #navigation{display:block!important; border-radius:10px; -moz-border-radius:10px; -webkit-border-radius:10px; border: 1px solid #ddd; background: #EFEFEF;box-shadow: 2px 2px 2px rgba(50,50,50,0.4); color: #444; text-decoration: none;width:60%;margin:0 0 0 90px; padding: 10px;text-align: center;}
自己可以设计以适应模板，注意“display:block!important;”成功后还要显示下一页的分页链接，不能隐藏。

这样应该就可以了。

***

以上为原文
然后该我说几点了,

1. 文中讲到的那个从官方或者从winy博客下载的js文件. 我没有写链接. 算是我不盗链吧.当然这个也可以不下载. 我提供的修改好的代码中已经包含了.
2. 修改分页代码. 这个位于home.php的最下面.将pagenavi();修改为next_posts_link(__('MORE'))就好了.
3. 对应的选择器的修改也不说了. 我的版本已经修改好了(只对应免费版W1s)
4. 最后的display:block!important;不需要. 要不然效果就会很难看. 我的文件中已经修改了. 再次感谢winy的指导!!
5. 修改后的js文件.将其中的代码. 添加到你的js文件中就好了.点击<a target="_blank" href="http://isayme.com/wp-content/uploads/2011/05/page.js">下载</a>
