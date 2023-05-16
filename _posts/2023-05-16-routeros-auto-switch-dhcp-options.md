---
title: RouterOS 自动根据 IP 是否在线切换下发 DHCP options
pid: 2023051601
tags: [RouterOS]
---

今天通过问 chatGPT, 解决了我一个使用 RouterOS 时的问题.

目前在我的网络中, 存在两个网关和两个DNS, 分别是 RouterOS 路由器本身, 以及另外的一个 openwrt.
在 RouterOS 的 DHCP 配置中, 会下发 openwrt 的 IP 作为网络中的设备使用的网关及 DNS 服务器.
但是如果 openwrt 由于我折腾挂掉后, 就导致设备就无法上网了. 所以如果 RouterOS 能在 openwrt 设备离线后自动将下发的网关及 DNS 服务器切换加 RouterOS 路由器就可以保持网络不中断.

chatGPT 给出了答案, 根据自己的实际情况稍微改了一下就利用起来了. 下面是 chatGPT 给出的原脚本代码

```
:local ipToCheck "192.168.1.100"  # 要检查的 IP
:local onlineGateway "192.168.1.1"  # 在线时的网关
:local onlineDNS "8.8.8.8"  # 在线时的 DNS
:local offlineGateway "192.168.1.2"  # 不在线时的备用网关
:local offlineDNS "8.8.4.4"  # 不在线时的备用 DNS

:if ([ping $ipToCheck count=2] = 0) do={
  # IP 不在线
  :log info "IP $ipToCheck 不在线，设置备用网关和 DNS"
  /ip dhcp-server option set [find name=gateway] value=$offlineGateway
  /ip dhcp-server option set [find name=dns] value=$offlineDNS
} else={
  # IP 在线
  :log info "IP $ipToCheck 在线，设置网关和 DNS"
  /ip dhcp-server option set [find name=gateway] value=$onlineGateway
  /ip dhcp-server option set [find name=dns] value=$onlineDNS
}
```