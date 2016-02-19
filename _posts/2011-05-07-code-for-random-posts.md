---
layout: post
title: 代码访问随机日志
pid: 118
comments: true
tags: [WordPress, 转载]
categories: [WordPress]
---
不记得是怎么找到这篇文章的,但是很庆幸,又找到了好东西.哈哈

原来在[IM路人](http://imluren.com) 的博客中看到了导航栏上的随机文章,感觉挺好的,但是不知道怎么弄的.
昨天晚上找到了个代码,在本地试验了一下.完全可以使用.所以就转过来了.

具体效果情点击侧栏Fantasy-time右侧的 [随便看看](http://isayme.com/?random).

代码来源*泪未溅心先碎*之[WordPress折腾小技巧1](http://willin.me/develop/wordpress/wordpress-tips1/)

代码如下,将代码放到functions.php中,然后用yourname.com/?random 就可以访问随机日志

	function matt_random_redirect() {
		global $wpdb;

		$query = "SELECT ID FROM $wpdb->posts WHERE post_type = 'post' AND post_password = '' AND 	post_status = 'publish' ORDER BY RAND() LIMIT 1";

		if ( isset( $_GET['random_cat_id'] ) ) {
			$random_cat_id = (int) $_GET['random_cat_id'];
			$query = "SELECT DISTINCT ID FROM $wpdb->posts AS p INNER JOIN $wpdb->term_relationships AS tr ON (p.ID = tr.object_id AND tr.term_taxonomy_id = $random_cat_id) INNER JOIN  $wpdb->term_taxonomy AS tt ON(tr.term_taxonomy_id = tt.term_taxonomy_id AND taxonomy = 'category') WHERE post_type = 'post' AND post_password = '' AND 	post_status = 'publish' ORDER BY RAND() LIMIT 1";
		}

		if ( isset( $_GET['random_post_type'] ) ) {
			$post_type = preg_replace( '|[^a-z]|i', '', $_GET['random_post_type'] );
			$query = "SELECT ID FROM $wpdb->posts WHERE post_type = '$post_type' AND post_password = '' AND 	post_status = 'publish' ORDER BY RAND() LIMIT 1";
		}

		$random_id = $wpdb->get_var( $query );

		wp_redirect( get_permalink( $random_id ) );
		exit;
	}

	if ( isset( $_GET['random'] ) )
		add_action( 'template_redirect', 'matt_random_redirect' );

貌似路人童鞋用的也是这个代码?
