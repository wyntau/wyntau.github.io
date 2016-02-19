---
layout: post
title: "OS X 10.9 安装配置 laravel4"
pid: 2014080601
comments: true
keywords: "Laravel"
description: ""
categories: [学习笔记]
tags: [PHP, Laravel]
---

1. 从Laravel官网下载[Laravel installer PHAR archive](http://laravel.com/laravel.phar), 重命名为`laravel`, 放到`/usr/local/bin`下.
2. 使用`laravel new demo`创建一个项目为demo, 并初始化文件目录.
3. 配置nginx指向demo目录, 并将index文件指向`server.php`

        server {
            listen 80;
            server_name laravel.local;
            root /path/to/demo;
            index index.html index.htm server.php;

            location / {
                if (!-e $request_filename) {
                    rewrite  ^(.*)$  /server.php?s=$1  last;
                    break;
                }
            }

            location ~ \.php$ {
                fastcgi_pass   127.0.0.1:9000;
                fastcgi_index  server.php;
                fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
                include        fastcgi_params;
            }
        }

4. 在hosts文件中添加一条host记录

        127.0.0.1 laravel.local

5. 设置laravel的`app/storage`目录为可写

        chmod -R 777 app/storage

6. 使用homebrew为osx安装php的mcrypt扩展(laravel需要).

        brew install php54-mcrypt --without-homebrew-php

7. 为php添加mcrypt的配置

        sudo su
        cp /etc/php.ini.default /etc/php.ini
        echo 'extension="/usr/local/Cellar/php54-mcrypt/5.4.31/mcrypt.so"' >> /etc/php.ini

8. 启动php-fpm

        sudo php-fpm

9. 访问<http://laravel.local>即可看到正常运行的laravel demo