---
layout: post
title: "angular创建directive时, &与=在继承callback中的差异"
pid: 2014060501
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Angular]
---

在看angular的一个小项目时,遇到了一个问题, 就是在创建directive的时候, 对于新scope的创建上.

html代码如下

    <!doctype html>
    <html lang="en" ng-app="demoApp">
    <head>
        <meta charset="UTF-8">
        <title>angular test</title>
        <style>
            .demo1, .demo2{
                width: 200px;
                height: 200px;
                border: 1px solid #ccc;
                text-align: center;
                line-height: 200px;
            }
        </style>
    </head>
    <body>
        <div id="output"></div>
        <div ng-controller="demoCtrl">
            <demo x-cbk1="cbk1(arg1, arg2)" x-cbk2="cbk2"></demo>
        </div>

        <script src="http://cdn.staticfile.org/angular.js/1.2.16/angular.js"></script>
        <script src="demoapp.js"></script>
    </body>
    </html>

js代码如下

    angular.module('demoApp', [])
        .controller('demoCtrl', function($scope) {

            var output = angular.element(document.getElementById('output'));
            $scope.cbk1 = function(arg1, arg2) {
                output.html('click demo1, calls cbk1, arg1: ' + arg1 + ' arg2: ' + arg2);
            };
            $scope.cbk2 = function(arg1, arg2) {
                output.html('click demo2, calls cbk2, arg1: ' + arg1 + ' arg2: ' + arg2);
            };
        })
        .directive('demo', function(){
            return {
                restrict: 'E',
                replace: true,
                template: '<div><div class="demo1">demo1</div><div class="demo2">demo2</div></div>',
                scope: {
                    cbk1: '&',
                    cbk2: '='
                },
                link: function(scope, element){

                    console.log('cbk1 string:', scope.cbk1);

                    console.log('cbk2 string:', scope.cbk2);

                    var demos = element.children();

                    var demo1 = demos.eq(0);
                    var demo2 = demos.eq(1);

                    demo1.on('click', function(){
                        scope.cbk1({
                            // 这里的调用方法需要注意, 不是使用参数列表, 而是使用object的方法
                            arg1: 'cbk1 arg1',
                            arg2: 'cbk1 arg2'
                        });
                    });

                    demo2.on('click', function(){
                        // 同原函数一样进行调用即可
                        scope.cbk2('cbk2 arg1', 'cbk2 arg2');
                    });
                }

            };
        });


可以看到, scope的两个cbk函数其实是一样的, 只是在从demo这个directive向template中的scope传递的时候并不一样,
传递cbk1的时候用的是 `&`, 传递cbk2的时候用的是`=`.

这样, 在template的新scope中, 接收到的cbk2是demo这个directive中的一个原样拷贝, 但是cbk1就不是了, 可以从上面获取两个函数的字符串表示中看到.

cbk1的字符串表示是

    function (locals) {
      return parentGet(scope, locals);
    }

cbk2的字符串表示是

    function (arg1, arg2) {
        output.html('click demo2, calls cbk2, arg1: ' + arg1 + ' arg2: ' + arg2);
    }

证明上面说的是正确的.

但是看angular官方文档的时候, 写的是, 如果需要传递一个callback的时候, 推荐使用`&`.

这里我的看法是, 如果这个callback不需要传递参数的话, 两种方法都没有问题.

如果需要向这个callback传递参数的话,我习惯上还是用`=`, 因为这里获取的function是一个原来函数的引用, 而不是经过angular包装的方法, 调用这个function的时候会更加符合函数的写法.

如果使用`&`的话, 调用函数就需要注意. 在上面html代码`x-cbk1="cbk1(arg1, arg2)"`中, cbk1的调用方法是`cbk1(arg1, arg2)`, 所以在调用这个方法就需要注意传递参数的正确. 在link中click回调中, 参数的传递方法是使用object, 而不是普通的参数列表的方法. key值是`x-cbk1="cbk1(arg1, arg2)"`中的形参的名字, 不能使用其它的名字.

以上.