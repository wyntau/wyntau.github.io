---
layout: post
title: 文章页实时更改文字大小新代码
pid: 108
comments: true
tags: [PhilNa2, WordPress]
categories: [WordPress]
---
原来刚刚建立博客的时候字体用的是12号.过了几天有童鞋反应我的字体太小.强烈要求我增大字体.当时我很纠结,到底是增大还是继续保持呢?因为我本身比较喜欢小一点的字体.所以就一直使用的是12号字体,可是也不能不照顾大家吧.

于是在IM路人的一篇文章
[折腾 jQuery 字体大小切换](http://imluren.com/2011/01/jquery-change-font-size.html)中copy了一段代码,修改了一下默认的大小,采取一个折中的方式,默认13号字体,如果嫌小的话,可以调成14号字体.

文章页面一直都有这么功能,由于用的比较少,所以一直也没有想过要改变什么.但是今天我又突然看到了 [荒野无灯weblog](http://www.ihacklog.com/wordpress/wpskills/jquery-fontsize-change-script-for-wordpress.html)上的一段代码,down下来一试,貌似效果更好.

这段代码可以无限增大或者缩小字体,而路人的那个代码只能到一个固定的大小就停止了.所以我又把这个代码换上了.但是原来的代码不能丢.所以写个文章记录一下.
先怀旧一下,从路人的博客上copy过来的代码以及css样式.

    <!--change content font size-->
    <script type="text/javascript">$(document).ready(function() {
    $('#resizer li').click(function() {
    var fontSize = 13;
    var name = $(this).attr('id');
    if (name == 'f_s') {
    fontSize -= 1
    } else if (name == 'f_l') {
    fontSize += 1
    } else if (name == 'f_m') {
    fontSize == 13
    }
    $('.post_content p').css('font-size', fontSize + 'px')
    });
    });</script>

然后是css样式,具体效果看文章页,

    /*change content font size*/
    #resizer {PADDING: 0px 8px 0 0;FLOAT: left;}
    #resizer LI {DISPLAY: inline; FLOAT: left; COLOR: #b4b4b4; MARGIN-LEFT: 5px;}
    #resizer LI A {BORDER: #c8c8c8 1px solid; TEXT-ALIGN: center;  WIDTH: 16px; DISPLAY: block; HEIGHT: 16px;}
    #resizer LI A:hover {BACKGROUND: #ebebeb; text-decoration: none;}

在你想要添加按钮的地方添加如下代码

    <ul id="resizer">
        <li id="f_s"><a href="javascript:void(0)" title="Smaller">-</a></li>
        <li id="f_m"><a href="javascript:void(0)" title="Normal">N</a></li>
        <li id="f_l"><a href="javascript:void(0)" title="Larger">+</a></li>
    </ul>

接下来是 今天新copy的代码,由于从荒野无灯那里copy过来的时候id什么的不对应,所以又修改了一下

    jQuery(function($) {
        $('#fs-change li').click(function() {
            /***START***配置区*****jQuery font change by 荒野无灯******/
            /***********==================================***********/
            //定义选择器，这里要和主题模板相对应
            var selector='.post_content,.post_content p';
            //ISayMe:我只选择了文章的字体.你可以改成content试试效果,好像连带着侧栏的字体都会更改.
            //定义每次点击后的字体大小增量
            var increment=1;
            //定义默认字体大小
            var fs_n = 13;  //这里我默认用了13号字体.
            /****END***配置区******jQuery font change by 荒野无灯******/
            var fs_cur=$(selector).css('font-size');
            //获取当前字体
            var fs_cur_num= parseFloat( fs_cur, 10);
            var id = $(this).attr('id');
            switch(id)
            {
            case 'fs_dec':
                fs_cur_num -= increment;
                break;
            case 'fs_inc':
                fs_cur_num += increment;
                break;
            case 'fs_n':
            default:
                fs_cur_num=fs_n;
            }
            $(selector).css('font-size', fs_cur_num + 'px');
            return false;
            });
        });

然后在你想要添加按钮的地方添加如下代码就好了.

    <ul id="fs-change">
    <li id="fs_dec"><a href="#" title="再小点再小点!">-</a></li>
    <li id="fs_n"><a href="#" title="我要返回地球">N</a></li>
    <li id="fs_inc"><a href="#" title="给点力吧">+</a></li>
    </ul>
css方面只要把上面的那个resizer改成fs-change即可.或者将按钮的id改成resizer,将jquery函数的选择器改成resizer都行.

OK,完工!!
