---
title: 修改数据库前缀之后
pid: 119
tags: [Blog, WordPress]
---
由于当初我的域名不是现在使用的这个,建博客的时候,原域名使用的是wp默认的wp\_前缀,但是后来感觉那个域名(lueeon.com)不好记,所以就送人了,换了现在的域名,在建博客的时候没用遗留的数据库,新建了一个数据库,名字是wp2,前缀改成了wp2_

建博客也有一段时间了,原来的数据库也早就删除了.我就在想要不要把前缀改过来,把数据库名字改过来.因为我怕以后要是换服务器的话,如果再改前缀,数据库名字神马的麻烦,所以现在看看怎么改了.

我知道在wp-config.php中是有地方修改的.于是我把原数据库导出一份,然后新建一个名为wp前缀为wp_的数据库,把导出的备份导入,然后修改好前缀之后,又将wp-config.php里面的相关内容给改了.
访问网站没有任何异常.我以为这样就可以了.没想到,只是这样做完还不行.
当我访问后台的时候,悲剧的提示我"您没有足够的权限访问这个页面".如下图.

![](/uploads/2011/05/20110507-119-01.png)

到网上一搜索,修改wp的数据库前缀,这种情况很常见.所以顺便摘抄一下.如果有童鞋在修改前缀的时候,遇到了这样的情况,不要害怕,很容易就解决啦.
由于那些对于数据库的SQL语句 我不知道怎么用,所以找了一个手动修改的.就几个地方,也不是很麻烦.
步骤+图片来源:[信智恒盛](http://www.forsuc.com/blog/wordpress/no-access-wordpress-wp-admin.html) 本人只不过将图片下载后重新上传了.在这里表示感谢.

*首先*打开?\_options表，修改optionname字段值为?\_user_roles,修改为与你的前缀对应.

![](/uploads/2011/05/20110507-119-02.jpg)

*然后*打开？\_usermeta表，将meta-key字段中有旧前缀的值，更为新的前缀就OK。

![](/uploads/2011/05/20110507-119-03.jpg)

这样完成后就OK啦.网上那些SQL语句,我看了很害怕啊.就怕我操作失误会把wp搞挂了.....
