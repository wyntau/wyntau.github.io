---
layout: post
title: PhilNa2首页文章收缩再修复
pid: 144
comments: true
tags: [jQuery, PhilNa2, WordPress, 原创]
categories: [WordPress]
---
前面讲到过关于使用philna2收缩而进行的一些修改.具体请看[PhilNa2首页文章收缩及问题修复](/2011/05/home-article-toggle-problems.html)  那里面讲的是如何让文章页不收缩的方法,就是修改ID号了.
然后是解决文章页 点击上一页下一页导航失效的问题.

其实那些问题完了之后还有一个问题,就是**首页点击下一页之后,文章收缩会失效**.当时不知道该怎么解决,所以就把ajax翻页去掉了.
在换了winy的W1s主题后,由于鼓捣无限翻页的时候,听说了"函数重新加载"这样类似的意思,就是说"页面的元素重新加载完毕之后,新加载的DOM元素并没有被绑定事件,因此要重新加载一遍函数,把新加载的元素和原有的元素再重新绑定一遍."

因此我又回过头来看了一下philna2的.发现确实是这样,在philna2.js中有好多的函数重新加载的地方,可惜当时不懂,并不知道是什么意思,现在明白了就好办了.
说说方法,把原先的那个 伸缩代码用一个函数包起来,像下面这样

	function homeslide (){
	$('#content .post_title').click(function(){ //点击class="post-title"元素（即文章标题）触发事件
		if($(this).next().next().is(':visible')){ //若其相邻的下一个再下一个元素（.post-content，即所点击标题的文章内容）属性为"可见"，则执行下述代码
			$(this).children().text('页面载入中……'); //让其子元素（.post-title a，即所点击的文章标题）文字改为"页面载入中……"//.......以下省略
		}
	//.............以下省略
	});
	}
	homeslide();//这是定义完函数后紧接着调用一遍,
你可以在里面包括那个模拟点击的代码,也可以不包含.

**注:**我已经换掉了模拟点击,换成了直接让第一篇展开,因为点击一下,屏幕会滚动,而直接展开,屏幕不会滚动
代码如下

	$('#content .post_content:first').slideDown(500);
然后在philna2.js(解压缩之后)中寻找function k(),在那一堆调用函数的地方添加上此函数就可以了.
我的function k()如下

	function k() {
			//..................以上省略
				var D = function(E) {
					document.body.style.cursor = "auto";
					B.html(E);
					$.scrollTo("#header", 700,
					function() {
						$('#content .post_content:first').slideDown(500)
					});
	//此处我去掉了弹跳的效果,改成滑动到顶部后,第一篇文章展开,因为我发现直接让第一篇展开更方便.
	//这样我的homeslide函数中就没有了模拟点击的步骤
					k();
					a();
					e();
					p();
					c();
					t();
					n();
					q();
					l();
					homeslide();//我是在此处调用的,只要在这一堆函数中就可以,位置没有要求
					g()
				};
				//..............以下省略
		}
		k();
当然你也可以在homeslide();的地方直接换上前面定义的homeslide函数中的具体内容,但是为了节省空间,还是调用的好.
