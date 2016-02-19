---
layout: post
title: 短代码 mp3player
pid: 127
comments: true
tags: [WordPress, 原创]
categories: [Wordpress]
---
代码来源

感谢 良心发现的[WP短代码集成音乐播放器](http://ongakuer.com/archives/shortcode-music/)以及荒野无灯weblog 的[不用audio-player插件也播放mp3](http://www.ihacklog.com/wordpress/plugins/add-wp-shortcode-to-enable-media-playing.html)

在荒野无灯的那个代码中,功能非常强大,可以播放各种格式的媒体文件,但是我好像用不到这么强大的播放器,只是有时候想要添加一个mp3文件就行了,而且不想为了N久才播放一次文件再去每次加载一个比较大的js文件.所以我把 荒野无灯的那些代码里面的关于播放mp3文件的代码放到了良心发现的代码里面,(为什么放到那里面呢,因为良心的那个函数比较简短)这样就可以方便的用短代码添加mp3文件了.

我修改良心发现的添加短代码的函数如下.

    function mp3player($atts, $content=null){
          extract(shortcode_atts(array("auto"=>'0'),$atts));
          $autostart=$auto?'yes':'no';
        return '<embed src="'.get_bloginfo('template_directory').'/swf/player.swf?soundFile='.$content.'&autostart='.$autostart.'&animation=yes&encode=no&initialvolume=80&remaining=yes&noinfo=no&buffer=5&checkpolicy=no&rtl=no&bg=E5E5E5&text=333333&leftbg=CCCCCC&lefticon=333333&volslider=666666&voltrack=FFFFFF&rightbg=B4B4B4&rightbghover=999999&righticon=333333&righticonhover=FFFFFF&track=FFFFFF&loader=009900&border=CCCCCC&tracker=DDDDDD&skip=666666" type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="always" width="290" height="30">';
        }
        add_shortcode('mp3','mp3player');

需要的文件就是一个swf文件,感觉效果很好.可以显示播放音乐的文件名,还可以调声音大小.
修改后的函数以及swf文件,下载地址 点击[此处](http://u.115.com/file/e6yixs7o),下载后放到主题目录的swf文件夹就可以了.没有swf的话,新建一个也行.

后台添加文件的时候,在html编辑器模式,使用[mp3\]\[/mp3](将空格去掉)将mp3文件的地址括起来就可以了.
默认不自动播放,如果要自动播放的话,使用[mp3 auto=1\]\[/mp3]
效果见下面(我没有放mp3文件)
[mp3\]

***

update(5-11-23:21)刚刚看到木木的[给WordPress主题添加短代码功能](http://immmmm.com/add-shortcodes-wordpress-theme.html)里面的那个mp3函数和我现在用的这个只是return的内容不一样,这个应该就是添加短代码的格式.这样我们就可以按照这个格式添加更多的短代码了.聪明的你快去试试吧 :lol:
