---
layout: post
title: PhilNa2-侧栏去掉博主回复
pid: 129
comments: true
tags: [PhilNa2, WordPress, 原创]
categories: [WordPress]
---
没事乱折腾的.说不定哪天就换回去了.但是弄出来东西还是想和大家分享一下,刚用这个主题的时候一心想着怎么把侧边栏的博主回复去掉,但是不会,也没找到方法.
时间长了,感觉侧栏有博主的回复也挺好的.

去掉博主回复这个也是无意间鼓捣的.
效果图如下所示

![](/uploads/2011/05/12_01.png)

在本地的wordpress乱翻那些php文件,就翻到了app/recentcomments.php文件.然后打开看了看.网上好多人侧栏去掉博主评论都是用的那种直接从数据库中读取评论时不读取mail等于博主邮箱的评论.但是philna2主题不是用的直接从数据库中读取,而是使用了wp官方的get_comments()函数.

我在zww大大的文章中才知道"WordPress官方一直不推荐直接用SQL语言调用数据库数据，所以一直以来WordPress官方主题审核中，直接用SQL语句的代码是通不过审核的".可见philna2主题作者yinheli的细心.呵呵.

此文的修改灵感,来自zww大大的[用get_comments()函数实现带头像最新评论](http://zww.me/archives/25317)
在我的googlereader里面放了好长时间.当我看到此主题是用的get_comments()函数时我才想起来我看过这样一篇文章.所以就拿来看看了,还真改出来了.

在zww的文章中,排除博主的回复用到的方法大致如下,先用get_comments()函数从数据库中取出N条评论,这其中包括了博主的回复.然后遍历这些评论.把其中的博主回复去掉.当到达指定的条数时停止遍历,然后输出.
**以上是我的理解,可能有偏颇,希望大家指教.**

我看到philna2主题中最新评论的函数写法和zww的那篇文章中的函数有相似的地方.所以就修改了一下.指定输出的条数.然后去掉博主的回复.修改的过程不说了,我不会表达.直接贴出来吧.把我的recentcomments.php文件的内容全部贴出来.自己看着修改自己的.或者直接复制粘贴也行
(**为了不把文章拉的过长,我把头部的主题作者的信息和注释去掉了**)

	<?php
	// no direct access
	defined('PHILNA') or die('Restricted access -- PhilNa2 gorgeous design by yinheli < http://philna.com/ >');
	function philnaRecentcomments($args='number=20&status=approve'){
		$cacheID = md5($args);
		if($output = wp_cache_get('recentComments_'.$cacheID, 'philna')){
			echo $output;
			return;
		}
		$rcms = get_comments($args);
		//print_r($rcms);return;
		if(empty($rcms)){
			_e('No Data Found',YHL);
			return;
		}
		$show_comments = 7;//指定输出条数
		$my_email = get_bloginfo ('admin_email'); //获取博主自己的email
		$i = 0;//计数器
		//历遍数据
		$output = '';
		foreach( $rcms as $rcm ){
			// 如果访客昵称为空, 则将显示名字设为 "Anonymous"
			if($rcm->comment_author_email != $my_email ){
			$i++;
			$author = $rcm->comment_author ? $rcm->comment_author : __('Anonymous', YHL);
			$content = philnaStriptags( $rcm->comment_content);
			$l_excerpt = philnaSubstr( $content, 200 );
			$l_excerpt = preg_replace('/["']/', '', $l_excerpt);
			$s_excerpt = convert_smilies( philnaSubstr( $content, 30 ) );
			$comment_author_link = '<a class="no_webshot" href="'.get_comment_link($rcm).'" rel="external nofollow" title="'.$l_excerpt.'">'.$author.'</a>';
			if($rcm->comment_type == ''){
				$output .= '<li class="r_item"><div class="row">'.get_avatar($rcm->comment_author_email, 25).'<span class="r_name">'.$comment_author_link.'</span><br /><span class="r_excerpt">'.$s_excerpt.'</span></div><div class="clear"></div></li>'."n";//不想分两行的话.将br和尖括号去掉
			}elseif($rcm->comment_type == 'pingback'){
				$output .= '<li class="r_item r_pingback"><span class="rc_label name">' . __('Pingback:') . '</span>'.$comment_author_link.'</li>';
			}elseif($rcm->comment_type == 'trackback'){
				$output .= '<li class="r_item r_traback"><span class="rc_label name">' . __('Trackback:') . '</span>'.$comment_author_link.'</li>';
			}
			}
			if ($i == $show_comments) break;
		}
		wp_cache_add('recentComments_'.$cacheID. $output, 'philna');
		echo $output;
	}


我在评论里面将评论者还有评论内容分成两行了.不想分两行的话,就把$rcm->comment_type == ''的那个输出中的回车符< br>去掉就行了
另外我把评论者头像放大了.原来是20px,现在是25px,自己看着修改吧

使用这个方法的时候最好将侧边栏调用函数的**philnaRecentcomments($args='number=6&status=approve')**中的那个数字调大点.因为如果太小的话,取出来的评论可能去掉博主回复之后,就不够你指定的输出条数了.zww那个文章里面写的是200......我写的是15
