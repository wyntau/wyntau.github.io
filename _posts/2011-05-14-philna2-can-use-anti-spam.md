---
layout: post
title: 让PhilNa2用上Anti Spam小墙
pid: 132
comments: true
tags: [PhilNa2, spam, WordPress, 原创]
categories: [WordPress]
---
先说两句废话,Anti Spam小墙,老早就用过,但是主题原因,导致使用小墙后任何人都无法发表评论,所以撤下来了,但是人民的力量是强大滴~~最终这个难题还是被拿下啦,哈哈~~ :eek:

同时感谢[Willin Kan](http://kan.willin.org/)大师写出来的这么厉害的小墙~~

- - -
-
最近两天不知道怎么搞的,来我这里的spam有点多,自从5月8号我写的[Anti Spam小墙貌似已经可以了](/2011/05/anti-spam-works.html),也就是我改造了一下自己的主题然后装上Anti Spam小墙后,这两天抓到了不少了spam.
后台垃圾评论中,被小墙过滤的spam如下.

> 2011-05-08 下午 3:18 提交IP210.87.254.5  
> 2011-05-13 上午 12:56 提交IP 213.0.89.52  
> 2011-05-13 上午 7:51 提交IP 89.248.165.132  
> 2011-05-13 下午 1:52 提交IP 89.248.165.132

通过这些数据,我发现Anti Spam小墙工作情况还是很正常的,至少还没有朋友告诉我说他们的正常评论受到了影响.
因此打算今天告诉大家怎么在philna2主题上使用Anti Spam小墙.

和大家唠叨一下解决的过程吧,希望大家不要嫌我太罗嗦.....

**先说说Anti Spam小墙的原理.** willin kan大师的小墙代码请点击[这里](http://kan.willin.org/?p=1324)

Anti Spam小墙在评论框的地方又增加了一个隐藏的评论框,并且将原本的评论框的名字改为w,将新增的隐藏的评论框的名字改为原来的评论框的名字comment.
这样正常人发表评论的时候是看不到隐藏的评论框comment的.只有spam才会填到那个隐藏的评论框.小墙通过判断 非隐藏的评论框和隐藏的评论框是否为空,即可判断是否为spam.

当comment框里面没有评论,同时w框中有评论的时候,可以确定不是spam(有些人工spam,像正常人那样提交评论,你只能靠自己审核了),就将w框中的评论内容交由comment,然后由comment框向wp系统送出评论.

当comment框里面有内容,而w框中没有内容时,可以确定一定是spam,因为正常评论是填不到w框的,这时小墙就直接拦下评论,放到后台垃圾评论中,什么时候你想起来了就可以去看看小墙的成果啦.. :evil:

以上原理在willin kan大师[给我的回复](http://kan.willin.org/?page_id=88&cpage=11#comment-8661)中也已经证实了,由于在大师回复我两天之前,我已经找了philna2主题不能使用Anti Spam的原因,所以只是再进一步印证一下我的判断是正确的啦.哈哈.靠自己找到问题的原因 很有成就感呀~~ :lol:  :eek:

**下面又开始说说为什么philna2不能使用Anti Spam小墙了**.由于yinheli童鞋写的这个主题功能很强大,在发表评论的时候需要经过一系列的检查后才能送出评论. 这其中的 "**字数检查**" 就是小墙不能使用的原因.

当初刚用Anti Spam小墙的时候,不管我怎么填写评论内容,系统都会提示 "**错误:请输入评论内容**",由于不知道是神马原因,就想看看主题中的哪个文件包含这个提示.但是主题中的文件是没有中文提示的,都是英文,然后再按照语言环境进行转换.

所以我跑到language文件夹中找了一下**zh_CN.po**文件.搜索"**错误: 请输入评论内容**",在第537行找到了,对应的英文为

    "Error: please type a comment."
而且还找到了 语言的位置位于**app/commentajax.php:165**,也就是app/commentajax.php的第165行啦.
马上翻到app/commentajax.php文件.找到第165行,看到了下面的内容

    if ( '' == $comment_content )
            //wp_die( __('Error: please type a comment.') );
            fail(__('Error: please type a comment.', YHL));
这个就是判断评论字数的了.如果评论内容为空,则抛出错误提示.
向上看,一直到第125行,可以看到如下内容

    $comment_content      = ( isset($_POST['comment']) ) ? trim($_POST['comment']) : null;
这玩意我还能看懂,三元运算嘛,如果设置了comment框的话,则将comment中的内容赋给**$comment_content**,否则赋值为**NULL**,也就是空啦.然后将**$comment_content**用于后面的字数检查.

找到了原因就好办了,将**$_POST['comment']**中的**comment**改为**w**就好啦.
这样做完,访客就可以发表评论啦,为什么说是访客呢,嘿嘿,因为这样改完,管理员就无法发表评论啦, :evil:

小墙的工作原理是,只在访客界面添加隐藏的评论框,管理员登录后是没有隐藏的评论框(即w框)的. 没有w框,不管怎么检查w都为空啊,所以**$comment_content**的内容就一直为空,因此就一直通不过字数检查咯. :lol:

**咋办?**还是从**$comment_content**入手啊.三元运算不是才用了两元吗?最后一元也利用起来就好了呗~~
判断是否设置了comment框,如果设置了comment,就将comment框的内容赋给$comment_content做字数检查,如果没有设comment框(即管理员登录后),就把原本的comment框的内容赋给$comment_content呗.修改后的代码如下

    $comment_content      = ( isset($_POST['w']) ) ? trim($_POST['w']) : trim($_POST['comment']);
哈哈,问题就是这么简单,最终原因总结起来就是,主题自带的检查字数的功能 在Anti Spam检查评论并送入comment框之前 执行,因此阻断了Anti Spam小墙的正常工作.
我猜想,如果小墙的检查工作在 检查评论的字数之前进行的话,就不会有任何问题,当小墙检查评论为非spam后,将评论送入comment框,然后再由主题的检查功能来检查comment框中的字数.
OMG :jiong: 忘记了,如果w中内容为空的话,小墙也不会送入comment框中.....

刚刚在本地试验了一下,如果关闭主题自带的字数检查功能,我改的那个some chinese please检查就会提示评论中必须包含汉字.
如果连some chinese please检查 也关闭的话,就可以发出空评论,但是我看anti spam的代码,需要满足w框中非空而且comment框中为空才会送入comment框,不知道是怎么回事.不管了,把字数检查和some chinese please检查检查打开就行了.

霍霍,问题就这样简单解决啦.虽说原因很简单,但是我一点一点找到还是挺不容易的~~本来打算私藏起来的,可是弄出来了好东西,心里高兴,不给大家说说心里难受啊. :evil: 哈哈,于是乎,就写了这么一大坨~~
