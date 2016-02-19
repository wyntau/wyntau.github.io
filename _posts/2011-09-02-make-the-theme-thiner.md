---
layout: post
title: 对主题适当精简
pid: 214
comments: true
tags: [Themes, WordPress]
categories: [WordPress]
---
最近对自己用的主题有点不满意了,于是处理一下.将一些用不着的功能去掉,也算是对主题载入速度加快一点吧.

**第一个是关闭侧栏的功能**

我发现有了这个功能,也没有多少次使用.还是去掉了吧.相比来说,这个功能的代码量也不少,所以去掉的话,应该对速度有不少帮助.

`SayMeMod.js`中的以下内容去掉

	(function() {
		function SetCookie(c_name, value, expiredays) {
			var exdate = new Date();
			exdate.setTime(exdate.getTime() + expiredays * 24 * 3600 * 1000);
			document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "": ";expires=" + exdate.toGMTString()) + ";path=/"
		}
		window['RootCookies'] = {};
		window['RootCookies']['SetCookie'] = SetCookie
	})();//SetCookie函数
	$('#close-sidebar').click(function() {//关闭侧栏
		RootCookies.SetCookie('show_sidebar', 'no', 30);
		$('#close-sidebar').hide();
		$('#show-sidebar').show();
		$('#sidebar').fadeOut(500);
		window.setTimeout(function() {
			$('#content,#content2,#content3,#footer').animate({
				width: "920px"
			},
			1000)
		},
		500)
	});
	$('#show-sidebar').click(function() {//显示侧栏
		RootCookies.SetCookie('show_sidebar', 'no', -1);
		$('#show-sidebar').hide();
		$('#close-sidebar').show();
		$('#content,#content2,#content3,#footer').animate({
			width: "662px"
		},
		800,
		function() {
			$('#sidebar').fadeIn(500)
		})
	});

`template.php hack archive.php links.php message.php page.php`文件中的以下内容去掉

	<div id="top_right">
	        <ul id="menu-top_right">
			<?php if(!$_COOKIE['show_sidebar']=='no'):?>
				<li id="close-sidebar" title="显示/关闭侧边栏"><a>关闭侧边栏</a></li>
				<li id="show-sidebar" style="display:none;"title="显示/关闭侧边栏"><a>显示侧边栏</a></li>
			<?php else: ?>
				<li id="close-sidebar" style="display:none;" title="显示/关闭侧边栏"><a>关闭侧边栏</a></li>
				<li id="show-sidebar" title="显示/关闭侧边栏"><a>显示侧边栏</a></li>
			<?php endif;?>
	        	<?php if($_COOKIE['show_sidebar']=='no'): ?>
	<style type="text/css">
	#content,#content2{width:920px;}
	#footer {width:920px;}
	#sidebar {display:none;}
	</style>
			<?php endif; ?>
		</ul>
	</div>

css中以下内容去掉

	/*close sidebar*/
	#top_right { display: block; padding: 0;height: 25x; float:right;}
	#top_right ul {float:right; margin: 0; padding: 0; position: relative;}
	#top_right ul *:hover { background-color: #666; color: #FFF; cursor:pointer;}
	#top_right ul a {display: block; color: #999; font-size: 12px; padding: 3px 15px 3px; margin: 0;}
	#top_right ul li { display: block; list-style: none; float: left; position: relative; margin-bottom:0; }

**第二个是社会化分享函数**,我反正从来不用,也没见过别人用.

`SayMeMod.js`中的以下内容去掉

	function getParamsOfShareWindow(width, height) {
		return ['toolbar=0,status=0,resizable=1,width=' + width + ',height=' + height + ',left=', (screen.width - width) / 2, ',top=', (screen.height - height) / 2].join('')
	}
	function bindShareList() {
		var link = encodeURIComponent(document.location);
		var title = encodeURIComponent(document.title.substring(0, 76));
		var source = encodeURIComponent(lang.blogName);
		var windowName = 'share';
		var site = blogURL;
		jQuery('.twitter').click(function() {
			var url = 'http://twitter.com/home?url=' + link + '&text=' + title;
			var params = getParamsOfShareWindow(500, 375);
			window.open(url, windowName, params)
		});
		jQuery('.renren').click(function() {
			var url = 'http://share.renren.com/share/buttonshare?link=' + link + '&title=' + title;
			var params = getParamsOfShareWindow(626, 436);
			window.open(url, windowName, params)
		});
		jQuery('.sina').click(function() {
			var url = 'http://v.t.sina.com.cn/share/share.php?url=' + link + '&title=' + title;
			var params = getParamsOfShareWindow(607, 523);
			window.open(url, windowName, params)
		});
		jQuery('.t_qq').click(function() {
			var url = 'http://v.t.qq.com/share/share.php?title=' + title + '&source=' + source + '&url=' + link;
			var params = getParamsOfShareWindow(642, 468);
			window.open(url, windowName, params)
		});
		jQuery('.qzone').click(function() {
			var url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + title + '&url=' + link + '&site=' + site;
			var params = getParamsOfShareWindow(634, 668);
			window.open(url, windowName, params)
		})
	}
	bindShareList();

`loop.php`中的以下内容去掉

	<?php if(is_single()):?>
		<div class="share clearfix right"><span>分享到</span>
	 		<span><a class="t_qq" title="分享到腾讯微博"></a></span>
	 		<span><a class="sina" title="分享到新浪微博"></a></span>
	 		<span><a class="twitter" title="分享到Twitter"></a></span>
	 		<span><a class="renren" title="分享到淫淫网"></a></span>
	 		<span><a class="qzone" title="分享到扣扣空间"></a></span>
		</div>
	<?php endif;?>

`style.css`中的以下内容去掉

	/* 这是分享部分的样式代码 */
	.share span{float:left;}
	.share a{cursor:pointer;background:url("images/icon2.gif") no-repeat 0 0;display:block;padding:0 0 0 18px;height:16px;line-height:16px;color:#0066CC;overflow:hidden;margin:2px 0 0;text-decoration:none;float:left;}
	.share a:hover{color:#E05C23;}
	.share .twitter{background-position:0 -16px;}
	.share .renren{background-position:0 -32px;}
	.share .qzone{background-position:0 -48px;}
	.share .t_qq{background-position:0 -64px;}

另外又去掉了两个原来已经废掉不用的函数代码,.以及在philna2.js中的函数调用.
`syntaxslide()`和`welcome_msg()`

现在应该代码量就少了一点了,或许有空继续精简一下.现在不明白,原来我干嘛加这么多的东西呢?现在去掉我都嫌麻烦.
