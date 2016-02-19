---
layout: post
title: 我的wordpress文章版权折腾记
pid: 26
comments: true
tags: [WordPress, 原创]
categories: [WordPress]
---
昨天在feedburner里面开启了邮件订阅的功能.现在用chrome(FF会直接出现我的文章列表,没有订阅器选项)打开[我的feedburner地址](http://feedburner.google.com/fb/a/mailverify?uri=isayme),可以看到除了我列出来的众多RSS订阅器外,下面还给出了一个使用EMail订阅的功能.点击一下,就弹出了一个高550宽520px的新窗口.输入邮箱地址就订阅OK啦.

看到这个指定大小的新窗口效果,我比较喜欢,想着该怎么在文章中出现.我现在的效果是 点击链接之后就出现了一个新标签而不是一个指定大小的新窗口.所以去网上找找嘛.
找是找到了,就是用以下的标签方法实现

    <a href="#" onclick="window.open('http://feedburner.google.com/fb/a/mailverify?uri=isayme','_blank','width=520,height=550')">邮箱订阅</a>

但是在操作的过程中还是遇到了一点问题.

我在文章最后添加版权使用的方法是我的文章[wordpress的feed输出版权信息](/2011/03/9-wordpresss-feed-output-copyright-information.html)中提到的在functions.php里面添加一个函数实现的.具体方法请前往我的那篇文章.

于是我把a标签换成上面说的那种格式.保存.额哦.进不去网站啦.我还以为是把什么标点删掉了.于是看了看,不是因为标点的问题.那问题是什么呢? 找了好一会才知道.原来就是新增加的这句话的问题.这句话导致整个网站进不去. 删掉链接就可以.

那我就试试另外一种方法.把版权那段话加在文章页模板的content后面.一试,咦,这次可以使用啦,点击链接也是我想要的指定大小的新开窗口.看来这句话使用的地方还是有要求的.这是什么情况?我很纳闷.

但是后面这种方法只能在文章页添加版权声明(可否加判断实现我还真不知道),而没法在 feed输出中添加.而且那个函数里面的当前网址'.get_permalink().'和标题'.get_the_title().'的变量在这里不能正常使用.

权衡了一下啊.还是不要那个指定大小的新开窗口了.就使用_blank标签就行了.我也不想再更改代码了,整不好.又把网站搞的进不去了.
