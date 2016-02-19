---
layout: post
title: 后台快速添加mp3按钮
pid: 128
comments: true
tags: [WordPress, 原创, 转载]
categories: [WordPress]
---
接上一篇[短代码mp3player](/2011/05/shortcode-enable-mp3player.html)

**首先感谢荒野无灯分享的源代码,要不是这个源代码,我也不会修改的....太菜了,只能修改人家的东西,自己就是不会写..**

在上一篇中讲到的在后台html编辑器模式添加mp3的时候需要 用[mp3\]\[/mp3]将mp3文件的地址括起来,有点不够人性化,正好我看到 荒野无灯的那篇文章[在后台添加quicktags——续《不用audio-player插件也播放mp3》](http://www.ihacklog.com/wordpress/plugins/add-media-quicktags-for-wp.html) 中,用functions.php中的函数就可以给后台quicktag添加按钮,由于荒野无灯也是为添加多媒体做的按钮,但是他添加了两个按钮,添加mp3的那个按钮没法设置是否自动播放.

所以我只是稍微修改了一下,把输出内容修改了一下,另外又增加一个是否自动播放的参数选择.

现在想要添加mp3文件的时候,只要按一下mp3的按钮,然后输入mp3文件的地址.再选择是否自动播放就可以了,0为不自动播放,1为自动播放.默认情况下是不自动播放.
functions.php中的代码如下

    if (strpos($_SERVER['REQUEST_URI'], 'post.php') || strpos($_SERVER['REQUEST_URI'], 'post-new.php') || strpos($_SERVER['REQUEST_URI'], 'page-new.php') || strpos($_SERVER['REQUEST_URI'], 'page.php'))
    {
            function sayme_add_mp3_tags()
            {
            echo <<<eot
            <script type="text/javascript">
                function insertAudio()
                {
                    var U=prompt('请输入mp3 URL','http://');
                    if(!U)
                        return false;
                    var audio_url = jQuery.trim(U);
                    if(audio_url == null || audio_url == "" || audio_url =='http://')
                    {
                    alert('请输入正确的mp3 URL!');
                    return false;
                    }
                    else
                    {
                    var autostart = prompt('auto autostart?' , '0');
                    edInsertContent(edCanvas, "[ mp3 auto=" + autostart+"]" + audio_url + "[/mp3]");
                    }//注意将中括号和mp3之间的空格去掉,下同
                }
        if(document.getElementById("ed_toolbar"))
        {
            qt_toolbar = document.getElementById("ed_toolbar");
            edButtons[edButtons.length] = new edButton('mp3' ,'mp3' ,'[ mp3]' ,'[/mp3]' ,'' );
            var qt_button = qt_toolbar.lastChild;
            while (qt_button.nodeType != 1){
                qt_button = qt_button.previousSibling;
            }
            qt_button = qt_button.cloneNode(true);
            qt_button.value = 'mp3';
            qt_button.title = '插入mp3';
            qt_button.onclick = function () { insertAudio();}
            qt_button.id = "ed_audio";
            qt_toolbar.appendChild(qt_button);
        }
    </script>
    EOT;
            }
        add_action('admin_footer','sayme_add_mp3_tags');
    }
这样做完 在后台的html编辑器模式就可以看到mp3按钮了.
