---
layout: post
title: 在Angular.js项目中使用异步加载(四)
pid: 2016022702
tags: [webpack, Angular, RequireJS]
---
将构建系统从 gulp + require.js 切换到 webpack 是因为通过一些学习, 我知道, webpack 可以更好的完成代码合并压缩的工作.

在我的期望中, webpack 可以自动的完成公共模块的分析及拆分工作. 即

1. 如果此模块只被一个地方使用的话, 则自动同使用它的代码合并在一起
2. 如果此模块被多个地方使用的话, 则此模块单独成为一个独立的文件, 被多个地方动态加载, 且被缓存, 不需要重复加载
3. 如果一个文件引用了多个模块, 每个模块都按上面两条处理

通过 webpack 的文档, 了解到 webpack 支持 AMD CommonJS 两种模块化方案. 因为项目原来是以 `RequireJS` 为模块化加载方案的, 所以此处自然选择 AMD 方案.

如果使用 AMD 方案, webpack 遇到 `require` 就会形成一个代码拆分点, 被 require 的文件会被放到一个单独的文件中. 所以原来使用 require.js 时的加载代码不需要动.

但是在切换过程中, 遇到了一点问题.

1. 入口文件的问题.

    在 `RequireJS` 中, 入口文件是通过 `require([deps], callback)` 来启动整个项目, 而 webpack 中, 则是通过在 `webpack.config.js` 指定入口文件的方式启动整个项目.

2. 和第一个问题相关的, 如果在入口文件中使用 `require` 的话, 会造成 webpack 初始化代码缺失, 所以需要使用 `define` 的形式. 也即, 在 webpack 中, 是无法显式的看到入口文件的, 需要在 `webpack.config.js` 中进行指定.

解决了上面的问题后, 再在 `webpack.config.js` 中添加 `css-loader`, `style-loader`这些东西, 保证 css 文件可以被正常加载, 然后使用 webpack 构建一下看看结果.

整个项目可以跑起来, 但是文件拆分, 代码量这些的结果确不是我想要的.

1. 公共模块并没有自动拆分开来.
2. 如果一个模块被多个地方使用, 在每个使用的地方都会把这个模块的代码复制一份.

经过搜索, 我找到了 `CommonsChunkPlugin`, 然后添加了这个插件, 重新构建后, 我得到的结果是, 只要是公共的模块, 全部都会被放到一个 `common.js` 文件中. 所以相当于, 只要我使用了一个公共模块, 就需要将所有的公共模块下载下来. 这是无法接受的.

