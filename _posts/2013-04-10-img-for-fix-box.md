---
layout: post
title: 固定大小的容器中图片宽高不一致处理办法
pid: 255
comments: true
tags: [JavaScript, CSS]
categories: [学习笔记]
---
今天写一个页面的时候遇到的一个问题。

固定大小的容器， 比如 250X250的div里面会放一张图片，要求图片水平垂直都居中显示。 水平居中好办，直接text-align：center就解决了，但是竖直居中的问题我还是第一次遇到。

网上搜索了一些办法，有用css解决的。大体思路 设置外容器display:table,图片设置display:table-cell;vertical-align:middle这种方法解决.这种方法在现代浏览器中基本可以使用.但是在IE6和7中好像就不行了.

我要兼容IE6 7,所以这种方法不能用了.

用js解决吧.如果图片大小超过250px的话,就用css控制到250px,如果小于250px的话,就用js动态设置图片的margin-top,让图片垂直居中;

这种方法需要等img完全加载完毕才行,所以如果刚上来图片就显示的话,就不好用了,可能会出现加载过程中图片很大,等图片加载完毕后才会变成合适的大小.

我处理的是图片会先隐藏显示,等到用户交互的时候才会出现,所以这个方法很好用.

    $('img').each(function(i){
            var _this = this;
            var _image = new Image();
            var _height = 0;
            var _width = 0;
            _image.src = $(_this).attr('src');
            _image.onload= function(){
                _height = _image.height;
                _width = _image.width;
                if(_height>250 || _width>250) {
                    $(_this).css({'height':'250px','width':'250px'});
                    _height = 250;
                    _width = 250;
                }
            $(_this).css('margin-top',(250-_height)/2+'px');
            }

        })

    <div style="width:250px;height:250px;padding:10px;border:1px solid #ccc;text-align:center;">
        <img src="a.jpg">
    </div>

无任何技术含量,记录一下,以后遇到类似的问题方便查找
