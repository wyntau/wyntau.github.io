---
layout: post
title: PhilNa2首页文章收缩及问题修复
pid: 117
comments: true
tags: [PhilNa2, WordPress, 原创]
categories: [WordPress]
---
今天终于有空写写这个了.话说这个效果最先是木木 博客上的效果,可惜现在连木木都不用了,他又换上了宽屏,看着好大气....

虽然木木不用了.可是好多人还没用上啊.所以我感觉就有写写的必要.毕竟这个效果真的很好.可以很节约首页空间,而且在一定程度上感觉很炫(这样也算炫?好吧.我承认我老土了 :jiong: )

为了实现这个效果,我也算是花了不少的功夫. 光copy代码还不行,还要根据自己的主题进行一番改造才可以.原来刚刚弄到自己的博客上的时候,潜伏了好多的小问题.最近也解决的差不多了.所以有必要向大家汇报一下了.哈哈.
别的也不多说了.还是代码神马的管事.霍霍.

最先看到的是木木的文章 [首页文章伸缩效果代码分享](http://immmmm.com/sharing-articles-telescopic-effect-code.html) 后来又翻到了改进后的代码 [\[jQuery\] 首页文章伸缩新方式新代码](http://immmmm.com/articles-telescopic-effect-new-code.html),我看到改进后的代码效果更好了.所以就在新代码的基础上按照自己的主题进行了一下修改.

*建议*大家把木木原来的代码和我修改后的代码对照看一下.这样就可以明白修改的地方有神马了,这样以后再有神马别的代码,就可以按照思路给自己添加了.

具体步骤.

*首先*在style.css里面将文章部分的css代码变成隐藏(根据自己的主题调整),即

    #content .post_content{display:none}

*然后*是主角, jquery代码,来自木木的文章[\[jQuery\] 首页文章伸缩新方式新代码](http://immmmm.com/articles-telescopic-effect-new-code.html),我只是把提到的元素换成了我主题里面的对应元素(*如果您用的不是philna2主题,请到木木的博客上看源代码,然后按照自己的主题进行修改*),

    $('#content .post_title').click(function(){ //点击class="post-title"元素（即文章标题）触发事件
        if($(this).next().next().is(':visible')){ //若其相邻的下一个再下一个元素（.post-content，即所点击标题的文章内容）属性为"可见"，则执行下述代码
            $(this).children().text('页面载入中……'); //让其子元素（.post-title a，即所点击的文章标题）文字改为"页面载入中……"
            window.location = $(this).children("a").attr('href'); //取得其子元素（.post-title a）内的href属性并打开；
        }else{ //反之，即.post-content属性为不"可见"（CSS已设置 .post-content{display:none}）
            $('#content .post_content').slideUp(300); //让所有class="post-content"元素以300毫秒速度收缩
            $(this).next().next().slideDown(500,
                function() {
                    $body.animate({
                        scrollTop: $(this).offset().top - 180
                    },
                    400)
                    });//让其相邻的下一个元素（.post-content）以500毫秒速度收缩
        }
        return false; //阻止默认点击打开新窗口事件发生
    });
    $('#content .post_title:first').click(); //模拟用户点击第一个class="post-title"元素（即首篇文章标题）

这样弄完基本上就可以出现效果了,如果没有神马要求的话.就是这么简单.

*但是我在使用此效果后还发现了一些问题.所以在这里一并说说,让大家少走点弯路.*

*第一个*是 文章页的问题.

上述代码和css会使文章部分处于隐藏状态.然后等待jquery代码模拟用户点击标题展开文章.
但是我遇到的问题就是,进入文章页时,如果网络状况不是很好的话.浏览者先看到的只是一个标题.必须要等网页内容加载完毕之后,jquery代码才会模拟用户点击标题. 恰好我用了无觅,无觅的速度确实不怎么快,所以大部分时间文章的内容部分都是隐藏状态.于是我就想在首页点击标题进入文章页后不再隐藏.我还特意去木木那里请教了一下.但是也没有神马结果.只好自己看着解决了.

我的办法说来也不高明,就是改一下文章页部分的ID号,由于jquery的选择器是根据ID号进行定位的.所以我把ID号改了,就不会出现这种情况了.
说的有点多.上代码.

在template.php文件中,将

    <div id="content">

改为如下代码

    <?php if(is_single() || is_page()):?>
                <div id="content2">
            <?php else: ?>
                <div id="content">
            <?php endif;?>

这样,在文章页还有独立页面,ID号是content2, jquery代码就不起作用了.
还需要做的就是在style.css中添加*ID为content2*的css代码,和content的一样就可以了. 修改后的css为

    #content{float:left;width:662px;}
    /*首页隐藏文章*/
    #content .post_content{display:none}
    #content2{float:left;width:662px;}

这样做完,文章页面就不会隐藏了,现在看来这么简单.当时我还停用过无觅一段时间,发现速度提升并不是很明显.后来又想过把无觅单独拿出来放到文章页下面,单独使用一个div,就像现在文章下方的效果.但是对网络的依赖还是很大.都会出现文章先隐藏,然后再展开的情况.所以使用这个改ID的办法,可以说是完美解决.呼呼.

***

文章页的问题解决了.随之而来的就是 文章页下面的导航,就是那个上一篇,下一篇的导航.感谢[奇遇](http://www.qiyuuu.com)大哥及时告知我这个情况.要不然我是不会发现的.哈哈.

原来的效果是点击一下标题,Ajax加载文章内容.但是现在再点击标题,会出现只是跳到文章部分.但是内容并没有改变.原因就是,此Ajax加载,变更的是ID为content的内容,但是现在的文章页的ID是content2,所以会出现内容无变化的情况.对于这个的修改方法,我觉得我的方法也比较简单.就是修改此主题的函数.

具体位置为 js/philna2.js 主题作者压缩了代码,所以你找个解压缩的网站,解压一下,再看下面的步骤.
解压网站推荐http://box.inote.cc/ 我感觉还不错.
在解压后的代码中寻找

    function k() {
            var w = $("#pagenavi a");
            var v = $("#pagenavi");
            var x = $("#pagenavi").html();........................

这样的代码,然后在有content的地方,添加一个content2,变成像下面的效果

    var B = $("#content2,#content");

在下面的function j()下面好像还有一个,虽然不知道是干嘛的,但是也一并改了.没删除东西,所以请放心,不会出现错误

OK,基本上改完啦.改完代码之后你可以选择再压缩,也可以不压缩,直接粘贴到原philna2.js里面替换原内容也行

这样修改完就不会出现文章页也收缩的情况啦.
首页文章收缩,就这样弄完了.是不是很简单?霍霍,多鼓捣就是变得简单.哈哈
你是否也想试试啊?快点鼓捣吧.哈哈
