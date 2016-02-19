---
layout: post
title: 做一个懒惰的程序员
pid: 14
comments: true
tags: [Programmer]
categories: [互联网络]
---
本文写给所有可爱的程序员，(我)你们都是一群可爱的，用双手建造世界的思想家。

从今天起，我要做一个懒惰的程序员。

***第一 拒绝鼠标***

从今天，我将拒绝鼠标。

鼠标，是[鼠标手](http://baike.baidu.com/view/10901.htm)的根源，无数的程序员都被鼠标手所困扰，这似乎已经成为了程序人员的专利。我们养成了一个一个的"恶习"，比如，滥用鼠标右键刷新，看文档的时候，喜欢用鼠标来标记正在阅读的段落等等。这些非常规的使用使我们的手得了严重的疾病，我不知道，这样继续下去，当我们牙齿掉光的时候，是否还有能力抚摸妻子动人的面庞。

所以，我要从以下几个方面拒绝鼠标的诱惑：（虽然某些时候它真的很方便）

**1.我要开始使用Emacs或是Vim**

Emacs和Vim就是程序员的倚天剑和屠龙刀！花一点时间学习来学习它，即便我以后不做程序员了，也将会终生受益。因为它同时也是[普通人的编辑利器](http://blog.sina.com.cn/s/blog_46dac66f010005kw.html)。

作者本人曾经就是Emacs使用者，后来转入了Vim。直言不讳的说，玩Emacs或Vim本就是一个享受的过程，因为你总能无意间挖掘出它的一个又一个有趣用法。

如果你还执迷于Notepad++这些编辑器，看看这个Wiki:[《Comparison of text editors》](http://en.wikipedia.org/wiki/Comparison_of_text_editors),你还有什么理由不选择它呢?

**2. 我要使用键盘来浏览网页**

学会了Emacs或是Vim，我开始想把这种高效的用法用在浏览网页上，毕竟这也会占据我的大部分时间。

如果是Vim的话，可以选择：[Vimperator](https://addons.mozilla.org/zh-CN/firefox/addon/vimperator/)(firefox)或是[Vimium](https://chrome.google.com/extensions/detail/dbepggeogbaibhgnhhndojpepiihcmeb?hl=zh-cn)(Chrome)

如果是Emacs的话，可以选择：[Firemacs](https://addons.mozilla.org/zh-CN/firefox/addon/firemacs/)(firefox)或是[Edit with Emacs](https://chrome.google.com/extensions/detail/ljobjlafonikaiipfkggjbhkghgicgoh?hl=zh-cn)(chrome)

**3. 我要使用键盘来操作系统**

我要使用更多方便的工具来帮助我管理系统：

我要使用[AutoHotKey](http://xbeta.info/autohotkey-guide.htm)，使重复工作一键完成。

我要使用[Totoal Commander](http://xbeta.info/studytc/)，使系统文件管理变成一件轻松而有效率的事情。
我要学习更多的快捷键，包括[Win+R的常用命令](http://ty.cquc.edu.cn/show.aspx?id=15611&amp;cid=21)，[Outlook的快捷键](http://www.microsoft.com/china/smb/local/reading/knowledge/office/outlookkey/default.aspx)，让这些以前只能缓慢移动鼠标的操作变成快捷的键盘操作。

***第二 少用键盘，甚至少看屏幕***

鼠标用的少了，键盘却用得多了，这还不够。

**1 我将使用更多的时间来阅读纸质的书籍，而非PDF**

阅读纸质书籍基于两点：

- 第一，我们可能有Twitter，有新浪微博，有QQ，电脑面前阅读有可能会使我们精力分散。
- 其二，阅读纸质的书籍会更加集中精力，触觉和视觉的结合会让我们记忆更加深刻。

**2 我将用更多时间进行交流和思考**

我将腾出更多的时间用于思考，而不是腻在电脑面前。我将花更多的时间思考人生，思考设计，甚至思考我正在思考的东西。

***第三 少写代码***

**1 构建自己的代码库**

所有我写过的代码，我都要保存起来，反复思考，修改，尽量让其变成通用的代码.
遇到所有我没有写过的代码，我都要抓出其最独立的代码段，算法段，反复思考，修改，让其变成通用的代码。
我要把所有我思考过的代码都保存起来，放到我的代码库里边。遇到一个问题，先看看我的代码库里有没有？有的话就拿出来，直接用，或是修改一下再用，没有的话才自己重新写过，当然，这些新实现的代码将再次进入我的代码库。如此一个良性循环，从此，很多相似的问题再也难不倒我，因为我熟悉我的代码就像熟悉自己的身体一样。

因为我承认：

- 1 我的记忆是有限的，它不能永远记得所有细节。
- 2 再造轮子是一件可怕的事情，除非我能造得比人家更好。

**2 让代码自己生成**

最简单的代码生成是非逻辑生成，比如[李先静](http://blog.csdn.net/absurd/archive/2006/08/26/1123781.aspx)曾经举过这样一个例子：

前几天遇到一个问题，要定义一组宏，它的格式是这样的：  
KEYMAP(GDK_Op_Left, GDK_F12, DIKS_F12)  
KEYMAP(GDK_Op_Right, GDK_F13, DIKS_F13)、  
…

大约有30多行，第一列的Op_Left之类是自定义的按键，是我们讨论的结果，放在一个表格中，手工把这份表格转换成以上的宏，不难也要不了多少时间，但这样单调的事很容易出错，特别对于我这样粗心大意的人来说。于是决定用awk来做：

    awk ‘BEGIN{i = 4} {print "KEYMAP(GDK_" $1 ", GDK_F" i ", DIKS_F" i ")"; i++}’ keys.txt

这就是代码产生器！就一行代码。简单吧，它却产生了30多行代码。其实我经常在用这样的代码产生器，给我节省了不少时间，减少了出错的可能。所以能用脚本就用脚本，脚本实现困难时才考虑用C/C++等编译语言。

复杂的代码生成便是逻辑生成，有这样一篇文章可以参考：[《浅谈代码生成》](http://blog.csdn.net/wishfly/archive/2007/12/14/1937556.aspx)

***第四 不调试程序***

我要抱着严谨的态度写程序，我要如同追求艺术极致一般追求编码的极致。虽然我们知道，这世界上有太多的程序员，他们远远比我们厉害。但这并不妨碍我们超越他们的脚步。  
我要像熟悉自己的身体一样熟悉我的代码，熟悉我思维中的每一个误区，每一个漏洞。我要写出优雅，优美的代码，而非依赖调试工具来找出问题。  
我要善用我的眼睛，让它接受每一段代码，我要善用我的大脑，让它模拟出每一段代码的问题。我的思维会为我调试一条语句，不管其是空指针还是内存泄露。我的眼睛会为我找出每一个语法错误，不管是我粗心还是大意。（参见李先静的博客：《程序员成长计划》，像机器一样思考， [1](http://www.limodev.cn/blog/archives/774)， [2](http://www.limodev.cn/blog/archives/785)， [3](http://www.limodev.cn/blog/archives/805)）

写完一段代码我不会心急地运行，看它的效果，我会花上10分钟检查我的代码，直到我确定，或者是"自以为"是bug 0.

从今天起，做一个懒惰的程序员，虽然我知道这条路很难走，但这并不妨碍我的热情。因为我知道，总有一天，我会变得比那些现在我只能仰望的人更加懒惰！

注:原文[地址](http://blog.imalbert.com/archives/35.html),感觉说的很好,所以就转过来了
