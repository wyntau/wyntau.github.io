---
layout: post
title: wp后台编辑器添加表情
pid: 34
comments: true
tags: [PhilNa2, WordPress]
categories: [WordPress]
---
今天又弄了个侧边栏3栏显示,感觉不错. 但是我发现我在编辑的时候喜欢加点表情,觉得只有表情才能表达某个时刻的心情.

原来是在前台的评论框里面 点击想要的表情看看是数目转义字符,然后复制到编辑器里面.可是又写了几次,感觉这样好麻烦啊.给编辑器添加表情该多好啊.所以到网上去找找.果真有人有这样的需求,所以我也顺便弄下来啦 :lol:
效果图

![](/uploads/2011/04/04_01.png)

参考地址是[荒野无灯weblog](http://www.ihacklog.com/wordpress/wpskills/add-wp-smiley-for-html-and-rich-text-editor.html)

具体代码如下.(哈哈,最近一直在鼓捣这个wordpress,越来越喜欢了 :evil: )

    /*add smiles to editor*/
            if (strpos($_SERVER['REQUEST_URI'], 'post.php') || strpos($_SERVER['REQUEST_URI'], 'post-new.php') || strpos($_SERVER['REQUEST_URI'], 'page-new.php') || strpos($_SERVER['REQUEST_URI'], 'page.php'))
    {
        function ihacklog_add_smiley()
        {
            echo <<<eot
            <script type="text/javascript">


            function grin(tag)
            {
            var myField;
            tag = ' ' + tag + ' ';
            if (document.getElementById('content') && document.getElementById('content').style.display != 'none' && document.getElementById('content').type == 'textarea')
            {
                myField = document.getElementById('content');

                if (document.selection)
                {
                myField.focus();
                sel = document.selection.createRange();
                sel.text = tag;
                myField.focus();
                }
                else
                    if (myField.selectionStart || myField.selectionStart == '0')
                    {
                    var startPos = myField.selectionStart;
                    var endPos = myField.selectionEnd;
                    var cursorPos = endPos;
                    myField.value = myField.value.substring(0, startPos) + tag + myField.value.substring(endPos, myField.value.length);
                    cursorPos += tag.length;
                    myField.focus();
                    myField.selectionStart = cursorPos;
                    myField.selectionEnd = cursorPos;
                    }
                    else
                    {
                    myField.value += tag;
                    myField.focus();
                    }
            }
            else
            {
            tinyMCE.execCommand('mceInsertContent', false, tag);
            }
        }

        var smiley='<p><a href="javascript:grin(':no:')"><img src="../wp-includes/images/smilies/1.gif"  /></a> <a href="javascript:grin(':razz:')"><img src="../wp-includes/images/smilies/17.gif" alt="冷笑" /></a> <a href="javascript:grin(':sad:')"><img src="../wp-includes/images/smilies/30.gif" alt="伤心" /></a> <a href="javascript:grin(':evil:')"><img src="../wp-includes/images/smilies/2.gif" alt="邪恶" /></a> <a href="javascript:grin(':eat:')"><img src="../wp-includes/images/smilies/3.gif" alt="感叹" /></a> <a href="javascript:grin(':smile:')"><img src="../wp-includes/images/smilies/33.gif" alt="微笑" /></a> <a href="javascript:grin(':sex:')"><img src="../wp-includes/images/smilies/13.gif" alt="微笑" /></a> <a href="javascript:grin(':oops:')"><img src="../wp-includes/images/smilies/25.gif" alt="红脸" /></a> <a href="javascript:grin(':grin:')"><img src="../wp-includes/images/smilies/4.gif" alt="咧嘴笑" /></a> <a href="javascript:grin(':eek:')"><img src="../wp-includes/images/smilies/18.gif" alt="吃惊" /></a> <a href="javascript:grin(':han:')"><img src="../wp-includes/images/smilies/6.gif" alt="吃惊" /></a> <a href="javascript:grin(':zzz:')"><img src="../wp-includes/images/smilies/29.gif" alt="惊讶" /></a> <a href="javascript:grin(':shock:')"><img src="../wp-includes/images/smilies/7.gif" alt="惊讶" /></a> <a href="javascript:grin(':mask:')"><img src="../wp-includes/images/smilies/27.gif" alt="惊讶" /></a> <a href="javascript:grin(':surprise:')"><img src="../wp-includes/images/smilies/26.gif" alt="惊讶" /></a> <a href="javascript:grin(':jiong:')"><img src="../wp-includes/images/smilies/8.gif" alt="惊讶" /></a> <a href="javascript:grin(':cold:')"><img src="../wp-includes/images/smilies/14.gif" alt="惊讶" /></a> <a href="javascript:grin(':han:')"><img src="../wp-includes/images/smilies/15.gif" alt="惊讶" /></a> <a href="javascript:grin(':shut:')"><img src="../wp-includes/images/smilies/23.gif" alt="惊讶" /></a> <a href="javascript:grin(':???:')"><img src="../wp-includes/images/smilies/5.gif" alt="困惑" /></a> <a href="javascript:grin(':cool:')"><img src="../wp-includes/images/smilies/10.gif" alt="耍酷" /></a> <a href="javascript:grin(':ool:')"><img src="../wp-includes/images/smilies/32.gif" alt="惊讶" /></a> <a href="javascript:grin(':lol:')"><img src="../wp-includes/images/smilies/24.gif" alt="大笑" /></a> <a href="javascript:grin(':mad:')"><img src="../wp-includes/images/smilies/31.gif" alt="抓狂" /></a> <a href="javascript:grin(':love:')"><img src="../wp-includes/images/smilies/20.gif" alt="惊讶" /></a> <a href="javascript:grin(':twisted:')"><img src="../wp-includes/images/smilies/19.gif" alt="痛苦" /></a> <a href="javascript:grin(':roll:')"><img src="../wp-includes/images/smilies/21.gif" alt="转眼珠" /></a> <a href="javascript:grin(':wink:')"><img src="../wp-includes/images/smilies/22.gif" alt="眨眼" /></a> <a href="javascript:grin(':idea:')"><img src="../wp-includes/images/smilies/9.gif" alt="好主意" /></a> <a href="javascript:grin(':arrow:')"><img src="../wp-includes/images/smilies/16.gif" alt="" /></a> <a href="javascript:grin(':neutral:')"><img src="../wp-includes/images/smilies/12.gif" alt="自然" /></a> <a href="javascript:grin(':cry:')"><img src="../wp-includes/images/smilies/28.gif" alt="哭" /></a> <a href="javascript:grin(':mrgreen:')"><img src="../wp-includes/images/smilies/11.gif" alt="绿脸先生" /></a></p>';
                jQuery('#quicktags').before(smiley);

    </script>
    EOT;
            }

        add_action('admin_footer','ihacklog_add_smiley');
    }
里面的那些表情转义字符还有图片名称和alt描述还需要你改一下才可以哦.要不然后台一片难堪啊 :eek:
