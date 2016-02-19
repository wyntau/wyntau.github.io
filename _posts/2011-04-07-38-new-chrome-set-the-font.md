---
layout: post
title: 解决Linux中chrome设置字体无效
pid: 38
comments: true
tags: [Chrome, Linux, Ubuntu]
categories: [唠唠叨叨]
---
昨天本来要再弄点东西大,可惜回到宿舍的时候发现 ubuntu系统突然就进不去了.说是我的的/home目录有错误. :mad:
可是我什么东西都没干啊.无奈了. 到网上找那些用修复磁盘的命令fsck神马的, 没有一个有效果.  检查磁盘的时候竟然问我.我的/home目录是不是 zero-length ,唉 我里面的东西 大大的有啊.所有调试wordpress的本地文件都在里面呢.看来没法要了.

没办法,重装吧. :jiong:  真的是麻烦死我了.....
装完系统,装上我喜欢的chrome浏览器.才发现 chrome的默认字体是那么丑,用的是默认的楷体,看着字体一点点,好难受,可是再选项里面设置了使用微软雅黑竟然没有效果. :mad:  搞的我很头疼.

唉,最后还是说说更改chrome字体的问题吧.

1. 先找到chrome的快捷方式(ubuntu里面使用系统--&gt;首选项--&gt;主菜单--&gt;互联网 即可看到chrome)
2. 属性：启动位置后面加参数 -disable-tabbed-options,这样设置完毕后,重启chrome,点击选项,竟然就出现了 chrome没有升级前的选项,这个我还是比较喜欢的
3. 到chrome首选项中寻找你需要的字体，设置即可update

- - -

**update(5-10):**经[oucfeng](/2011/04/38-new-chrome-set-the-font.html#comment-547)童鞋提醒,在不更改tab选项页的情况下也可以更改字体.

修改方法:打开google，在搜索框中点击右键选择选拼写检查选项——语言设置——字体编码器 下面修改就可以了。
