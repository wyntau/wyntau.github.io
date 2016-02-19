---
layout: post
title: 看书找到的一个ajax函数封装
pid: 233
comments: true
tags: [Ajax, JavaScript]
categories: [学习笔记]
---
几天好像又过去了,不知道写点什么东西.
题目是一个ajax函数,就是看书找到的一个实现ajax过程的封装.

生成XMLHttpRequest对象的方法是在《DOM编程艺术》里面找到的.我看着很全面,所以就用了.

主要的ajax方法是从 jQuery的作者 John Resig 写的《精通javascript》找到的.将他们结合一下.

在那个方法中,已经有了onComplete onError onSuccess的实现.所以我照葫芦画瓢,弄上了beforeSend 还有onTimeout

但是那个ajax方法,作者默认是用的POST方法.不知道为什么.而且在提取返回数据的时候也出现了一点错误,将type误作为dataType来提取返回数据的responseXML或者responseText.
所以自己又改了一下.也不知道改的怎么样.(已经在本地服务器测试完毕,目前没有问题)

```js
function ajax(options) {
  var options = {
    url: options.url || "",
    data: options.data || null,
    type: options.type || "GET",
    dataType: options.dataType || "html",
    timeout: options.timeout || 5000,
    beforeSend: options.beforeSend ||
      function() {},
    onComplete: options.onComplete ||
      function() {},
    onSuccess: options.onSuccess ||
      function() {},
    onTimeout: options.onTimeout ||
      function() {},
    onError: options.onError ||
      function() {}
  };

  function getHTTPObject() {
    if (typeof XMLHttpRequest == "undefined")
      XMLHttpRequest = function() {
        try {
          return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e) {}
        try {
          return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (e) {}
        try {
          return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {}
        return false;
      }
    return new XMLHttpRequest();
  }
  var requestDone = false;
  var xhr = getHTTPObject();
  xhr.open(options.type, options.url, true);
  if (options.type == "POST") {
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && !requestDone) {
      options.onComplete();
      if (httpSuccess(xhr)) {
        options.onSuccess(httpData(xhr, options.datatype));
      } else {
        options.onError(httpData(xhr, options.datatype));
      }
      clearTimeout(interval);
      xhr = null;
    }
  };
  options.beforeSend();
  xhr.send(options.data);
  var interval = setTimeout(function() {
      requestDone = true;
      options.onTimeout();
    },
    options.timeout);

  function httpSuccess(r) {
    try {
      return !r.status && location.protocol == "file:" ||
        (r.status >= 200 && r.status < 300) ||
        r.status == 304 ||
        navigator.userAgent.indexOf("Safari") >= 0
        && typeof r.status == "undefined";
    } catch (e) {}
    return false;
  }

  function httpData(r, type) {
    var ct = r.getResponseHeader("content-type");
    var data = !type && ct && ct.indexOf("xml") >= 0;
    data = type == "xml" || data ? r.responseXML : r.responseText;
    if (type == "script")
      eval.call(window, "(" + data + ")");
    return data;
  }
}
```