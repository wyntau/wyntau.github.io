---
layout: post
title: 在Angular.js项目中使用异步加载(五)
pid: 2016031101
tags: [webpack, Angular, RequireJS]
---

本篇是对于上篇在一个改进, 作用是在以 webpack 为构建系统的项目中, 不使用 webpack-dev-server 而是直接加载源码的方式进行开发.

##### 原因

在我目前的项目中, 由于文件太多, 在使用 webpack-dev-server 的时候, 重新 build 的时间太长. 即使将 webpack 的 `devtools` 选项设置为 `eval` 也需要等待3秒左右才能重新 build 一次, 有的时候还会更长. 即使是什么都不修改, 只是按一下保存, 也会触发一次 rebuild, 然后等待很长时间. 对于有经常保存习惯的我来说, 3秒左右的等待简直不能接受. 我在网上搜索了很多, 都没有找到关于这个问题的文章. 所以索性自己搞一套来解决.

##### 需求

自己写一个简单的模块加载器, 可以加载源码, 同时做到兼容 webpack 的加载系统.

目前在项目中使用 webpack 加载的内容如下

1. js 文件, 按照正常的 amd 方式进行定义
2. html 文件, 要求返回 html 文件的内容
3. css 文件, 要求将 css 文件以 link 标签的方式插入到 DOM 中, 以此来兼容 webpack 中 style-loader 将 css 文件内容作为 style 标签的处理方式.
4. 图片文件, 要求返回图片地址, 以此来兼容 webpack 中的 file-loader 返回文件地址的处理方式

所以只要解决了以上几个问题, 就可以在目前的项目中, 采用直接加载源码的方式进行开发.

**使用注意**: 在加载 html 文件的时候, 由于是异步加载的方式, 所以不能在代码中直接写 `require('foo.html')` 的方式, 而是在定义模块的时候, 使用 `define` 进行加载.

##### 解决

通过网上的搜索, 找到一些简单的模块加载器, 并在此基础上进行修改以满足要求.

项目地址: <https://github.com/Wyntau/webpack-source-code-loader>

##### 使用方法

1. 加载 `webpack-source-code-loader.js`
2. 写一个 `webpack-source-code-entry.js`来加载上篇文章中讲到的 `boot.js`

   ```js
   require.config({
     baseUrl: './'
   });

   require(['boot.js'])
   ```
