---
layout: post
title: 一段wordpress的Theme DEBUG程序
pid: 238
comments: true
tags: [PhilNa2, Themes, WordPress]
categories: [学习笔记]
---
- 作者:yinheli http://philna.com
- 出处:philna2主题
- 位置:app/debug.php
- 作用:开启自定义DEBUG后,在页脚上集中显示错误提示,而不是在分散在出错位置上直接显示
- 使用方法:在functions.php文件中设置自定义DEBUG选项,define('THEME_DEBUG',true); 或者false.

        <?php
        if(defined('THEME_DEBUG') && constant('THEME_DEBUG')){
        //如果定义了自定义DEBUG,则设置错误处理函数
            set_error_handler('ErrorHandler', E_ALL);
            $GLOBALS['PHPErrorMessage'] = array();
            //设置错误信息数组
        }
        /**
        * @param int $errno contains the level of the error raised, as an integer.
        * @param string $errstr contains the error message, as a string.
        * @param string $errfile which contains the filename that the error was raised in, as a string.
        * @param int $errline contains the line number the error was raised at, as an integer.
        * @param array $errcontext which is an array that points to the active symbol table at the point the error occurred...
        * @return unknown_type
        */
        function ErrorHandler($errno, $errstr, $errfile, $errline, $errcontext){
            static $id = 1;
            if(!is_user_logged_in()){
                return;
            //如果不是管理员登录,则直接返回
            }
            //判断错误级别
            switch($errno){
                case E_WARNING : case E_USER_WARNING :
                    $type = 'Warning';
                    break;
                case E_NOTICE : case E_USER_NOTICE :
                    $type = 'Notice';
                    break;
                default :
                    $type = 'Error';
                    break;
            }
            //填充错误信息数组
            $GLOBALS['PHPErrorMessage'][] = 'ID: '.$id.' '.$type.': '.$errfile.' line: '.$errline.' '.$errstr;
            $id++;
            return;
        }
        //echo E_NOTICE;
        function DisplayPHPErrorMessage(){
            //if(is_bot()) return;
            if(isset($GLOBALS['PHPErrorMessage']) && $GLOBALS['PHPErrorMessage']){
                echo '<div style="margin: 0 auto; width: 898px"><h3>PHP errors on this blog</h3><ul>';
                foreach($GLOBALS['PHPErrorMessage'] as $message){
                    echo '<li>', $message, '</li>';
                }
                echo '</ul></div>';
            }
        }
        add_action('wp_footer', 'DisplayPHPErrorMessage', 0);
        ?>