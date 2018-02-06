---
layout: post
title: 在Angular.js项目中使用异步加载(二)
pid: 2016022602
tags: [webpack, Angular, RequireJS]
---
上篇讲了, 在以 Angular.js 为框架的项目中, 使用 `RequireJS` 进行模块化加载的关键代码. 本篇介绍如何将上述的代码应用到实际中.

首先创建一个典型的项目结构

```
.
├── controllers/
├── directives/
├── services/
├── styles/
├── views/
├── app.js
└── boot.js
```

app.js 中的主要内容如下

```js
define(function(){
  var app = angular.module('demo', [
    'ui.router'
  ]);

  // 看我将上篇中讲到的代码放在这里
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

  // 在这里进行正常的路由定义
  app.config([
    '$stateProvider',
    function($stateProvider){
      $stateProvider
        .state('state1', {
          url: '/state1',
          template: 'views/state1.html',
          controller: 'state1Ctrl'
        })
        .state('state2', {
          url: '/satte2',
          template: 'views/state2.html',
          controller: 'state2Ctrl'
        })
    }
  ]);

  // 在这里需要将 app 返回, 才能保证在其它地方, define(['app'], factory) 的时候, factory能够得到 app
  return app;
});
```

而boot.js中的内容就很简单了, 只是调用 app.js, 然后进行初项目始化


```js
require.config({
  baseUrl: './'
});

require([
  'app'
], function(){
  angular.bootstrap(document, ['demo']);
});
```

这样就完了吗? 当然没有. 此时只是一个基本结构完成了. 但是还没法做到异步加载controller, directive等.

我们需要找到一个加载时机, 可以让我们在切换到相应的路由时, 进行文件的加载. 我选择的是 `$stateProvider` 定义路由时的`resolve`对象. 按照ui-router的文档中说的

> resolve: An optional map<string, function> of dependencies which should be injected into the controller. If any of these dependencies are promises, the router will wait for them all to be resolved before the controller is instantiated. If all the promises are resolved successfully, the $stateChangeSuccess event is fired and the values of the resolved promises are injected into any controllers that reference them. If any of the promises are rejected the $stateChangeError event is fired.

在这里, 我们可以返回一个 promise, 然后使用 require.js 进行文件加载, 等待文件加载完毕后, 改变 promise 的状态, 然后让 ui-router 进行相应路由的初始化.

所以, `$stateProvider` 定义路由的写法进行一些修改

```js
$stateProvider
  .state('state1', {
    url: '/state1',
    templateUrl: 'views/state1.html',
    controller: 'state1Ctrl',
    resolve: {
      deps: ['$q', '$rootScope', function($q, $rootScope){
        var deferred = $q.defer();
        require([
          'controllers/state1Ctrl'
        ], function(){
          $rootScope.$apply(deferred.resolve);
        });
        return deferred.promise;
      }]
    }
  })
```

这样的话, 在 state1 进行初始化的时候, 可以保证对应的 controller 文件已经加载完毕. 在 controller 中, 就是正常的写法了

```js
define([
  'app'
], function(app){
  app.controller('state1Ctrl', [
    '$scope',
    function($scope){
      // code here
    }
  ])
});
```


如果你使用了 require.js 的 css 插件的话, 完全可以在这里也把 css 文件加载进来.

```js
$stateProvider
  .state('state1', {
    url: '/state1',
    templateUrl: 'views/state1.html',
    controller: 'state1Ctrl',
    resolve: {
      deps: ['$q', '$rootScope', function($q, $rootScope){
        var deferred = $q.defer();
        require([
          'controllers/state1Ctrl'
        ], function(){
          $rootScope.$apply(deferred.resolve);
        });
        return deferred.promise;
      }],
      css: ['$q', '$rootScope', function($q, $rootScope){
        var deferred = $q.defer();
        require([
          'css!styles/state1Ctrl'
        ], function(){
          $rootScope.$apply(deferred.resolve);
        });
        return deferred.promise;
      }],
    }
  })
```

你可以将这些代码进行抽象, 封装成一个方法. 对于 css 文件的加载, 可以在开发模式, 使用 `RequireJS` 进行加载. 而在发布模式时, 不单独加载 css 文件, 而是配合下篇讲的方法, 将 css 的内容注入到对应的 controller 中.

为了简化代码, 我写了一个 angular 的 模块, [angular-require](https://github.com/Wyntau/angular-require). 本篇写的代码, 就是这个小项目的原型.

在以 Angular.js 为框架的项目中, 使用 `RequireJS` 进行代码的异步加载, 其实并不是很难, 下篇将写一下, 在这样的项目中, 怎么对代码进行构建发布.
