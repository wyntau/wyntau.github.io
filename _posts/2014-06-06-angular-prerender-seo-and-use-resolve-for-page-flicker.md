---
layout: post
title: "Angular Prerender SEO实践"
pid: 2014060601
comments: true
keywords: "angular prerender autoscroll seo ngcloak uirouter"
description: ""
categories: [学习笔记]
tags: [Angular, SEO]
---

### 前导0

angular.js好用, 但是有一点不好的就是, 对于SEO不友好, 因为angular更适合于SPA单页面应用. 这样的话, 所有的html都是使用angular动态生成的. 因此搜索引擎就没有办法对整个网站进行索引.

对于这个问题, 我看了一篇文章[javascript SEO](http://jeffwhelpley.com/javascript-seo/). 看了这篇文章后, 对于使用angular的SEO, 有了一个简单的了解. 并且看到了线上已经在运行的一个网站<http://answers.gethuman.com/>, 知道按照文章中说的是完全可以既对搜索引擎友好, 同时又能完全发挥angular的优势, 来构建一个单页面应用的.

经过和博客作者的邮件沟通, 了解了一些具体的细节, 同时我也想通过一个例子进行试验一下. 所以自己进行了一番尝试, 在尝试的过程中, 自然遇到了一些问题. 经过一步步的寻找并解决, 现在对于angular单页面应用的SEO问题有了一个大体的了解, 因此在这里记录一下.

### 过程1 - 实现后端Prerender
实现这个思路应该不是太难, 我的做法是, 在后端使用ejs进行渲染, 在前端就是angular本身的渲染了. 这样虽然会存在两套模板, 但是其实成本并不大, 经过后面的说明就能明白.

对于数据来源, 我的做法是, 在后端有一个*数据获取层*, 一个*API层*. 在前端就是angular的*获取数据层*.

1. 后端的数据获取层, 只负责获取数据的逻辑部分, 输出的是结构化的数据.
2. 后端的API层, 对上面的数据获取层, 进行json或者jsonp的包装, 返回给前端.
3. 前端angular的数据获取, 通过2中的API层进行数据获取.

渲染流程为:

1. 后端ejs部分, 直接通过后端的数据获取层, 拿到数据进行渲染.
2. 前端的angular部分, 则通过后端的API层获取数据, 进行前端渲染.

由于后端的API层, 只是对数据进行简单的json或jsonp封装, 因此, **前后端拿到的数据实际上是一样的**. 这样就能保证, 前后端两套模板的逻辑是一样的, 只是ejs和angular模板语法的一些简单差异, 比如循环, if判断等等. 只需要拿其中一套模板, 然后将语法变成另外一种即可, 所以对于维护的成本, 个人感觉并不是太大.

### 过程2 - 前端angular的渲染问题
前端如果要使用angular进行数据绑定, 用户交互等操作, 就需要让angular接管页面的全部或部分. 由于这里我是完全使用angular + angular-uirouter, 因此这里就是接管全部页面了.

但是这里有一个问题.

如果将后端渲染的内容填充在ui-view中, angular渲染页面时需要的数据是在页面加载完成后, 通过接口获取的, 这个过程有等待, 但是angular在渲染之前就会把ui-view之间的内容全部清理掉, 就会造成刚进入页面是正常的, 然后页面突然空白一段时间(此时正在进行数据获取), 然后再次加载的问题.

如果将后端渲染的内容单独放到页面的一个部分中, 这部分内容是不受angular控制的. 同时, angular也会渲染一份相同的模板, 造成模板重复的问题.

所以为了解决这个问题, 我进行了一个小hack.

我把整个页面的结构写成这样

    <body ng-controller="topCtrl">
        <div ui-view ng-hide="initLoad"></div>

        <div ng-if="initLoad"><!-- 这里是后端模板渲染的部分. -->
        </div>
    </body>

js部分写成这样

    angular.module('demo', ['ngResource', 'ui.router'])
    .config(['$stateProvider', function($stateProvider){
        $stateProvider.state('state1', {
            url: '/state1/:param1',
            templateUrl: 'tpl/template.html',
            controller: 'demoCtrl'
        })
    }])
    factory('Resource1', ['$resource', function($resource){
        return $resource('/api/:param1', {
            param1: '@param1'
        });
    }])
    .controller('topCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
        // initLoad确定第一次加载页面时, angular不会把后端加载的页面清掉.
        // 当页面加载后, 设置initLoad为false, 当下一次进行angualr操作时,
        // 就可以自动将后端渲染的东西清理掉.
        var initLoad = $scope.initLoad = true;
        $scope.markInit = function(){
            // 如果是首次加载, 此处只是将标记更新一下, 然后直接返回,
            // 当下次再执行此方法时, 就需要使用angular渲染ui-view来替换后端渲染的模板
            if(initLoad){
                initLoad = false;
                return;
            }
            // 当$scope.initLoad的值变为false后, angular就会自动把后端渲染的模板清理掉.
            // 然后展示使用ui-view渲染的前端模板
            $scope.initLoad = false;
        };

        $rootScope.$on('$stateChangeStart', function(){
            $scope.markInit();
        });
    }])
    .controller('demoCtrl', ['$scope', 'Resource1', '$stateParams', function($scope, Resource1, $stateParams){
        Resource1.query({
            param1: $stateParams.param1
        }).$promise.then(function(data){
            $scope.data = data;
        })
        // ...
    }])

