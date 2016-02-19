---
layout: post
title: Chrome下载页面小效果一个
pid: 251
comments: true
tags: [Chrome, JavaScript]
categories: [互联网络]
---
起因:最近几次下载chrome的时候看到chrome的logo,鼠标放上去竟然有奇特效果,所以自己搞下来玩玩.

下面是demo,仅限Chrome.鼠标放上去就可以看到效果了

<img id="logo" src="/uploads/2012/11/17_01.png" alt="chrome" style="width: 123px;cursor: pointer;">
<script type="text/javascript">
	var _pro1 = 0,
		_logo = document.getElementById('logo');
	function demo(){
		_style = 'width: 123px;cursor: pointer;-webkit-mask: -webkit-gradient(radial, 17 17, ' + _pro1 + ', 17 17, ' + (_pro1 + 15) + ', from(rgb(0, 0, 0)), color-stop(0.5, rgba(0, 0, 0, 0.2)), to(rgb(0, 0, 0)));';
		_logo.setAttribute('style',_style);
		_pro1++;
		if (_pro1 < 123) {
			setTimeout(demo,15);
		}else{
			_pro1 = 0;
		}
	}
	_logo.addEventListener('mouseover',demo,false);
</script>
