---
layout: post
title: WP-Syntax代码框增加滑动效果
pid: 133
comments: true
tags: [WordPress, 转载]
categories: [WordPress]
---
一直都想找个方法将wp_syntax的代码能否自由的伸缩,可是一直都不会.原来在木木的一篇文章[WordPress 短代码之——Toggle 伸缩](http://immmmm.com/wordpress-shortcodes-toggle.html)中看到过用toggle伸缩的方法.本来想把那个放到代码伸缩上,可是效果一直都不好,所以只好作罢.

今天看 冰剑博客 的时候,翻到了他的一篇旧文,写的是让 WP-Syntax 滑动显示隐藏,这不正是我想要的吗?
哈哈,直接拿来用了.这里只是记录一下啊修改过程吧.

感谢冰剑博客[让 WP-Syntax 滑动显示隐藏](http://www.binjoo.net/2010/07/syntax-slide-show-hide/) 以及蛋疼的生活[为WP-Syntax代码框增加滑动效果](http://www.dt-life.info/sliding-effect-for-code-box-of-the-wp-syntax.html) .
冰剑博客上讲的是 不加行号的时候的效果,蛋疼的生活中讲的是 有行号的时候做法,并且更全面,所以我就弄了个最全面的.哈哈.

**具体过程,** 第二条和第三条 是从[蛋疼的生活](http://www.dt-life.info/)中复制的,再次感谢~~
#### 一，给代码框加上标题栏
需要改动WP-Syntax的源代码,wp后台插件->编辑,选择wp_syntax,然后就是wp-syntax.php了.
在大约120到130行之间,搜索 **if ($line)** ,对这个判断进行修改.
将第一个output改为如下内容(这是为有行号的情况添加标题的)

    $output .= "<div class="code_title" title="点击看代码">".strtoupper($geshi->language)." CODE</div><div class="code_tb"><table><tr><td class="line_numbers">";
然后修改else**前面**的最后一个output,改为如下内容(这个是用来闭合前面新增的标签的)

    $output .= "</td></tr></table></div>";
**然后**是没有行号的时候的情况,修改else里面的第一个output,改为如下内容(为没有行号的情况添加一个标题)

    $output .= "<div class="code_title" title="点击看代码">".strtoupper($geshi->language)." CODE</div><div class="code">";
这样不管有没有行号,都会在代码上方显示一个当前的代码语言的标题了.

#### 二，存在滚动条时标题栏的固定及CSS样式修改(此条目复制自蛋疼的生活
当存在滚动条时，标题栏会随着滚动条滚动，可能出现白条等不和谐的情况。所以需要对原始的CSS文件进行修改。我是融合到了Style.css中，而大多数情况下会在插件目录的wp-syntax.css中，修改如下（**注意是全部修改，不是仅修改注释地方**）：

    .wp_syntax {
        color: #100;
        background-color: #f9f9f9;
        border: 1px solid silver;
        width: 97%;
        margin: 0 0 1.5em 20px;
    }
    /*对.code和.code_tb两个框进行滚动
    而标题栏不动*/
    .wp_syntax div.code, .wp_syntax div.code_tb {
        overflow: auto;
        overflow-x: auto;
        overflow-y: hidden;
        expression(this.scrollWidth > this.offsetWidth ? 15 : 0);
    }

    .wp_syntax table {
        border-collapse: collapse;
    }

    .wp_syntax div.code, .wp_syntax td {
        vertical-align: top;
        padding: 2px 4px;
    }

    .wp_syntax .line_numbers {
        text-align: right;
        background-color: #def;
        color: gray;
        overflow: visible;
    }

    .wp_syntax pre {
        width: auto;
        float: none;
        clear: none;
        overflow: visible;
        font-size: 12px;
        line-height: 1.333;
        white-space: pre;
        margin: 0;
    }
    /*标题栏的样式*/
    .wp_syntax .code_title {
        padding-left: 5px;
        width: auto;
        background: #CCC;
        cursor: pointer;
        color: #2971A5;
        font-weight: bold;
    }

#### 三，jQuery实现滑动效果(此条目复制自蛋疼的生活

    jQuery(function($){
    //代码框隐藏
        $('.wp_syntax div.code,.wp_syntax div.code_tb').hide();
    //添加文字说明
        $('.wp_syntax .code_title').prepend('<span>点击展开</span>');
    //设置其CSS样式
        $('.code_title span').css({
            'float': 'right',
            'margin-right': '5px'
        });
        $('.wp_syntax .code_title').toggle(function(){
    //防止多次动画叠加
            if (!$(this).next().is(':animated')) {
                $(this).next().slideDown('slow', function(){
                    $(this).parent().find('.code_title').children('span').text('点击隐藏');
                });
            }
        }, function(){
            if (!$(this).next().is(':animated')) {
                $(this).next().slideUp('slow', function(){
                    $(this).parent().find('.code_title').children('span').text('点击展开');
                });
            }
        });
    });

**L3-L10：**不应该用CSS去控制代码框的隐藏，因为如果有的浏览器进行了JS禁用或调用代码失败，那么显示的效果只是没有滑动效果与右上角的“点击展开隐藏”文字，因为我觉得只有调用成功才显示文字说明更合理。

**L13，L19：**如果你多次连续点击标题栏，可能就使动画进行队列，显示多次。所以应该加上动画判断语句。

保存为单独的js文件，或者置于头部调用，刷新，查看一下你的页面，满意？用着；不满意？过来说说。

至此，全部效果实现。

****

**SayMe:**对于IE6/7我就不考虑了,爱咋咋的吧,
