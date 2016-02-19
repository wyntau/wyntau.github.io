---
layout: post
title: 帅哥认证用到的两个函数
pid: 176
comments: true
tags: [PHP, Study]
categories: [学习笔记]
---
前几天弄的那个帅哥认证,是看别人的php代码,自己尝试着写的.那时候一点php的知识都没学,完全是根据自己的理解还有C以及C++的基础理解的.
今天看了一点PHP,把那天用到的函数看了一下.也算是真正学习了一遍吧.

我更新后台后,又用了另外一个函数,是把在后台填写的用逗号分隔的一串邮箱转换成一个数组,然后在别人评论的时候,判断此人邮箱是否在数组中,然后再决定是否输出帅哥认证.

**1,explode() 函数把字符串分割为数组.**

例如,我将一串字符串分成一个数组

    <?php
    $char='a@b.com,c@d.com,e@f.com';
    $handsome=explode(',',$char);
    print_r($handsome);
    ?>

输出结果是

    Array ( [0] => a@b.com [1] => c@d.com [2] => e@f.com )

成功的将一个字符串分隔成几部分了.这个print_r是好像是个打印数组的函数.具体的不知道,但是用这个可以看到数组的元素是什么.

**2,in_array() 函数在数组中搜索给定的值.**

如果给定的值 value 存在于数组 array 中则返回 true,如果没有在数组中找到参数，函数返回 false,
下面的是w3school中的一个例子

    <?php
    $people = array("Peter", "Joe", "Glenn", "Cleveland");
    if (in_array("Glenn",$people)){
      echo "Match found";
    }else{
      echo "Match not found";
    }
    ?>

输出结果是

    Match found

**3,另外一个函数我没有用到,但是也同样记录一下.是和explode() 函数对应的.将一个数组转换成字符串.**

implode() 函数把数组元素组合为一个字符串。

    <?php
    $handsome=array('a@b.com','c@d.com','e@f.com');
    $char=implode(',',$handsome);
    echo $char;
    ?>

输出结果是

    a@b.com,c@d.com,e@f.com

中间都加了一个英文逗号隔开.

写的都很简单,函数中的参数什么的我都没有写全,要是有童鞋感兴趣的话,可以去w3school网站去看看.我是在那里看到的这几个函数.
