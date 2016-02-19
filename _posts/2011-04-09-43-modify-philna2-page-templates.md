---
layout: post
title: PhilNa2主题页面模板修改
pid: 43
comments: true
tags: [PhilNa2, WordPress, 原创]
categories: [WordPress]
---
对于这个主题的页面模板,我只能说对我的挑战很大啊.当初刚使用这个主题时候就遇到了多多的问题,
首先是新建contact页面的时候,再编辑器里面输入的内容经过发布,看不到任何内容,只有空空的一个标题.然后是links页面,输入内容后也是如此,发布后有链接,但是连点说明都没法加.

我也向主题作者反馈了一下.主题一共自带了两个页面模板(加上默认的是3个,有特色的就两个嘛.哈哈)但是作者好像很忙,也没有解决,最后也就那样了.因此我一直都是使用的默认模板.链接页面我都是手动添加的链接啊.劳累程度可想而知了.

曾经想过在网上搜索答案来着,但是网上的新建页面的方法我好像都不适用(我知道本文的方法后才知道不是不适用,是我不会用.嘻嘻).别的主题有的像**page.php single.php**这样的文件,这个主题都有,但是文件里面只有寥寥几句话."include xxx"就完了.这对于刚上来使用wordpress就遇到这样的主题的我来说,难度很大啊.当时根本不敢胡乱改主题.要不然把网站搞的都进不去了.我就更不会弄啦.

随着使用这个主题的时间越来越长.对于这个主题的修改也越来越多,因此对主题的文件结构也慢慢熟悉了,同时对于主题作者的创作风格也慢慢熟悉了.

唉,闲话不说了.还是说说正事,修改这个主题的页面模板.也可以说是创建一个模板.
用到的文件也就两三个吧. template.php 还有loop.php
至于为什么使用loop.php,是因为只有使用这个文件时,在编辑器里面的输入内容才可以显示,而其他的都不显示,所以要拿来借用一下.
主题中的其他的文件只起参考作用了.

献丑一下,把我在写这篇文章的时候修改的文件共享一下.如果你怕自己搞坏(或者是你很懒)的话,可以直接下载我修改好的文件,文章中讲到的可以留可以删的地方我貌似都留着了.你不想要的话,可以再自己删除.也可以看完本文后自己看着删除不想要的.

