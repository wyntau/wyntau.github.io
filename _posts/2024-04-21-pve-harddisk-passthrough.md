---
title: Proxmox VE直通硬盘（全盘映射方式）
pid: 2024042101
tags: [PVE]
---

使用PVE有时为了方便，需要将硬盘直通，一般有两种方式，一是硬件直通，一是全盘映射，这里介绍第二种，方法如下：

**一、打开PVE管理网页Shell**

输入

```shell
ls /dev/disk/by-id
```

查看存储设备的id

![](/uploads/2024/04/2101-01.png)

图上划红线即为硬盘ID号，复制下来

**二、硬盘映射**

**注意：这里需要将100换成虚拟机的真实ID，sata1这里也可以换成未占用的id数（PVE支持satat0-5）**

```shell
qm set 100 -sata1 /dev/disk/by-id/ata-WDC_XXXX_XXXX_XXXX
```

如果返回以下信息,说明已成功映射

```shell
update VM 100: -sata1 /dev/disk/by-id/ata-WDC_XXXX_XXXX_XXXX
```

**三、确定是否成功**

进入PVE对应虚拟机的硬件页面，查看是否硬盘是否已经在虚拟机里，如图所示说明已成功，这时打开虚拟机就能找到对应硬盘。

![](/uploads/2024/04/2101-02.png)
