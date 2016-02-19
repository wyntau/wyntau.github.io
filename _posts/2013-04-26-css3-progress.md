---
layout: post
title: CSS3进度条
pid: 257
comments: true
tags: [CSS3]
categories: [学习笔记]
---
<pre>
<style>
span#progress{width:100% !important;;display: block;height:30px !important;;}
    @-webkit-keyframes progress {
    0% {
        background-position: 0 0
    }
    100% {
        background-position: 30px 30px
    }
}
@-moz-keyframes progress {
    0% {
        background-position: 0 0
    }
    100% {
        background-position: 30px 30px
    }
}
@-ms-keyframes progress {
    0% {
        background-position: 0 0
    }
    100% {
        background-position: 30px 30px
    }
}
@keyframes progress {
    0% {
        background-position: 0 0
    }
    100% {
        background-position: 30px 30px
    }
}
span#progress{
-webkit-animation: progress 0.7s linear infinite;
-moz-animation: progress 0.7s linear infinite;
-ms-animation: progress 0.7s linear infinite;
animation: progress 0.7s linear infinite;
display: block;
height: 100%;
width: 2%;
background-color: #5290D0;
-webkit-box-sizing: border-box;
-moz-box-sizing: border-box;
box-sizing: border-box;
-webkit-background-size: 30px 30px;
-moz-background-size: 30px 30px;
-o-background-size: 30px 30px;
background-size: 30px 30px;
-webkit-border-radius: 4px;
-moz-border-radius: 4px;
-ms-border-radius: 4px;
-o-border-radius: 4px;
border-radius: 4px;
background-image: -webkit-linear-gradient(-45deg, #4a84c2 25%, transparent 25%, transparent 50%, #4a84c2 50%, #4a84c2 75%, transparent 75%, transparent);
background-image: -moz-linear-gradient(-45deg, #4a84c2 25%, transparent 25%, transparent 50%, #4a84c2 50%, #4a84c2 75%, transparent 75%, transparent);
background-image: -ms-linear-gradient(-45deg, #4a84c2 25%, transparent 25%, transparent 50%, #4a84c2 50%, #4a84c2 75%, transparent 75%, transparent);
background-image: linear-gradient(-45deg, #4a84c2 25%,transparent 25%,transparent 50%,#4a84c2 50%,#4a84c2 75%,transparent 75%,transparent);
overflow: hidden;
}
</style></pre>
<div style="width:100%;margin:20px 0"><span id="progress"><span style="color:#fff;line-height:30px;margin-left:30px;width:80%">loading</span></span></div>
