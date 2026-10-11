# FlClash ShuntRules 覆写脚本

用于 FlClash 的配置覆写脚本，在已有订阅节点基础上引用 ShuntRules 规则集。

## 版本对比

| | V1 `shuntrules-v1.js` | V2 `shuntrules-v2.js` |
|---|---|---|
| 代理组 | **写死** `农村人Cloud`，订阅里没有就报错 | **自适应**：偏好名单 → 第一个组 → 第一个节点 |
| IP 检测 | 无（仪表盘网络检测显示本机 IP） | 7 个检测域名走代理（显示节点 IP） |
| linux.do / meta.ai / muse.ai | 无 | 走代理 |
| commandcode.ai | 无 | 走代理（直连 Cloudflare 丢包严重） |
| 规则数 | 5 条 | 17 条 |
| 换订阅 | 需要改脚本里的组名 | 无需改动 |

**建议直接用 V2**；V1 仅适合想自己改造的极简起点。

## 规则逻辑（V2）

```text
IP 检测接口(ipwho.is 等 7 个) -> 代理组（FlClash 仪表盘网络检测显示节点 IP）
linux.do / meta.ai / muse.ai  -> 代理组
commandcode.ai                -> 代理组
Advertising.yaml              -> REJECT
Direct.yaml                   -> DIRECT
China.yaml                    -> DIRECT
Global.yaml                   -> 自适应代理组
未匹配流量                    -> DIRECT
```

## 使用方式

1. 打开 FlClash
2. 进入订阅配置的「覆写」页面
3. 覆写模式选择「脚本」
4. 点击「前往配置脚本」
5. 新建脚本
6. 复制 `scripts/shuntrules-v2.js` 内容粘贴进去
7. 保存并返回覆写页面选择该脚本
8. 点击预览，确认无报错后应用配置

> 注意：修改脚本内容后需要重新生成配置才会生效（切换一次配置或重启 FlClash）。

## 代理组自适应（V2）

脚本不写死策略组名，按以下优先级自动选择规则目标：

1. `FAVORITE_GROUPS` 名单中第一个在订阅里实际存在的组（默认 `["农村人Cloud"]`）
2. 名单全部落空时，回退到**订阅的第一个策略组**
3. 订阅没有任何组时，回退到**订阅的第一个节点**

因此更换订阅、更换机场后脚本无需修改即可继续工作。想优先指定某个组时，把名字加进 `FAVORITE_GROUPS`（跨订阅通用的名字放前面）：

```js
const FAVORITE_GROUPS = ["农村人Cloud", "自动选择", "🚀 节点选择"];
const FALLBACK_TO_FIRST_GROUP = true; // 不想回退第一个组时改为 false（认不到名字直接报错）
```

## 引用规则集

```text
https://rule.kelee.one/Clash/Advertising.yaml
https://rule.kelee.one/Clash/Direct.yaml
https://rule.kelee.one/Clash/China.yaml
https://rule.kelee.one/Clash/Global.yaml
```

这些规则文件是 Clash classical 格式，因此脚本里使用：

```yaml
behavior: classical
format: yaml
```

## 验证是否生效

在 FlClash 请求详情里看到类似：

```text
规则：RuleSet(Shunt_Global)
代理链：... -> 农村人Cloud
```

即表示 `Global.yaml` 命中后已走目标策略组。

IP 检测是否生效：仪表盘「网络检测」应显示所选节点对应的 IP 与国旗，而不是本机 IP。
