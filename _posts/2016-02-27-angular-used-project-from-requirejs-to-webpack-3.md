---
layout: post
title: 在Angular.js项目中使用异步加载(三)
pid: 2016022701
tags: [webpack, Angular, RequireJS]
---
经过前两篇, 已经可以在以 Angular.js 为框架的项目中, 正常的使用 `RequreJS` 作为模块化加载器. 但是这还只是开发模式. 如果要进行布署上线, 肯定还需要经过代码合并压缩等步骤.

本篇简单讲一下, 在这样的项目中, 如何进行发布前的准备. 因为使用了 `RequireJS` 作为模块化加载器, 在源码状态下, 会有很多文件. 所以当进行发布上线的时候, 需要将一些文件合并起来. 但是在这里要进行一些取舍, 哪些文件和哪些文件进行合并, 哪些文件单独加载.

本人在实施的过程中, 遵循了一些原则

1. 每个 controller 和对应的 css 文件, 基本上是配套的, 而且不会被其它文件使用. 所以尽量将这两个文件进行合并压缩.
2. service, directive, factory, 因为像这样的, 一般都会是公共模块, 所以只是将这些文件进行压缩, 而不和其它一些文件合并. 如果在写 directive 时, 使用了一些 css 文件, 那么也可以像 controller 那样, 将 directive 的 js 文件和 css 文件合并起来.
3. views, 使用 html-minifier 工具, 进行压缩, 去除多余的空格及空行.

那如何将 css 文件和 js 文件进行合并呢, 答案是, 将 css 的内容通过 js 注入到 style 标签中. 为此我还写过 grunt 插件 [grunt-inline-css](https://github.com/Wyntau/grunt-inline-css) 和 gulp 插件 [gulp-scriptcss](https://github.com/Wyntau/gulp-scriptcss).

其实核心方法就是下面的这么简单

```js
"function" == typeof window.__scriptCSS__ || (window.__scriptCSS__ = function(styleContent) {
  var styleNode = document.createElement("style");
  styleNode.setAttribute("type", "text/css");
  if(styleNode.styleSheet){
    styleNode.styleSheet.cssText = styleContent;
  }else{
    styleNode.appendChild(document.createTextNode(styleContent));
  }
  document.getElementsByTagName("head")[0].appendChild(styleNode);
});
```

但是把 css 文件内容当成 style 标签的话, 会带来一个问题. 原来的 css 文件中使用的相对路径, 在 style 标签中, 会全部以入口页面路径为相对位置, 造成图片或者字体找不到. 所以我在开发时, 全部使用以 `/` 开头的绝对路径.

如果这样做的话, 工作其实已经完成了很大一部分. 我在实施的过程中, 还有另外一个小优化, 就是将一些全局的公共模块连同入口文件一起加载.

比如我的 boot.js 文件可能是下面这样的, 除了将 app.js 加载进来之外, 还把一些全局的 service, directive 也加载进来. 这样在使用 requirejs-optimize 的工具时, 首先对全部的文件添加 module id, 然后将这些全局公共文件一起包含到入口文件中来.

```js
require([
  'app',
  'services/EventBus',
  'services/Cache',
  'directives/lazyload'
], function(){
  angular.bootstrap(document, ['demo']);
});
```

如果需要发布到 CDN 上, 则可以使用 gulp 在构建过程中, 动态配置 `RequireJS` 的 `baseUrl`, 还有替换 html, css 文件中的一些路径为使用 CDN 后的绝对路径.

现在的状态, 完全可以经得起线上环境的考验了. 因为我在公司的项目中, 使用这套构建系统, 使用大约得有一年的时间. 直到我把整套构建系统从 gulp + require.js 切换到 webpack, 同时也把构建的质量提升了一个等级.

下篇将讲我是如何完成整套构建系统从 gulp + require.js 到 webpack 的切换.
