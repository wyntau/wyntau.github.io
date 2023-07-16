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
:local ipToCheck "192.168.100.4" # 要检查的 IP
:local onlineGateway "'192.168.100.4'" # 在线时的网关和DNS
:local offlineGateway "'192.168.100.1'" # 不在线时的备用网关和DNS

:if ([ping $ipToCheck count=2] = 0) do={
  # IP offline
  :log warning "IP $ipToCheck offline, set fallback gateway and DNS"
  /ip dhcp-server option set [find name=gateway] value=$offlineGateway
  /ip dhcp-server option set [find name=dns] value=$offlineGateway
} else={
  # IP online
  :log info "IP $ipToCheck online, set gateway and DNS"
  /ip dhcp-server option set [find name=gateway] value=$onlineGateway
  /ip dhcp-server option set [find name=dns] value=$onlineGateway
}
```

这里有个地方需要注意, 检查 IP 是否在线时, 使用的是 `192.168.100.4`, 对 gateway 和 dns 赋值时, 使用是 `'192.168.100.4'` 和 `'192.168.100.1'`, 值是带有单引号的. 如果直接使用 `192.168.100.4` 和 `192.168.100.1` 时会导致设置失败.