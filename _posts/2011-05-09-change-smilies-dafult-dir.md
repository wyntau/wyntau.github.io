---
layout: post
title: PhilNa2-更改默认表情图片位置
pid: 123
comments: true
tags: [PhilNa2, WordPress, 原创]
categories: [WordPress]
---
先唠叨几句啦.下午的时候本来就写好了.可是就在粘贴到编辑器里面的时候,学校的网突然就断了,我连草稿都没存,估计又浪费了一个文章ID....
学校的网络都TM垃圾.一天一块钱,可是网速慢的像屎 :twisted: .....还动不动就就掉线....日子真不好过.... :roll:

不说了.下面是下午的时候写的.

在willin kan大师的博客上闲逛的时候看到了这个东西.所以就在本地试验了一下,结果成功了.
更改表情图片位置的好处就不多说了.大部分人对wp内置的表情不喜欢,都换上了自己喜欢的表情图片.但是wp一升级,那些表情图片就全部都没有了,还要我们再自己上传覆盖.把表情图片的位置改为主题里面的位置就好了,不管wp怎么升级.表情都不会变.

现在我就在为wp升级做准备,看看能转移到主题文件夹里面的东西就赶紧转移.省得升级之后还要我麻烦手动更改.
我这里说的是对philna2主题的修改方法.对于其他主题的方法,还要看各自的主题进行调整,大家去willin kan大师的博客上去看原文吧.

原文地址<http://kan.willin.org/?p=1341>

*philna2更改方法.*(其他的主题更改方法,大同小异,自己看着办吧.)
将*wp-includes/imges/*里面的*smilies*文件夹复制到*philna2/images/*里面.
然后修改*philna2/app/smilies.php*,将第34行的

	$path = get_bloginfo('url').'/wp-includes/images/smilies/';

改为如下代码

	$path = get_bloginfo('template_directory').'/images/smilies/';

这样评论框上点击那个表情图片出现的图片就是读取的这个路径里面的了.
然后在*functions.php*文件中添加如下代码.

	//下面函数用于更改wp默认的表情图片的路径
	function custom_smilies_src($src, $img){
	    return get_bloginfo('template_directory').'/images/smilies/' . $img;
	}
	add_filter('smilies_src', 'custom_smilies_src', 10, 2); // 優先級10(默認), 變量2個($src 和 $img)
	//下面的是给图片设置转义字符,以及增加图片.你可以按照下面的格式给自己添加表情.
	if ( !isset( $wpsmiliestrans ) ) {
			$wpsmiliestrans = array(
			':mrgreen:' => '11.gif',
			 ':no:' => '1.gif',
			':neutral:' => '12.gif',
			':twisted:' => '19.gif',
			 ':shut:' => '23.gif',
			 ':eat:' => '3.gif',
			  ':arrow:' => '16.gif',
			  ':shock:' => '7.gif',
			   ':surprise:' => '26.gif',
			  ':smile:' => '33.gif',
			    ':???:' => '5.gif',
			);
		}

记得将上面的那些转义字符和图片名称改成你现在使用的.

这样鼓捣完应该就可以啦.以后你就可以自己增加表情图片而且不用害怕wp升级会覆盖掉你的表情了.
现在你大可以把wp-includes里面的smilies文件夹删除了. :evil:
