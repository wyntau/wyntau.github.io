---
layout: post
title: 扩展后台侧栏小工具初记
pid: 177
comments: true
tags: [Widget, WordPress]
categories: [WordPress]
---
又想着更新一下我的修改的philna2,但是找不到哪里可以更新,于是我就四处逛一逛.发现了一个值得鼓捣的地方.

扩展后台的小工具.

现在的主题侧栏部分要求大家什么都不要放,但是有点朋友不习惯,所以嘛,还是弄成后台可以直接拖放的小工具比较好.这样朋友们就可以安排自己的侧栏小工具的排列位置了.

下面这个是从codex.wordpress中找到的一段代码.放到functions.php中就可以在后台中生成一个输出 "hello world"的侧栏小工具.

我要做的就是把他改造一下,用来放我的侧栏的那个 最新评论,最新文章,随机文章的小工具.

    <?php
    /**
     * FooWidget Class
     */
    class FooWidget extends WP_Widget {
        /** 构造函数 */
        function FooWidget() {
            parent::WP_Widget(false, $name = 'FooWidget');
        }
        /** @see WP_Widget::widget */
        function widget($args, $instance) {
            extract( $args );
            ?>
                  <?php echo $before_widget; ?>
                      <?php echo $before_title
                          . $instance['title']
                          . $after_title; ?>
                      Hello, World!
                  <?php echo $after_widget; ?>
            <?php
        }
        /** @see WP_Widget::update */
        function update($new_instance, $old_instance) {
            return $new_instance;
        }
        /** @see WP_Widget::form */
        function form($instance) {                $title = esc_attr($instance['title']);
            ?>
                <p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?> <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" /></label></p>
            <?php
        }
    } // class FooWidget
    // 注册 FooWidget 挂件
    add_action('widgets_init', create_function('', 'return register_widget("FooWidget");'));

经过多方查找,学习,模仿,终于成功了.现在的侧栏的 那个最新评论 就是用后台的小工具实现的.还可以修改标题的名字.这样多好啊.更接近傻瓜式操作了.HOHO~~

具体的看图

[![](/uploads/2011/06/27-1.png)](/uploads/2011/06/27-1.png)

由于不会说,就不说了.等着有空了,就直接更新到主题上~~加上这个功能
另外,那个人体时钟我也去掉了.把 随便看看 的那个链接用木木讲的方法hook到了导航菜单上面.节省了空间了还不需要额外设置.呵呵.
