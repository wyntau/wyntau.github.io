---
title: 使用 FIS3 构建 Vue 前端工程. webpack 用户也请看过来
pid: 2017040801
tags: [Vue, FIS3, webpack]
---

本文的目标是通过一个例子向大家展示如何使用 FIS3 作为构建工具, 来对使用 Vue 的前端工程进行构建.
当然, Vue 只是一个例子, 完全可以推广到其它的项目中.

前端构建工具, 我从 Grunt, Gulp, webpack 一路用过来. 虽然 webpack 非常火, 但是最终我在项目中使用的是 FIS3. 为什么用 webpack 的那么多, 我却没有使用呢.

我在使用 wepback 的过程中, 遇到了比较大的问题, 所以最终没用 webpack. 这也是文章标题中请 webpack 用户也看过来的原因.

### 1. webpack 基于数字的模块ID方案, 会很大程序上导致浏览器的缓存大面积失效

在 webpack 的配置中, 大家一般都会使用文件 hash 作为文件名, 然后在静态服务器中设置强制缓存, 可以保证用户在使用缓存的同时, 方便我们进行文件的更新. 只要 hash 一变, 用户自然就会去下载新的文件了.

但是, 文件内容没有变化, 仅仅因为我们组织、引用文件的顺序变化, 或者新添加了一个模块, 就有可能导致缓存大面积失效.

假设我们有这样一个场景, 有一个路由文件 route.js, 会在此文件中使用 webpack 的 `code spliting` 写法, 按需加载文件.

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

当我们使用 webpack 进行 build 后, webpack 会给每个文件分配一个 `moduleId`, 这个 moduleId 是随着 webpack 扫描到的文件的数目而进行递增的. 一种结果是类似于下面的示例, 文件后面的括号中是生成的 moduleId 号

- foo.js (1)
  - dep1.js (4)
  - dep2.js (5)
- bar.js (2)
  - dep2.js (5)
  - dep3.js (6)
- baz.js (3)
  - dep1.js (4)
  - dep3.js (6)

如果我们调整了文件的依赖顺序, 把 dep2 放在 dep1 之前, 那么相应的moduleId 会变成类似下面这样

- foo.js (1)
  - dep2.js (4)
  - dep1.js (5)
- bar.js (2)
  - dep2.js (4)
  - dep3.js (6)
- baz.js (3)
  - dep1.js (5)
  - dep3.js (6)

而如果我们需要在foo.js中增加一个依赖 `dep4.js`, 那么相应的 moduleId 会变成类似于下面这样

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

我们只增加(或删除)了一个文件, 或者只调整了文件的引用顺序, 却导致了多个文件的 moduleId 变化, 这样就导致多个文件的内容发生了变化.
那么当重新发布后, 其实有的页面的内容根本没有变化, 但是仅仅因为 moduleId 变化, 而导致需要重新下载这些文件, 使得没法使用浏览器已经缓存的文件.

听说现在已经有了 namedModulePlugin 这个插件, 可以保证文件的模块ID是稳定的, 但是请看下面的一个问题.

### 2. 多页面中 webpack 的 commonChunksPlugin 插件, 导致的冗余加载问题

在项目中, 肯定会有很多公共模块, 所以大家都会使用 commonChunksPlugin 来提取公共模块.

像一些第三方库的话, 我们可以通过 commonChunksPlugin, 将第三方类库放到 vendor 中.
我们自己写的公共模块, 一般也是通过 commonChunksPlugin, 并传入 minChunks 选项来进行抽取. 如果一个模块被依赖次数达到了 minChunks 的大小, 就会被抽取到一个类似 common.js 中.

只是模块抽取的逻辑, 以及导致的冗余加载的问题, 大家有没有关注过呢.

比如在多页面项目中, 设置了多个 entry, 并通过 commonChunksPlugin 抽取公共模块, 假设我们配置的公共模块抽取的目标文件为 common.js.

当 minChunks 为最小值 2 时, 即只要一个模块被依赖次数大于等于 2, 就会被抽取到 common.js 中. 所以构建完成后, common.js 会包含所有的公共模块. 那么当我们在加载的时候, 可能只需要其中的一个模块, 却要把整个文件下载下来. 这样造成的冗余性非常大.

那么如果我们把 minChunks 设置的大一些会怎么样呢? 如果一个公共模块被依赖的次数没有达到 minChunks, 那么此模块就会在所有依赖它的文件中都会被打包一份. 同样也造成了资源的冗余加载.

