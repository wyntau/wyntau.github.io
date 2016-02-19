---
layout: post
title: W1s 首页Ajax翻页新效果
pid: 148
comments: true
tags: [Ajax, w1s, WordPress, 原创]
categories: [WordPress]
---
最近真的累了,鼓捣了这么多感到有点身心俱疲...,现在我越来越发现PhilNa2的省心了...神马都不用操心,yinheli童鞋都弄好了.
有一种想要换回PhilNa2的冲动了.

临换回去之前,想把现在弄的这个首页翻页效果分享一下.

前两天放出大话,说基本可以整站Ajax,好吧,是我太高估自己的能力了.javascript还有php一点不懂的人,我太异想天开了 :jiong: ....
搞了一个首页翻页的效果就先这样吧,还是换回PhilNa2继续研究.

只说方法,不解释.累了,懒得解释了,厉害人自己看着办吧.
实现方法来自PhilNa2主题,最后的具体效果(可能你已经在我的博客上看不到效果了,所以我描述一下)为,

*点击首页下方的翻页链接,翻页导航显示为"载入中...".数据成功返回后,文章列表slideUp,然后文章列表部分换成新的数据,然后再slideDown,然后浏览器定位到文章列表顶部.*

如果想要神马新效果,请自己钻研,并且由于本人不会写jquery代码,都是胡乱写的,你尽可以修改优化.

**实现方法:**

1,独立W1s的home.php文件,将home.php中的

	<div id="middle">
	.............
	</div>
之间的内容(也就是省略号的那部分) 独立出来,单独放到一个文件中,比如`loop/loop-home.php`

这样做是为了提高这部分文件的复用性,为什么这么做,还是从PhilNa2上学来的,PhilNa2首页翻页后获取文章列表就是用的这个方法.
我发现这样可以做到最简单的方法获取文章列表,下面的php响应函数,只要包含进来这部分文件,就会自动输出文章列表,比起网上那些人写的一大坨代码方便多了,关键是对我这样的php代码盲来说是最简单的方法.

2,php响应部分.在functions.php中添加如下内容

	function ajax_post(){
		if( isset($_POST['action'])&& $_POST['action'] == 'ajax_post'){
		include_once TEMPLATEPATH.'/loop/loop-home.php';  //注意修改为你自己的文件的位置
			die();
		}else{
			return;
		}
	}
	add_action('template_redirect', 'ajax_post');

3,jquery代码部分

	function fanye (){
	$("#pagenavi a").click(function() {
				var z = $(this).attr("href");
				$.ajax({
				url: z,
				type:"POST",
				data:"action=ajax_post",
				beforeSend:function(){
				$("#pagenavi").html('<p class="ajaxloading">载入中</p>');
				},
				success: function (data){
				$("#middle").slideUp(300).html(data).slideDown(500,function() {
						$body.animate({
							scrollTop: $(this).offset().top - 100
						},
						500)
					});
				fanye();//翻页后DOM变化了,需要重新绑定函数
				}
				});
				return false;
			});
	}
	fanye();

*注:*我使用的时候,必须要使用POST方法,要不然使用GET方法返回的数据中,翻页链接上就会带有&amp;ajax_post的参数.对于再次翻页貌似有影响.

就是这么简单.使用包含文件的方法我只试验成功了这一个,本想测试一下获取评论的,但是死活不行,说是找不到评论,烦死了,不弄了.
况且一,我发现,如果服务器速度不行的话,Ajax就是个悲剧,还不如直接刷新来的快.二来是对我来说太难了,这些玩意不在我可以鼓捣的范围之内,我只能修改点小代码,这样的难题我是解不出来的.

弄完这个,我真的要回到PhilNa2了,想想自己真的是毅力不行,才弄了一点就坚持不下去了.唉....
