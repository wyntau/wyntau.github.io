---
layout: post
title: Linux记录总结
pid: 125
comments: true
tags: [Linux, Ubuntu]
categories: [学习笔记]
---
***非Linux用户可以不用看此文啦.***

这里面写的都是些原来在使用Ubuntu还有fedora的过程中遇到的问题以及解决方法.原来没有独立博客.所以都放在了百度空间. [折腾窝窝](http://hi.baidu.com/weatny).现在把我认为对我以后还有用的东西转移过来.因此把所有的东西集合在一起,所以文章可能会非常长,因为我不打算弄 好几篇文章,毕竟这些东西都是旧东西.为了这些东西浪费几篇文章的空间不值得.

写这些东西的目的不是为了让大家看,是为了给自己做个记录.所以精简其中的一些文字,只留下必要的代码以及说明.

#### 一,ubuntu 下打开文本乱码解决办法
XP下的一个文本文件，在ubuntu下打开既然成了乱码，估计编码的原因。只要把相应的编码添加进去就可以咯。详细解决办法如下：终端输 入：gconf-editor（配置编辑器）依次打 开;apps--&gt;gedit2--&gt;preferences--&gt;encodings双击右边的 “auto_detected"--&gt;"添加"--&gt;输入：GBK（GB2312）--&gt;OK--&gt;点向上把它移动到最上边 --&gt;确认  不放心的话还可以再加上GB18030

今天发现按照上边做的后果会是,
你新建一个新文档 ，当里面什么内容都没有的时候你不能够用gedit打开它，解决方法就是把刚才的UTF-8调到最上边，把刚才添加的两个分别放在第二个和第三个，这样就解决了用gedit打开文档乱码和不能用gedit打开空白文档的问题了.

#### 二,ubuntu rar 乱码
rar等格式下载后老是乱码,就是Windows和Linux编码不同引起的
卸载rar，只留unrar

    sudo apt-get remove --purge rar

以下是我自己的看法 只安装 unrar就可以了 我就是这样解决的

    sudo apt-get install unrar 这样就好了

#### 三,Ubuntu 10.04 安装Nvidia显卡后开机花屏（分辨率低）完美解决
转载自 [touchsola](http://hi.baidu.com/touchsola)

1. 可以解决的问题：
    * 安装驱动后开机和关机画面花屏，分辨率低；
    * 开机画面直接出现，一闪而过，错过点点进度过程。（这个我原来幼稚地认为是10.04的开机速度太快，进度条来不及显示呢。呵呵）
2. 解决 方案：uvesafb 替代 vesafb（具体什么意思我也不知道）
3. 所需包：
    * v86d（uvesafb需要）
    * hwinfo（查看framebuffer）
4. 步骤
    1. 安装驱动：
        * 方法一，Nvidia官网下载最新驱动，但是得先屏蔽掉nouveau，而且安装后会出现Nvidia巨大的Logo,我没有用 这种方法。
        * 方法二，System--&gt;Administration--&gt;Hardware Drivers，我选的是那个Recommended。
    2. 安装所需包：

        sudo apt-get install v86d hwinfo

    3. 查看framebuffer

        sudo hwinfo --framebuffer

        我的显示器分辨率是1280x800的所以我需要的是：1280x800-24
    4. 修改grub文件

    sudo gedit /etc/default/grub

    （注意：以下更改中的1280x800分辨率数值可以改成任何你能在framebuffer中看到的并且你的显示器所支持的分辨率，最好是用显示器的最佳分辨率，如果最佳分辨率没有出现在上表中，可以使用1024x768分辨率，这个分辨率下显示效果也很好）

        # If you change this file, run 'update-grub' afterwards to update
        # /boot/grub/grub.cfg.

        GRUB_DEFAULT=0
        GRUB_HIDDEN_TIMEOUT=0
        GRUB_HIDDEN_TIMEOUT_QUIET=true
        GRUB_TIMEOUT=10
        GRUB_DISTRIBUTOR=`lsb_release -i -s 2&gt; /dev/null || echo Debian`
        GRUB_CMDLINE_LINUX_DEFAULT="quiet splash nomodeset video=uvesafb:mode_option=1280x800-24,mtrr=3,scroll=ywrap"
        GRUB_CMDLINE_LINUX=""

        # Uncomment to disable graphical terminal (grub-pc only)
        #GRUB_TERMINAL=console

        # The resolution used on graphical terminal
        # note that you can use only modes which your graphic card supports via VBE
        # you can see them in real GRUB with the command `vbeinfo'
        #GRUB_GFXMODE=1280x800（原文没有去掉此行最前面的“#”号，应该去掉，即写成GRUB_GFXMODE=1280x800）

        # Uncomment if you don't want GRUB to pass "root=UUID=xxx" parameter to Linux
        #GRUB_DISABLE_LINUX_UUID=true

        # Uncomment to disable generation of recovery mode menu entries
        #GRUB_DISABLE_LINUX_RECOVERY="true"

        # Uncomment to get a beep at grub start
        #GRUB_INIT_TUNE="480 440 1"

5. 修改initramfs:</span>

    sudo gedit /etc/initramfs-tools/modules

        # List of modules that you want to include in your initramfs.
        #
        # Syntax: module_name [args ...]
        #
        # You must run update-initramfs(8) to effect this change.
        #
        # Examples:
        #
        # raid1
        # sd_mod
        uvesafb mode_option=1280x800-24 mtrr=3 scroll=ywrap

6. 强制使用Framebuffer:

    echo FRAMEBUFFER=y | sudo tee /etc/initramfs-tools/conf.d/splash

7. 更新grub和initramfs:

    sudo update-grub2
    sudo update-initramfs -u
8. 重启

    （重启时的退出ubuntu画面还是低分辨率的，不要急，待重启后进入ubuntu时的分辨率已经是你设定的了）

#### 四,ubuntu:关闭UTC
目的：使ubuntu系统与windows系统时间保持一致

操作：

    # vi /etc/default/rcS
    modify
    UTC=yes
    to
    UTC=no

更好的办法是在安装的时候就选择关闭UTC 我安装的时候就关闭了
#### 五,减少ubuntu开机引导多余项目
这是在ubuntu中文论坛上看的,怕以后找不到所以现在转下来,以防以后找不到
在win系统下安装ubuntu后开机引导系统的时候会出现多个选择项目 就像下面这样
> 1. ubuntu with linux 2.6.35-22-generic
> 2. ubuntu with linux 2.6.35-22(recovery mode)
> 3.memory test (memtest 86+)
> 4.memory test (memtest 86+) serial console 115200
> 5.windows 7 (loader) (on/dev/sdal)

我们需要的是1 2 和5.
PS:ubuntu上牛人说2最好还是保留.以防不测好恢复.
把3 4去掉的方法就是,
看/etc/grub.d/下面的文件,
带memtest86+的就是生成3、4项的，移走即可.
移完后,别忘了更新一下grub.

命令

    sudo update-grub
#### 六,Ubuntu下Flash乱码的解决方法
若所播放的flash里有字体乱码（显示为方块），那么按如下方法解决：

1. 在终端里输入sudo gedit /etc/fonts/conf.d/49-sansserif.conf然后回车
2. 将倒数第四行 sans-serif 改为 文泉驿正黑

保存即可，重启firefox，flash乱码解决了。
有的人也许可以只要将sans-serif 改成sans serif 就好了...
把中间的"-"去掉....
貌似这是一个BUG...
#### 七,重装windows xp操作系统后恢复Ubuntu的引导启动
1. 方法一：重新安装xp后ubuntu进不去了，原因是引导文件被XP修改了，可以通过下面方法找回ubuntu
    1. 找到ubuntu的光盘，进入试用界面；
    2. 打开终端，或者按ctrl+alt+F1进入；
    3. 输入：sudo -i 命令获取超级管理员
    4. 输入：grub 命令来使用引导工具
    5. 输入：find /boot/grub/stage1 命令来查找引导文件，find后面有个空格
    6. 屏幕显示你的ubuntu在那里安装的了，格式为（hd0，7），表示第一个主硬盘的第七个分区，
    7. 输入：root (hdx,7) 命令，注意root后面有个空格，括号里的内容为上面显示的内容，这个时候界面没有什么变化
    8. 输入：setup (hd0) 命令，同样setup后面有个空格。
    然后出现几行的sucess.这个时候就引导成功了，重启后就可以看到原来的引导界面了
2. 方法二、使用GRUB for Dos软件引导修复
    - 第一步、先下载 grub4dos-0.4.3.rar 并解压将 grldr 和menu.lst一同复制到 C:；
    - 第二步、编辑C:BOOT.INI，加入一行: C:GRLDR=”GRUB” 并把其中的timeout改成timeout=10 保存boot.ini
    - 第三步、重新启动windows xp 就会出现启动界面多出一个引导启动项GRUB选项，选择它就可以引导启动ubuntu啦～！
3. 方法三、直接使用ubuntu自救模式进行修复
    1. 用 Ubuntu 安装 CD 开机
    2. 在 “boot:” 提示号出现时, 键入 “rescue” 当作开机参数boot: rescue
    3. 顺着屏幕上的指示跟着作4，例如
        假设 /boot 磁碟分区位在 /dev/hda
        代码:

            #grub-install /dev/hda
        ps：我一般都是常留着我的livecd的，所以我常用的是第一种方法，很简单有效。

以上内容转载自<http://blog.163.com/xueyulong1988@126/blog/static/55163238200985103744248/>
感谢似水流年  
用livecd修复grub  
用ubuntu 的livecd启动后,打开终端  
假如你的ubuntu的 / 分区是sda7,又假如 /boot分区是 sda6,用livecd启动,在终端下
输入

    sudo -i
    mount /dev/sda7 /mnt
    mount /dev/sda6 /mnt/boot (如果没 /boot 单独分区这步跳过)
    grub-install --root-directory=/mnt /dev/sda
下面是百度找到的,我还没有试过

重装windows xp操作系统后恢复Ubuntu9.04的引导启动
下载最新版的grub4dos,从中提取出一个名为grldr的文件,把它放到XP系统盘的根目录下,修改boot.ini,在它的末尾加一句:

    c:grldr="ubuntu"
如此即可.注意,我这里是假设你的XP装在C盘,如果不是C盘,请改为对应的盘符号.

#### 八,[Ubuntu10.10之Wine下完美安装QQ 2010](http://hi.baidu.com/weatny/blog/item/1e2a28f20fd3747fddc4742b.html)
Wine下完美安装QQ 2010：

1. 先安装Wine

    sudo add-apt-repository ppa:ubuntu-wine/ppa
    sudo apt-get update
    sudo apt-get install wine
2. 获取获取最新的WineTricks，WineTricks 是 Wine的其中一个开发者DanKegel写的一个安装Windows有关库和软件的小程序，非常有用。
    下载WineTricks，在终端中输入:

        wget http://www.kegel.com/wine/winetricks

    也就几秒的时间。
3. 安装WineTricks：

    终端中输入：

        sh winetricks msxml3 gdiplus riched20 riched30 ie6 vcrun6 vcrun2005sp1 flash

    接下来会出现窗口形式的安装界面，按照提示一步步装下去就行。
4. 修改QQ的显示字体：

    将Windows系统下的“Windows-&gt;Fonts”下的“simsun.ttc”拷到“wine-&gt;Fonts”
    进入Wine的注册表“/home/用户名/.wine/dosdevices/c:/windows/”，右键用"使用Wine Windows Program Loader打开" 方式打开regedit.exe，打开[HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\FontSubstitutes]，将“MS Shell Dlg ”“MS Shell Dlg 2”“Tahoma(可以在fontsubstitutes点击右键查找)”三项的值都设为“simsun”。
    说明：这一步最后设置也行，最后设置可以让你看到修改前和修改后的区别。
5. 将下载好的“QQ2010.exe”放到某位置，我是放到桌面的。
6. 设置QQ的运行环境：

    打开“Configure Wine”,选中“应用程序”，把“QQ2010.exe”添加进去，并将“Windows 版本”设为“Windows 7”。（XP版本也行，我是设的“Windows 7”版本，未出任何问题）
    设置riched20.dll
    选中“函数库”，添加riched20.dll和riched32.dll 。

7. 设置权限：

    右键“QQ2010.exe”的属性，“权限”的“允许以程序执行文件”的勾勾上。

8. 开始安装：

    双击“QQ2010.exe”开始安装，这里跟windows下的安装过程完全相同。中间可能有错误提示，不用理会。

9. 开始登陆：

    先输入QQ号，注意，这时要用密码框旁边的软键盘输入密码，否则QQ程序会崩溃，然后最好勾上“记住密码”，不用一次一次的输入密码。

10. 登陆QQ空间：

    登上QQ后直接点击空间图标是没有反应的，这时需要换一种方式来登录。打开我的好友，右键自己的图标，点击“进入空间”。
    说明：到这一步，QQ2010就算安装完成了，安装完成后可能还有一些其它问题，但是到这一步已经非常不错了，相对于EVA和其它安装方式已经非常完美了。

#### 九,Linux Ubuntu /Fedora安装Ailurus（小熊猫）
Ubuntu 用户，这样装
9.10用户和10.04用户运行命令

    sudo add-apt-repository ppa:ailurus
    sudo apt-get update
    sudo apt-get install ailurus
对于其它版本的用户，以上命令执行出错，则运行命令

    sudo apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 9A6FE242
再用这个命令编辑源列表

    sudo gedit /etc/apt/sources.list
加入这两行：

    deb http://ppa.launchpad.net/ailurus/ppa/ubuntu karmic main
    deb-src http://ppa.launchpad.net/ailurus/ppa/ubuntu karmic main
Ubuntu 8.04, 8.10, 9.04, 10.04 的用户请将 karmic 换成 hardy, intrepid, jaunty, 或者 lucid
Fedora用户，这样装

    su -c 'wget http://homerxing.fedorapeople.org/ailurus.repo -O /etc/yum.repos.d/ailurus.repo'
    su -c 'yum makecache'
    su -c 'yum install ailurus'
#### 十,缺少公钥问题的解决方法
原文地址 http://forum.ubuntu.org.cn/viewtopic.php?f=120&amp;t=27006
症状：
代码:

    sudo apt-get update
    W: GPG error: http://apt.tt-solutions.com dapper Release: 由于没有公钥，下列签名无法进行验证： NO_PUBKEY 06EA41DE4F6C1E86
解决方法：
代码:

    gpg --keyserver subkeys.pgp.net --recv 4F6C1E86
    gpg --export --armor 4F6C1E86 | sudo apt-key add -
说明：
若缺少其他公钥，则将命令中两处4F6C1E86改为NO_PUBKEY
06EA41DE4F6C1E86中最后8位即可！

如果是Ubuntu PPA的
代码:

    sudo apt-key adv --recv-keys --keyserver keyserver.ubuntu.com
#### 十一,[fedora13安装 fcitx4.0.0输入法和设置](http://hi.baidu.com/weatny/blog/item/837b06a2417645e59052eefb.html)
默认情况下 fedora的库里面是有fcitx输入法的，但是版本很低 在已经出现4.0版本的时候，库里面仍然是3.63，因此想要装fcitx就要用电手段了
到fcitx的googlecode项目主页上 可以看到

动态  
2010-12-17fcitx 更新 4.0.1 fcitx-configtool 更新 0.2.0 fcitx-sunpinyin 更新 0.2.1  
2010-11-28fcitx-sunpinyin 更新 0.2.0  
2010-11-21版本管理改为 mercurial，将 fcitx-config 和 fcitx-sunpinyin 从 github 也迁移到了 google code。  
2010-11-19发布 3.6.4，4.0.0  
2010-11-09发布 4.0 rc1  
2010-11-02删除了 svn 里的原本打算用来存储码表的 /extra 目录，并将被删除的一个码表压缩包移到了下载列表里。在 svn 里存储压缩包等二进制文件不是一个好的实践。  
2010-10-12增加了 openSUSE 和 Fedora 的源，地址见右侧外部链接（External Links）(我要的就是这句话)  
2010-09-23增加 PPA 源，地址见右侧外部链接（External Links）Google code 上的 deb 包将不再更新

于是按照说的去找 源 看到了 home:csslayer.repo
好 下载下来 放到 /etc/yum.repos.d里面
然后

    yum makecache
然后就可以

    sudo yum install fcitx
这样就可以安装最新版本的输入法了
装完后最好能够把自带的 ibus输入法 删除掉

    sudo yum remove ibus
这样可能系统进入的时候 fcitx不能自动启动
这样做:
点击系统--&gt;首选项--&gt;启动应用程序 对话框中点击添加 名称 命令位置分别填上 fcitx fcitx 即可 这样注销之后 看看fcitx是不是自动启动了？
或者在～/.bashrc文件中添加如下语句

    export XMODIFIERS="@im=fcitx"
    export XIM=fcitx
    export XIM_PROGRAM=fcitx
    fcitx&

但是建议用第一种方法,我用第二种出现了打开终端 就又提示加载fcitx配置文件错误的问题
#### 十二,ubuntu10.04安装openfetion的方法
在ubuntu的环境下有三种方法：

1. 方法一：编译安装
    1.下载源码包：http://ofetion.googlecode.com/files/openfetion-1.8.tar.gz，解压到任意文件夹里（命令：tar -zxvf openfetion-1.8.tar.gz）。
    2. 如果你的系统里没有下面的这些：libssl-dev，libxml2-dev ，libgtk2.0-dev；需要先安装；

        sudo apt-get install libssl-dev
        apt-get install libxml2-dev
        sudo apt-get install libgtk2.0-dev
    3. cd /你解压后的目录（openfetion-1.8）
    4. 分别运行

        ./configure
        make
        sudo make install .
    5. 完成！到 “应用程序——互联网，飞信Openfetion。
2. 方法二：ppa源安装

        sudo apt-add-repository ppa:happyaron/ppa
        sudo apt-get update
        sudo apt-get install openfetion
3. 方法三：deb安装包

    到 http://ppa.launchpad.net/happyaron/ppa/ubuntu/pool/main/o/openfetion/下载相应的版本，双击安装。
4. 方法四：

        sudo gedit /etc/apt/sources.list
    1. 添加源：

            deb http://ppa.launchpad.net/happyaron/ppa/ubuntu lucid main

    2. 添加key：

            sudo apt-key adv –keyserver keyserver.ubuntu.com –recv-keys DDA4DB69

    3. 更新

            sudo apt-get update

    4. 安装

            sudo apt-get install openfention

#### 十三,fedora 面板问题

新建了一个面板，把属性设置为自动隐藏，并且显示隐藏按钮，在隐藏按钮上显示箭头。但是它就出不来了

1. 先确定你新建的面板在左侧还是右侧
2. 在fedora原有面板上点击鼠标右键 选择属性-----常规里面有一个方向，把方向选择成你第一步周里面所确定的方向
3. 把鼠标放在第一步周所确定的方向上 晃动几下 会看到一个没有内容的灰白条 把鼠标放上去 点击邮件 删除
4. 好了 这样就删除掉新建的面板了。。。 恩 这是个bug。。。 在重复第二部把面板还原就好了。。

#### 十四,[fedora13 h3c8021xclient自动配置脚本的麻烦以及解决方法](http://hi.baidu.com/weatny/blog/item/87caddeb9715d35d78f055df.html)

#### 十五,fedora 13 增加菜单编辑器，方便添加删除修改菜单项<

fedora又不自带菜单编辑器，所以只能手动安装了
安装alacarte即可。
命令：

    yum install alacarte
一百多k。很快安装好后在 “系统”--》“首选项”中就能看到“主菜单”的选项了。
点击“主菜单”就可以很方便的对菜单进行编辑。

#### 十六,libreoffice执行中文化方法(ubuntu)

    sudo apt-get install libreoffice-gnome
    sudo apt-get install libreoffice-l10n-zh-cn libreoffice-help-zh-cn

#### 十七,fedora13配置sudo文件手记

安装fedora之后就是配置sudo文件了，话说这个真不好弄，网上的人啊，都不知道新手真的需要什么。
我找了很长时间才知道 配置这玩意是如此的简单

首先打开终端 输入

    su -

然后输入密码，接着输入

    visudo

然后按光标，往下走，找到如下代码

    ## Allow root to run any commands anywhere
    root ALL=(ALL) ALL

然后在此代码下按A,然后添加如下代码

    ‘你的用户名’ ALL=(ALL) ALL

*比如我的用户名为ripflowers，则添加代码为：*

    ripflowers ALL=(ALL) ALL

注意网上有很多地方说这样你就拥有了sudo权限，但是别急，你还没有保存呢，我就是因为这里没保存，好几次没有配置成功。还以为是网上的人说错了呢
添加完以上代码后 按ESC键退出 ，然后 再次输入

    ：wq

三个字符，然后按回车，是不是就回到了尼输入visudo的界面，那样就表示你成功了。
然后验证以下身份，输入

    sudo whoami

回车后输出

    root

呵呵 已经是管理员权限了。

以后再想执行权限高的指令时只要输入sudo 然后再输入你想要的指令就可以了