所以, 不管 minChunks 被设置为多少, 总是会有冗余加载的问题. 使用 webpack 的用户, 请看一下你们的 commonChunksPlugin 配置, 然后再看一下你们 build 之后的文件, 是不是会出现我上面所说的问题.

### 3. SPA 中, code split 导致的冗余加载问题

多页面的项目, 冗余加载的问题其实并没有那么严重, 即使有冗余加载, 但是因为用户刷新了页面, 也不会占用过多资源.
但是在 SPA 项目中, 影响就会变得大了, 同时还会有一些潜在的问题.

在 SPA 中, 一般我们都是通过在 route 中使用 require.ensure 实现动态加载. 但是 webpack 在切分文件时, 也会造成冗余加载的问题.

比如

a.js
```js
require('./c');
console.log('a.js')
```

b.js
```js
require('./b');
console.log('a.js')
```

c.js
```js
console.log('c.js');
```

main.js
```js
module.exports = {
  a: function(){
    require.ensure([], function(){
      require('./a');
    })
  },
  b: function(){
    require.ensure([], function(){
      require('./b');
    })
  }
};
```

webpack.config.js
```js
var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: path.resolve(__dirname, 'main.js'),
  output: {
    filename: '[name].js',
    path: path.resolve('.', 'dist')
  }
};
```

最终通过 webpack, 生成了三个文件. 0.js, 1.js, main.js, 内容分别如下

0.js 对应 main.js 中的 a
```js
webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {
__webpack_require__(3);
console.log('b.js')
/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports) {
console.log('c.js');
/***/ })
]);
```

1.js 对应 main.js 中的 b
```js
webpackJsonp([1],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {
__webpack_require__(3);
console.log('a.js')
/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports) {
console.log('c.js');
/***/ })
]);
```

可以看到, 相同的 c.js 被分别打包进了 a.js 和 b.js

所以当我们加载的时候, A 模块依赖 C 模块, 下载下来的文件中, 既有 A, 也会有 C. 但是 B 模块也依赖 C 模块, 下载下来的文件中, 既有 B, 也会有 C. 相同的 C 模块被下载了2次.

设想一下, 如果这个 C 模块是一个 EventBus 模块, A 使用它来发布消息, B 使用它来订阅消息. 那么 A B 之间的通讯就会出现问题. 因为 A 使用的 C 和 B 使用的 C 是两个完全不同的模块, 它们的数据并不会共享, 也并不知道彼此的存在

这几个问题, 是我在使用 webpack 的时候, 一直在思考的问题, 也在网上搜索过相关的知识. 但是好像使用 webpack 的用户, 都不认为这是问题?

---

在构建项目的时候, 我想让模块ID能够稳定, 那么使用文件的路径作为模块ID就是一个不错的方案.
我需要按需加载, 但是却不希望有冗余加载. 一个办法是, 在构建的时候, 其它流程都正常进行, 但是却不合并, 或者是通过配置有限合并. 加载的时候采取其它的办法. 这个办法后面会讲到.

但是对 webpack 来说, 它作为一个打包器, 却要让它不进行打包合并, 真的是困难.

## 使用 FIS3

因为上面的问题, 在了解了 FIS3 之后, 我就选择了 FIS3.
我选择 FIS3, 首先是因为它能很好的解决上面的问题, 其次在它的基础上, 我们还能有更加优化的办法.

FIS3 默认使用文件路径作为模块ID, 所以也就不存在模块ID不稳定的问题. 其次, 如果在没有进一步配置的情况下, FIS3 产出的文件是没有任何合并的, 只是把 commonjs 模块包装成 amd 模块, 添加了模块ID, 并且会产出一份静态文件资源表, 标识出文件之间的互相依赖关系.

虽然没有自动合并, 但是 FIS3 提供了打包合并的配置, 我们可以通过配置选择将哪些文件合并打包在一起. 由于是我们自己控制的, 所以肯定会比 webpack 的自动化打包方案更灵活.

可能使用 webpack 的人会有疑问, 通过手动配置的方式? 这不是更麻烦吗. 其实后面通过例子会看到, 真的很简单.

下面是一个使用 FIS3 的实现的一个 demo. 此 demo 是 vue 官方出的 [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0), 我把它改成使用 FIS3 进行构建.

这是整个项目的结构及依赖关系.

![](/uploads/2017/04/2017040801-01.png)

