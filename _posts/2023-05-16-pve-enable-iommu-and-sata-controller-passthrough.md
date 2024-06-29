---
title: PVE 启用 IOMMU 功能为虚拟机开启 sata 控制器直通
pid: 2023051602
tags: [PVE]
---

PVE 安装了个黑群晖, PVE 系统安装在 U 盘上, 所以想把 sata 控制器整个直通给群晖, 方便进行硬盘管理. 在网上搜索了一番, 最终直通成功.

### 启用 IOMMU 功能
由于我的 CPU 是 intel 的, 所以按照下面步骤开启

1. 编辑 grub 文件 `/etc/default/grub`
2. 找到 `GRUB_CMDLINE_LINUX_DEFAULT="quiet"` 修改为 `GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on"`
3. `update-initramfs -u -k all`
4. 使用 `update-grub` 更新 grub

### 增加虚拟化驱动，加载vifo系统模块
修改 `/etc/modules` 文件, 添加如下内容

```
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd #not needed if on kernel 6.2 or newer
```

### 重启验证

重启系统, 然后运行命令 `dmesg | grep -e DMAR -e IOMMU`. 如果有输出, 表示成功.

### 虚拟机添加 pci 设备
接下来就可以为虚拟机添加设备了.