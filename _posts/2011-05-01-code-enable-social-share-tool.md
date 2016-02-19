---
layout: post
title: 转-代码实现社会化分享工具
pid: 110
comments: true
tags: [Blog, 转载]
categories: [他山之石]
---
呼呼,五一假期就是好.可以一直上网,没人打扰.因此嘛,我就多转转,找找好东西.这不,又看到了好东西.所以就直接拿来用了.

代码实现社会化分享,这样就不用那些个什么Jiathis 还有 bshare什么的了,使用那些工具的不好的地方就是那样的网站加载起来一般都比较慢,拖慢了网站的整体速度,因此最好的办法就是网站原生带有这些东西.

今天正好找到了这个玩意,因此和大家分享一下.具体效果可以看文章右下角.
原文地址动点创想的[分享条插件](http://www.11reading.com/?post=139),表示非常感谢.虽然作者的网站是emlog的,但是代码是通用的.所以....嘿嘿.

此作者的方法我感觉非常好,不用在页面上写一大堆的代码,把这些代码放到js文件里面加载,节省了空间.(也有人可能不喜欢js,那就自己看着办吧.)
写很麻烦,还是直接转载吧,大家可以去动点创想亲自去看看哟. 只是作者的网站上贴的代码好像有点错误.附件中的代码是正确的,因此我斗胆将附件中的代码替换了原文中的代码

**------------原文开始---------------**
曾几何时，我为了这个分享条工具折腾了好久，刚开始还在我很菜的时候我用过“Jiathis分享道”等第三方平台提供的JS代码，后来自己在网上找独立的JS代码，然后一点点淘汰掉。这个东西，要说确实也没什么大用，几乎没人会点击分享，就算分享到SNS网站，对于带链接的东西几乎也没人点击。不过，我还是乐此不疲。

然后我慢慢总结了一些常用SNS分享站点的地址，比如腾讯微博，QQ空间，人人网等等的share平台地址和格式。偶然的机会在WP大神mg12的博客看到一段jQuery获取网址和文章标题、链接的代码，正好最近看《锋利的jQuery》看到DOM操作，可以用了，然后就诞生了此插件。其实根本不算什么emlog插件，是一个通用的jQuery插件吧。因为做成插件一来必要性确实不大，另外做成插件只能占用相关日志的挂载点，还不如提供一个JS的插件供大家继续折腾呢。下面是具体方法：

首先，为了获取网站的网址和分享文章的标题、链接，我们用jQuery相关方法操作，代码如下：

	/*
		name:分享条工具JS插件
		Author:sprityaoyao
		website:www.11reading.com
		Email:13919361718.cool@163.com
		*/
	jQuery(document).ready(function($){
	function getParamsOfShareWindow(width, height) {
		return ['toolbar=0,status=0,resizable=1,width=' + width + ',height=' + height + ',left=',(screen.width-width)/2,',top=',(screen.height-height)/2].join('');//定义好弹窗样式
	}

	function bindShareList() {
		var link = encodeURIComponent(document.location); // 文章链接
		var title = encodeURIComponent(document.title.substring(0,76)); // 文章标题
		var source = encodeURIComponent('自说Me话'); // 网站名称
		var windowName = 'share'; // 子窗口别称
		var site = 'http://ISayMe.com/'; // 网站链接

		jQuery('.twitter').click(function() {  //DOM操作html的class元素
			var url = 'http://twitter.com/home?url=' + link + '&text=' + title;//分享网址格式
			var params = getParamsOfShareWindow(500, 375);
			window.open(url, windowName, params);//弹出一个窗口中打开页面
		});

		jQuery('.renren').click(function() {
			var url = 'http://share.renren.com/share/buttonshare?link=' + link + '&title=' + title;
			var params = getParamsOfShareWindow(626, 436);
			window.open(url, windowName, params);
		});

		jQuery('.sina').click(function() {
			var url = 'http://v.t.sina.com.cn/share/share.php?url=' + link + '&title=' + title;
			var params = getParamsOfShareWindow(607, 523);
			window.open(url, windowName, params);
		});

		jQuery('.t_qq').click(function() {
			var url = 'http://v.t.qq.com/share/share.php?title=' + title + '&source=' + source + '&url='+ link;
			var params = getParamsOfShareWindow(642, 468);
			window.open(url, windowName, params);
		});

		jQuery('.qzone').click(function() {
			var url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + title + '&url=' + link + '&site=' + site;
			var params = getParamsOfShareWindow(634, 668);
			window.open(url, windowName, params);
		});
	}
	bindShareList();//调用
	});

按照相关注释修改成你的网址和网站名称后，将以上代码按照UTF-8编码保存为share.js，然后再header.php的< head>标签内或者footer.php的< /body>之前引用。
然后，我们还得有分享样式，以下是html代码：

	<div class="share clearfix">
	 <span><a class="t_qq" title="分享到腾讯微博">腾讯微博</a></span>
	 <span><a class="sina" title="分享到新浪微博">新浪微博</a></span>
	 <span><a class="twitter" title="分享到Twitter">Twitter</a></span>
	 <span><a class="renren" title="分享到人人网">人人网</a></span>
	 <span><a class="qzone" title="分享到QQ空间">QQ空间</a></span>
	</div>

将以上代码放在你需要放置的位置，比如echo_log.php的文章末尾处。
当然还得有样式规范，以下是CSS样式代码，放在你模板的css文件即可：

	/*分享到*/
	/* 这是清除浮动的代码 */
	.clearfix:after{content:".";clear:both;height:0;visibility:hidden;display:block;}
	.clearfix{display:inline-block;}
	* html .clearfix{height:1%;}
	.clearfix{display:block;}
	/* 清除浮动代码结束 */

	/* 这是分享部分的样式代码 */
	.share{padding:5px;}
	.share span{float:left;margin:0 15px 0 0;}
	.share span.txt{margin:0;}
	.share a{background:url("images/icon.gif") no-repeat 0 0;display:block;padding:0 0 0 18px;height:16px;line-height:16px;color:#0066CC;overflow:hidden;margin:2px 0 0;text-decoration:none;float:left;}
	.share a:hover{color:#E05C23;}
	.share .twitter{background-position:0 -16px;}
	.share .renren{background-position:0 -32px;}
	.share .qzone{background-position:0 -48px;}
	.share .t_qq{background-position:0 -64px;}

最后，是一个图标了，在附件中提供下载。当然注意CSS代码中的图标路径要匹配。
至此，整个分享条制作完毕，感觉这样是不是舒服多了。呵呵，兼容性嘛，样式完全兼容，但是在IE6下，本来是小窗口新页面显示分享站点的却是整个页面显示了，没什么大问题。这个我只能表示让蛋疼的IE6去死吧，懒得兼容了。最后提供打包好的代码。

---

说明一下.那个icon.gif,由于我的主题文件中已经有了icon.gif文件,因此如果想要再使用的话.就要改名了.我改成了icon2.gif,要不然就会一片难堪哟.呵呵.
另外那个css部分,大家看着自己调整吧.我就不把我调整的拿出来了.想要我的话,自己看源代码. :lol:

文中提到的 附件地址.我上传到了115网盘,点击[此处](http://u.115.com/file/f02c182464)下载.
