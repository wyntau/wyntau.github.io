---
layout: post
title: 咱也来段JavaScript功能书签(4.16更新)
pid: 48
comments: true
tags: [Blog, JavaScript]
categories: [他山之石]
---
最近不少人都在传一段用于快速填写 wp评论框信息的代码.我也一直都在使用 效果刚刚的.但是大家传的基本上都是适用于wordpress的代码.如果对方使用的不是wp的话,就会没有效果了.还好我在网上逛的时候看到了适用于其他的博客程序的代码.

**具体使用方法**就是 将下面的代码中的信息修改后拖到浏览器的书签栏里面,然后再改个名字就OK啦.挺简单的哟. :evil:

**第一个是 wordpress的代码**

	javascript:document.getElementById('author').value = '你的昵称'; document.getElementById('email').value = '你的邮箱'; document.getElementById('url').value = '你的主页'; void(0)

**下一个是z-blog的代码.和上一个差不多,只不过就是ID变了.**

	javascript:document.getElementById('inpName').value = '你的昵称'; document.getElementById('inpEmail').value = '你的邮箱'; document.getElementById('inpHomePage').value = '你的主页'; void(0)

**还有一个是Typecho的代码**

	javascript:document.getElementById('author').value = '你的昵称'; document.getElementById('mail').value = '你的邮箱'; document.getElementById('url').value = '你的主页'; void(0)

基本上就是这样了.可以看到就是填写框的ID 不同导致了代码不同.要是编写主题的人把评论框的ID改了,那么这个代码就没有用处啦.

抢沙发专用的代码可以使用[木木](http://immmmm.com/)的这段代码.就是比前面说的多加了点东西(适用于wp系统.其他系统的请自己开发 :lol: )

	javascript:document.getElementById('author').value = '您的昵称'; document.getElementById('email').value = '您的邮箱地址'; document.getElementById('url').value = '您的个人主页';document.getElementById('comment').value = '杀勒个发 —_—！';void(0)

**Update(4-16):**昨天[冰剑](http://www.binjoo.net)童鞋看了我的这几段代码后感觉 每个博客程序都要一段代码太麻烦了.所以冰剑大虾 把自己用的代码贡献出来啊.热烈欢迎啊. 冰剑大虾的博文地址http://www.binjoo.net/2011/04/share-my-sofa-code

具体的代码我没怎么看懂. 冰剑大虾的原话说"**所用的方法呢，就是把相应的程序表单、昵称、EMAIL、网址的ID分别保存在四个数组里，然后循环遍历去查找.**" 冰剑大虾只给了wordpress还有typecho的代码.然后我又加上了z-blog的代码.

为什么我这么喜欢z-blog的代码呢. :jiong: 哈哈.原因就是月光博客啊.由于我比较喜欢去月光博客那里看看人家写的高质量文章,但是我又比较喜欢折腾我的本地wordpress.所以会经常的清空缓存还有cookie文件.所以评论框里面就没有我的信息了.每次填写很麻烦.因此就用代码实现啦.

闲话少说啦.贴代码. 把昵称,邮箱 还有网址换成你自己的(你不想换也无所谓啦.哈哈)

	javascript: void
	function() {
		var formArray = ["commentform", "comment_form","frmSumbit"],
		nameArray = ["author", "author", "inpName"],
		emailArray = ["email", "mail", "inpEmail"],
		urlArray = ["url", "url", "inpHomePage"];
		for (i = 0; i < formArray.length; i++) {
			var form = document.getElementById(formArray[i]);
			if (form != null) {
				var name = document.getElementById(nameArray[i]),
				email = document.getElementById(emailArray[i]),
				url = document.getElementById(urlArray[i]);
				name != null && (name.value = "ISayMe"),
				email != null && (email.value = "Email@domain.com"),
				url != null && (url.value = "ISayMe.com");
				break
			}
		}
		return ! 1
	} ()
注意:需要将代码中的空格什么的去掉.推荐找一个代码净化网站,将空格回车什么的去掉.要不然书签会没有效果.

**冰剑大虾:**如果你要新增加其他的怎么办？那你直接把相关的ID添加至相应的数组后面就行了，记住，位置要一一对应。弄完后再随便找个代码压缩的网站把这段JS压缩成一段放置书签中就OK了。这里推荐 @疯淫 弄的一个压缩网站（[传送门](http://scriptcode.info/?hl=zh-CN)）。

**ISayMe:**要是你还想加上那个抢沙发的话的话,就照葫芦画瓢,加一个数组,然后就OK啦.
最后还想说的就是:**会代码就是牛逼啊.可惜咱屁都不会.遇到问题只好求助于人啦.**
