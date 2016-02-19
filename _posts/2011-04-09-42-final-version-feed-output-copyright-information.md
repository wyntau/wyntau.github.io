---
layout: post
title: PhilNa2主题feed输出版权最终版
pid: 42
comments: true
tags: [PhilNa2, WordPress, 原创]
categories: [Wordpress]
---
昨天晚上[Japhia童鞋](http://japhia.info/)问我关于PhilNa2主题 在feed中输出版权信息的问题.主要需求就是将版权信息放在主题自带的相关文章之前.以前在feed中输出版权信息,用的是[wordpress的feed输出版权信息](/2011/03/9-wordpresss-feed-output-copyright-information.html)中讲到的方法,在functions.php中增加函数. 但是此方法无法控制版权信息在feed中的位置.效果出来后排在了相关文章.无觅推荐还有无觅网络的后面,位置很不明显.

于是我就 开始了鼓捣了.我记得在feed中是有相关文章的,肯定是有关函数控制的.于是找到了 主题文件夹中的 *relatedposts.php*文件,在这里面找到了答案.

这里面有一个函数的名字叫作*philnaFeedRelatedPosts*,看名字就知道是在 feed中插入相关文章的了.因此就对它动刀啦.
这个函数的函数主体是

	function philnaFeedRelatedPosts($content){
	if(is_feed())
				{$content .= philnaRelatedPosts('limit=8&excerpt_length=0');}
		return $content;
	}
	add_filter('the_content', 'philnaFeedRelatedPosts', 0);

我们在这里将 判断条件变换一下.改成`if(is_feed()||is_single())`,这样就可以在文章页还有feed中同时输出东西了.然后将[wordpress的feed输出版权信息](/2011/03/9-wordpresss-feed-output-copyright-information.html)中讲到的以`$content.=` 开头的内容 都放在`$content .= philnaRelatedPosts('limit=8&excerpt_length=0');`前面,这样保存后,新建一篇文章测试一下.再看feed输出 应该就有效果了.版权信息处在相关文章的前面.

最后作一下修缮工作. 首先,functions.php里面的那个函数可以光荣下岗了.直接删除.然后把*philnaFeedRelatedPosts*函数中的`{$content .= philnaRelatedPosts('limit=8&xcerpt_length=0');}`再*加个判断*,让他只在feed中显示(你应该不想在文章页也同时显示相关文章,因为文章下面已经有主题作者做好的相关文章啦.)

*Update:*:jiong: 我吃饱了撑的,直接在if(is\_feed())前面添加要增加if(is\_feed()||is_single())函数不就好了吗? 想弄的童鞋别犯我这样的错误了. 其实出这样的笑话都是 一边修改一边测试的原因,怕出现问题,所以每次只改一点,才闹了这样的笑话. :lol:

最后贴一下 我的philnaFeedRelatedPosts函数,大家对照着看一下,就会更明白啦.

	function philnaFeedRelatedPosts($content){
		if(is_feed()||is_single()){
			$content.= '<div><p class="copyright_info no_webshot"> 　&raquo; <b>原创文章如转载请注明来源：<a title="I Say Me | 我说我自己 | 我说世界" href="http://ISayMe.com">自说Me话 &#8482;</a> &raquo; <a rel="bookmark" title="'.get_the_title().'" href="'.get_permalink().'">《'.get_the_title().'》</a></b>
			　&raquo; <b>本文链接地址：<a rel="bookmark" title="'.get_the_title().'" href="'.get_permalink().'">'.get_permalink().'</a></b>
			　&raquo; <b>欢迎订阅本站：您可以选择通过<a href="http://feeds2.feedburner.com/ISayMe.com" target="_blank">RSS阅读器订阅</a>或者通过<a href="http://feedburner.google.com/fb/a/mailverify?uri=isayme" target="_blank">邮件E-mail订阅</a></b>
			<strong class="icon">声明:</strong><b>如無特別申明,文章均為博主原創并遵循<a title="署名-非商业性使用-相同方式共享3.0共享协议" href="http://creativecommons.org/licenses/by-nc-sa/3.0/deed.zh" target="_blank" rel="external nofollow">署名-非商业性使用-相同方式共享3.0</a>. 转载请注明转自<a title="I Say Me | 我说我自己 | 我说世界" href="http://ISayMe.com" rel="bookmark inlinks"> 自说Me话 &#8482;</a></b></p></div>';}
			if(is_feed())
				{$content .= philnaRelatedPosts('limit=8&excerpt_length=0');}
		return $content;
	}
	add_filter('the_content', 'philnaFeedRelatedPosts', 0);

在这里感谢Japhia童鞋 童鞋了.要不是他问我,我也想不起来去鼓捣一下这个feed中的版权信息的位置. :evil:
