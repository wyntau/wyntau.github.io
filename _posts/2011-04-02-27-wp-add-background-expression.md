---
layout: post
title: wp后台回复添加表情
pid: 27
comments: true
tags: [WordPress, 原创]
categories: [Wordpress]
---
本文参考了[奚少收藏小窝](http://www.xishao.net/wp/547.html),增加多行表情的方法姑且算是我找到的吧.呵呵.

我在本地试验成功了,但是还没有在服务器上使用.原因是我正在寻找怎么在后台回复才能和文章页面回复一样能够添加@用户名的效果.等以后找到了方法,再在服务器上添加.那样就不用每次审核完评论之后回复的时候都要回到文章页面.因为好像在前台才能保证 mail to comment正常吧?不是很清楚.

下面就记录一下实现方法.前提条件是你的前台也有了表情了哦,我想大部分博友都会已经添加了吧.所以这里就不说了.自己动手丰衣足食.呵呵

代码如下

    <div>
    <script type="text/javascript" language="javascript">
    /*<![CDATA[*/
    function grin(tag) {
    var myField;
    tag = ' ' + tag + ' ';
    if (document.getElementById('replycontent') && document.getElementById('replycontent').type == 'textarea') {
    myField = document.getElementById('replycontent');
    } else {
    return false;
    }
    if (document.selection) {
    myField.focus();
    sel = document.selection.createRange();
    sel.text = tag;
    myField.focus();
    }
    else if (myField.selectionStart || myField.selectionStart == '0') {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    var cursorPos = endPos;
    myField.value = myField.value.substring(0, startPos)
    + tag
    + myField.value.substring(endPos, myField.value.length);
    cursorPos += tag.length;
    myField.focus();
    myField.selectionStart = cursorPos;
    myField.selectionEnd = cursorPos;
    }
    else {
    myField.value += tag;
    myField.focus();
    }
    }
    /*]]>*/
    </script>
    <p style="cursor:pointer;">
    <a onclick="javascript:grin(':mrgreen:')"><img src="/wp-includes/images/smilies/icon_mrgreen.gif" /></a>
    <a onclick="javascript:grin(':razz:')"><img src="/wp-includes/images/smilies/icon_razz.gif" /></a>
    <a onclick="javascript:grin(':sad:')"><img src="/wp-includes/images/smilies/icon_sad.gif" /></a>
    <a onclick="javascript:grin(':smile:')"><img src="/wp-includes/images/smilies/icon_smile.gif" /></a>
    <a onclick="javascript:grin(':oops:')"><img src="/wp-includes/images/smilies/icon_redface.gif" /></a>
    <a onclick="javascript:grin(':grin:')"><img src="/wp-includes/images/smilies/icon_biggrin.gif" /></a>
    <a onclick="javascript:grin(':eek:')"><img src="/wp-includes/images/smilies/icon_surprised.gif" /></a>
    <a onclick="javascript:grin(':???:')"><img src="/wp-includes/images/smilies/icon_confused.gif" /></a>
    <a onclick="javascript:grin(':cool:')"><img src="/wp-includes/images/smilies/icon_cool.gif" /></a>
    <a onclick="javascript:grin(':lol:')"><img src="/wp-includes/images/smilies/icon_lol.gif" /></a>
    <a onclick="javascript:grin(':mad:')"><img src="/wp-includes/images/smilies/icon_mad.gif" /></a>
    <a onclick="javascript:grin(':twisted:')"><img src="/wp-includes/images/smilies/icon_twisted.gif" /></a>
    <a onclick="javascript:grin(':roll:')"><img src="/wp-includes/images/smilies/icon_rolleyes.gif" /></a>
    <a onclick="javascript:grin(':wink:')"><img src="/wp-includes/images/smilies/icon_wink.gif" /></a>
    <a onclick="javascript:grin(':idea:')"><img src="/wp-includes/images/smilies/icon_idea.gif" /></a>
    <a onclick="javascript:grin(':arrow:')"><img src="/wp-includes/images/smilies/icon_arrow.gif" /></a>
    <a onclick="javascript:grin(':neutral:')"><img src="/wp-includes/images/smilies/icon_neutral.gif" /></a>
    <a onclick="javascript:grin(':cry:')"><img src="/wp-includes/images/smilies/icon_cry.gif" /></a>
    <a onclick="javascript:grin(':?:')"><img src="/wp-includes/images/smilies/icon_question.gif" /></a>
    <a onclick="javascript:grin(':evil:')"><img src="/wp-includes/images/smilies/icon_evil.gif" /></a>
    <a onclick="javascript:grin(':shock:')"><img src="/wp-includes/images/smilies/icon_eek.gif" /></a>
    <a onclick="javascript:grin(':!:')"><img src="/wp-includes/images/smilies/icon_exclaim.gif" /></a>
    <br />
    </p>
    </div>

将以上代码复制到*wp-admin/includes/template.php*文件,搜索

    <div id="replyhead" style="display:none;">

然后将代码放在

    <?php _e('Reply to Comment'); ?>

后， &lt;/div>之前即可。

看到前面的那些表情图片定义了吗?
最好改成和你的前台表情定义一致.要不然效果会很混乱哦.
如果你有多套表情的话.可以看我的[给WP增加多套表情](/2011/04/24-increase-the-expression-of-wp.html)里面的给多套表情增加定义的方法.然后在上面的代码中p标签结束后再增加一对p标签.这样两套表情就会占用两行了.

如果按照上面的做法不成功后.试着修改一下那些图片的地址.修改成绝对地址看看.
