---
layout: post
title: css3版读者墙
pid: 179
comments: true
tags: [CSS3, 读者墙]
categories: [WordPress]
---
先说明一下,在看本篇文章之前,请确定你使用的是Chrome或者是firefox浏览器.IE家族效果不敢保证~~

前两天在大前端那里看到的一篇文章,讲的是如何用css3写一个读者墙.我看了demo,非常给力.很喜欢.就收藏了下来.

今天考完了万恶的英语,所以打算弄点东西.就把那个css3的代码拿过来了.但是我原来用的读者墙里面 有那个血条显示.我感觉那个创意非常好,不忍心丢掉.所以我就修改了一下.将血条显示和css读者墙弄在了一起.下面是我弄完的效果(鼠标放上就可以看到效果了.呵呵).完整的效果可以去读者墙看看去.呵呵.
相比之下,这个读者墙才是真正的给力!!

**注:**Chrome效果最好.有想不到的惊喜哟~~Firefox就弱了点.但是基本上无影响. IE最差劲了,会使得那个血条跑到最上面去,但是还好,没发现有错位的情况.
~~所以换完浏览器再来看吧.

大前端原文地址:点击[此处](http://www.daqianduan.com/css3-wordpress-wall/)

<pre>
<style>
/*readerwall*/
body{overflow-x: hidden;}
.readerwall{padding:12px 0 12px 15px; font-size:12px;overflow:visible;}
.readerwall li{width:40px;height:40px;margin:0;padding:5px 0 5px 5px;float:left;list-style:none;border: 1px solid #DFDFDF;-moz-border-radius:2px;-khtml-border-radius: 2px;-webkit-border-radius: 2px;border-radius: 2px;}
.readerwall .active-bg{width:40px;height:2px;_font-size:0;margin:-3px 0 0 -2px;background:#DFDFDF; }
.readerwall .active-degree{background:red;width:40px;height:2px;_font-size:0;}
.readerwall a{width:36px;height:36px;display:inline-block;position:relative;margin:0 0px 2px 0; text-decoration:none}
.readerwall .pic{position:absolute;top:0;left:0;z-index:100;width:36px;height:36px;display:block;-webkit-transform-style:preserve-3d;-webkit-backface-visibility:hidden;-webkit-transition:all .4s ease-in-out;-moz-transition:all .4s ease-in-out;-o-transition:all .4s ease-in-out;border-radius:4px; text-indent:-9999px}
.readerwall .num{position:absolute;top:0;left:0;z-index:99;width:34px;height:34px;line-height:34px;color:#E02523;font-size:18px;font-weight:bold;display:block;background:#fff;text-align:center;border:#bbb 1px solid;box-shadow:0 0 4px #ccc;-webkit-transform:rotateY(-180deg);-webkit-transform-style:preserve-3d;-webkit-backface-visibility:hidden;transition:all .4s ease-in-out;-webkit-transition:all .4s ease-in-out;-moz-transition:all .4s ease-in-out;-o-transition:all .4s ease-in-out;border-radius:4px}
.readerwall .name{position:absolute;top:0;left:0;color:#333;display:block;width:1px;height:1px;overflow:hidden;-webkit-transform-style:preserve-3d;-webkit-backface-visibility:hidden;-webkit-transition:all .2s ease-in-out;-moz-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;text-align:center}
.readerwall a:hover .pic{z-index:100;border-color:#eee;-webkit-transform:rotateY(180deg);-moz-transform:rotateY(180deg)}
.readerwall a:hover .num{z-index:101;-webkit-transform:rotateY(0deg);-moz-transform:rotateY(0deg);opacity:.8}
.readerwall a:hover .name{top:-28px;left:-38px;z-index:101;padding:4px 6px;height:20px;line-height:20px;overflow:hidden;background:#fff;border-radius:2px;box-shadow:0 0 3px #000;min-width:100px;opacity:.8}
</style>
</pre>

<div class="readerwall"><li><a target="_blank" href="http://www.qiyuuu.com"><span class="pic" style="background: url(http://www.gravatar.com/avatar/cab095b19fc8e1d184a553f506db0f93?s=36&d=monsterid&r=G) no-repeat;">pic</span><span class="num">125</span><span class="name">奇遇</span></a><div class='active-bg'><div class='active-degree' style='width:40px'></div></div></li><li><a target="_blank" href="http://japhia.info"><span class="pic" style="background: url(http://www.gravatar.com/avatar/671a44d0800580ad63c6eab82aa0c17e?s=36&d=monsterid&r=G) no-repeat;">pic</span><span class="num">108</span><span class="name">Japhia</span></a><div class='active-bg'><div class='active-degree' style='width:34.56px'></div></div></li><li><a target="_blank" href="http://dengken.name"><span class="pic" style="background: url(http://www.gravatar.com/avatar/27820dbbfb7b6672388ad71ec6249772?s=36&d=monsterid&r=G) no-repeat;">pic</span><span class="num">64</span><span class="name">邓肯</span></a><div class='active-bg'><div class='active-degree' style='width:20.48px'></div></div></li><li><a target="_blank" href="http://imluren.com"><span class="pic" style="background: url(http://www.gravatar.com/avatar/79c34a8e43c9c81dbb8e444ecdf1bb61?s=36&d=monsterid&r=G) no-repeat;">pic</span><span class="num">56</span><span class="name">IM路人</span></a><div class='active-bg'><div class='active-degree' style='width:17.92px'></div></div></li><li><a target="_blank" href="http://www.11reading.com"><span class="pic" style="background: url(http://www.gravatar.com/avatar/70bec75394c6154665a816268e2ee409?s=36&d=monsterid&r=G) no-repeat;">pic</span><span class="num">55</span><span class="name">spityaoyao</span></a><div class='active-bg'><div class='active-degree' style='width:17.6px'></div></div></li><div class="clear"></div></div>
