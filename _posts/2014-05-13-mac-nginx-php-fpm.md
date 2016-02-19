---
layout: post
title: "mac下nginx搭配php-fpm解析php文件"
pid: 2014051301
comments: true
keywords: "nginx php-fpm"
description: ""
categories: [学习笔记]
tags: [Nginx, PHP]
---

### 1. 为单个项目添加nginx的php-fpm配置.

在server中添加php-fpm的配置.

    server{
        listen 80;
        server_name demo.local;
        index index.html index.htm index.php;
        root /path/to;

        location ~ \.php$ {
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            include        fastcgi_params;
        }
    }

在nginx.conf中的默认配置中, 对于php-fpm的配置是有问题的. `SCRIPT_FILENAME`的配置有问题. 原配置中的值为`/scripts$fastcgi_script_name`, 需要修改为`$document_root$fastcgi_script_name`, 这样才能使路径随着上面设置的`root`进行变化, 否则当访问一个php文件时就会出现`File not found`的问题.

### 2. 开启php-fpm.

1. 添加php-fpm的配置文件.

    复制一份默认的php-fpm配置

        sudo cp /private/etc/php-fpm.conf.default /private/etc/php-fpm.conf

    对php-fpm.conf进行修改, 去掉php-fpm.conf中的`pid`及`error_log`的注释, 并修改为, `pid=/var/run/php-fpm.pid`, `error_log=/var/log/php-fpm.log`. 如果不重新对此两项进行配置, 可能会出现由于默认目录不存在, 导致php-fpm启动不成功的问题.

2. 启动php-fpm

        sudo php-fpm

### 3. 添加hosts记录

    127.0.0.1 demo.local

如果愿意的话, 可以为nginx添加php文件的rewrite

    location / {
        if (!-e $request_filename) {
            rewrite  ^(.*)$  /index.php?s=$1  last;
            break;
        }
    }

那么最终的nginx配置变为

    server{
        listen 80;
        server_name demo.local;
        index index.html index.htm index.php;
        root /path/to;

        location / {
            if (!-e $request_filename) {
                rewrite  ^(.*)$  /index.php?s=$1  last;
                break;
            }
        }

        location ~ \.php$ {
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            include        fastcgi_params;
        }
    }