1. 最下层的是作为全局的第三方类库, 整个项目初始化时就需要加载. 所以我通过 FIS3 的 packTo 配置, 将他们打包为 `runtimes/packages.js` 文件. fis 的配置只需要下面这样
    ```js
    // node_modules 库, 只 packTo 部分文件, 有的文件不是全局依赖还是按需加载
    fis.match('/(node_modules/{' + require('./src/runtimes/packages.json').join(',') + '}/**.{js,ts})', {
      packTo: '/src/runtimes/packages.js'
    })
    ```

    `runtimes/package.json` 中的内容如下
    ```js
    [
      "es6-promise",
      "vue",
      "vuex",
      "vue-router",
      "vuex-router-sync",
      "process",
      "tslib",
      "firebase"
    ]
    ```

    我在 `runtimes/packages.json` 中定义哪些 node_modules 模块作为初始化加载的依赖. 如果没有在这里列出, 就会走异步加载的流程.
2. 往上一层是项目的全局依赖模块, 包括 route, filters, app.vue 等等, 我把他们全都放到 runtimes 文件夹下, 表示它们都是作为运行时依赖. 我把它们合并为 `runtimes/runtimes.js`
    ```js
    // 全局 runtimes 文件
    fis.match('/src/runtimes/**.{js,ts,vue}', {
      packTo: '/src/runtimes/runtimes.js'
    })
    ```
3. 再往上一层就是我们的 view, 业务逻辑. 每个 view 占据 views 下面的一个文件夹, 做到高度自制. 即, 此 view 需要的所有私有依赖, 都放到此文件夹下, 包括但不限于 自用组件, 图片, 字体, 工具函数等等. 上面图中 vuex 中的 store 我也把它放在这里, 因为 vuex 中有 registerModule 方法, 可以在 view 被加载时, 动态注册 vuex module. 最后通过 FIS3, 把每个view的文件夹合并为一个文件. fis 的配置中, 通过 FIS3 提供的类似于 glob 的语法, 可以很方便的进行配置
    ```js
    // 各个页面自用的文件, 打包成一个文件, 减少http请求
    fis.match('/src/views/(*)/**.{js,ts,vue}', {
      packTo: '/src/views/$1-pack.js'
    })
    ```

    但是这里, 有个需要注意的地方. 如果是其中的某个模块, 也被其它模块依赖时, 可以把此依赖从此 view 文件夹中提出来, 上移到公共模块文件夹中. 但是如果是一些 icon 图片, 我更倾向于复制一份到view中, 而不是把它上移到公共图片目录中. 这样当某个view不需要了, 可以安全的将此目录直接删除
4. 右边就是一些公共模块, 公共组件了, 它们依赖 node_modules, 同时被各个 view 所依赖. 但是它们不会被合并到任何文件中, 每个模块在构建完毕后, 都是一个单独的文件, 所以也就不会出现冗余加载的情况发生.

其实通过上面的一些结构或者做法, 我们做了下面这些事情

1. 我们把初始化需要的 node_modules 模块放到一个文件中, 这和 webpack 中通过定义 vendor, 然后使用 commonChunksPlugin 将 vendor 抽取到 vendor.js 中效果一样
2. 我们把项目中的运行时依赖, 合并为 `runtimes/runtimes.js` 中, 这和 webpack 中, 通过 commonChunksPlugin 抽取项目公共模块的做法类似, 但是更精准. 只合并了项目初始化需要的依赖, 并不包括各个 view 展示时需要的依赖.
3. 各个 view 中的模块都被合并成一个文件, 加载一个 view, 最小的 http 请求变为一个

那么, 如果一个 view 依赖了很多公共模块, 不就会出现很多的请求吗?

## 请求数优化方法

因为 FIS3 在构建时, 会产出一份静态资源表, 所以我们根据此资源表, 可以有两种解决办法.

1. 本地 localStorage 缓存, 这是只需要前端, 不需要后端配合就可以完成的一种方案, 但并不是最好的办法.

    1. 初次加载时, 将模块缓存到 localStorage 中, 并以文件 url 或者文件 hash 作为标识
    2. 再次加载时, 首先检查 localStorage 中是否有缓存的模块, 以及模块 hash 是否匹配. 如果匹配的话, 直接拿出使用, 否则去远程加载

    所以当第一次到达某个页面时, http 请求可能会很多. 但是当用户以后再次到达此页面时, 因为localStorage 中有缓存, 所以完全可以做到 0 个请求.

2. 上面的办法不是最好的办法, 是因为它没法解决第一次加载时, http 请求数目过多的问题. 那么解决此问题最好的办法就是, 后端 combo 服务.

    由于我们有静态资源表, 所以当加载某个模块时, 在发出请求之前, 我们就可以通过静态资源表递归的找到所有依赖, 然后拼装成 combo 服务接收的参数, 一次请求, 把所有的依赖全部下载下来.

