---
layout: post
title: 转-防止攻击 - WordPress登录邮件提醒
pid: 109
comments: true
tags: [转载]
categories: [他山之石]
---
首先祝大家五一快乐,劳动光荣. :lol:
今天看rss订阅,无意见又看到了好东西了.是个防止自己的博客被人恶意登录的东西,可以防止别人通过穷举的方法尝试密码哦.不说了.先转过来再说.
原文地址在*烙 印*的[防止攻击 - WordPress登录邮件提醒](http://awy.me/2011/05/prevent-attacks-wordpress-login-e-mail-alert/),这里表示感谢啦.

**---------------以下为烙印原文------------**

WordPress 不像Dedecms，可以任意的修改后台管理目录文件夹的文件名，防止有人恶意穷举登陆来破解密码。随着 WordPress 的发展，关注的人越来越多，漏洞也越来越多，我们更应该注意自己的后台安全。

为了防止博客被人穷举登陆，我们可以使用下面的代码来自动发送邮件提醒自己。

首先需要确定的是空间有无邮件功能，此功能需要邮件功能支持，测试有无邮件功能的方法：登录界面点击“忘记密码”，有邮件发到你邮箱就有邮件功能。

一、登录成功提醒

这种方法就像银行的登录提醒一样，如果有人登录了系统，就会发一封邮件到邮箱，提醒你有人登录了，如果当时不是你登录，就要引起警惕了。将以下代码放入主题的functions.php中：

    /*****************************************************
     函数名称：wp_login_notify v1.0 by DH.huahua.
     函数作用：有用户登录wp后台就会email通知博主
    ******************************************************/
    function wp_login_notify()
    {
        date_default_timezone_set('PRC');
        $admin_email = get_bloginfo ('admin_email');
        $to = $admin_email;
        $subject = '你的博客空间登录提醒';
        $message = '<p>你好！你的博客空间(' . get_option("blogname") . ')有登录！</p>' .
        '<p>请确定是您自己的登录失误，以防别人攻击！登录信息如下：</p>' .
        '<p>登录名：' . $_POST['log'] . '<p>' .
        '<p>登录密码：' . $_POST['pwd'] .  '<p>' .
        '<p>登录时间：' . date("Y-m-d H:i:s") .  '<p>' .
        '<p>登录IP：' . $_SERVER['REMOTE_ADDR'] . '<p>';
        $wp_email = 'no-reply@' . preg_replace('#^www.#', '', strtolower($_SERVER['SERVER_NAME']));
        $from = "From: "" . get_option('blogname') . "" <$wp_email>";
        $headers = "$fromnContent-Type: text/html; charset=" . get_option('blog_charset') . "n";
        wp_mail( $to, $subject, $message, $headers );
    }

    add_action('wp_login', 'wp_login_notify');

二、登录失败提醒

第二种方法我就得比较有效，有人尝试登陆你的系统，但是没有成功，这种反复尝试的动作本身就需要被记录下来，发给博主，这样，只要有错误的登录，就会发一封邮件到自己的邮箱，将对方尝试的登录名和登录密码发送到你邮箱。将以下代码放入主题的functions.php中：

    /*****************************************************
     函数名称：wp_login_failed_notify v1.0 by DH.huahua.
     函数作用：有错误登录wp后台就会email通知博主
    ******************************************************/
    function wp_login_failed_notify()
    {
        date_default_timezone_set('PRC');
        $admin_email = get_bloginfo ('admin_email');
        $to = $admin_email;
        $subject = '你的博客空间登录错误警告';
        $message = '<p>你好！你的博客空间(' . get_option("blogname") . ')有登录错误！</p>' .
        '<p>请确定是您自己的登录失误，以防别人攻击！登录信息如下：</p>' .
        '<p>登录名：' . $_POST['log'] . '<p>' .
        '<p>登录密码：' . $_POST['pwd'] .  '<p>' .
        '<p>登录时间：' . date("Y-m-d H:i:s") .  '<p>' .
        '<p>登录IP：' . $_SERVER['REMOTE_ADDR'] . '<p>';
        $wp_email = 'no-reply@' . preg_replace('#^www.#', '', strtolower($_SERVER['SERVER_NAME']));
        $from = "From: "" . get_option('blogname') . "" <$wp_email>";
        $headers = "$fromnContent-Type: text/html; charset=" . get_option('blog_charset') . "n";
        wp_mail( $to, $subject, $message, $headers );
    }

    add_action('wp_login_failed', 'wp_login_failed_notify');

个人推荐使用第二种方法，第一种如果你经常登陆后台的话，会造成邮箱大量邮件积累。不过你要是跟我一样习惯离线使用WLW发布的话，就无所谓了。目前烙印已经加入此功能，如果有人愿意尝试穷举登陆，我不介意将他加入访问黑名单。

参考来源[DH 博客](http://www.dhblog.org/?p=888)，感谢DH.huahua。

---

我也是把第二段 放到functions里面,然后一试.效果确实不错. 效果图大家可以去烙印博客看看.推荐大家是使用这段函数.
