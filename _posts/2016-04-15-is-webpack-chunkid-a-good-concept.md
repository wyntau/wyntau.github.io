---
layout: post
title: webpack 的 chunkId 是不是一个好的概念
pid: 2016041501
tags: [webpack]
---

webpack 因为有各种各样的 loader, 可以让我们把所有的东西都使用相同的 require 写法进行加载, 同时还可以配合各种 compiler, 让我们从现在就可以享受到 ES6 给我们带来的便利, 所以 webpack 受到了大家的欢迎, 成为 2015 - 2016 特别受欢迎的打包及模块化方案.

但是在使用 webpack 的时候, 遇到了一个不小的问题, webpack 的 `chunkId` 对于永久缓存的支持.

假设我们有这样一个 SPA 页面场景, 有一个路由文件 route.js, 会在此文件中使用 webpack 的 `code spliting` 写法, 按需加载文件.

在 route.js 中分别对应三个页面(foo, bar, baz), 按需加载对应的入口文件. 在入口文件中, 会再分别加载各个子页面依赖的文件.

- foo.js
  - dep1.js
  - dep2.js
- bar.js
  - dep2.js
  - dep3.js
- baz.js
  - dep1.js
  - dep3.js

当我们使用 webpack 进行 build 后, webpack 会给每个文件分配一个 `chunkId`, 这个 chunkId 是随着 webpack 处理到的文件的数目而进行递增的. 一种结果是类似于下面这样的, 文件后面的括号中是生成的 chunkId 号

- foo.js (1)
  - dep1.js (4)
  - dep2.js (5)
- bar.js (2)
  - dep2.js (5)
  - dep3.js (6)
- baz.js (3)
  - dep1.js (4)
  - dep3.js (6)

如果我们需要在foo.js中增加一个依赖 `dep4.js`, 那么相应的 chunkId 会变成类似于下面这样

- foo.js (1)
  - dep1.js (4)
  - dep2.js (5)
  - dep4.js (6)
- bar.js (2)
  - dep2.js (5)
  - dep3.js (7)
- baz.js (3)
  - dep1.js (4)
  - dep3.js (7)

我们只增加(或删除)了一个文件, 却导致了多个文件的 chunkId 变化, 这样就导致多个文件的内容发生了变化. 那么当重新发布后, 其实有的页面的内容根本不需要变化, 但是仅仅是因为 chunkId 变化, 而导致需要重新下载这些文件, 使得没法使用浏览器已经缓存的文件.

如果你的页面有几十个, 每次添加或者删除一个文件后, 都会导致几乎所有的文件的浏览器缓存失效.

我们期望的结果是, 每当我们修改一个文件后, 只有依赖此文件的文件会更新, 而其它的文件不会发生变化. 当重新发布后, 只会去重新下载那些已经被更新的文件, 这样我们就可以做到类似于增量更新的效果.

但是 webpack 采用的 chunkId 的概念好像没办法避免这样的问题. 如果将 chunkId 换成依赖文件的路径, 是不是可以减少这种问题的发生呢?