**点击下载[page.php](http://u.115.com/file/f081e36b55)**

在修改的过程中,我都在本地的服务器上测试,每删除一条语句,我都会测试一下是否成功,

下面就说说具体的修改过程.

首先打开template.php文件,可以看到下面的一句话

	<?php include_once TEMPLATEPATH . '/loop.php';?>

这是将loop.php文件包含进来.因此我直接将loop.php里面的内容替换这句话,注意不要将下面的那个 < /div>去掉了.

原则上一个模板就这样创建完毕啦.你把page.php里面的内容全部删除,再把这个文件里面的内容全部粘贴到page.php里面,完全就替代了默认的页面模板.但是我们还要加工一下.
首先是下面这句话

	<?php include_once TEMPLATEPATH . '/templates/notice.php';?>

这一句,你可以去掉或者留着.去掉了对页面也没有影响(目前我测试的情况来看是这样的,但是最还还是留着吧)
然后是下面的

	if(is_archive() || is_search()){
		include_once TEMPLATEPATH . '/templates/loophead.php';
	}

这句话,一看就知道是对页面没用的东西啦.直接去掉.
然后往下走,又有一句

	<?php if( is_single() ): ?>
	        <div id="position" class="box message"><a class="right_arrow icon" title="<?php _e('Back to homepage', YHL); ?>" href="<?php echo get_settings('home'); ?>/"><?php _e('Home', YHL); ?></a> &gt; <?php the_category(', '); ?> &gt; <?php the_title();?></div>
	<?php echo "n"; endif; ?>

判断single,和页面模板也没有关系,直接去掉.
然后就是显示文章标题,还有作者信息发布时间之类的控制语句了.
下面还有一句话,

	<?php if(is_singular()): ?>
	<span id="skiptocomment" class="comments_link"><a href="#comments"><?php _e('Skip to Comments', YHL)?></a></span><?php else: ?><span class="comments_link"><sup>{ </sup><?php comments_popup_link(__('No Comments',YHL), __('1 Comment', YHL), __('% Comments', YHL));?><sub> }</sub></span>
	<?php endif; ?>

这句话是右上角的那个跳到评论的控制语句,如果你不打算让页面有评论功能的话,可以去掉.但是最好留着吧.我的留着了.
然后就到了**class="post_content content"**的部分了.

	if((is_home() || is_archive()) && has_post_thumbnail()) {
				the_post_thumbnail(); // you may change the size of the thumbnail by use param array(width, height);
			}

这句话,你可以去掉或者留着.这个是显示缩略图的,我感觉对于页面模板来说没有用处,所以去掉了.注意不要把前面的那个<  ?php去掉了.要不然你就悲剧了.

下面还有一句要处理的

	<?php if(!is_page()): ?>
		<div class="meta">
			<span class="cat icon"><?php the_category(', ');?></span>
			<?php the_tags('<span class="tag icon">', ', ', '</span>');?>
		</div>
		<?php endif; // meta ?>

这是显示文章下面的分类的那个控制语句.判断条件是 "如果是非页面".我们本来搞的就是页面模板,这里还判断非页面,直接去掉.

接下来就是 显示相关文章还有随机文章的控制语句了.

	do_action('philnaEndloop');

这句话是japhia童鞋告诉我用处的.页面应该用不着显示相关文章还有随机文章,去掉吧
接下来还有一句话

	include_once TEMPLATEPATH . '/templates/navigation.php';

这个的作用我还没弄明白,我去掉后 对页面好像没有什么影响,暂且先加个// 注释掉吧.
最后的一个就是下面这句话了

	comments_template();

这个就是评论功能了.要不要随你了.
如果你留着评论的话.我觉得对于这个评论还是要再修改一下.

就是文章下方的那个Trackback 还有评论框下方的那个Trackbacks & Pingbacks ( 0 )
页面应该用不到trackback,所以这些也去掉.修改这个的话,就不是在这个文件里面了.
转移到comments.php文件.找到

	<?php if(pings_open()):?>
	<a id="addtrackback" class="addtrackback" rel="nofollow" href="<?php trackback_url(); ?>" title="<?php _e('Use this link to send a trackback to this post.', YHL);?>"><?php _e('Trackback', YHL);?></a>
	<?php endif; ?>

这是显示 订阅到这里的评论右边的那个Trackback的,在前面加个判断变为

	<?php if(!is_page()):?>
	           <?php if(pings_open()):?>
	                      <a id="addtrackback" class="addtrackback" rel="nofollow" href="<?php trackback_url(); ?>" title="<?php _e('Use this link to send a trackback to this post.', YHL);?>"><?php _e('Trackback', YHL);?></a>
	           <?php endif; ?>
	<?php endif; ?>

这样 页面就不显示了,文章页正常显示.
还有最下面的那个显示trackback状态的控制语句了.找到`<!--trackpbacks state-->`,在前面添加

	<?php if(!is_page()):?>

然后再在最后添加

	<?php endif; ?>

这样页面就不会显示trackback状态了.
如果你还想把"**可以使用的标签:**" 那个框去掉的话,可以修改**commentform.php**文件,将位于最后的下面的语句删除

	<div id="allowed_tags" class="box message icon">
		<?php _e('**Allowed tags:** ',YHL);echo allowed_tags(); ?>
	</div>

好了,整个模板已经修改完毕了.接下来新建页面的时候,就可以任你发挥啦.
网上的那些复制page.php文件然后修改content部分也界可以使用啦.
比如新建一个link页面,就在

	<?php
			the_content(__('Read more...', YHL));
			?>

前面或者后面添加原本link页面的那个函数就好了.
如果还想要 主题作者yinheli写的那个contace页面的邮件表单,就把相关的语句复制过来放到相应的地方就好啦

模板是修改完毕了.但是我在想,原本的contact模板还有link模板好像里面并没有什么地方导致 输入的内容无法显示啊.无解.
不管啦.反正模板出来了,以后再添加什么模板的话,直接在这个基础上 修改就好啦.
