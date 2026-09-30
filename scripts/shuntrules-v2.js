const main = (config) => {
  // ---- 自适应代理组选择 ----
  // 优先级：FAVORITE_GROUPS 中订阅实际存在的第一个 > 订阅的第一个组 > 订阅的第一个节点
  const FAVORITE_GROUPS = ["农村人Cloud"]; // 想优先命中的组名，按顺序写，跨订阅通用的名字放前面
  const FALLBACK_TO_FIRST_GROUP = true;    // 没命中任何偏好名时，退回订阅第一个组

  const groups = config["proxy-groups"] || [];
  const proxies = config["proxies"] || [];

  const groupNames = groups.map((g) => g.name);
  const proxyNames = proxies.map((p) => p.name);
  const allTargetNames = [...groupNames, ...proxyNames];

  let globalTarget = null;

  // 1) 偏好名单里第一个实际存在的组
  for (const favorite of FAVORITE_GROUPS) {
    if (groupNames.includes(favorite)) {
      globalTarget = favorite;
      break;
    }
  }

  // 2) 退回订阅第一个组
  if (globalTarget == null && FALLBACK_TO_FIRST_GROUP && groups.length > 0) {
    globalTarget = groups[0].name;
  }

  // 3) 连组都没有：退回第一个节点名（规则目标允许指向单个节点）
  if (globalTarget == null && proxies.length > 0) {
    globalTarget = proxies[0].name;
  }

  if (globalTarget == null) {
    throw new Error("订阅里没有任何代理组或节点，无法生成分流规则");
  }

  config["rule-providers"] = {
    ...(config["rule-providers"] || {}),

    Shunt_Advertising: {
      type: "http",
      behavior: "classical",
      format: "yaml",
      path: "./ruleset/ShuntRules/Advertising.yaml",
      url: "https://rule.kelee.one/Clash/Advertising.yaml",
      interval: 86400,
    },

    Shunt_Direct: {
      type: "http",
      behavior: "classical",
      format: "yaml",
      path: "./ruleset/ShuntRules/Direct.yaml",
      url: "https://rule.kelee.one/Clash/Direct.yaml",
      interval: 86400,
    },

    Shunt_China: {
      type: "http",
      behavior: "classical",
      format: "yaml",
      path: "./ruleset/ShuntRules/China.yaml",
      url: "https://rule.kelee.one/Clash/China.yaml",
      interval: 86400,
    },

    Shunt_Global: {
      type: "http",
      behavior: "classical",
      format: "yaml",
      path: "./ruleset/ShuntRules/Global.yaml",
      url: "https://rule.kelee.one/Clash/Global.yaml",
      interval: 86400,
    },
  };

  config.rules = [
    // IP 检测接口 → 走代理（FlClash 仪表盘网络检测用这批域名）
    `DOMAIN,ipwho.is,${globalTarget}`,
    `DOMAIN,api.myip.com,${globalTarget}`,
    `DOMAIN,ipapi.co,${globalTarget}`,
    `DOMAIN,ident.me,${globalTarget}`,
    `DOMAIN,ip-api.com,${globalTarget}`,
    `DOMAIN,api.ip.sb,${globalTarget}`,
    `DOMAIN,ipinfo.io,${globalTarget}`,
    // 常用站点
    `DOMAIN-KEYWORD,linux.do,${globalTarget}`,
    `DOMAIN-KEYWORD,meta.ai,${globalTarget}`,
    // 分流规则集
    "RULE-SET,Shunt_Advertising,REJECT",
    "RULE-SET,Shunt_Direct,DIRECT",
    "RULE-SET,Shunt_China,DIRECT",
    `RULE-SET,Shunt_Global,${globalTarget}`,
    "MATCH,DIRECT",
  ];

  return config;
};