实现思路是, 让ui-view部分先隐藏起来, 只显示后端渲染部分. 当前端进行了一些操作, 需要跳转到ui-view的其它状态时, 再把服务端渲染的html去掉.

重点部分是topCtrl中的`initLoad`这个东西. 我们先把这个变量设为true或false,来保证ui-view部分是隐藏或显示.

在angular和uirouter初始化页面的时候, $rootScope会触发`$stateChangeStart`这个事件, 我们就利用这个事件来知道, 当前展示的页面是否是从服务端渲染来的, 还是后来由angular渲染来的.

第一次触发这个的时候, 是angular在进行首次渲染, 不应该把$scope.initLoad设为true, 所以我们只是把initLoad这个临时变量设为false, $scope.initLoad仍然为true.

当下一次再触发的时候, 首先检查initLoad这个变量, 此时为false, 证明不是首次加载了, 所以需要将$scope.initLoad设为false. 一旦$scope.initLoad变成false后, ng-if就会起作用, 将后端渲染的模板清理掉, 同时, 将angular渲染的模板展示出来.

这样, 过程2开头说到的问题基本就解决了.

### 过程3 - 保证首次加载后, 用户交互仍然可用.

过程2中只是做到后端渲染模板与前端渲染模板不冲突, 但是还无法解决一个问题. 如何保证在首次加载的后端模板不清理的情况下, 正确响应用户的click dblclick这些操作呢? 这些部分可是不在ui-view的controller控制之下的.

解决办法, 利用$scope的继承特性.

整个代码修改为下面这样.

    angular.module('demo', ['ngResource', 'ui.router'])
    .config(['$stateProvider', function($stateProvider){
        $stateProvider.state('state1', {
            url: '/state1',
            templateUrl: 'tpl/template.html',
            controller: 'demoCtrl'
        })
    }])
    factory('Resource1', ['$resource', function($resource){
        return $resource('/api/:param1', {
            param1: '@param1'
        });
    }])
    .controller('topCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
        // initLoad确定第一次加载页面时, angular不会把后端加载的页面清掉.
        // 当页面加载后, 设置initLoad为false, 当下一次进行angualr操作时,
        // 就可以自动将后端渲染的东西清理掉.
        var initLoad = $scope.initLoad = true;
        $scope.markInit = function(){
            // 如果是首次加载, 此处只是将标记更新一下, 然后直接返回,
            // 当下次再执行此方法时, 就需要使用angular渲染ui-view来替换后端渲染的模板
            if(initLoad){
                initLoad = false;
                return;
            }
            // 当$scope.initLoad的值变为false后, angular就会自动把后端渲染的模板清理掉.
            // 然后展示使用ui-view渲染的前端模板
            $scope.initLoad = false;
        };

        $scope.addMethod = function(evtName, func){
            // 此处的this指向的是ui-view对应的controller中的$scope
            this[evtName] = func;
            $scope[evtName] = func;
        };

        $rootScope.$on('$stateChangeStart', function(){
            $scope.markInit();
        });
    }])
    .controller('demoCtrl', ['$scope', 'Resource1', '$stateParams', function($scope, Resource1, $stateParams){

        $scope.addMethod('clickImg', function(){
            alert('click img');
        });

        Resource1.query({
            param1: $stateParams.param1
        }).$promise.then(function(data){
            $scope.data = data;
        })
        // ...
    }])

这样, 假如, 后端渲染部分如下

    <div ng-if="initLoad"><!-- 这里是后端模板渲染的部分. -->
        <img src="" alt="" on-click="clickImg()">
    </div>

这样修改之后, ui-view的controller添加一个方法后, 上层的topCtrl就能添加同样的方法, 就能正确响应用户的操作了.

只是, 这种修改方法有一个不好的地方. 如果我先写一个前端模板, 然后转换成ejs模板的语法, 就需要决定, 哪些angular语法需要转换, 哪些angular语法需要保留, 以便能够正确响应用户操作.

当然, 为了能够达到既使用angular, 又对SEO友好的最终目的, 这一切都不是问题.

### 过程4 - ngCloak

基本问题解决了, 那就写一个页面吧. 此时的页面可以后端prerender, 首次进入页面后, 也没有页面闪动现象, 还能够正确响应用户的一些操作, 看上去一切似乎都是perfect. 但是, 还是有很多问题.

页面闪动, 这里的页面闪动, 是后续的操作中的页面闪动, 从一个ui-view的state转换到另一个state的时候, 就像前面说的, angular会把页面的内容全部清理掉, 然后再进行渲染. 而不是, 等一切渲染就绪之后, 再把页面上的内容清掉.

使用`angular ui-view flicker`关键词进行搜索后, 发现了使用ng-cloak进行解决的方法, 但是我试验之后, 基本没有效果. 因为, ng-cloak的本质是一个class类, 在渲染的过程中, 是`display:none`状态, 当渲染完毕后,把这个class去掉.

