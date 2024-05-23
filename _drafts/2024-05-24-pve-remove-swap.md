---
title: PVE删除 swap，并把空间合并到local
pid: 2024052401
tags: [PVE, swap]
---

我的 PVE 是安装在 U 盘中, PVE安装完成后, 自动划分了 3.5G 空间作为 swap 分区. 最近发现 PVE 系统的 io 延迟很高, 一直在 10%~30% 跳动. 网上搜了一下, 有说是因为 swap 性能太差导致的, 所以尝试下把 swap 禁用, 结果真的有效. 所以记录一下.

**首先**是设置系统不使用 swap, 修改 `/etc/sysctl.conf` 文件, 添加如下内容

```
vm.swappiness=0
```

**然后**刷新系统设置

```
sysctl -p
```

**然后**停用 swap 文件

```
swapoff -a
```

**然后**删掉 swap 文件, 并扩充空间到 local

```
lvremove /dev/pve/swap
lvextend -l+100%FREE /dev/mapper/pve-root
resize2fs /dev/mapper/pve-root
```

**然后**更新 `/etc/fstab` 文件, 将 swap 文件挂载的配置删掉或将如下内容注释

```
# /dev/pve/swap none wrap sw 0 0
```

**最后**是重启系统. 在重启之前我的 io 延迟依然很高, 重启后下降到 `0.17%`, 并且因为 io 延迟降低, CPU 占用率也下降了一点.

下面是禁用 swap 前的 CPU 占用率和 io 延迟与禁用 swap 之后的 CPU 占用率和 io 延迟对比.

禁用前
![](/uploads/2024/05/2024052401-01.png)
![](/uploads/2024/05/2024052401-02.png)

禁用后
![](/uploads/2024/05/2024052401-03.png)
![](/uploads/2024/05/2024052401-04.png)
