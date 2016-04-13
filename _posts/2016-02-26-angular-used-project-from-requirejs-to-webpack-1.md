---
layout: post
title: 在Angular.js项目中使用异步加载(一)
pid: 2016022601
tags: [webpack, Angular, RequireJS]
---
Angular.js 很好, 但是也很不好.

Angular.js 好, 是因为它确实解决了前端开发中的很多问题, 带来了一套解决方案, 能够让人快速的构建出一个网站, 尤其是它的双向绑定技术, 解放了前端开发人员的双手, 让大家可以专注于数据及逻辑, 不用想着怎么和DOM进行打交道.

Angular.js 不好, 是因为它的模块化机制, 天生就是不健全的. 和市面上流行的模块化方案格格不入, 更不用提按需加载和异步加载等方案. 因为它要求的是, 所有 controller, service, directive, factory 等在 bootstrap 之前就已经加载完毕.

如果页面不多, 将所有的文件加载进来, 也没有不可以. 但是, 假如一个项目的页面很多, 同时又有很多的 controller, service, directive, factory 等等, 如果一次性将全部文件加载进来, 但是却又用不到, 那么对于带宽绝对是一种浪费.

很多人都在尝试如果在以 Angular.js 为框架的项目中, 采用按需加载或者异步加载的方案. 在这方面最著名的可能就是 [`ocLazyLoad`](https://github.com/ocombe/ocLazyLoad).

但是, 我不打算使用它. 因为我更喜欢按照 `RequireJS` 的那种方式去加载代码. 同时这样做, 也是为后面从 require.js 到 webpack 的切换做准备. 这样, 在 Angular.js 的层面, 我是感知不到异步加载的存在的. 每个 controller, service, directive, factory 等, 我可以按照原生Angular.js的写法.

那么如果在以 Angular.js 为框架的项目中使用 require.js 进行模块化加载呢?

经过搜索, 找到了一小段代码完成这件事.

```js
app.config([
  '$controllerProvider',
  '$compileProvider',
  '$filterProvider',
  '$provide',
  function($controllerProvider, $compileProvider, $filterProvider, $provide) {
    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.provider = $provide.provider;
    app.value = $provide.value;
    app.constant = $provide.constant;
    app.decorator = $provide.decorator;
  }
]);
```

只要在 config 阶段, 使用 Angular.js 内部的方法, 将已经生成的 module 的方法进行覆盖即可. 这样, 异步加载进来的代码, 就可以正常的注册 controller, service, directive, factory 等.

下一篇, 将讲一下怎么将这段代码应用到实际当中, 并使用 require.js 异步加载代码
