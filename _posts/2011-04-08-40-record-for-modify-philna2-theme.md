---
layout: post
title: PhilNa2主题修改优化细节记录
pid: 40
comments: true
tags: [PhilNa2, WordPress, 原创]
categories: [Wordpress]
---
一直都是把这个放在了 [关于](http://isayme.com/about) 页面里面,但是觉得放在那里面始终不是个办法.早点独立出来吧.

**博客修改细节记录**

* <a href="/2011/03/23-new-target-for-commenter-links.html" target="_blank">修改评论者链接从新窗口打开</a>
* <a href="/2011/04/24-increase-the-expression-of-wp.html" target="_blank">在wp默认表情的基础上添加了海绵宝宝的表情</a>
* 增加两个css样式,用于链接页面的博客链接界线
* <a href="/2011/03/9-wordpresss-feed-output-copyright-information.html" target="_blank">文章和feed最后添加版权说明</a>
* <a href="/2011/03/8-non-plug-in-to-achieve-pagenavi-page.html" target="_blank">非插件实现pagenvi翻页</a>
* 修改侧栏,增加最新文章和随机文章同时显示(原本是随机文章还有最新评论只有在侧栏无小工具的时候才会有效果
* 去掉前台 Wordpress 本身的 jQuery.js 加载(参考<a href="http://imluren.com">IM路人</a>).打开/wp-includes/script-loader.php文件，查找“jquery.js”字符串，大概在第120行能找到这么一句：

        $scripts->add( 'jquery', '/wp-includes/js/jquery/jquery.js', false, '1.4.4');
加上判断，变为：

        if(is_admin()){$scripts->add( 'jquery', '/wp-includes/js/jquery/jquery.js', false, '1.4.4');}
    *Update:*我把归档页面换成了cleanarchivereload插件,选择只在归档页面才加载script文件,发现首页已经不再加载这个jquery.js文件了.如果做了上面的步骤,就会使插件的滑动效果失效.所以还是恢复了  
    *Update(4-28):*还是去掉了加载此文件,因为我已经不再使用上述插件  
    *Update(4-6):*将cleanarchive reload插件也去掉了.使用一个单独的页面.具体方法点击[此处](/2011/04/36-non-plugin-for-archive-page.html)
* 给留言框增加简单编辑器,参考[IM路人](http://imluren.com),涉及到的文件是 新建一个js文件并用js.php加载. 增加css样式,在commentform.php文件中增加相应的调语句.(css样式偷了IM路人的.  :evil:  :eek: )
* 将此主题的分类添加到导航栏.具体方法点击[此处](/2011/04/30-philna2-add-category-to-navigation-menu.html)
* 网站上方添加[[万戈牌工具条](http://wange.im),源 为<del datetime="2011-04-08T11:52:04+00:00">我的微博</del>.
    *Update:*我已经决定还是不用工具条了.
* .更改[侧栏友情链接为3栏显示](/2011/04/33-three-column-friends-sidebar.html),侧栏新浪微博加判断,单独页面不显示
* 给后台编辑器添加表情,具体方法点击[此处](/2011/04/34-add-expression-to-editor-background.html)
* 给评论框的[编辑器添加syntax按钮](/2011/04/35-modify-comment-editor-note.html),以后可以输入代码了
* 修正右上角搜索框错位问题
* 留言板增加读者墙功能.纯css使鼠标放上去图片放大.具体方法点击[此处](/2011/04/39-pure-css-on-mouse-larger-picture.html)
* 添加滑动导航条,效果见文章页左侧.使用了[狼图腾](http://erick.im/)的图标,在这里表示感谢.
* **重大更新!** philna2主题添加自定义导航菜单支持.代码来源:[自由的风](http://loosky.net/),表示万分感谢.随意添加站外链接.排列顺序
* 淡入淡出隐藏侧边栏.参考来源[捣鼓笔记](http://www.dao-gu.com/web/jquery-display-sidebar.html)
* 添加 搜索框.评论框自动获取焦点
* 首页文章收缩,文章页上一篇 下一篇链接点击无效解决办法,修改philna2.js文件.给其中的ajax翻页函数添加#content2的选择器即可.
    首页添加"折叠本文"链接
* 侧边栏tab切换,具体方法点击[此处](/2011/04/philna2-sidebar-tab-switch.html)
* 评论楼层前4层标注具体名称:沙发,藤椅,板凳,地板,添加"点击评论者头像回复评论"
* 文章页面折叠相关文章,折叠无觅推荐.
* 读者墙换用新代码,添加血条显示,评论最多者满血 :lol:
* 去掉首页文章ajax翻页.具体的简单做法为给首页的翻页框的pagenavi的id更名,然后补充一个和pagenavi相同的css样式即可.
* 边框以及评论者头像添加圆角效果.同时评论表情添加 hover倾斜效果.
* 集成 [some chinese please插件](/2011/05/code-some-chinese-please.html)效果.
* 集成 willin kan大师的 [Anti Spam小墙](/2011/05/anti-spam-works.html), 经过修改使之能够在此主题正常使用.
* 全站图片添加lazyload效果,你发现了吗?
* 文章下方,集成社会化分享按钮.实现方法点击[此处](/2011/05/code-enable-social-share-tool.html)
* 代码访问随机日志,方法点击[此处](/2011/05/code-for-random-posts.html) 效果见侧栏[随便看看](http://isayme.com/?random)
* wordpress登录失败提醒,具体方法点击[此处](/2011/05/wp-login-failed-notify.html)
* 更改wp默认表情图片位置,防止wp升级图片文件被覆盖点击[此处](/2011/05/change-smilies-dafult-dir.html)
* 评论框添加实时计数功能,代码来源 [木木](http://immmmm.com/comments-words-statistics-by-jquery.html)
* wordpress升级到3.1.2.[\[WP3.1.2\]完美自动保存,禁用版本控制](/2011/05/perfect-autosave-disable-version-control.html)
* 添加短代码支持以及mp3播放器.后台快速添加mp3文件地址,详情点击[此处](/2011/05/backeditor-add-audio-button.html)
* 修复不能使用comment mail notify的bug,以后想要使用的时候直接换上代码即可
* 集成slimbox效果特效.压缩全站js文件.
* 开启[Gzip压缩](http://kan.willin.org/?p=1318)
* 使用willinkan大师的头像缓存代码.
