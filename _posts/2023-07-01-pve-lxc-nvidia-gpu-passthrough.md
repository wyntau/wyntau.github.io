---
title: PVE LXC 容器直通 Nvidia 显卡
pid: 2023070101
tags: [PVE, Nvidia]
---

一直看到网上有讨论说在 PVE 下直通显卡给虚拟机或容器来作为 Plex、emby或者jeffyin 的解码/编码工具, 所以一直在关注这个.

在 v2ex 上看到讨论, 大家推荐使用 nvidia T400 显卡, 因为这个显卡支持编解码的格式多, 而且不需要单独供电, 功耗只有30W, 所以在闲鱼上购入一张 T400 4GB 显卡.

显卡有了, 接下来就是看怎么在 PVE 中直通了. 搜索了一圈, 发现了一个博主写的文章比较详细, <https://www.insilen.com/post/263.html> 这篇文章中介绍了虚拟机直通以及 lxc 容器直通的区别. 通过这篇文章, 觉得使用 lxc 容器直通显然更经济一些, 非独占式, 可以多个容器共用一张显卡, 做到资源利用最大化. 所以按照博客文章的步骤, 在自己的 PVE 机器上安装, 经过一些修改和测试, 最终安装并直通成功.

下面主要记录下安装中的一些步骤，方便后面再次安装时用到.

## 宿主机配置
**首先**是安装驱动

由于 debian 源中已经有了 nvidia-driver, 所以我选择直接使用源安装, 方便进行升级。唯一的缺点是源中的版本旧一些. 目前 PVE 7.4 是基于 debian 11 bullseye, 在我安装时源中最新的 nvidia-driver 驱动版本为 470.182.03.

更新 `/etc/apt/sources.list` 文件, 开启 nvidia-driver 所在的库 `non-free`，为了保险起见，把 `contrib` 也加上

```
deb https://mirrors.ustc.edu.cn/debian bullseye main contrib non-free
deb https://mirrors.ustc.edu.cn/debian bullseye-updates main contrib non-free
# security updates
deb https://mirrors.ustc.edu.cn/debian-security bullseye-security main contrib non-free
```

然后执行更新并安装 pve-headers 和 nvidia-driver.

这里要注意一下，不能只安装 `nvidia-driver`。由于在安装过程中需要编译，依赖 `pve-headers` 模块，但是 `nvidia-driver` 并没有标识 `pve-headers` 作为依赖，所以需要手动安装。

```
apt update && apt install pve-headers nvidia-driver
```

**然后**是确认驱动及对应模块配置正确，并屏蔽掉开源的显卡驱动 nouveau

在 `/etc/modules-load.d/nvidia.conf` 文件中，确认以下内容存在，如果有缺少的需要补全。在我的机器上安装完 nvidia-driver 后，这个文件里只有一个 `nvidia-drm`, 导致后面在直通时缺少对应的设备，需要把 `nvidia` 和 `nvidia_uvm` 补全。

```
nvidia-drm
nvidia
nvidia_uvm
```

安装完 nvidia-driver 后，在 `/etc/modprobe.d/` 目录下，可以看到如下内容

```
/etc/modprobe.d/dkms.conf
/etc/modprobe.d/nvidia-kernel-common.conf
/etc/modprobe.d/nvidia-blacklists-nouveau.conf
/etc/modprobe.d/pve-blacklist.conf
/etc/modprobe.d/nvidia.conf
```

在 `nvidia-blacklists-nouveau.conf` 文件中，有如下内容

```
blacklist nouveau
```

在 `pve-blacklist.conf` 文件中，有如下内容

```
blacklist nvidiafb
```

保证这两个 blacklist 存在，并且没有重复。如果没有的话，需要进行补全。

**然后**是更新内核模块

由于在 `/etc/modules-load.d/nvidia.conf` 中添加了 `nvidia` 以及 `nvidia_uvm` 模块，所以需要对内核模块进行更新。使用如下命令

```
update-initramfs -u
```

在上面我贴的博客文章中使用的命令是 `update-initramfs -u -k all` 对本地的所有内核模块进行更新，但是按照我的理解 nvidia module 是和内核模块版本绑定的, 所以把 nvidia module 更新到旧的内核中会有风险导致旧的内核模块在加载 nvidia 模块时版本不匹配出现问题. 我觉得只使用一个 `-u` 选项可能更合理一些。

**然后**是创建对应的脚本文件

创建文件路径 `/etc/udev/rules.d/70-nvidia.rules`, 内容如下

```
# Create /nvidia0, /dev/nvidia1 … and /nvidiactl when nvidia module is loaded
KERNEL=="nvidia", RUN+="/bin/bash -c '/usr/bin/nvidia-smi -L && /bin/chmod 666 /dev/nvidia*'"
# Create the CUDA node when nvidia_uvm CUDA module is loaded
KERNEL=="nvidia_uvm", RUN+="/bin/bash -c '/usr/bin/nvidia-modprobe -c0 -u && /bin/chmod 0666 /dev/nvidia-uvm*'"
```

这些规则作用：
- 设置更宽松的权限
- 启用默认情况下未启动的 nvidia_uvm（至少对于我的卡而言）

**然后**就是重启，并检查对应的设备及显卡运行情况

