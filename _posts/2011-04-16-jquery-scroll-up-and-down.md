---
layout: post
title: jQuery上下浮动滚动[4-22更新]
pid: 83
comments: true
tags: [PhilNa2, WordPress]
categories: [WordPress]
---
唉 几天没写点东西啦.
昨天到网上又转了一圈 看到了这个jQuery 上下浮动滚动.原来也看到人家的博客上有,效果不错所以就给自己也整上了.感觉还不错.呵呵

下面说说折腾过程. 说来全部都是人家的东西.也就是记录一下吧.
源代码地址 [捣鼓笔记](http://www.dao-gu.com/web/updown.html),在 安装的时候还遇到了问题.多亏 木木(此木木非彼木木,大家不要弄混了 :evil: ) 帮助我才弄好了.

**首先**是加载jquery库,已经有的就跳过了(philna2跳过).

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>

然后将html部分加入到< /body>前

    <div id="updown">
    <div id="up"></div>
    <div id="comt"></div>
    <div id="down"></div>
    </div>

然后将CSS部分加入到style.CSS文件中

    #updown {
     display:block;
     left:50%;
     margin-left:-520px;  /*设置横向位置*/
     position:absolute;
     top:40%;  /*设置纵向位置*/
     }
     #up {
     background:url(images/updown.gif) -34px 0 no-repeat;
     cursor:pointer;
     height:32px;
     margin:10px 0;
     position:relative;
     width:32px;
     }
    #comt {
     background:url(images/updown.gif) no-repeat;
     cursor:pointer;
     height:32px;
     margin:10px 0;
     position:relative;
     width:32px;
     }
     #down {
     background:url(images/updown.gif) -68px 0 no-repeat;
     cursor:pointer;
     height:32px;
     margin:10px 0;
     position:relative;
     width:32px;
     }

最后是jquery函数部分啦

     jQuery(document).ready(function (a) {
        var c = a("#updown").offset().top;
        $body = window.opera ? document.compatMode == "CSS1Compat" ? a("html") : a("body") : a("html,body");
        a(window).scroll(function () {
            a("#updown").animate({
                top: a(window).scrollTop() + c + "px"
            },
     {
         queue: false,
         duration: 500
     })
        });
        a("#up").click(function () {
            $body.animate({
                scrollTop: "0px"
            },
     1000)
        });
        a("#down").click(function () {
            $body.animate({
                scrollTop: a("#footer").offset().top
            },
     1000)
        });
        a("#comt").click(function () {
            $body.animate({
                scrollTop: a("#comments").offset().top
            },
     1000)
        })
    });

**针对philna2的做法**是 在主题目录的js目录里面新建一个 updown.js文件,然后把上面的函数代码加到里面.然后修改js.php文件.添加上这个js文件的名字就好了.
或者是在head中添加一条类似加载jquery库的方法,加载这个js文件即可.

css部分针对自己的情况再改一下吧.
哦 用到的图片,在 [捣鼓笔记](http://www.dao-gu.com/web/updown.html)上有一个图标,我现在使用的图标是 [狼图腾](http://erick.im)博客中使用的图标,希望他不要介意啊 :evil:
好了.记录完毕.

* * *

无事又到[木木](http://immmmm.com/sliding-navigation-final-version.html)(此处的木木是林木木,额,两个木木,不知道该怎么区分了 :jiong: )博客上看了看.找了点东西.

关于这个滑动导航的部分,他那里有一个貌似更好点的代码.可以放上鼠标慢慢向上向下滚动,只不过图标不是上下浮动而是固定位置的了.我发现貌似这样固定住更好,这样显得比较简单一点.于是我就把样式改成了那个了.
下面只说我用到的部分,想要自己研究的,就去原文看吧.上面已经有了.

html代码不变,css代码也不变,主要就是jquery函数部分变换一下就好了

    jQuery(document).ready(function($){
    $body=(window.opera)?(document.compatMode=="CSS1Compat"?$('html'):$('body')):$('html,body');//修复Opera滑动异常地，加过就不需要重复加了。
    $('#shang').mouseover(function(){//鼠标移到id=shang元素上触发事件
            up();
        }).mouseout(function(){//鼠标移出事件
            clearTimeout(fq);
        }).click(function(){//点击事件
            $body.animate({scrollTop:0},400);//400毫秒滑动到顶部
    });
    $('#xia').mouseover(function(){
            dn();
        }).mouseout(function(){
            clearTimeout(fq);
        }).click(function(){
            $body.animate({scrollTop:$(document).height()},400);//直接取得页面高度，不再是手动指定页尾ID
    });
    $('#comt').click(function(){
        $body.animate({scrollTop:$('#comments').offset().top},400);//滑动到id=comments元素，遇到不规范的主题需调整
    });
    });
    //下面部分放jQuery外围，几个数值不妨自行改变试试
    function up(){
       $wd = $(window);
       $wd.scrollTop($wd.scrollTop() - 1);
       fq = setTimeout("up()", 50);
    }
    function dn(){
       $wd = $(window);
       $wd.scrollTop($wd.scrollTop() + 1);
       fq = setTimeout("dn()", 50);
    }

将上面的ID号换成你的html代码中的ID号就好了.具体的你可以试着改一下那些时间参数,让速度变得快些或者慢些
