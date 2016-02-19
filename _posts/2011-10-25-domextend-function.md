---
layout: post
title: 一个扩展DOM的函数
pid: 230
comments: true
tags: [DOM, JavaScript]
categories: [学习笔记]
---
这个函数是 《犀利开发 jquery内核详解与实践》这本书中的一段代码.
作用是用来扩展DOM的.然后为DOM绑定自定义函数.不知道这个可不可以拿来用.
我试验之后,可以用.但是不知道有没有什么问题.

代码如下

	var DOMextend=function(name,fn){
	if(!document.all){
		eval("HTMLElement.prototype."+name+"=fn");
	}else{
		var _createElement=document.createElement;
		document.createElement=function(tag){
	        //为createElement函数绑定自定义函数
			var _elem=_createElement(tag);
			eval("_elem."+name+"=fn");
			return _elem;
		}
		var _getElementById=document.getElementById;
		document.getElementById=function(id){
	        //为getElementById函数绑定自定义函数
			var _elem=_getElementById(id);
			eval("_elem."+name+"=fn");
			return _elem;
		}
		var _getElementsByTagName=document.getElementsByTagName;
		document.getElementsByTagName=function(tag){
	        //为getElementsByTagName函数绑定自定义函数
			var _arr=_getElementsByTagName(tag);
			for(var _elem=0;_elem<_arr.length;_elem++){
				eval("_arr[_elem]."+name+"=fn");
			}
		return _arr;
		}
	}
	}

测试用例

	<!DOCTYPE html>
	<html>
	<head>
	<script type="text/javascript" src="domextend.js"></script>
	</head>
	<body>
	<div id="test"></div>
	<script type="text/javascript">
	DOMextend("sayhi",function(){
		alert("sayhi,yes!");});
	document.getElementById("test").sayhi();
	</script>
	</body>
	</html>
