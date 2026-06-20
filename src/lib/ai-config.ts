type EnvLike = Record<string, string | undefined>;

export type ConfigCheck = {
  ready: boolean;
  missing: string[];
};

export type AiConfigStatus = {
  neon: ConfigCheck;
  dify: ConfigCheck;
  openRouter: ConfigCheck;
};

export function getAiConfigStatusFromEnv(env: EnvLike): AiConfigStatus {
  return {
    neon: checkRequired(env, ["DATABASE_URL"]),
    dify: checkRequired(env, ["DIFY_API_KEY", "DIFY_BASE_URL", "DIFY_SIM_KNOWLEDGE_ID"]),
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