为此, 我还专门到 webpack 的 github 上专门提了一个 [issue](https://github.com/webpack/webpack/issues/1693), 但是 webpack 的作者并没有什么好的解决方案. 他说的 `two-explicit-vendor-chunks example` 我也专门实践过, 但是都没法达到当初使用 require.js 时那样, 公共模块单独加载的效果.

就在我快要放弃 webpack 的时候, 我在网上看到了 [promise-loader](https://github.com/gaearon/promise-loader), 通过这个 loader, 可以把任何模块拆分到一个单独的文件. 那么, 通过使用这个 loader, 并在 `webpack.config.js` 中配置相关的规则, 只有公共模块才使用这个 loader 不就可以实现公共模块单独加载了吗?

通过 promise-loader 的文档知道, 使用此 loader 后, 会返回一个方法, 通过调用此方法会返回一个 promise, 当文件加载完毕后, promise 会变成 resolved 状态.

那么我在声明模块的时候, 按照下面这样写

```js
define([
  'app.js',
  'services/service1.js',
  'services/service2.js'
], function(app, func1, func2){
  // 这里的 func1, func2 通过调用会得到两个promise
  Promise.call([func1(), func2()]).then(function(){
    app.controller('ctrl', [
      '$scope',
      function($scope){
        // code here
      }
    ])
  });
});
```

如果有公共模块的话, 我还需要调用一次方法才行, 能不能默认就返回一个promise呢? 所以基于 promise-loader, 我修改了一个 [then-loader](https://github.com/Wyntau/then-loader), 其它功能和 promise-loader 相同, 但是返回的就是一个 promise, 不需要调用方法.

现在定义模块时, 我的写法是这样的

```js
define([
  'app.js',
  'services/service1.js',
  'services/service2.js'
], function(app, promise1, promise2){
  Promise.call([promise2, promise2]).then(function(){
    app.controller('ctrl', [
      '$scope',
      function($scope){
        // code here
      }
    ])
  });
});
```

像上面那样, 如果一个文件中, 使用了公共模块, 就需要等待所有的 promise 达到 resolved 状态. 那么如果目前我们的文件很多的话, 就需要挨个文件作这样的修改. 有没有一些方法, 可以作尽量少的修改甚至是不修改就可以得到 resolved 之后的结果呢? 所以有下面的这样的一段方法.

```js
window.Ready = function(cbk){
  // 1
  return function(){
    // 2
    return Promise.all([].slice.call(arguments)).then(function(args){
      if('function' == typeof cbk){
        // 3
        return cbk.apply(null, args);
      }
    });
  };
};
```

使用了上面的代码后, 我定义模块的写法是这样的.

```js
define([
  'app.js',
  'services/servie1.js',
  'services/service1.js'
], Ready(function(app, service1, service2){
  app.controller('ctrl', [
    '$scope',
    function($scope){
      // code here
    }
  ]);
}));
```

区别就是, 把所有的 factory 外面包了一层 Ready 函数调用. 其它地方不需要作任何修改.

分别说明 Ready 方法中的三个注释点的作用.

1. 返回一个函数, 作为 `define(deps, factory)` 中的 factory, 接受依赖模块的导出值
2. factory 返回一个 promise, 作为本模块的导出值.
3. 等待本模块所依赖的其它模块的 promise 都变为 resolved 状态时, 执行 Ready 的回调函数, 并将回调函数的执行结果作为本模块 promise 的值.

通过上面的改造, 我们所有模块的导出值都将是一个 promise, 而获取 promise 的值的工作, 是 Ready 方法完成的.

那对于那些没有使用 then-loader 的模块, 这种写法有没有影响呢? 答案是没有, 因为 `Promise.all()` 方法, 接受一个数组, 如果数组中的某个位置为非 promise, 会直接将这个位置视为 resolved 状态.

`webpack.config.js`中关于 then-loader的配置如下

```js
module.exports = {
  // ... 其它配置
  module: {
    loaders: [
      {
        test: /(services\/.*\.js$)|(directives\/.*\.js$)/,
        loader: 'then?global,[name]'
      }
    ]
  }
};
```

上面的配置中, 把所有的 service 和 directive 都放入单独的文件进行加载. 那那些全局的公共模块怎么办呢? 答案是把它们放入另一个文件夹比如 runtimes 中处理, 并让 webpack 忽略它们, 按照正常的逻辑处理.

所以新的目录结构会变成这样

```
.
├── controllers/
├── directives/
├── runtimes
│   ├── directives
│   └── services
├── services/
├── styles/
├── views/
├── app.js
└── boot.js
```

新的 `webpack.config.js` 配置

```js
module.exports = {
  // ... 其它配置
  module: {
    loaders: [
      {
        test: /(services\/.*\.js$)|(directives\/.*\.js$)/,
        exclude: /runtimes\/[^\/]*\/.*/,
        loader: 'then?global,[name]'
      }
    ]
  }
};
```

上面这些是在定义模块及文件拆分方面的修改. 而在定义路由时, 我们同样也可以采取类似的措施. 有下面一段方法

```js
window.Chunk = function(loading){
  // 1
  return function(){
    // 2
    return new Promise(function(resolve, reject){
      // 3
      loading(function(){
        Promise.all([].slice.call(arguments)).then(function(args){
          if(args.length){
            // 4
            resolve(args[0]);
          }else{
            reject();
          }
        });
      });
    });
  };
};
```

在`webpack.config.js` 中配置 html 使用的 loader, 返回字符串, 然后定义路由时, 通过使用`templateProvider`采用下面的写法

```js
$stateProvider
  .state('state1', {
    url: '/state1',
    templateProvider: Chunk(function(resolve){
      require([
        'views/state1.html',
        'styles/state1.css',
        'controllers/state1Ctrl.js'
      ], resolve);
    }),
    controller: 'state1Ctrl'
  })
```

下面解释上面Chunk方法中4个注释点的作用

1. 返回一个函数, 因为 $stateProvider 期望 templateProvider 是一个函数
2. 返回一个 promise, 以便让 $stateProvider 等待所有文件加载完成再进行下一步操作
3. webpack 进行所有文件的加载
4. 所有文件加载完成后, 将数组中的第一项作为 promise 的值. 因为我们将模板文件放到了 `require` 列表的第一项, 所以这样做, 可以让 `$stateProvider` 正确的得到模板字符串

所以, 现在我的 boot.js 文件是这样的

```js

window.Ready = function(cbk){
  return function(){
    return Promise.all([].slice.call(arguments)).then(function(args){
      if('function' == typeof cbk){
        return cbk.apply(null, args);
      }
    });
  };
};

window.Chunk = function(loading){
  return function(){
    return new Promise(function(resolve, reject){
      loading(function(){
        Promise.all([].slice.call(arguments)).then(function(args){
          if(args.length){
            resolve(args[0]);
          }else{
            reject();
          }
        });
      });
    });
  };
};

define([
  'app.js',
  'runtimes/services/runtime1.js',
  'runtimes/directives/foo.js'
], Ready(function(){
  angular.bootstrap(document, ['demo']);
}));

```

基本工作完成了, 只是还有一些其它的工作要处理, 比如添加 image loader, 然后修改 css 文件, html 文件中的一些图片或字体的绝对路径为相对路径, 因为绝对路径会被 webpack 忽略.

这样做完后, 从 gulp + require.js 到 webpack 的切换已经基本完成. 当然肯定还有一些细节在文章中并没有涉及到, 那些相对来说就比较容易了.

下一篇, 也是本系列的最后一篇, 将讲一下, 如何在使用 webpack 作为构建系统的项目中, 通过直接加载源码进行开发, 而不需要使用 webpack-dev-server, 因为我在使用 webpack-dev-server 的过程中, 每当修改一个文件并保存后, 重新 build 的时间太长了...
