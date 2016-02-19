---
layout: post
title: 一段python代码显神通
pid: 198
comments: true
tags: [Linux, Python]
categories: [学习笔记]
---
起因,在ubuntu中文论坛上乱逛,看到了一个帖子.具体需求就是楼主需要在一个包含数万个文件(具体多少不清楚,但是文件非常多)的文件夹中,寻找出所有的内容一样的文件.
这内容一样的文件,具体是什么样的呢?

1. 内容相同,但是文件名不同(可是是文件名不同,也可以是后缀不同).
2. 文件名相同,内容也相同,但是位于不同的子文件夹

最后需要将所有的相同文件 列表打印出来,以方便去掉相同的文件,或者是做进一步处理

回帖中,有人说使用md5值检验.但是考虑到文件数目非常非常多.每计算一个文件的md5值就需要很多时间,总时间加起来可想而知.

但是,ubuntu中文论坛的论坛管理员oneleaf(一叶)没用md5检验,给出一段python代码,完美解决 原文地址,点击[此处](http://forum.ubuntu.org.cn/viewtopic.php?f=120&t=87646&start=15)

上代码

    #!/usr/bin/env python
    #coding=utf-8
    import binascii,os

    filesizes={}
    samefiles=[]
    def filesize(path):
        if os.path.isdir(path):
            files=os.listdir(path)
            for file in files:
                filesize(path+"/"+file)
        else:
            size=os.path.getsize(path)
            if not filesizes.has_key(size):
                 filesizes[size]=[]
            filesizes[size].append(path)

    def filecrc(files):
        filecrcs={}
        for file in files:
            f=open(file,'r')
            crc = binascii.crc32(f.read())
            f.close()
            if not filecrcs.has_key(crc):
                 filecrcs[crc]=[]
            filecrcs[crc].append(file)
        for filecrclist in filecrcs.values():
            if len(filecrclist)>1:
               samefiles.append(filecrclist)

    if __name__ == "__main__":
        filesize("/home/oneleaf/test/")
        for sizesamefilelist in filesizes.values():
            if len(sizesamefilelist)>1:
                filecrc(sizesamefilelist)
        for samefile in samefiles:
            print "******* same files group **********"
            for file in samefile:
                print file
将以上内容保存为name.py,然后增加x权限. 注意将最后的 /home/oneleaf/test/目录改为你想要测试的目录.
然后执行py文件即可

下面是我的测试结果(将相同的文件散布于几个文件夹中)

    lwent@lwent:~$ ./name.py
    ******* same files group **********
    /home/lwent/test/2/aa.txt
    /home/lwent/test/aa.txt
    /home/lwent/test/1/test2/aa.txt
    /home/lwent/test/1/aa.txt
    lwent@lwent:~$

具体有什么用处呢?

打个比方,自从接触wordpress后.我就一直在找主题,虽然没换过几个,但是找的主题确实有几百兆了.

另外主题放的都比较乱.时间一长,当再遇到一个心仪的主题后,就会忘记,我到底收藏过没有.
为了保险起见,还是会下载下来.虽然如果有存在的文件时,会提示覆盖,但是还是会有不少文件,因为存放到不同的文件夹的原因,而再次下载下来

现在,用这段代码,就可以将所有的文件夹里面的主题全部搜索一遍,不管文件名是什么,只要文件内容相同的,统统找出来打印成列表.方便我将多余的文件剔除.
