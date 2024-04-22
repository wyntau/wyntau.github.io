---
title: 为 PVE lxc 中的 docker 容器添加 nvidia GPU 支持
pid: 2024042201
tags: [PVE, lxc, nvidia, docker]
---

本篇介绍如何在 lxc 容器中的 docker 容器中能够使用 nvidia GPU. 如果可以在 docker 容器中使用 nvidia GPU, 那么就可以在 docker 容器中安装 jellyfin 并启用硬件转码了.

之前写过一篇在 PVE lxc 中直接通过 linux 包管理工具安装 jellyfin 的文章 [PVE LXC 安装 Jellyfin]({% post_url 2023-07-02-pve-lxc-install-jellyfin %}), 如果不需要在 docker 中安装 jellyfin 的话可以进行参考.

在 lxc 容器中的 docker 容器中使用 nvidia GPU, 首先需要在 lxc 容器中安装 nvidia 显卡驱动, 之前也写过一篇文章 [PVE LXC 容器直通 Nvidia 显卡]({% post_url 2023-07-01-pve-lxc-nvidia-gpu-passthrough %}), 可以进行参考.

下面开始介绍如何为 docker 容器添加 nvidia GPU 支持. 安装过程参考了 nvidia 的官方文档 <https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installing-with-apt>.

**首先**执行以下命令为 apt 添加 `nvidia-container-toolkit` 源信息

```shell
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
```

**然后**更新 apt 并安装 `nvidia-container-toolkit`. 这里官方文档里只写了安装 `nvidia-container-toolkit`, 实测 `nvidia-container-runtime` 也是需要安装的.

```shell
apt update
apt install nvidia-container-toolkit nvidia-container-runtime
```

**然后**是配置 `nvidia-container-runtime`

```shell
nvidia-ctk runtime configure --runtime=docker
```

运行此命令会在 `/etc/docker/daemon.json` 中写入 nvidia runtime 相关信息.

**然后**是重启 docker.

```shell
systemctl restart docker.service
```

**最后**是验证 nvidia GPU 是否正常使用

通过上面一系列操作, 此时 `nvidia-container-toolkit` 相关配置已经完成, 可以通过下面的命令, 对 docker 中的 nvidia GPU 进行测试. 官方的测试命令如下

```shell
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi
```

由于我是需要在 docker 中安装 jellyfin, 并且 ubuntu 镜像比较大下载时间较长, 所以我直接用了 jellyfin 镜像来测试. 测试方法是先在后台运行一个 jellyfin 容器, 然后通过 `docker exec` 连接到 jellyfin 容器并运行 `nvidia-smi` 命令, 查看输出结果.

```shell
docker run --rm --name jellyfin-test --runtime=nvidia --gpus all -d jellyfin/jellyfin
docker exec -it jellyfin-test nvidia-smi
```

我在运行上面第一条命令时, 遇到了错误, 错误信息如下

```
Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error running hook #0: error running hook: exit status 1, stdout: , stderr: Auto-detected mode as 'legacy'
nvidia-container-cli: mount error: failed to add device rules: unable to find any existing device filters attached to the cgroup: bpf_prog_query(BPF_CGROUP_DEVICE) failed: operation not permitted: unknown
```

通过搜索找到了下面的两篇讨论, 参考了其中的一个方案, 并成功解决. 相关文档

- <https://forum.proxmox.com/threads/docker-is-unable-to-access-gpu-in-lxc-gpu-passthrough.125066/>
- <https://discuss.linuxcontainers.org/t/how-to-build-nvidia-docker-inside-lxd-lxc-container/17582/6>

修复方案就是在 lxc 容器下修改 `nvidia-container-runtime` 配置文件 `/etc/nvidia-container-runtime/config.toml`, 将其中的 `# no-cgroups = false` 修改为 `no-cgroups = true`.

通过上面的修复后, 重新启动 docker, 并再次测试

```shell
systemctl restart docker.service
docker run --rm --name jellyfin-test --runtime=nvidia --gpus all -d jellyfin/jellyfin
docker exec -it jellyfin-test nvidia-smi
```

如果输出类似下面的内容, 就表示 docker 容器中的 nvidia GPU 可以正常使用了

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 525.147.05   Driver Version: 525.147.05   CUDA Version: 12.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA T400 4GB     Off  | 00000000:01:00.0 Off |                  N/A |
| 38%   32C    P8    N/A /  31W |      1MiB /  4096MiB |      0%      Default |
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
