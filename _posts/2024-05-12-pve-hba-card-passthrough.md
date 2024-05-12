---
title: PVE HBA 卡直通
pid: 2024051201
tags: [PVE, HBA]
---

最近购入了一张 HBA 卡，计划将 HBA 卡和外置的硬盘笼进行连接，然后将 HBA 卡直通给黑群晖，由群晖管理所有的硬盘。在配置直通的过程中遇到了一些问题，所以在这里记录下。

在配置直通前，需要确认 HBA 卡已经正常加载了。在 pve shell 中通过 `lspci` 命令列出所有的设备。
```
...
02:00.0 Serial Attached SCSI controller: Broadcom / LSI SAS2308 PCI-Express Fusion-MPT SAS-2 (rev 05)
...
```
在上面的输出中，可以看到 HBA 卡正常加载了。

接下来是开启 iommu，开启 iommu 的配置之前写过一篇直通 sata 控制器的总结，步骤是一样的。可以参考 [PVE 启用 IOMMU 功能为虚拟机开启 sata 控制器直通]({% post_url 2023-05-16-pve-enable-iommu-and-sata-controller-passthrough %})

开启 iommu 后，找到要直通的虚拟机，就可以在虚拟机的硬件配置中添加 pci 设备了。

![](/uploads/2024/05/2024051201-01.png)

![](/uploads/2024/05/2024051201-02.png)

此时需要确认下， HBA 卡对应的 iommu 组号有没有和别的设备重复。如果 HBA 卡的 iommu 组号没有重复，此时添加完 pci 设备后， 重启虚拟机应该就完成 HBA 的直通了。

在我的配置过程中，HBA 卡的 iommu 组号是和别的设备有重复的。如果直接添加 pci 设备重启虚拟机的话，会导致虚拟机卡住启动失败。所以还需要再进行一些额外的配置，参考了 pve 官方文档 [PCI Passthrough](https://pve.proxmox.com/wiki/PCI_Passthrough#Verifying_IOMMU_parameters) 成功解决。

第一步，按照 pve 文档描述，需要确认 `IOMMU interrupt remapping` 功能是否支持。

```shell
$ dmesg | grep 'remapping'
[    0.106362] DMAR-IR: Queued invalidation will be enabled to support x2apic and Intr-remapping.
[    0.106821] DMAR-IR: Enabled IRQ remapping in x2apic mode
```

从上面输出，可以看到 `DMAR-IR: Enabled IRQ remapping in x2apic mode` 代表是支持的。如果是 amd CPU, 输出应该是 `AMD-Vi: Interrupt remapping enabled`.

下一步是确认主板支持 `ACS(Access Control Services)`, 不一样的主板好像选项所在位置不一样，经过确认我的主板是开启了的。

下一步是添加内核启动参数，修改 `/etc/default/grub` 文件，在 `GRUB_CMDLINE_LINUX_DEFAULT` 参数最后追加 `pcie_acs_override=downstream`. 我的参数配置完成后是这样的

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt pcie_acs_override=downstream"
```

上面配置中的 `iommu=pt` 看网上的解释是说可以提高未直通设备PCIe的性能，所以先加上了，但是不是必须的。

下一步是更新 grub
```shell
update-grub
```

grub 更新完成后，重启 pve 系统，此时再到虚拟机的硬件配置中添加 pci 设备，不同设备的 iommu 组号应该就不一样了。 此时将 HBA 卡添加后再启动虚拟机，正常情况下就可以启动成功，并且 HBA 卡直通成功了。
