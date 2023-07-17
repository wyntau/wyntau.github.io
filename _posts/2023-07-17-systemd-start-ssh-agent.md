---
title: 使用 systemd 自动启动 ssh-agent
pid: 20230701701
tags: [Systemd, SSH]
---

最近在整理自己的 sshkey, 看了网上大家的讨论, 虽然 sshkey 普遍用在无密码登录场景, 但是最好也给 sshkey 加一个密码. 加密码的好处是为了更好的安全性, 即使密钥丢失, 没有密码也可以保证安全. 至于 ssh 连接时需要输入密码的问题, 可以使用 ssh-agent 来解决.

所以搜索了一些关于 ssh-agent 的知识, 打算重新生成一批 sshkey 并添加密码, 然后交给 ssh-agent 进行管理.

本文记录一下在 linux 中如何使用 systemd 在用户登录时自动启动 ssh-agent 并常驻后台, 方便 ssh 连接时进行使用.

**首先** 是新建 systemd unit `~/.config/systemd/user/ssh-agent.service` 文件如下
```
[Unit]
Description=SSH key agent

[Service]
Environment=SSH_AUTH_SOCK=%t/ssh-agent.socket
ExecStart=/usr/bin/ssh-agent -D -a $SSH_AUTH_SOCK
# ExecStartPost=/usr/bin/ssh-add -t 1h

[Install]
WantedBy=default.target
```

由于是 systemd用户服务单元, 所以创建位置为 `~/.config/systemd/user/ssh-agent.service`.

当设置 `Environment=SSH_AUTH_SOCK=%t/ssh-agent.socket` 时，它将为systemd用户服务单元中的 `SSH_AUTH_SOCK` 环境变量指定一个特定的值。设置`SSH_AUTH_SOCK` 环境变量为 `%t/ssh-agent.socket` 的目的是告诉SSH客户端在与ssh-agent进行通信时使用这个套接字文件。SSH客户端将通过该套接字与ssh-agent建立连接，以请求私钥并进行身份验证。`%t` 是systemd的一个模式，代表了服务单元的运行时目录。对于用户服务单元，`%t` 指代了当前用户的运行时目录。对于用户服务单元，`%t` 通常会被替换为当前用户的运行时目录, 用户运行时目录的默认位置是` /run/user/<user-id>`，其中 `<user-id>` 是当前用户的用户ID. 因此，当使用`%t` 模式时，例如 `%t/ssh-agent.socket` ，它将被展开为当前用户的运行时目录加上后续的路径。例如，如果当前用户的用户ID是1000，那么 `%t/ssh-agent.socket` 会被展开为 `/run/user/1000/ssh-agent.socket`.

`ExecStart=/usr/bin/ssh-agent -D -a $SSH_AUTH_SOCK` 的作用是让 ssh-agent 以守护进程（daemon）模式运行.

`ssh-add -t 1h` 命令，它的作用是将私钥添加到ssh-agent代理中，并设置私钥的有效时间为1小时（1h）。这样，在成功登录到远程服务器后，私钥将在ssh-agent中保持有效状态1小时，而无需再次输入密码。此功能可以提高安全性，因为私钥在有效时间过后将自动从代理中移除，减少了私钥长时间暴露在内存中的风险。一旦有效时间到期，就需要重新输入密码来重新加载私钥到ssh-agent，以继续使用该私钥进行SSH连接。

但是看上面 `ExecStartPost` 被注释掉了，在这里被注释的原因是，如果私钥都是无密码的那就没问题，但是如果私钥是有密码的，那么这个命令会出现一个输入密码的 prompt, 由于 systemd 无法输入密码， 所以会导致启动失败，因此 `ExecStartPost` 在这里注释掉。

当 ssh-agent 启动成功后，后续可以执行 `ssh-add` 命令，手动将 `~/.ssh` 目录下的私钥添加到 ssh-agent 中并输入密码。添加成功后， 后续再通过 ssh 连接时就不需要输入密码了。

**然后** 是配置 ssh 使用 ssh-agent

配置 ssh 使用 ssh-agent 有两种方案

第一种方案是在 shell 启动时, 执行 `eval $(ssh-agent -s)`.

`ssh-agent -s` 输出内容如下所示
```
SSH_AUTH_SOCK=/var/folders/g9/yczk5ymn4k16g211z5pn9bdr0000gn/T//ssh-HPXEJnNTleTH/agent.21286; export SSH_AUTH_SOCK;
SSH_AGENT_PID=21287; export SSH_AGENT_PID;
echo Agent pid 21287;
```

但是如果通过 `eval` 执行, 就会在 shell 中输出一名话 `Agent pid 21287`. 所以看起来可能会比较烦.

另一种方案是 `.bashrc` 等文件中对 `SSH_AUTH_SOCK` 变量进行赋值.

在上面 systemd unit 文件中, 使用了 `Environment=SSH_AUTH_SOCK=%t/ssh-agent.socket` 指定 socket 路径, 所以可以在 `.bashrc` 等文件中使用 `export SSH_AUTH_SOCK="${XDG_RUNTIME_DIR}/ssh-agent.socket"` 来指定环境变量以便 ssh 来读取.

`XDG_RUNTIME_DIR` 是一个环境变量，用于指定当前用户的运行时目录（runtime directory）。该目录用于存储运行时数据，例如套接字文件、临时文件等。一般情况下，`XDG_RUNTIME_DIR` 的值是 `/run/user/<user-id>` ，其中 `<user-id>` 是当前用户的用户ID。可以看到 `XDG_RUNTIME_DIR` 和 systemd unit 文件中的 `%t` 定义基本一致.

如果你的系统没有 `XDG_RUNTIME_DIR` 这个变量, 那就执行一下 `ssh-agent -s` 看下 `SSH_AUTH_SOCK` 的值是多少, 写到 `.bashrc` 等文件里就行了.

**最后** 是使服务单元生效。

在终端中运行以下命令：

```
systemctl --user enable ssh-agent
```

这将使 `ssh-agent.service` 成为用户的默认服务。

启动服务。在终端中运行以下命令：

```
systemctl --user start ssh-agent
```

这将启动 ssh-agent 并将其绑定到 `SSH_AUTH_SOCK` 路径。

现在，当登录到用户帐户时，ssh-agent 将自动启动，并且可以通过 `ssh-add` 命令添加私钥并将其保存在代理中。这样，在使用 ssh 连接到远程服务器时将不再需要每次输入密码。

---

**后记**

在 PVE LXC 容器中， 由于是使用的 root 用户登录，按照上面的步骤配置时， 当执行 `systemctl --user enable ssh-agent` 时会遇到报错

```
Failed to connect to bus: $DBUS_SESSION_BUS_ADDRESS and $XDG_RUNTIME_DIR not defined (consider using --machine=@.host --user to connect to bus of other user)
```

此时可以选择直接以 root 用户身份运行 ssh-agent.

systemd unit 文件 `/etc/systemd/system/ssh-agent.service` 内容如下

```
[Unit]
Description=SSH key agent

[Service]
Environment=SSH_AUTH_SOCK=/var/run/user/ssh-agent.socket
ExecStart=/usr/bin/ssh-agent -D -a $SSH_AUTH_SOCK
# ExecStartPost=/usr/bin/ssh-add -t 1h

[Install]
WantedBy=default.target
```

systemd 启用命令

```
systemctl enable ssh-agent.service
systemctl start ssh-agent.service
```