看来, 这个东西, 并不能解决我说的问题, 既, 先清理页面内容, 然后再进行渲染. 由于渲染过程, 需要到服务器端获取数据,所以这个过程中, 整个页面就是白的.

### 过程5 - ui-router的resolve

又经过的一番搜索, 搜索到了ui-router中的一个东西, `resolve`, 通过文档可以看到, 这个东西, 是为了保证, ui-view对应的controller初始化时, 所有依赖的东西都已经加载完毕.

文档如下

> You can use resolve to provide your controller with content or data that is custom to the state. resolve is an optional map of dependencies which should be injected into the controller.
>
> If any of these dependencies are promises, they will be resolved and converted to a value before the controller is instantiated and the $routeChangeSuccess event is fired.

因此, 我把整个js代码修改成这样

    angular.module('demo', ['ngResource', 'ui.router'])
    .config(['$stateProvider', function($stateProvider){
        $stateProvider.state('state1', {
            url: '/state1',
            templateUrl: 'tpl/template.html',
            controller: 'demoCtrl',
            resolve: {
                // 在这里进行resource1Data的获取工作
                resource1Data: ['Resource1', '$stateParams', function(Resource1, $stateParams){
                    return Resource1.query({
                        param1: $stateParams.param1
                    }).$promise;
                }]
            }
        })
    }])
    factory('Resource1', ['$resource', function($resource){
        return $resource('/api/:param1', {
            param1: '@param1'
        });
    }])
    .controller('topCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
        // initLoad确定第一次加载页面时, angular不会把后端加载的页面清掉.
        // 当页面加载后, 设置initLoad为false, 当下一次进行angualr操作时,
        // 就可以自动将后端渲染的东西清理掉.
        var initLoad = $scope.initLoad = true;
        $scope.markInit = function(){
            // 如果是首次加载, 此处只是将标记更新一下, 然后直接返回,
            // 当下次再执行此方法时, 就需要使用angular渲染ui-view来替换后端渲染的模板
            if(initLoad){
                initLoad = false;
                return;
            }
            // 当$scope.initLoad的值变为false后, angular就会自动把后端渲染的模板清理掉.
            // 然后展示使用ui-view渲染的前端模板
            $scope.initLoad = false;
        };

        $scope.addMethod = function(evtName, func){
            this[evtName] = func;
            $scope[evtName] = func;
        };

        $rootScope.$on('$stateChangeStart', function(){
            $scope.markInit();
        });
    }])
    .controller('demoCtrl', ['$scope', 'resource1Data', function($scope, resource1Data){
        // 这是不再注入Resource1以及$stateParams, 而是直接注入resolve中定义的resource1Data
        $scope.addMethod('clickImg', function(){
            alert('click img');
        });

        $scope.data = resource1Data;

        // ...
    }])

经过以上修改, 就能保证, 当页面切换时, 会先去获取ui-view对应的controller需要的所有注入项, 等所有的注入项都已经是resolve状态时, 再进行controller的初始化工作. 这样, 页面闪动的问题就解决了.

### 过程6 - 完美方案

通过上面的resolve方案, 既然能够解决后续页面之间切换时的页面闪动问题, 那是否可以解决页面首次加载时的页面闪动问题呢? 因为首页加载的页面冷却也是由于resource去获取数据造成的.

所以, 试验一下, html代码修改为下面这样

    <body>
        <div ui-view>
            <!-- 这里是后端模板渲染的部分. -->
        </div>
    </body>

js代码修改为如下

    angular.module('demo', ['ngResource', 'ui.router'])
    .config(['$stateProvider', function($stateProvider){
        $stateProvider.state('state1', {
            url: '/state1',
            templateUrl: 'tpl/template.html',
            controller: 'demoCtrl',
            resolve: {
                // 在这里进行resource1Data的获取工作
                resource1Data: ['Resource1', '$stateParams', function(Resource1, $stateParams){
                    return Resource1.query({
                        param1: $stateParams.param1
                    }).$promise;
                }]
            }
        })
    }])
    .factory('Resource1', ['$resource', function($resource){
        return $resource('/api/:param1', {
            param1: '@param1'
        });
    }])
    .controller('demoCtrl', ['$scope', 'resource1Data', function($scope, resource1Data){
        $scope.clickImg = function(){
            alert('click img');
        }
        $scope.data = resource1Data;

        // ...
    }])

经过试验, 首页加载时的页面闪动问题也可以解决. 通过上面的方法, 也不需要topCtrl, 因为页面加载后, angular也会再次渲染, 但是这里的渲染过程不会出现页面闪动, 用户几乎察觉不到整个页面由后端模板向前端模板的过渡过程. 对于后端模板正确响应用户操作的hack, 同样也能去除.

以上就是我为了实现angular prerender SEO进行的一些研究, 以及为了达到一些目标而进行的hack, 并且一步步探索, 并寻找更优方案的过程. 虽然有些地方写起来看着挺简单, 好像一笔带过的样子, 但是其中的思考确实不太容易.
