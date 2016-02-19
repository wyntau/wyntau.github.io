---
layout: post
title: "nginx配置phpmyadmin, 解决#2002错误"
pid: 2014052201
comments: true
keywords: "phpMyadmin"
description: ""
categories: [学习笔记]
tags: [Nginx, phpMyadmin]
---

通过homebrew安装phpmyadmin, 安装完成后, phpmyadmin只给出了下面的提示

    ==> Caveats
    Note that this formula will NOT install mysql. It is not
    required since you might want to get connected to a remote
    database server.

    Webserver configuration example (add this at the end of
    your /etc/apache2/httpd.conf for instance) :
      Alias /phpmyadmin /usr/local/share/phpmyadmin
      <Directory /usr/local/share/phpmyadmin/>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Order allow,deny
        Allow from all
      </Directory>
    Then, open http://localhost/phpmyadmin

并没有说明nginx如何配置, 原来的做法, 是单独为phpmyadmin配置apache监听8080端口.

但是感觉有些麻烦, 如果能只开nginx的话, 还是只开nginx.

nginx的配置如下, 彩添加一个vhost的办法.

    server {
        listen 80;
        server_name db.local;
        root /usr/local/share/phpmyadmin;
        index index.html index.htm index.php;

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

在`/etc/hosts`文件中添加一条hosts记录

    127.0.0.1 db.local

然后重启nginx即可.

访问db.local后, 使用root用户名, 空密码, 出现 #2002错误. 网上查询一下, 发现如下解决办法.

1. 找到phpmyadmin的配置文件 /path/to/config.inc.php
2. 找到文件中的$cfg['Servers'][$i]['host'] = 'localhost';
3. 将其修改为$cfg['Servers'][$i]['host'] = '127.0.0.1';
4. 关闭浏览器，再次登陆，就可以了。