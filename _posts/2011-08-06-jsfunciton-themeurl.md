---
layout: post
title: 修改js获取主题地址函数
pid: 200
comments: true
tags: [JavaScript, Themes, WordPress]
categories: [WordPress]
---
囧文,很旧的东西了,只是我在使用的时候遇到了一点问题.所以尝试着解决了一下.另外这几天没有什么灵感了,所以随便找点东西吧.嘻嘻

起因:扩展侧边栏的小宠物的时候,为了正确引用到主题文件夹中的flash动画,需要获取到正确的主题文件夹地址.因此我找到一段js函数.此函数大多数人已经用了,可能没人注意到.此段函数位于willinkan大师的ajaxcommnet文件中.

问题:但是我在使用的时候遇到了一点问题.尝试着解决了一下.

原函数如下

    function themeurl() {
            var i = 0,
            got = -1,
            url,
            len = document.getElementsByTagName('link').length;
            while (i <= len && got == -1) {
                url = document.getElementsByTagName('link')[i].href;
                got = url.indexOf('/style.css');
                i++
            }
            return url.replace('/style.css', '')
        };
此函数可以获取到head中的一个link节点,然后判断此网址中有没有包含 style.css

如果有的话,一般就是主题文件夹的位置了.然后对获取到的网址进行修改即可.但是,我的style.css文件后面还跟了一个时间戳.如果直接拿来用的话,就会获取到`http://127.0.0.1/wp-content/themes/philna2?v=201106181049`这样的网址,显然这不是我想要的.

我需要将后面的时间戳也去掉.所以试着结合我看的一点正则表达式,修改了一下

    function themeurl() {
            var i = 0,
            got = -1,
            url,
            len = document.getElementsByTagName('link').length;
            while (i <= len && got == -1) {
                url = document.getElementsByTagName('link')[i].href;
                got = url.indexOf('/style.css');
                i++
            }
            return url.replace(//style.css.*/g, '')
        };
这样获取到的结果就是`http://127.0.0.1/wp-content/themes/philna2`.
就这样了.没有任何技术含量.
