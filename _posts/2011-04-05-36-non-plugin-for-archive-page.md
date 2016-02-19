---
layout: post
title: 归档页面非插件化
pid: 36
comments: true
tags: [PhilNa2, WordPress, 原创]
categories: [WordPress]
---
看题目就知道是神马意思了吧.效果可以看我的[归档页面](http://isayme.com/archive),原来我是使用的 clean archive reload插件,到网上逛的时候正好看到了非插件使用的方法.所以拿过来试验了一下,成功了.所以就写一下咯.(优点:所有的东西都在模板文件里面,一个归档页面就只用它本身)

源代码地址是在[荒野无灯weblog](http://www.ihacklog.com/wordpress/wpskills/hacklog-clean-archives.html),在这里表示灰常感谢.调试的过程中向他请教了好多.
他那里有修改的模板文件,原文说只要下载那个模板文件然后修改页面,调用那个模板就好了.

我下载下来本地调用的时候,发现css样式完全错位.看来还是要鼓捣一番才行.

使用此模板的前提条件是 主题加载了JQuery 库,使用PhilNa2主题的童鞋不要担心了,主题本身已经有这个库啦 :evil:

使用这个模板文件的主要思想就是 那个文件里面有两个大函数(前后各一个,中间是显示文章的函数),把它们复制到模板里面适当位置,然后再在模板的适当位置调用那个列举文章的函数就好了.

*注意:*后边的那个函数要放到get_footer()函数的前面.要是放在后面的话,会没有折叠效果哦 :lol:  我也是折腾了好长时间才找到了原因.不想自己折腾的就接着往下看咯

>原文说明：
>
>此代码部分参考了Viper007Bond童鞋的插件Clean Archives Reloade 。不过我这个应该运行时效率稍高一些，主要是对其GetPosts()这个函数做了相应的修改。在此感谢Viper007Bond童鞋一下。
>
>此方法与插件法相比的优点：
>
>1. 纯绿色，不写入任何东东到数据库
>2. 按需调用。无需全站加载，只在访问存档页时调用。
>3. 与插件一样，可配置。（配置方法见下面）
>使用方法，将hacklog-clean-archives.php上传至当前主题目录下面，然后在后台新建一页面，名字随意，模板选择 hacklog-clean-archives ，内容可写可不写。
>页面内容如果要写，则必须按以下格式，因为这里页面内容实际上是用来控制这个存档的显示的。

    usejs=1;
    monthorder=old;
    postorder=old;
    postcount=1;
    commentcount=1;
    解释下，这里usejs表示使用JQ折叠显示 ，这个Javascript存档折叠显示效果相当酷的。  为1开启，设为0关闭。
    monthorder (存档月份排序) :
    new 【按时间倒叙排列月份（离现在最近的月份排最前）】
    old 【按时间正序排列月份（离现在最远的月份排最前）】
    postorder （存档文章排序）：
    new 【将最新的日志显示在第一位】
    old 【将最旧的日志显示在第一位】
    postcount:是否显示每月的文章数
    0 :不显示
    1 :显示
    commentcount :是否显示文章评论数
    0 ：不显示
    1 ：显示

献丑一下.把我现在使用的归档页面模板共享一下.有需求的童鞋可以拿去用(仅限PhilNa2主题,别的主题的童鞋自己去鼓捣吧 :evil: )
[下载地址](http://u.115.com/file/f0aa2a19ff)

*Update(5-9):*早些天之前看到了zww大大的博文中一篇关于归档页面的函数的文章.在本地试验了一下.发现代码确实很少,但是效果一点也不差,所以转载一下.以后可能就换了.
原文地址点击[此处](http://zww.me/archives/25209)

以下内容截取自zww原文[代码实现WordPress归档页面模板\[速度很快\] | ZWWoOoOo](http://zww.me/archives/25209)

- - -
**特点：**

1. 这个存档函数会在数据库生成一个表 SHe_archives_25216，用来保存在文章新发表/删除文章时生成的 html，这主要是加快访问速度，不用每次都要查询数据库生成归档。
2. 显示每月文章数
3. 显示每篇文章的评论数

说明：我另外加了jQuery滑动效果，jQ代码来自上面提到的 hzlzh，稍微修改。

下面是详细步骤

1.把下面的 archives_list_SHe 函数代码扔进主题的 functions.php 里面 （2010.7.23 edit）

    function archives_list_SHe() {
         global $wpdb,$month;
         $lastpost = $wpdb->get_var("SELECT ID FROM $wpdb->posts WHERE post_date <'" . current_time('mysql') . "' AND post_status='publish' AND post_type='post' AND post_password='' ORDER BY post_date DESC LIMIT 1");
         $output = get_option('SHe_archives_'.$lastpost);
         if(empty($output)){
             $output = '';
             $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE 'SHe_archives_%'");
             $q = "SELECT DISTINCT YEAR(post_date) AS year, MONTH(post_date) AS month, count(ID) as posts FROM $wpdb->posts p WHERE post_date <'" . current_time('mysql') . "' AND post_status='publish' AND post_type='post' AND post_password='' GROUP BY YEAR(post_date), MONTH(post_date) ORDER BY post_date DESC";
             $monthresults = $wpdb->get_results($q);
             if ($monthresults) {
                 foreach ($monthresults as $monthresult) {
                 $thismonth    = zeroise($monthresult->month, 2);
                 $thisyear    = $monthresult->year;
                 $q = "SELECT ID, post_date, post_title, comment_count FROM $wpdb->posts p WHERE post_date LIKE '$thisyear-$thismonth-%' AND post_date AND post_status='publish' AND post_type='post' AND post_password='' ORDER BY post_date DESC";
                 $postresults = $wpdb->get_results($q);
                 if ($postresults) {
                     $text = sprintf('%s %d', $month[zeroise($monthresult->month,2)], $monthresult->year);
                     $postcount = count($postresults);
                     $output .= '<ul class="archives-list"><li><span class="archives-yearmonth">' . $text . ' &nbsp;(' . count($postresults) . '&nbsp;篇文章)</span><ul class="archives-monthlisting">' . "n";
                 foreach ($postresults as $postresult) {
                     if ($postresult->post_date != '0000-00-00 00:00:00') {
                     $url = get_permalink($postresult->ID);
                     $arc_title    = $postresult->post_title;
                     if ($arc_title)
                         $text = wptexturize(strip_tags($arc_title));
                     else
                         $text = $postresult->ID;
                         $title_text = 'View this post, &quot;' . wp_specialchars($text, 1) . '&quot;';
                         $output .= '<li>' . mysql2date('d日', $postresult->post_date) . ':&nbsp;' . "<a href='$url' title='$title_text'>$text</a>";
                         $output .= '&nbsp;(' . $postresult->comment_count . ')';
                         $output .= '</li>' . "n";
                     }
                     }
                 }
                 $output .= '</ul></li></ul>' . "n";
                 }
             update_option('SHe_archives_'.$lastpost,$output);
             }else{
                 $output = '<div class="errorbox">Sorry, no posts matched your criteria.</div>' . "n";
             }
         }
         echo $output;
     }

2.复制一份主题的 page.php 更名为 archives.php，然后在最顶端加入：

    <?php
    /*
    Template Name: archives
    */
    ?>

再然后找到类似

    <?php content(); ?>

在其下面加入如下代码（2010.7.21 edit）

    <a id="expand_collapse" href="#">全部展开/收缩</a>
    <div id="archives"><?php archives_list_SHe(); ?></div>

进wp后台添加一新页面，在右侧栏模板选择 archives

3.如果你的主题本身加载了 jQuery 库，那么继续把下面的 jQ 代码加上去，就会有滑动伸缩效果了（2010.7.23 edit）

    /* 存档页面 jQ伸缩 */
     $('#expand_collapse,.archives-yearmonth').css({cursor:"s-resize"});
     $('#archives ul li ul.archives-monthlisting').hide();
     $('#archives ul li ul.archives-monthlisting:first').show();
     $('#archives ul li span.archives-yearmonth').click(function(){$(this).next().slideToggle('fast');return false;});
     //以下下是全局的操作
     $('#expand_collapse').toggle(
     function(){
     $('#archives ul li ul.archives-monthlisting').slideDown('fast');
     },
     function(){
     $('#archives ul li ul.archives-monthlisting').slideUp('fast');
     });

css 样式可以通过 #archive 来定义
