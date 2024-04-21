---
title: PVE LXC 安装 Jellyfin
pid: 2023070201
tags: [Jellyfin, PVE, LXC]
---

LXC 容器首先按照昨天讲的 nvidia 显卡直通步骤, 开启显卡直通功能. 下面是安装 Jellyfin 的步骤

**首先**是启用 `non-free` 源

我使用的是 lxc 容器, 模板是 debian 12, 所以在 debian 的源中, 先启用 `non-free` 源.
在 debian 12中, 原来的 `non-free` 被分为了 `non-free` 和 `non-free-firmware`, 所以将这两部分都启用.

```
$ cat /etc/apt/sources.list

deb http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware
deb http://deb.debian.org/debian bookworm-updates main contrib non-free non-free-firmware
deb http://security.debian.org bookworm-security main contrib non-free non-free-firmware
```

**然后**是安装 jellyfin

安装方法参考 jellyfin 官方建议 [Debuntu (Debian, Ubuntu, and derivatives using apt)](https://jellyfin.org/docs/general/installation/linux#debuntu-debian-ubuntu-and-derivatives-using-apt)

使用 `curl` 执行如下命令

```
curl https://repo.jellyfin.org/install-debuntu.sh | bash
```

如果没安装 curl, 可以用 `wget` 执行如下命令

```
wget -O- https://repo.jellyfin.org/install-debuntu.sh | bash
```

**最后**想要开启硬件转码功能, 还需要安装 `jellyfin-ffmpeg5`

```
apt install jellyfin-ffmpeg5
```

注意这里可能会出错, 源里面有一个 `jellyfin-ffmpeg`, 还有一个 `jellyfin-ffmpeg5`, 按照 jellyfin 官方的说明, 这里应该安装的是 `jellyfin-ffmpeg5`, 如果安装了 `jellyfin-ffmpeg` 会把 `jellyfin` 这个包替换掉

安装完毕后, 去 jellyfin 后台开启硬件转码功能即可. jellyfin web 端的端口号是 8096.

开启路径: `控制台` => `播放` => `硬件加速`.
![](/uploads/2023/07/2023070201-01.png)
