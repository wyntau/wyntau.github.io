---
layout: post
title: PhilNa2使用google自定义搜索
pid: 150
comments: true
tags: [Google, PhilNa2, WordPress, 原创]
categories: [WordPress]
---
为什么使用google自定义搜索呢?

因为google是搜索的老大,另一个原因是wp博客站内搜索，每搜索一次都会发送数据库查询，消耗服务器资源.
因此,我把博客中自带的搜索功能换成了 google自定义搜索.

可能有人说,只要申请一个google自定义搜索的ID号,在PhilNa2的后台填上就行了.
其实不然,只在后台填上KEY,默认的搜索结果会在新页面显示,我的目的是让搜索结果嵌入到博客中去.

大家可以在本博客侧栏搜索框上搜索一个东西,看搜索结果的样式.

具体步骤 ,简单一下.

1,申请一个google自定义搜索,然后进入管理后台控制面板,选择外观,然后选择IFRAME,选择一个样式,然后保存获取代码.
然后在那个填写网址的地方,填写你希望出现在你博客上的网址.
比如我的网址是 http://isayme.com/cse
然后你就得到了两端代码了.

2,修改搜索框代码,具体位置在philna2/serchform.php,在第30行可以看到对于是否使用google自定义个搜索的判断.
对这个地方进行对照修改.已经有的代码,就不用再加了,没有的就加上
修改的后的代码如下(我对google给的代码进行了修改,使之能够符合现在的css样式)

    <div id="search" class="s_google">
        <form action="http://isayme.com/cse" id="cse-search-box">    <!--注意将网址改为你的网址-->
          <div id="searchbox">
            <input id="searchinput" class="textfield" type="text" name="q" size="24" value="" tabindex="12" />
            <input id="searchbtn" class="button" type="submit" name="sa" value="" title="Search" />
            <input type="hidden" name="cx" value="<?php echo $GLOBALS['philnaopt']['google_cse_cx']; ?>" />
            <input type="hidden" name="cof" value="FORID:11" />
            <input type="hidden" name="ie" value="UTF-8" />
          </div>
      </form>
    </div>

3,创建页面模板
复制一个平常的页面模板,然后对页面模板的内容进行修改.这时要用到google给你的第二段代码.
将

    <div id=content>
    ..........
    </div>
之间的内容全部清空,然后将google给你的第二段代码粘贴到这里
然后在后台新建一个页面,网址设为你修改搜索框时的那个action中的网址,比如我的网址是 http://isayme.com/cse


做完后测试一下吧,在后台的设置中选择使用google自定义搜索,填上自己的专有号码,
然后在搜索框中搜索一个东西.搜索结果就会从你的模板里面打开了.

很简单对吧,呵呵.var googleSearchFrameWidth = 600; 是用来控制搜索结果的宽度的,要是调节这个宽度不变化的话,就在css中添加如下代码

    #cse-search-results iframe {width:662px;}
改成你自己的宽度就行了,感谢[园子博客](http://www.yzznl.cn/archives/272.html)提供的方法,解决了我的搜索结果宽度不可调节的问题
