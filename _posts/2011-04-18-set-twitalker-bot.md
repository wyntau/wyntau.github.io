---
title: TwiTalker bot搭建成功
pid: 85
tags: [Twitter]
---
最近两天没干什么别的事.想要看看css书,但是看不下去,只好到网上逛逛. 一直使用的免费的SSH帐号这两天非常不给力,一直连接不上.搞的俺上个推特,上个youtube看看都不行.还好学校的IPV6挺给力,可以曲线番羽墙,上个youtube和facebook.同时经过多方搜索,找到了可以限时使用的SSH,速度还可以.所以抓紧时间看看墙外的世界啊.

看了看墙外的 精品博客,还有可能吧.发现好多好东西啊.尤其是像 同步推特的工具.所以也学习了一点.
早就为没法从墙内同步twitter而恼火.原来一直在寻找同步twitter的工具.想过用buzz同步,或者是第三方工具,像buzz2twitter,Follow5,tweetfeed 还有使用feedburner烧制buzz后发布twitter信息这样的.可是我用的时候总感觉不好用.不是同步不及时就是没法看人家发的信息.只能单向同步. 所以一直都搁置了.
正好看jingpin博客的时候发现了一个gtalk机器人.TwiTalker.可能有的人已经听说这是什么样的一个东西吧? 不知道的就去搜索一哈子.这里就不多说了.

想说的就是这个功能太强大了,而且还是开源的. 下面写转一下jingpin博客上的原话.[原文地址](http://jingpin.org/gtalk-twitalker-twitter/)

**一、TwiTalker 的三大功能**

能吓人的东西通常都有不少牛逼的地方：

**1、简单易用**

通过 Twitter 帐号登录之后，将 TwiTalker 机器人添加到你的 GTalk 联系人里面，接着给机器人发送自动生成的验证码和密钥，然后就可以使用了，和添加其他微薄的机器人差不多。
另外，TwiTalker 的帮助（FAQ）页面还提供非常详细的使用教程，你可以按部就班。

**2、功能丰富**

除了一般的发布信息、回复信息、查看信息等功能之外，你还可以关注用户、查看列表、删除信息、等等，甚至还可以添加多个 Twitter 帐号。

**3、支持中文**

由于作者 Kevin 是汕头人，很了解中国国情，所以 TwitTalker 不仅提供中英文版本的介绍网站，而且也提供中英文版本的机器人，你可以根据自己的兴趣选择中文或者英文服务。
除了以上三大功能之外，TwiTalker 还有一个明显的优势，那就是——除了注册时需要登录 Twitter 官方网站之外，以后就可以免翻墙使用了，不管是通过 GTalk 客户端、Gmail、Talk Gadget，还是通过其他官方或者非官方的 GTalk 应用程序。

**二、TwiTalker 的两个不足**

有优势就有劣势，以下是 TwiTalker 的两个不足之处：

**1、机器人限制**

由于每个机器人最多只能添加 250 个 GTalk 帐号，所以 TwiTalker 自动为你提供的机器人很可能已经满额了，你需要到“列表”（Lists）页面亲自查看还有哪些机器人可以接受新用户，如果所有的机器人都满额了，那就得联系作者了。
到目前为止，TwiTalker 有二十几个机器人，虽然绝大多数已满额，不过仍然还是有未满额的。

**2、命令不好玩**

除了直接发信息（包括回复别人）之外，其他所有的操作都需要使用命令代码，而现在的人都趋向于通过移动自己的手指头来操作，所以 TwiTalker 的使用有点麻烦。

原来也发现了这个同步工具,但是总是发现官方的机器人已经满员了.无法添加.可是在jingpin博客上突然发现这个是开源的,只需要有google App engine帐号就可以搭建,所以何不自己搭建一个.

对于机器人限制的问题,很好解决.如果你有google帐号而且还申请了google App engine的话,完全可以自己搭建一个.以后就可以使用TwiTalker 来同步推特了.

这里 共享一下自己搭建的TwiTalker bot,限额是250人.到我发文前,才使用了两个名额.所以应该绰绰有余.
认证地址是 <http://othertweet.appspot.com>(需要番羽墙,保持低调,如果您不想再使用了,请及时解除绑定,以便腾出更多的空余名额)  
发推的时候 API名称为**AnotherTweet**.   
欢迎大家 Follow Me:[@vinntoe(http://twitter.com/vinntoe)  
如果我很有幸,能够帮到你的话,请留个言,让我知道

下面说几个最多使用的TwiTalker的命令吧.很少用的我就不列举了,想要更详细的,去我上面给的网址或者是官方的项目主页上找吧.

    查看帮助: -help
    查看所有帮助: -all
    绑定用户：-v 认证码 密钥
    删除绑定：-remove
    个人TwiTalker信息：-status 或 -st
    附加工具：-tool
    开启完全消息接收(接收好友消息和私信)：-on
    开启自我消息接收(只接受好友@我消息和私信)：-self
    直播模式消息接收(接收默认群组消息)：-live
    设置直播模式默认群组：-live 群组创建者用户名 群组名或群组ID号 (例:-live kavin_gray test)
    完全关闭消息接收(屏蔽所有消息)：-off
    设置消息接收刷新时间：-time 分钟数(只能取1到5的整数)
    推特操作功能:
    查看收藏：-fav 页数 (页数可省略，页数之前要带字母P，如-fav p2)
    查看私信：-d 页数 (页数可省略，页数之前要带字母P，如-d p2)
    @我消息：-@ 页数 (页数可省略，页数之前要带字母P，如-@ p2)
    自己发表的消息：-me 页数 (页数可省略，页数之前要带字母P，如-me p2)
    回复特定消息：-@ 消息id号 回复内容
    删除最近发布的一条消息：-del
    删除自己的消息：-del 消息id号
    给某人发送私信：-d 用户名 私信内容
    消息收藏：-fav 消息id号
    取消消息收藏：-unfav 消息id号
    消息RT：-rt 消息id号 附加消息(附加消息可省略)
    官方RT：-r 消息id号
    查看某人信息：-status 用户名 或 -st 用户名
    关注某人：-follow 用户名 或 -fo 用户名
    取消关注某人：-unfollow 用户名 或 -uf 用户名
    某人是否关注你：-if 用户名
