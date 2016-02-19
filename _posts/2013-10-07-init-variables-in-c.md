---
layout: post
title: "在C中初始化变量"
pid: 2013100701
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [C]
---

在C中对变量进行初始化相对其它高级语言来说,有一些困难.所以简单总结了几种变量的初始化方法

### 普通变量
例如`int`, `char`, `float`等,直接使用最普通的初始化语法

    int a = 12;
    char b = 'a';
    float c = 12.3;

### 数组
- __字符数组__

        char a[] = {'e', 'x', 'a', 'm', 'p', 'l', 'e', '\0'};
        // 最麻烦的赋值方法,还要注意最后面的'\0', 因此不推荐此方法
        char b[] = "example";
        char *c = "example";
        // 相对最优雅的方法
- __非字符数组__

        int a[] = {1, 2, 3, 4, 5};
        // 数组分别赋值为 1, 2, 3, 4, 5
        int b[5] = {1};
        // 初始化一个长度为5的整数数组,第一项赋值为1,其余为0
- __多维数组__

        char *a[] = {
            "example1", "example2",
            "example3", "example4"
        };
        // 初始化一个字符串数组

        char **b = malloc(4 * sizeof(char *));
        // malloc方法需要include "stdlib.h"
        b[0] = "example5";
        b[1] = "example6";
        b[2] = "example7";
        b[3] = "example8";
        // 在知道字符串个数的情况下,初始化字符串数组

        int c[3][5] = {
            {1, 2, 3, 4, 5},
            {6, 7, 8, 9, 10},
            {11, 12, 13, 14, 15}
        };
        // 初始化整数二维数组时,分别指定第一维和第二维的长度

        int d[][5] = {
            {1, 2, 3, 4, 5},
            {6, 7, 8, 9, 10},
            {11, 12, 13, 14, 15}
        };
        // 不指定第一维的长度,编译器根据第二维的长度自动判断第一维长度

        // int e[][5] = {
        int e[3][5] = {
            1, 2, 3, 4, 5,
            6, 7, 8, 9, 10,
            11, 12, 13, 14, 15
        };
        // 直接当成一个一维数组

### 结构体

        typedef struct Person{
            int id;
            int age;
            char *name;
        } Person;

        Person people1;
        people1.id = 1;
        people1.age = 11;
        people1.name = "example1";

        Person people2 = {
            .id = 5,
            .age = 14,
            .name = "example2"
        };
        // 类似于JavaScript中的对象字面量方法,但是需要在属性前面加`点`,
        // 赋值操作使用`等号`,而不是JavaScript中的`冒号`

        Person *people3 = malloc(sizeof(Person));
        // 使用malloc确定指针指向的空间大小,否则会出现`segmentation fault`错误
        people3->id = 3;
        people3->age = 13;
        people3->name = "example3";
        // 因为people3是指针,所以此处使用箭头符号`->`,而不用点号`.`

##### 如果你也有一些个人体会或总结,欢迎在下方评论.