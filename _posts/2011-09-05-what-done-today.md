---
title: 今日主题进展
pid: 217
tags: [Themes]
---
今天又是一直在鼓捣主题,把昨天没有完成的功能给补了一下.
今天主要完成的功能

1,ajax提交评论功能.我最怕的就是这个,这个真不好弄,以前没弄过,这次一点一点的测试.本来想直接用willinkan的ajaxcomment文件的,但是我的评论部分可能不是太标准,所以出问题不少,一想从头开始改的话还不如自己写一个呢.于是就自己写了一个.

将wp根目录的comment-post.php文件改写一下,写的不怎么样,但是基本上可以正常工作了.刚刚用opera FireFox和Chrome都测试了.可以正常评论.
发评论前对邮箱进行检查,防止冒充管理员.
加上了小墙,防spam用的.

2,回复别人的时候添加 @某人.由于这个主题的回复部分我不打算做成嵌套评论而是做成philna2那种的.所以就加这个@回复.这个功能的代码是直接从philna2中拿过来的.我就按照这个主题改了一下.

没有别的了.
新建了一个子站,大家可以去看看效果,欢迎反馈 <http://test.isayme.com>