重启后，正常情况下显卡驱动应该正常加载，查看对应位置内容进行验证。

`ls -al /dev/nvidia*` 内容如下

```
crw-rw-rw- 1 root root 195,   0 Jun 30 23:08 /dev/nvidia0
crw-rw-rw- 1 root root 195, 255 Jun 30 23:08 /dev/nvidiactl
crw-rw-rw- 1 root root 195, 254 Jun 30 23:08 /dev/nvidia-modeset
crw-rw-rw- 1 root root 506,   0 Jun 30 23:08 /dev/nvidia-uvm
crw-rw-rw- 1 root root 506,   1 Jun 30 23:08 /dev/nvidia-uvm-tools

/dev/nvidia-caps:
total 0
drw-rw-rw-  2 root root     80 Jun 30 23:08 .
drwxr-xr-x 20 root root   4560 Jun 30 23:08 ..
cr--------  1 root root 509, 1 Jun 30 23:08 nvidia-cap1
cr--r--r--  1 root root 509, 2 Jun 30 23:08 nvidia-cap2
```

`ls -al /dev/dri` 内容如下

```
drwxr-xr-x  3 root root        120 Jun 30 23:08 .
drwxr-xr-x 20 root root       4560 Jun 30 23:08 ..
drwxr-xr-x  2 root root        100 Jun 30 23:08 by-path
crw-rw----  1 root video  226,   0 Jun 30 23:08 card0
crw-rw----  1 root video  226,   1 Jun 30 23:08 card1
crw-rw----  1 root render 226, 128 Jun 30 23:08 renderD128
```

注意上面出现的数字（195、506、226），这些是之后LXC中需要的，所以先记录下来。

**注意**： 上述设备缺一不可至少包含：nvidia0、nvidiactl、nvidia-modeset、vidia-uvm、nvidia-uvm-tools； 少了说明驱动有组件没有安装成功，需要详细检查.

另外，使用 `nvidia-smi` 命令会输出当前显卡的信息

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 470.182.03   Driver Version: 470.182.03   CUDA Version: 11.4     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA T400 4GB     On   | 00000000:01:00.0 Off |                  N/A |
| 38%   38C    P8    N/A /  31W |      3MiB /  3911MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

这些的设备以及 nvidia-smi 输出正确的内容后，表示显卡驱动已正确安装并加载。

**最后**是对 LXC 容器进行配置

宿主机进入 `/etc/pve/lxc/` 找到对应LXC的ID配置文件，打开后在最后一行加入以下内容：

```
lxc.cgroup2.devices.allow: c 195:* rwm
lxc.cgroup2.devices.allow: c 506:* rwm
lxc.cgroup2.devices.allow: c 226:* rwm
lxc.mount.entry: /dev/nvidia0 dev/nvidia0 none bind,optional,create=file
lxc.mount.entry: /dev/nvidiactl dev/nvidiactl none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-modeset dev/nvidia-modeset none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-uvm dev/nvidia-uvm none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-uvm-tools dev/nvidia-uvm-tools none bind,optional,create=file
lxc.mount.entry: /dev/dri dev/dri none bind,optional,create=dir
```

这里的 195、506和226就是上面记录下的数值。
注意这里使用的是 `lxc.cgroup2.devices.allow`, 和我上面博客文章中写的 `lxc.cgroup.devices.allow` 不一致，是因为 PVE 6 升级 7 时，升级说明已经提到了这个写法的变化，应该是博客文章的作者没有更新。

到这里宿主机配置应该就全部结束了。下面是 lxc 容器中的配置。

## LXC 容器配置

**首先**是确认容器的相关设备映射成功。使用 `ls -al /dev/nvidia*` 以及 `ls -al /dev/dri` 命令应该会得到和宿主机一样的输出。

**然后**是安装驱动。

注意 LXC 容器安装的驱动版本需要和宿主机**完全一致**。并且不能使用内核模块。所以在容器中安装驱动，我没有再使用源来安装，因为源中的驱动不支持指定 `--no-kernel-module` 选项，但是这个选项在 LXC 容器直通显卡时是必须的。

所以在容器中通过下载 nvidia 驱动安装文件的方式进行安装。对应的官网地址为 https://www.nvidia.com/en-us/drivers/unix/ ，找到和宿主版本相同的驱动下载即可。我使用的 470.182.03 版本驱动文件下载命令如下

```
wget https://us.download.nvidia.com/XFree86/Linux-x86_64/470.182.03/NVIDIA-Linux-x86_64-470.182.03.run
```

下载后，添加可执行权限并进行安装。

```
chmod +x NVIDIA-Linux-x86_64-470.182.03.run
./NVIDIA-Linux-x86_64-470.182.03.run --no-kernel-module
```

安装驱动后，执行命令 `nvidia-smi` 可以看到输出内容如下

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 470.182.03   Driver Version: 470.182.03   CUDA Version: 11.4     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA T400 4GB     Off  | 00000000:01:00.0 Off |                  N/A |
| 38%   38C    P8    N/A /  31W |      3MiB /  3911MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

证明 LXC 容器中的显卡驱动也正常. 如果 `nvidia-smi` 没有输出，可以尝试下重启 LXC 容器。

至此，PVE LXC 容器直通显卡工作就结束了。
