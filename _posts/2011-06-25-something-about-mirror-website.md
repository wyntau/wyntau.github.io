---
layout: post
title: 镜像网站遇到的那些事儿
pid: 175
comments: true
tags: [Linux, website, 原创]
categories: [互联网络, 学习笔记]
---
前两天想要镜像 两个网站 codex.wordpress.org和 w3school.
但是在镜像的时候遇到了各种各样的问题.今天完整的总结一下

**1,镜像网站的方法.**

这个我是在linux中完成的.windows这货果然不好使(可能是我没有找到好的软件的原因吧),在linux中使用wget命令就好多了.
  主要命令(w3school与此类似,请自己扩展),

    mkdir codex
    cd codex
    wget -r -p -k -np codex.wordpress.org

**2, 修改链接问题**

镜像下来的codex.wordpress凡是中文的文件,前面都带有一个`zh-cn:` 标识,但是浏览器不认这个玩意,认为`zh-cn:`和`http:`一样,是一种新的网络协议,于是打不开...
 所以只好把地址显示的指定为本目录,在每个文件中引用zh-cn: 链接的地方显式的指定是本目录 即变成`./zh-cn:`

    sed -i "s/href="zh-cn:/href="./zh-cn:/g" `grep href="zh-cn: -rl /var/www/codex`

**3,修改文件后缀问题**

w3school镜像下来之后,所有的文件后缀都是.asp的.linux没法打开,windows正常(windows这货乐了,终于有个linux干不了的了). 但是.asp文件里面就是纯html代码.手动把后缀改成html后linux就正常了.

改吧,2000+个文件.手动改还不抽筋.... 正则替换,先把文件中的链接引用中的`.asp"`(限制条件是href=后面的.asp,而且是.asp做结尾,所以匹配条件是 `.asp"`)换成`.html"` ,用的同样是上面的方法.

    sed -i "s/.asp"/.html"/g" `grep .asp" -rl /home/w3school`

然后就是把文件名改了,将`.asp`全部换成`.html`(这玩意不能递归,我是挨个文件夹改的.o(︶︿︶)o )

    rename 's/.asp/.html/'

**4,windows的不兼容问题.**

搞完上面的东西,linux的浏览器浏览是没有问题了.但是在windows这货里面就是不行.想把这玩意分享给同学,他们都没法看(同学不用linux,我总不能让他们装个linux吧...).所以还得我自己想办法.

windows的文件名中不准包含 **问号? 冒号:** 等等. 可是下载下来的文件中就有`zh-cn:`这样的, 还有w3school中的那些个试一试的链接中用了问号?.
首先修改codex.wordpress中的冒号问题.我打算将`zh-cn:`全部改为`zh-cn-`,这样windows这货就能识别了.

    sed -i "s/zh-cn:/zh-cn-/g" `grep zh-cn: -rl /var/www/codex`

然后是修改文件名,也是用上面的方法.

    rename 's/zh-cn:/zh-cn-/' *

这样改完,貌似就不需要改上面的那个本目录链接了.不知道对不对,反正改完了.
再然后就是w3school的问题了. 文件名中有问号? windows这货就不认识这文件.连改文件名都说找不到这文件. 更别说打开了.所以只能在linux中改了

这替换问号? 还真不是好活.我试着用上面的方法替换,可是结果是 把`.html?`替换成了 `.html.html?` 根本没效果.
于是跑去 Linux群问了下高手,原来是匹配问号的时候出问题了.

    #!/bin/bash
    for i in `find ./ -type f`
    do
    sed 's/html'?/html'&/g'  $i > $i.bak
    rm -f $i;mv $i.bak $i
    done

就像上面那样,需要用 `'?`来匹配问号?,用`'&`来匹配&号,这个和一般的只需要反斜线转义来匹配还不一样.
好在完美解决了.不管了.

然后是文件名改名. 这里又不需要 `'?` 而只需要 `?` 匹配问号了.无奈,不知道怎么回事

    rename 's/.html?/.html&/' *

这样几个大问题就都解决了. 还有几个有问号的文件名.到时候再慢慢改,知道方法了就不急了.~~

哎,翻来覆去就是那两三个命令,没啥技术含量. 就算是记录一下吧.以后再遇到类似的问题就知道该怎么办了.
