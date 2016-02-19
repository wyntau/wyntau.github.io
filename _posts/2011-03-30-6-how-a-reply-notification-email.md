---
layout: post
title: 转-如何让wordpress评论者收到回复通知邮件？
pid: 6
comments: true
tags: [WordPress]
categories: [WordPress]
---
注:本文转自[dboy~小真の365天](http://www.dboy365.com/)博客.原文地址请[点击](http://www.dboy365.com/archives/611).感谢dboy精简了这个插件.我按照他的说明设置之后,邮件回复功能正常.因此才转载这篇文章.希望更多的同学能够使用上邮件回复的功能.

以下为原文.(原文的下载地址好像已经失效了.我把下载的文件上传到了115网盘,大家可以下载.如果过期的话,请告诉我.我会续期)

最近常常要给一些朋友回复评论，但刚接触wordpress不久，不清楚直接回复对方能否收到通知邮件，我想应该是可以的，因为对方在评论的时候已经留下了邮箱地址，但今天才和JOE测试并确认了：回复对方是不会发送通知邮件的，那对方岂不是不知道我们的回复，互动性大打折扣… … 已是开始寻找解决方案，经过强大的Google，历经艰辛学到了解决方法，下面就分享给大家，避免大家遇到同样的问题时走弯路。

1、安装**Mail To Commenter**插件

该插件口碑不错，我本来是安装了Comment Reply Notification插件，都配置好了，但发现其不能正常发送邮件而不得不卸载；最后安装了**Mail To Commenter** 并经过自己的修改，将一些没有必要的功能都去掉了，感觉非常棒；

大家如果想使用原版，可以进入WP后台》插件》添加新插件 页面搜索：**Mail To Commenter**进行安装并激活，激活后需要进入：设置》Mail To Commenter options 设置开启才能使用；

**小D推荐使用以下修改版的：**

我将很多使用不到的后台设置去掉了，设置界面简化了很多，您完全用不着在页面中添加任何代码，安装后，前台界面也不会发生任何变化，但邮件通知确能完美的运行；[点此下载修改版文件↓](http://u.115.com/file/f088944be8)下载后，通过WP后台》插件》添加新插件》上传，选择下载的ZIP包**安装并激活**，然后进入：设置》Mail To Commenter **勾选激活邮件通知**，再点击右上角的“**更新设置**”按钮即可。

修改版后台设置如下图：

![](/uploads/2011/03/30_01.png)

2、根据自己的需要**修改发件人姓名及邮箱地址**

编辑该插件文件夹下的 mailtocommenter_functions.php 文件，搜索 From: 定位到这个位置并操作如下：

(你也可以进入已安装的插件列表，找到Mail To Commenter，点编辑，然后在右侧选择上述文件即可编辑)

a、如果你使用官方版本，请将 From: 所在的这一行替换为如下代码再进入b操作

    $headers = 'From: replay <replay@yourmail.com>' . "rn\";

b、如果你使用小D提供的版本，请将直接将 replay 修改为发件人姓名，将 &lt;&gt; 中的邮箱更换为你希望使用的；

修改文件并确认无误后记得点击最下方的“更新文件”以保存；

测试一下吧(退出管理员账号，发一个评论，然后登陆管理员账户，进入日志页面点回复)，是不是很好用，你可以根据自己的需要修改邮件主题、正文的内容及排版（需要进行第3不修改），自由度非常高。

如果没有收到邮件，可能是发送迟缓，一般情况能实时送达，特殊情况可能要等好几个小时；

3、根据自己的喜好修改邮件内容及排版（可选设置）

进入设置》Mail To Commenter，根据右侧的提示，修改邮件模板即可；

小D将设置的内容也分享给大家使用：

邮件主题：

    您对《%post_title%》的评论有了新回复

邮件内容：

    %user%，您好：<br/>
    您对 《<a href="%post_link%">%post_title%</a>》的评论被%comment_author%回复了，快去看看吧^_^<br/>
    <div style="padding:5px;border:1px solid #888;">您的评论：<br />%your_comment%<div style="margin-left:5px;margin-right:5px;padding:5px;border:1px solid #ccc;">
    %reply_comment%<br /></div>
    <div style="margin-top:10px;margin-left:10px;padding-bottom:10px;border-bottom:1px solid #ccc;">
    <a href='%comment_link%' target='_blank'>查看回复</a>或点<a href="mailto:%admin_email%">这里</a>给作者回Email</div>
    欢迎再次访问：<a href="%blog_link%">%blog_name%</a>    <a href="%rss_link%">%rss_name%</a><br/>

OK，需要做的就是这些了，使用的时候，你只需要登录管理员账号(如果设置成仅管理员可以通知)，进入日志页面，点对方评论的“回复”，回复的内容对方就能通过邮件收到了。
