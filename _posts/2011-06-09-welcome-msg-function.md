---
title: 博客右侧欢迎信息
pid: 163
tags: [PhilNa2, WordPress]
---
来我这里的朋友是否注意到这个小玩意了呢?嘻嘻,早就弄上了,

具体效果见此处 (点击看清晰图)

![欢迎信息](/uploads/2011/06/20110609-163-01.png)

这个东西的来历呢,应该还是从PhilNa2说起.在早期版本的PhilNa2中是有这个功能的.只是在后来的版本中去掉了这个功能,我不明白是什么原因.呵呵.

还好在winysky的W1s主题中找到了.winysky写曾经写过一篇文章分享过这个功能.具体原文请看 [复杂的博客欢迎](http://winysky.com/complex-blog-welcome)

貌似原函数经过了winy的一点修改,也可能没修改,反正我搞不明白了.对照了一下从Wordpress的Svn上下载的PhilNa2早期版本中的这个功能和W1s中的这个功能,貌似被winy修改后,调用的方法变了,当然是变得更容易使用了.其他的倒是没有什么差别.

这里分享一下吧.最近几天一直没弄什么东西.今天的英语听力测试还有口语测试总算过去了.结果咋样不管了.过去就好.

代码太长,因此不贴了.给大家压缩包就好.

使用方法,将php文件中的代码放到functions.php中就好了.至于怎么放,大家应该都明白吧.呵呵

在想要显示欢迎信息的地方使用&lt;?php welcome_msg();?&gt;调用就好.
如果可以的话,你还可以用css美化一下.就像我的这样.

点击下载咯[welcome_msg.php.zip](/uploads/2011/06/welcome_msg.php.zip)

经过大家的提示,这个效果貌似会在有些浏览器里出现被搜索框挡住的情况,由于我对css方面一窍不通,所以我把这个效果撤下来了.等我有能力调整好再说吧.但是这个代码是非常有用的.以后要是你用到的话.就派上用场了.哈哈
