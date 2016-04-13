---
layout: post
title: 在Angular.js项目中使用异步加载(六) - 动态加载第三方模块
pid: 2016031901
tags: [webpack, Angular, RequireJS]
---

在 Anguarl.js 中使用异步加载, 并配合构建工具, 基本已经可以在生产环境中进行使用. 但是还有一些情况并没有覆盖到.

比如, 整个项目的某个页面需要依赖第三方模块, 但是以 Angular.js 加载模块的方式, 就需要在页面初始化之前把第三方模块加载完毕, 同时在项目初始化的依赖部分加以引用, 打包资源时, 就需要把这个依赖同样引入. 这样就会造成加载资源的浪费.

由于目前我所在的项目中, 基本都是些全局依赖, 所以没有遇到这种需求. 也是这个原因, 导致我对这个方向没有做过研究. 但是没需求不代表没问题, 如果某天我也遇到了这样的问题, 可能就要费一番功夫了.

正好在SegmentFault上看到一篇文章, 讲述怎么动态加载第三方模块, 并在项目中进行了试验, 可以解决这个问题.

文章地址 [angularjs+requirejs实现按需加载的全面实践](https://segmentfault.com/a/1190000004487211?_ea=632149), 还有一篇英文的 [AngularJS: RequireJS, dynamic loading and pluggable views](http://benohead.com/angularjs-requirejs-dynamic-loading-and-pluggable-views/), 这篇中我只看了其中动态加载模块的部分.

解决方法, 就是按照正常加载模块的流程, 将 Angular.js 内部的逻辑走一遍.

一个模块在定义时, 会有好多方法, 比如 `controller`, `directive`, `filter`, `factory`, `service`, `provider`, `value`, `constant`, `decorator`. 但是调用这些方法的最终结果, 是把那些具体的逻辑放入三个数组中, 这三个数组为

- module._invokeQueue
- module._configBlocks
- module._runBlocks

等到需要使用这个模块的时候, 再进行执行. 在 Angular.js 中, 如果不在项目的定义时引入依赖, 即使加载了第三方模块也不能用的原因就是因为, 第三方模块只进行了定义, 而那些具体的逻辑并没有得到执行, 所以才会报各种 *Provider 找不到的错误.

动态加载第三方模块的关键就是将第三方模块的初始化逻辑进行执行. 所以我们将 app.js 中的 config 部分进行改写.

```js
app.config([
  '$controllerProvider',
  '$compileProvider',
  '$filterProvider',
  '$provide',
  '$injector',
  function($controllerProvider, $compileProvider, $filterProvider, $provide, $injector) {
    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.provider = $provide.provider;
    app.value = $provide.value;
    app.constant = $provide.constant;
    app.decorator = $provide.decorator;

    // 在这里定义一个新的全局方法, 方便进行第三方模块的加载
    window.Library = (function(){

      var providers = {
        '$controllerProvider': $controllerProvider,
        '$compileProvider': $compileProvider,
        '$filterProvider': $filterProvider,
        '$provide': $provide
      };

      var cache = {};

      return function Library(module){

        // already activated
        if(cache[module]){
          return;
        }

        var module = angular.module(module);

        var i;

        if (module.requires) {
          for (i = 0; i < module.requires.length; i++) {
            Library(module.requires[i]);
          }
        }

        var invokeArgs, provider, method, args;
        for(i = 0; i < module._invokeQueue.length; i++){
          invokeArgs = module._invokeQueue[i];
          provider = providers[invokeArgs[0]];
          method = invokeArgs[1];
          args = invokeArgs[2];
          provider[method].apply(provider, args);
        }

        for(i = 0; i < module._configBlocks.length; i++){
          $injector.invoke(module._configBlocks[i]);
        }

        for(i = 0; i < module._runBlocks.length; i++){
          $injector.invoke(module._runBlocks[i]);
        }

        cache[module] = true;
      };
    })();
  }
]);
```

使用方法很简单, 假如有一个第三方模块按照正常的模块定义方式进行书写. 我们可以有一个只进行引入第三方模块的文件. 在这个模块中, 进行第三方模块的载入工作.

```js
define([
  'path/to/library.js'
], Ready(function(){
  Library('libraryName');
}));
```

当我们在其它文件需要加载此第三方模块时, 不去依赖原文件, 而是依赖我们写的文件即可
