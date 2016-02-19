---
layout: post
title: 一段shell程序下载图片
pid: 224
comments: true
tags: [Bash, Linux]
categories: [学习笔记]
---
一直都是用的一个原来写的php程序,通过给定一个网址,php程序去访问网址,然后用php中的正则表达式提取网页源代码中的图片地址,然后用鼠标把想要的一批图片地址复制到一个叫url的文件中.待所有的地址都提取好了后,再用一个shell脚本每次读取url文件的一行作为下载来源,用curl下载文件,并重命名

但是这个方法有个缺点,需要我一次一次的复制图片地址到一个文件,每个网页就得复制一次,所以我就想过用C写一个能够只要输入网址就可以读取网页源代码然后提取图片地址,然后再调用程序下载的小程序(好像即使成功的话,也只省去了我复制的麻烦),但是我C学的太差了.

网上找了许多东西,才知道了C中该怎么用socket获取一个网页的源代码,但是对字符串的提取上,我就不行了.C语言本身没有正则表达式,而且没有原生的字符串类型,所以一切都不好办了.所以就只能作罢.

那就转变思路,用shell,在shell中循环读取网址,每读一个网址,就用curl获取该网址的网页源代码,重定向给sed提取图片地址,显示出来,让操作者选择截取哪几行(假设符合条件的地址是连续几行的).将选择截取的那几行的图片地址重定向到一个新文件.

待循环结束后,就开始下载文件了.这里读取一个序号作为下载的第一个文件的序号,然后每次加1
如果一共三个图片网址,读取的序号是4,则下载好的三个文件分别为4.jpg 5.jpg 6.jpg

    #!/bin/bash
    DEST=./url
    DOWNLOAD=./download  #这是最终的图片地址所在地,文件下载结束后删除
    until [ "$again" = "n" ]
    do
    i=1
    echo "输入新网址"
    read url
    curl $url | sed -n 's/.*src="([^"]*[.jpg|.jpeg|.png])".*/1/gp' >$DEST
    while read line #这里是在每个图片地址前面加上行号,并显示给操作者,以便选择截取哪几行的地址
    do
    echo ${i} ${line}
    ((i+=1))
    done<$DEST
    echo "输入截取开始行和结束行"
    read start
    read end
    sed -n ${start},${end}p $DEST >>$DOWNLOAD #追加方式
    rm $DEST
    echo "网址保存成功"
    echo "继续添加新网址(y)或停止添加网址并下载符合条件的图片(n)?"
    read again
    done
    echo "开始保存文件,"
    echo "请输入保存文件的开始序号:"
    read count
    while read line
    do
    curl -o $count.jpg $line
    ((count+=1))
    done<$DOWNLOAD
    rm $DOWNLOAD
    echo "文件下载结束~~感谢使用~~"

http://127.0.0.1/index.html的文件内容如下

    <script type="text/javascript" src="http://127.0.0.1/js.js" />
    <img title="test1" src="http://127.0.0.1/a.jpg" alt="" /> 测试测试
    测试测试<img title="test2" src="http://127.0.0.1/b.jpg" />
    <script type="text/javascript" src="http://127.0.0.1/js2.js" />
    <img title="test1" src="http://127.0.0.1/abbb.jpg" alt="" /> 测试测试
    测试测试<img title="test2" src="http://127.0.0.1/ccc.jpg" />
    <h1>测试</h1>
    测试测试<img title="test2" src="http://127.0.0.1/png.png" />
    <img src="http://127.0.0.1/c.jpg" alt="" />
    <a href="http://127.0.0.1">imya</a>

执行结果如下

    lwent@lwent:~/img$ ./get.sh
    输入新网址

    http://127.0.0.1

      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100   569  100   569    0     0   549k      0 --:--:-- --:--:-- --:--:--  555k
    1 http://127.0.0.1/a.jpg
    2 http://127.0.0.1/b.jpg
    3 http://127.0.0.1/abbb.jpg
    4 http://127.0.0.1/ccc.jpg
    5 http://127.0.0.1/png.png
    6 http://127.0.0.1/c.jpg
    输入截取开始行和结束行
    2
    4
    网址保存成功
    继续添加新网址(y)或停止添加网址并下载符合条件的图片(n)?
    n
    开始保存文件,
    请输入保存文件的开始序号:
    1
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100  7644  100  7644    0     0  26019      0 --:--:-- --:--:-- --:--:-- 26088
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100  7647  100  7647    0     0  26129      0 --:--:-- --:--:-- --:--:-- 26098
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100  7646  100  7646    0     0  24528      0 --:--:-- --:--:-- --:--:-- 24585
    文件下载结束~~感谢使用~~

上面的输入截取开始行和结束行后,在文件夹中会有一个download文件,里面的网址会是
http://127.0.0.1/b.jpg  
http://127.0.0.1/abbb.jpg  
http://127.0.0.1/ccc.jpg
