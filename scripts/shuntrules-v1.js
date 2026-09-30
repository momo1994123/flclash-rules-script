const main = (config) => {
  const globalTarget = "农村人Cloud";

  const groups = config["proxy-groups"] || [];
  const proxies = config["proxies"] || [];

  const groupNames = groups.map((g) => g.name);
  const proxyNames = proxies.map((p) => p.name);
  const allTargetNames = [...groupNames, ...proxyNames];

  if (!allTargetNames.includes(globalTarget)) {
    throw new Error("未找到规则目标：农村人Cloud，请确认订阅里存在这个节点或策略组");
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
    "RULE-SET,Shunt_Advertising,REJECT",
    "RULE-SET,Shunt_Direct,DIRECT",
    "RULE-SET,Shunt_China,DIRECT",
    `RULE-SET,Shunt_Global,${globalTarget}`,
    "MATCH,DIRECT",
  ];

  return config;
};
