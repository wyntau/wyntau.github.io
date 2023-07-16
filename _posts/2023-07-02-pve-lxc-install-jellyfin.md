---
title: PVE LXC 安装 Jellyfin
pid: 2023070201
tags: [Jellyfin, PVE, LXC]
---

LXC 容器首先按照昨天讲的 nvidia 显卡直通步骤, 开启显卡直通功能. 下面是安装 Jellyfin 的步骤

**首先**是启用 repo

```
apt install curl gnupg
mkdir -p /etc/apt/keyrings
curl -fsSL https://repo.jellyfin.org/jellyfin_team.gpg.key | gpg --dearmor -o /etc/apt/keyrings/jellyfin.gpg

cat <<EOF | tee /etc/apt/sources.list.d/jellyfin.sources
Types: deb
URIs: https://repo.jellyfin.org/$( awk -F'=' '/^ID=/{ print $NF }' /etc/os-release )
Suites: $( awk -F'=' '/^VERSION_CODENAME=/{ print $NF }' /etc/os-release )
Components: main
Architectures: $( dpkg --print-architecture )
Signed-By: /etc/apt/keyrings/jellyfin.gpg
EOF
```

**然后**是安装 jellyfin

```
apt update && apt install jellyfin
```

**最后**想要开启硬件转码功能, 还需要安装 `jellyfin-ffmpeg5`

```
apt install jellyfin-ffmpeg5
```

注意这里可能会出错, 源里面有一个 `jellyfin-ffmpeg`, 还有一个 `jellyfin-ffmpeg5`, 按照 jellyfin 官方的说明, 这里应该安装的是 `jellyfin-ffmpeg5`, 如果安装了 `jellyfin-ffmpeg` 会把 `jellyfin` 这个包替换掉

安装完毕后, 去 jellyfin 后台开启硬件转码功能即可. jellyfin 的端口号是 8096.