---
layout: post
title: PhilNa2首页Ajax加载文章
pid: 141
comments: true
tags: [Ajax, jQuery, PhilNa2, 原创]
categories: [WordPress]
---
前几天弄出来的东西,没用几天就换主题了, :jiong: 但是还是和大家分享一下.免得时间长了,我自己也忘记了.

php响应部分代码来源于 木木的文章[AJAX动态加载文章内容](http://immmmm.com/ajax-loading-post-content.html)
响应部分的修改来自winysky[Query_posts之自动截断](http://winysky.com/query_posts-automatic-cut-off)

**首先**是php响应部分,将如下代码放到functions.php里面,

	function ajax_post(){
	if( isset($_GET['action'])&& $_GET['action'] == 'ajax_post'){
	$ariticle_id=$_GET['id'];
	query_posts("p=$ariticle_id");
	the_post();
	global $more;
	$more = 0;
	 the_content(__('Read more...', YHL)); //此处可以输出more标签之前的内容
	die();
	}else{
	return;
	}
	}
	add_action('init', 'ajax_post');

**然后**是jQuery的AJAX代码(**我已经修改过了,PhilNa2可以直接拿来用,不需要修改**)
jquery代码部分 框架 来源于木木的文章,部分代码来自[自由的风](http://loosky.net)博客,这里一并表示感谢.

	//AJAX动态加载文章内容 By ISayMe.com
	$('#content .post_title').click(function() {//文章标题点击事件
		var postContent = $(this).next().next();
		var id = $(this).parent().attr("id");
		var postId = id.replace(/^post-(.*)$/, '$1');//获取文章ID
		if (postContent.html() == "") {//如果文章内容为空，则执行以下代码
			$.ajax({
				url: "?action=ajax_post&id=" + postId,
				beforeSend: function() {
					$('#content .post_content').slideUp(150,
					function() {
						postContent.html('<p class="ajaxloading">Loading......</p>').show()
					});
				},
				success: function(data) {
					postContent.hide(0).html(data).slideDown(500,
					function() {
						$body.animate({
							scrollTop: $(this).offset().top - 180
						},
						500)
					});
				}
			});
			return false;
		} else if (postContent.is(":hidden")) {//如果文章内容为隐藏，则执行以下代码
			$('#content .post_content').slideUp(500);
			postContent.slideDown(500,
			function() {
				$body.animate({
					scrollTop: $(this).offset().top - 180
				},
				400)
			});
			return false;
		} else {//如果文章内容为显示，执行以下代码
			$(this).children('a').text('页面载入中……');//改变文章标题文字
			window.location = $(this).children().attr('href');//打开文章链接
		}
	});
	$('#content .post_content:first').slideDown(500); //自动展开第一篇文章,此处不需要,这个是文章伸缩时的代码

对于php文件还需要再修改一下. 修改来源取自 自由的风 主题**loosky**,再次表示感谢.

**loop.php**文件.在头部的作者声明信息下面寻找如下内容

	if( have_posts() ) :
		// post loop start
		do_action('philnaLoopStart'); /* philna hook */ //在此行下方添加内容,
		while( have_posts() ) :
		the_post();,
修改后代码如下,这是为了计数用的,只让指定篇数的文章显示内容,其余的不加载.

	if( have_posts() ) :
		// post loop start
		do_action('philnaLoopStart'); /* philna hook */
	        $count=1;
		while( have_posts() ) :
		the_post();
找到

	<div class="post_content content">
将如下内容全部删掉

	<?php
			// if the post has thumbnail, display it in homepage or archive page
			if((is_home() || is_archive()) && has_post_thumbnail()) {
				the_post_thumbnail(); // you may change the size of the thumbnail by use param array(width, height);
			}
			the_content(__('Read more...', YHL));
			?>
	<div class="clear"></div>
同时将空格换行什么的都全部删掉(关键!!要不然无法ajax加载成功)变成如下这样的样式(以下是为了向你展示一下无空格换行之后结果)

	<div class="post_content content"><?php if( is_singular() ) wp_link_pages('before=<div class="content_pages icon"><strong>'. __('Pages:', YHL).'&after=</strong></div>'); ?>
的后面添加如下内容

	<?php
		if(is_bot() || is_single()) : the_content();
		elseif($count >=1 &&$count <=1) :the_content(__('Read more...', YHL));
		endif;
		$count++;?>
修改后如下(php函数中出现换行空格神马的没事.)

	<div class="post_content content"><?php
		if(is_bot() || is_single()) : the_content();
		elseif($count >=1 &&$count <=1) :the_content(__('Read more...', YHL));
		endif;
		$count++;?><?php if( is_singular() ) wp_link_pages('before=<div class="content_pages icon"><strong>'. __('Pages:', YHL).'&after=</strong></div>'); ?>

那个count的数字是定义输出文章的篇数,我原来用了一篇,其他的全部ajax加载.

这样就OK了.有问题了再来问我吧
