---
layout: post
title: 非插件实现Pagenavi 翻页
pid: 8
comments: true
tags: [WordPress]
categories: [WordPress]
---
今天 逛博客的时候看到了[IM路人](http://imluren.com/)的一篇文章.讲的是 [非插件实现Pagenavi 翻页](http://imluren.com/2010/10/wordpress-mini-pagenavi.html),本着能少用插件就少用的原则.我也COPY了一下.记录一下.

首先在主题文件夹里面的functions.php里面添加下列语句

    /* Mini Pagenavi v1.0 by Willin Kan. */
    function wp_pagenavi ( $p = 2 ) { //取当前页前后各2页
      if ( is_singular ( ) ) return ; //文章与插页不用
      global $wp_query , $paged ;
      $max_page = $wp_query -> max_num_pages ;
      if ( $max_page == 1 ) return ; //只有一页不用
      if ( empty ( $paged ) ) $paged = 1 ;
      echo '&lt;div class="wp-pagenavi">&lt;span class="pages">'  .  ' [ ' . $paged . ' / ' . $max_page . ' ] ' . ' &lt;/span> '; // 页数
       if ( $paged > 4 ) p_link( 1, '|<' );
       if ( $paged > 1 ) p_link( $paged-1, '&lt;&lt;' );
      for ( $i = $paged - $p ; $i &lt;= $paged + $p ; $i ++ ) { //中间页
        if ( $i > 0 && $i &lt;= $max_page ) $i == $paged ? print "&lt;span class='current'>{$i}&lt;/span> " : p_link( $i );
      }
      if ( $paged &lt; $max_page ) p_link( $paged+1, '>>' );
      if ( $paged &lt; $max_page-3 ) p_link( $max_page, '>|' );
      echo '&lt;/div>';
    }
    function p_link( $i, $title = '' ) {
      if ( $title == '' ) $title = "{$i}";
      echo "&lt;a href='", esc_html( get_pagenum_link( $i ) ), "'>{$title}&lt;/a>";
    }
    // -- END ----------------------------------------

原博客文章中的标点的格式有的出现了问题.我已经解决了.

然后在style.css里面的最后添加如下内容

    /* pagenavi */
    .wp-pagenavi .pages {color: #666;background: url(images/icon.gif) no-repeat -80px -112px;padding-left: 23px;margin-right: 18px;}
    .wp-pagenavi a, .wp-pagenavi .current {padding: 2px 7px;border: 1px solid #fff;text-decoration: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;}
    .wp-pagenavi .current {color: #565656;font-weight: bold;}
    .wp-pagenavi a:hover {color: #222;border-color: #aaa !important;border-color: #fff;text-decoration: none;}

最后是调用函数了(这里我把上面那个函数的名字改为了Pagenavi插件的函数名字,直接在主题文件夹里面的Pagenavi.php里面的特定位置就可以进行调用了,一般的主题都会有判断是否有Pagenavi函数的语句.所以我直接把这个函数的名字改为了Pagenavi的函数的名字.一来是不用寻找模板是在上面地方调用的.二来不用再麻烦修改了.如果改成别的名字的话.还要再修改相关语句.)

**谨记:在这里之前请先把Pagenavi插件停用.因为两个函数的名字是一样的.**
我的调用Pagenavi函数的文件是template文件夹里面的navigation.php