如果把上面的 1, 2 结合起来, 我认为才是真正最好的解决方案.

1. 首次加载时, 通过 combo 服务, 一个请求, 即可把模块的递归依赖全部下载下来, 然后缓存到 localStorage 中, http 请求数最小
2. 再次加载时, 由于 localStorage 中有缓存, 所以不需要发出 http 请求即可完成.
3. 如果是在其它view中加载某个模块, 首先通过静态资源表, 递归的把所有的依赖找到, 然后先去 localStorage 缓存中过滤一遍, 将 localStorage 中已经存在并可以使用的模块缓存直接拿出来使用, 然后再将 localStorage 中没有或者已经失效的模块, 使用 combo 服务进行加载. 这样就可以实现以最小的请求量以及最少的请求数, 即可完成模块加载.

    比如首次加载 a.js, 依赖模块有 b, c, d. 当再次加载时, 因为已经有缓存, 所以不需要发出 http 请求, 直接使用缓存即可. 当加载另一个模块 e.js 时, 分析出的依赖模块有 c, d, f, g. 此时, 先去 localStorage 中, 发现缓存中有 c, d 模块, 直接拿出使用. 然后再用一个请求, 将 f, g 模块使用 combo 服务下载下来

最终的 demo 的链接 [fis3-typescript-vue-hackernews-2.0](https://github.com/Wyntau/fis3-typescript-vue-hackernews-2.0).

dev 模式下的请求

![](/uploads/2017/04/2017040801-02.png)

在 dev 模式下, 我没有配置任何的合并, 所以进入首页后, 请求数很多. 除去 livereload, 以及 vconsole 这两个 dev 模式下才有的模块外, 还有 21 个文件请求.

production 模式下的请求

![](/uploads/2017/04/2017040801-03.png)

在 production 模式下, 我通过上面说到的使用 FIS3 的 packTo 配置, 将请求数降到 7 个. 其实还可以更进下一步, 将 `init.js` 和 `runtimes/runtimes.js` 再合并一下, 将运行时依赖以及项目启动文件, 同时合并到 `runtimes/init.js` 中

```js
// init 初始化文件
fis.match('/src/{boot,app}.{js,ts,vue}', {
  packTo: '/src/runtimes/init.js'
})

// 全局 runtimes 文件
fis.match('/src/runtimes/**.{js,ts,vue}', {
  packTo: '/src/runtimes/init.js'
})
```

那么这时候只剩下了 6 个请求, 还剩下的没有被合并的就是首页 view 依赖的一些公共组件模块了. 这里可以看一下, FIS3 提供的模块加载框架 mod.js 根据静态资源表分析到的文件依赖关系.

![](/uploads/2017/04/2017040801-04.png)

最后一个分组中的文件, 就是前面一个图中最后加载的 4 个文件. 我们已经可以在请求发出前, 就知道这4个文件有关联, 所以使用 combo 服务, 就可以一次请求这4个文件.

那么最后, 通过使用 FIS3 的 packTo 配置, 再配合使用 combo 服务的话, 我就可以将 21 个文件请求, 优化到 3 个文件请求. 如果进行页面切换的话, 因为有 combo, 发出的请求数也会很少.

再进下一步, 假如我们不使用 FIS3 的 packTo 配置, 而只使用 combo 服务的话, 通过上面的图, 可以看出, 也是可以将首次请求数量优化到3个.

第一个请求

    "boot"
    "node_modules/es6-promise/dist/es6-promise"
    "node_modules/process/browser"

第二个请求

    "app"
    "node_modules/tslib/tslib"
    "node_modules/vue/dist/vue"
    "node_modules/vuex-router-sync/index"
    "runtimes/filters/filters"
    "runtimes/router/router"
    "node_modules/vue-router/dist/vue-router.common"
    "runtimes/store/store"
    "node_modules/vuex/dist/vuex"
    "runtimes/store/api"
    "runtimes/store/create-api"
    "node_modules/firebase/app"
    "node_modules/firebase/database"
    "runtimes/views/app"

第三个请求

    "views/createListView"
    "components/ItemList"
    "components/Spinner"
    "components/Item"

只是, combo 服务需要后端或者 CDN 去配合, 只是前端的话, 就可以只使用 packTo 的配置, 效果也是很明显的.

### Edit

经掘金上的[任侠](https://juejin.im/user/57c9687e67f3560057b2409c)提醒, 在使用文件名 hash 和 CDN 强缓存的情况下, 浏览器根本不会去远端请求，直接从本地读取, 所以就不需要使用 localStorage 了.
