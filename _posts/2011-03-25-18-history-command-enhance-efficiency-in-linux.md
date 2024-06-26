---
title: Linux中使用history命令提升效率
pid: 18
tags: [Linux]
---
![](/uploads/2011/03/20110325-18-01.png)

无论你是linux命令行新手还是老鸟,这些技巧都可以让您得到提升,节省时间,提升效率,增加兴趣....

**历史命令**

这些技巧大部分是利用 历史(history) 命令,我们首先输入

    history

然后你就会看到类似下图

![](/uploads/2011/03/20110325-18-02.png)

要想执行历史中的某一条命令,只要用 !加上命令前的行号就可以了.

    !510

![](/uploads/2011/03/20110325-18-03.png)

你也可以看一条命令是什么时候被执行的,我们来看看3条命令之前的命令是什么.

    !-3

![](/uploads/2011/03/20110325-18-04.png)

**快速替换**

假设你想执行上一条命令.直接输入两个感叹号即可(译者注:此时或许不如方向键方便,但下面才是真正的作用).当你在执行一条命令之后才发现忘记加上sudo了,这个命令就发挥了作用.

    sudo !!

![](/uploads/2011/03/20110325-18-05.png)

假设你想要运行一个命令,而此命令的参数,在上一个命令中已经有了,但是再打出来就太麻烦了,好了,直接用!$代替即可.

    cd !$

![](/uploads/2011/03/20110325-18-06.png)

如果你已经运行了一个带有两个参数的命令,但是接下来想要使用第一个参数的话,就可以使用!^命令,这个命令在你备份一个文件,然后想再编辑原文件的时候非常有用.

    nano !^

(注意看图中的上一条命令)

![](/uploads/2011/03/20110325-18-07.png)

接下来让我们从你历史中搜索某条特定的命令.按下Ctrl+R,当你输入的时候,就会自动搜索.你可以使用方向键找到你想要的命令.

![](/uploads/2011/03/20110325-18-08.png)

如果你知道你运行过的命令的特定的关键字,可以跳过搜索步骤,直接找到.

    !keyword(keyword换成你的关键字即可)

![](/uploads/2011/03/20110325-18-09.png)

**清空历史**

如果你想要清空历史
使用下面命令

    history –c

如果你想要禁用历史命令的话 使用如下命令

    HISTSIZE=0

想要再次启用的话,可以把0 换成某个数值.(默认数值通常是500或者1000)
使用如下命令可以使历史忽略以空格开头的命令.

    HISTCONTROL=ignorespace

在下面的第四行中,cd前面是空格,所以历史中忽略了

![](/uploads/2011/03/20110325-18-10.png)

**去掉重复**

使用如下命令忽略重复命令.

    HISTCONTROL=ignoredups

![](/uploads/2011/03/20110325-18-10.png)

如果你既想忽略空格,也想忽略重复的话,使用如下命令

    HISTCONTROL=ignoreboth

文章[来源](http://www.howtogeek.com/howto/44997/how-to-use-bash-history-to-improve-your-command-line-productivity/)
