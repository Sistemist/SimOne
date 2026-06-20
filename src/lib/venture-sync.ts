import type { SimOneVenture } from "./simone-model";

export function mergeVenturesByUpdatedAt(
  localVentures: SimOneVenture[],
  remoteVentures: SimOneVenture[],
): SimOneVenture[] {
  const venturesById = new Map<string, SimOneVenture>();

  for (const venture of [...localVentures, ...remoteVentures]) {
    const existing = venturesById.get(venture.id);
    if (!existing || timestamp(venture.updatedAt) >= timestamp(existing.updatedAt)) {
      venturesById.set(venture.id, venture);
    }
  }

  return [...venturesById.values()].sort((left, right) => {
    return timestamp(right.updatedAt) - timestamp(left.updatedAt);
  });
}

function timestamp(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
