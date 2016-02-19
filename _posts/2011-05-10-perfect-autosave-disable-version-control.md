---
layout: post
title: WP3.1.2-完美自动保存,禁用版本控制
pid: 122
comments: true
tags: [Blog, WordPress, 转载]
categories: [WordPress]
---
前两天把wp的默认表情图片的路径改了一下,然后又看了下木木的文章[新窗口中打开评论者链接](http://immmmm.com/jquery-notes-open-comment-link-new-window.html) 感觉没有什么东西值得留恋的了.

况且好多人都说3.1.2版本修复了几个很严重的漏洞,我也有点害怕不升级会不会造成神马影响,所以就在后台把wp升级到了3.1.2版本.升级完我才想起来,自动保存,版本控制这些玩意我忘记啦.OMG!又要重新鼓捣啦.

原来修改的方法没有记录下来,只好去google上搜索,嘿,没想到搜到了更完美的方法,既保留自动保存,又可以保持文章ID连续,禁用版本控制.这么好的事,一定要试试.不成功也是尝试嘛.所以就按照文章中的方法试验了一遍.果真可以.哈哈.

而且这个方法还有一个好处就是,貌似可以把你原来删掉的那些auto draft的ID利用起来.(不太确定,因为我在本地试验的,谁知道是不是这样,但是使用自动保存的同时禁用版本控制,这个方法是真正的做到了.)

**update:**确定此方法会将原来的ID利用起来.因为我最新的文章ID是125,但是此篇文章的ID是122.应该是把没用到的ID给利用起来了.
下面就说说方法,欢迎大家一起折腾.哈哈

原文地址[完美自动保存、禁用版本控制、连续文章ID](http://www.jiechic.com/archives/perfect-auto-save-disable-version-control-continuous-article-id.html)

**首先 关闭修订版本**

**原文的话如下**
这个有很多方法，一下三种方法，只用一种即可。

1、修改源代码去掉钩子.
在wp-includes/default-filters.php中，可以看到这一行：

    add_action( 'pre_post_update', 'wp_save_post_revision' );

将其注释掉，修改后，为

    //add_action( 'pre_post_update', 'wp_save_post_revision' );

2、使用插件，关闭修订版本.
原理是，插件启用一个函数，去掉这个修订版本的钩子。

    remove_action ( 'pre_post_update', 'wp_save_post_revision' );

或者是定义修订版本选项，使其修订版本功能关闭

    define('WP_POST_REVISIONS',false);

3、配置文件添加修订版本选项，使修订版本功能关闭.
编辑 wp-config.php 文件（博客根目录），在下面代码之前：

    define('ABSPATH', dirname(__FILE__).'/');

添加以下代码：

    define('WP_POST_REVISIONS',false);

*原文作者注，define('WP\_POST\_REVISIONS',false);的这种方法，我现在也不知道可不可用，如果有哪位童鞋使用这种方法可以停止修订版本功能的，留言告知，我好完善该文章，懒了，不想一个一个去测试了。*

**SayMe:**我使用的是第一种方法.当我查看我的wp-config.php的时候,貌似里面还有第三种方法.这个应该是原来按照人家的教程修改的时候留下来的.

**二,继续自动保存，关闭自动保存的新增版本**

在wp-admin/includes/post.php文件中，搜索”wp\_create\_post\_autosave”，不含引号。找到如下函数：

    function wp_create_post_autosave( $post_id ) {
        $translated = _wp_translate_postdata( true );
        if ( is_wp_error( $translated ) )
            return $translated; // Only store one autosave. If there is already an autosave, overwrite it.
        if ( $old_autosave = wp_get_post_autosave( $post_id ) ) {
            $new_autosave = _wp_post_revision_fields( $_POST, true );
             $new_autosave['ID'] = $old_autosave->ID;
            return wp_update_post( $new_autosave );
        } // Otherwise create the new autosave as a special post revision
        return _wp_put_post_revision( $_POST, true );
    }
将如下函数

    return _wp_put_post_revision( $_POST, true );
替换为

    return edit_post();

**三,关闭自动草稿**

找到/wp-admin/includes/post.php文件，搜索”$create\_in\_db”，不含引号。找到如下函数：

    if ( $create_in_db ) {
        // Cleanup old auto-drafts more than 7 days old
        $old_posts = $wpdb->get_col( "SELECT ID FROM $wpdb->posts WHERE post_status = 'auto-draft' AND DATE_SUB( NOW(), INTERVAL 7 DAY ) > post_date" );
        foreach ( (array) $old_posts as $delete )
            wp_delete_post( $delete, true ); // Force delete
        $post_id = wp_insert_post( array( 'post_title' => __( 'Auto Draft' ), 'post_type' => $post_type, 'post_status' => 'auto-draft' ) );
        $post = get_post( $post_id );
        // Below is added in 3.1
        if ( current_theme_supports( 'post-formats' ) && post_type_supports( $post->post_type, 'post-formats' ) && get_option( 'default_post_format' ) )
            set_post_format( $post, get_option( 'default_post_format' ) );
    } else {
        $post->ID = 0;
        $post->post_author = '';
        $post->post_date = '';
        $post->post_date_gmt = '';
        $post->post_password = '';
        $post->post_type = $post_type;
        $post->post_status = 'draft';
        $post->to_ping = '';
        $post->pinged = '';
        $post->comment_status = get_option( 'default_comment_status' );
        $post->ping_status = get_option( 'default_ping_status' );
        $post->post_pingback = get_option( 'default_pingback_flag' );
        $post->post_category = get_option( 'default_category' );
        $post->page_template = 'default';
        $post->post_parent = 0;
        $post->menu_order = 0;
    }
修改 if ｛｝else 之间的函数，修改代码后如下，你可以直接复制粘贴。

    if ( $create_in_db ) {
        global $current_user;
        $post = $wpdb->get_row( "SELECT * FROM $wpdb->posts WHERE post_status = 'auto-draft' AND post_type = '$post_type' AND post_author = $current_user->ID ORDER BY ID ASC LIMIT 1" );
        if ( !$post ) {
            $post_id = wp_insert_post( array( 'post_title' => __( 'Auto Draft' ), 'post_type' => $post_type, 'post_status' => 'auto-draft' ) );
            $post = get_post( $post_id );
        }
        /* End */
        // Below is added in 3.1
        if ( current_theme_supports( 'post-formats' ) && post_type_supports( $post->post_type, 'post-formats' ) && get_option( 'default_post_format' ) )
            set_post_format( $post, get_option( 'default_post_format' ) );
    } else {

*注else之后的函数不变,请对照修改else之前的内容*

经过这一系列的源码修改后,既可以使用自动保存的功能,又不会产生多余的文章ID啦.哈哈.又可以把super switch插件干掉啦.霍霍~~

**严重提醒:**

如果你的wp-config.php文件里面有原来关闭自动保存的时候留下的如下语句

    define('AUTOSAVE_INTERVAL', false);
的话,请注释掉.因为此文章中的方法是保留自动保存的功能,如果config中继续有这句话,在新建文章的时候会引起强烈冲突,导致服务器负荷急剧上升.如果不信的话,可以在本地服务器测试一下.切记切记!!!!!否则出现问题.不负责....

![](/uploads/2011/05/10_01.png)
