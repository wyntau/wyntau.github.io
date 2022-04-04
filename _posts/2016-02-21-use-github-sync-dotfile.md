---
layout: post
title: 使用Github管理配置文件
pid: 2016022102
tags: [GitHub]
---

Github, 一个神奇的网站.

除了可以进行代码托管以外, 还可以进行博客托管, 就像你目前看到的我的博客一样.

今天我要向大家推荐的是使用Github来进行同步你的配置文件.

自己的电脑使用的时候长了, 难免会产生一些配置文件. 这些文件大都是自己经历长时间的使用之后沉淀下来的
宝贵财富. 如果更换电脑, 或者重装系统, 那么这些配置文件难免就会有丢失的风险. 使用Github就可以很
好的解决这些问题.

重装系统或者更换电脑后, 使用一个git命令, 所有熟悉的配置全部回来了, 这感觉!

<https://github.com/wyntau/dotfiles>

    $ git summary

    project  : .dotfile
    repo age : 2 years, 4 months
    active   : 189 days
    commits  : 657
    files    : 21
    authors  :
      517  Treri     78.7%
      138  Jeremial  21.0%
        2  username  0.3%


上面是我的个人配置文件, 经历2年多的时间的打磨, 包含了众多程序的配置文件, 并尽量做到自动化配置.

目前支持的程序如下

- git
- vim
- zsh
- SublimeText{2, 3}
- tmux
- astyle
- editorconfig
- homebrew

如果你使用的是*nix环境, 不妨一试.

如果你还没有使用Github来管理你的配置文件, 从现在开始动起来.
