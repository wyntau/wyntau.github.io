---
layout: post
title: 使用 System.js 作为 ES6 的加载器
pid: 2016041301
tags: [ES6, System.js, webpack]
---

随着 ES6 的慢慢普及以及各浏览器对于 ES6 的支持, 在新开的项目或者对于老项目的更新上, 大家纷纷采取拥抱 ES6 的态度. 因为即使有的浏览器目前对于 ES6 的支持还不太高, 但是我们可以使用 webpack, 加上 webpack 中的各种 loader, 我们可以很方便的将 ES6 编译为普通的 ES5 代码, 然后跑在所有的浏览器上.

webpack 为大家提供了 webpack-dev-server 用于开发环境, webpack-dev-server 可以方便的进行代码调试, reload 等功能.

但是我在使用 webpack 搭配 webpack-dev-server 的时候, 由于项目很大, 文件特别多, 所以遇到了一个很大的问题, rebuild 等待的时间太久了, 完全不如我原来没有使用 webpack 时保存代码后手动刷新浏览器来的快速. 但是因为我使用了 webpack 进行合并压缩, 我不得不等待整个项目编译完成才能进行调试.

为了解决这个问题, 我写了 [webpack-source-code-loader](https://github.com/Wyntau/webpack-source-code-loader), 并且写了一篇文章 [在Angular.js项目中使用异步加载(五)]({% post_url 2016-03-11-angular-used-project-from-requirejs-to-webpack-5 %}).

后来接触到了 [System.js](https://github.com/systemjs/systemjs), 发现其实我的需求完全可以使用 System.js 进行解决. 因为 System.js 可以通过 Babel.js 或者 TypeScript 在浏览器中完成 ES6 => ES5 的编译工作. 具体例子请看我写的 [demo](https://github.com/Wyntau/systemjs-example)

在使用的时候我发现, 使用 TypeScript 时会比使用 Babel.js 有更快的编译速度, 同时还可以使用 TypeScript 提供的类型系统, 真的很好. 并且, System.js 和 Babel.js@6.x 有兼容性问题, 目前还只能使用 Babel.js@5.x 才能进行正常工作.

综上, 以后开始一个新的项目的时候, 完全可以先不管 webpack 的配置, 可以直接使用 System.js 来加载 ES6 源码, 等到整个项目完成的差不多了, 再考虑使用 webpack 或者其它构建工具进行工程化也不迟.
