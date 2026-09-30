# FlClash ShuntRules 覆写脚本

用于 FlClash 的配置覆写脚本，在已有订阅节点基础上引用 ShuntRules 规则集。

## 规则逻辑

```text
IP 检测接口(ipwho.is 等 7 个) -> 代理组（FlClash 仪表盘网络检测显示节点 IP）
linux.do / meta.ai            -> 代理组
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
6. 复制 `scripts/shuntrules.js` 内容粘贴进去
7. 保存并返回覆写页面选择该脚本
8. 点击预览，确认无报错后应用配置

> 注意：修改脚本内容后需要重新生成配置才会生效（切换一次配置或重启 FlClash）。

## 代理组自适应

脚本不再写死策略组名，按以下优先级自动选择规则目标：

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
