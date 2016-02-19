---
layout: post
title: 我所知道的两种彩色标签云
pid: 171
comments: true
tags: [Tag, WordPress]
categories: [WordPress]
---
第一种:网上流传的 一种使用最广泛的 非插件版彩色标签云 为下面这种

    <?php
    function colorCloud($text) {
    $text = preg_replace_callback('|<a (.+?)>|i', 'colorCloudCallback', $text);
    return $text;
    }
    function colorCloudCallback($matches) {
    $text = $matches[1];
    $color = dechex(rand(0,16777215));
    $pattern = '/style=('|")(.*)('|")/i';
    $text = preg_replace($pattern, "style="color:#{$color};$2;"", $text);
    return "<a $text>";
    }
    add_filter('wp_tag_cloud', 'colorCloud', 1);
    ?>

具体使用方法就是把这段代码扔functions.php里面就行了.具体颜色值随机显示.

这是最为常见的一种方法了.

我还见过一种可以指定颜色的方法,具体就是根据上面那个来改成的,
但是我始终不能成功,反而还会使wp崩溃.不知道有人知道是什么原因吗?

    <?php
    function colorCloud($text) {
    $text = preg_replace_callback('|<a (.+?)>|i', 'colorCloudCallback', $text);
    return $text;
    }
    function colorCloudCallback($matches) {
    $tag_link=$matches[1];
    /*颜色集合*/
    $colorFull = array('#999′,'#D8D9A4′,'#9BB','#EB9′,'#a3c159′,'#FEC42D','#6C8C37′,
    '#c2dc15′,'#3371A3′,'#888′,'#00ccff','#FF8080′
    );
    $color=$colorFull[ mt_rand(0, count($colorFull) - 1)];
    $pattern = '/style=('|")(.*)('|")/i';
    $tag_link= preg_replace($pattern, "style="color:{$color};$2;"", $tag_link);
    return "<a $tag_link>";
    }
    add_filter('wp_tag_cloud', 'colorCloud', 1);
    ?>

第二种:就是我使用的PhilNa2中使用的方法了.这个需要在style.css中指定一下颜色值了.

    .tagcolor_0{color:#888;}
    .tagcolor_1{color:#f00;}
    .tagcolor_2{color:#0f0;}
    .tagcolor_3{color:#222;}
    .tagcolor_4{color:#00f;}
    .tagcolor_5{color:#000080;}
    .tagcolor_6{color:#004040;}
    .tagcolor_7{color:#555;}
    .tagcolor_8{color:#666;}
    .tagcolor_9{color:0020ff;}
    .tagcolor_1:hover,.tagcolor_2:hover{color:#fff;background:#0000a0;}
    .tagcolor_6:hover,.tagcolor_8:hover{color:#fff;background:#333;}

然后把下面的代码扔functions.php里面

    <?php
    function philnaColorfullTags($tagLinks){
        $r = "/class='(.*?)'/i";
        $tagLinks = explode("n", $tagLinks);
        $c = array(0,1,2,3,4,5,6,7,8,9); //这里是根据上面css中指定的颜色进行写的. 上面颜色有几个,这里就写到几
        $returns = '';
        foreach($tagLinks as $tagLink){
            $returns .= preg_replace($r, 'class="$1 tagcolor_'.$c[mt_rand(0, count($c)-1)].'"', $tagLink)."n ";
        }
        return $returns;
    }
    add_filter('wp_tag_cloud', 'philnaColorfullTags');

相比较而言,第一种方法更适合于那种纯白色主题,因为这种方法的颜色没法控制. 主题颜色不是白色的话,出来的结果的颜色有可能被背景色干扰.

而第二种方法就比较好,虽然需要先指定颜色值,但是这种方法可以根据自己的主题进行颜色调整,使得结果的颜色和主题比较搭配,对比度明显.