type EnvLike = Record<string, string | undefined>;

export type ConfigCheck = {
  ready: boolean;
  missing: string[];
};

export type DifyConfigCheck = ConfigCheck & {
  mode: "dedicated" | "shared";
  knowledgeIdKey: string | null;
  label: string;
};

export type AiConfigStatus = {
  neon: ConfigCheck;
  dify: DifyConfigCheck;
  openRouter: ConfigCheck;
};

export function getAiConfigStatusFromEnv(env: EnvLike): AiConfigStatus {
  return {
    neon: checkRequired(env, ["DATABASE_URL"]),
    dify: checkDify(env),
    openRouter: checkRequired(env, ["OPENROUTER_API_KEY"]),
  };
}

function checkRequired(env: EnvLike, keys: string[]): ConfigCheck {
  const missing = keys.filter((key) => !env[key]?.trim());

  return {
    ready: missing.length === 0,
    missing,
  };
}

function checkDify(env: EnvLike): DifyConfigCheck {
  const mode = env.DIFY_KNOWLEDGE_MODE?.trim().toLowerCase() === "shared" ? "shared" : "dedicated";
  const knowledgeIdKey = getDifyKnowledgeIdKey(env, mode);
  const missing = [
    ...["DIFY_API_KEY", "DIFY_BASE_URL"].filter((key) => !env[key]?.trim()),
    ...(knowledgeIdKey ? [] : [mode === "shared" ? "DIFY_SHARED_KNOWLEDGE_ID" : "DIFY_SIM_KNOWLEDGE_ID"]),
  ];

  return {
    ready: missing.length === 0,
    missing,
    mode,
    knowledgeIdKey,
    label: mode === "shared" ? "Shared existing knowledge" : "Dedicated SimOne knowledge",
  };
}

function getDifyKnowledgeIdKey(env: EnvLike, mode: DifyConfigCheck["mode"]) {
  if (mode === "shared" && env.DIFY_SHARED_KNOWLEDGE_ID?.trim()) return "DIFY_SHARED_KNOWLEDGE_ID";
  if (env.DIFY_SIM_KNOWLEDGE_ID?.trim()) return "DIFY_SIM_KNOWLEDGE_ID";

  return null;
}
