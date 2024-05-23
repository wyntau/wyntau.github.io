---
title: PVE 配置自动备份到 NFS
pid: 2024051901
tags: [PVE, NFS]
---

1. 群晖开启 NFS 服务
2. 新建共享目录 `backups0`, 配置 nfs 权限允许 PVE IP 访问, 并且映射所有用户为 `admin`
3. PVE 挂载 NFS 目录, 内容选择为 `VZDump备份文件`.
4. 配置自动备份任务, 存储位置为刚才挂载的 NFS 目录.
5. PVE 宿主机修改 `/etc/vzdump.conf` 文件, 新增 `tmpdir` 配置. 如果不加的话, 直接备份 nfs 会失败.
并且我配置了nfs 目录直接通过 cloudSync 同步到oneDrive. 如果不设置 `tmpdir` 的话, 在备份过程中的临时文件也会触发 oneDrive 同步. 所以通过配置 `tmpdir` 可以只同步最后生成好的文件即可.