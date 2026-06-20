import type { ConfigCheck } from "./ai-config";

const storageKey = "simone.providerSettings";

export type ProviderSettings = {
  provider: "openrouter";
  apiKey: string;
  model: string;
  baseUrl: string;
};

export type ProviderSettingsStatus = {
  ready: boolean;
  source: "server" | "local" | "missing";
  label: string;
  missing: string[];
};

export function normalizeProviderSettings(input: Partial<ProviderSettings> = {}): ProviderSettings {
  return {
    provider: "openrouter",
    apiKey: input.apiKey?.trim() || "",
    model: input.model?.trim() || "openrouter/auto",
    baseUrl: input.baseUrl?.trim() || "https://openrouter.ai/api/v1",
  };
}

export function getProviderSettingsStatus(
  serverOpenRouter: ConfigCheck,
  localSettings: ProviderSettings,
): ProviderSettingsStatus {
  if (serverOpenRouter.ready) {
    return {
      ready: true,
      source: "server",
      label: "Server configured",
      missing: [],
    };
  }

  if (localSettings.apiKey.trim()) {
    return {
      ready: true,
      source: "local",
      label: "Local BYOK ready",
      missing: [],
    };
  }

  return {
    ready: false,
    source: "missing",
    label: "Needs provider key",
    missing: ["OPENROUTER_API_KEY or local BYOK key"],
  };
}

export function maskProviderKey(apiKey: string) {
  const trimmed = apiKey.trim();
  if (!trimmed) return "";
  if (trimmed.length < 8) return "saved";

  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
}

export function loadProviderSettings(): ProviderSettings {
  if (typeof window === "undefined") return normalizeProviderSettings();
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return normalizeProviderSettings();

  try {
    return normalizeProviderSettings(JSON.parse(raw) as Partial<ProviderSettings>);
  } catch {
    return normalizeProviderSettings();
  }
}

export function saveProviderSettings(settings: ProviderSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(normalizeProviderSettings(settings)));
}

export function clearProviderSettings() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey);
}
