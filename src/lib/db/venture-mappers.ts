import type { SimOneVenture } from "../simone-model";

export type VenturePersistenceRow = {
  id: string;
  ownerEmail: string;
  name: string;
  idea: string;
  audience: string;
  intent: string;
  engines: SimOneVenture["engines"];
  drivers: SimOneVenture["drivers"];
  assumptions: SimOneVenture["assumptions"];
  decisionGates: SimOneVenture["decisionGates"];
  experiments: SimOneVenture["experiments"];
  coherenceReview: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeVentureForDb(
  ownerEmail: string,
  venture: SimOneVenture,
): VenturePersistenceRow {
  return {
    id: venture.id,
    ownerEmail: ownerEmail.trim().toLowerCase(),
    name: venture.name,
    idea: venture.idea,
    audience: venture.audience,
    intent: venture.intent,
    engines: venture.engines,
    drivers: venture.drivers,
    assumptions: venture.assumptions,
    decisionGates: venture.decisionGates,
    experiments: venture.experiments,
    coherenceReview: venture.coherenceReview,
    createdAt: new Date(venture.createdAt),
    updatedAt: new Date(venture.updatedAt),
  };
}

export function deserializeVentureRow(row: VenturePersistenceRow): SimOneVenture {
  return {
    id: row.id,
    name: row.name,
    idea: row.idea,
    audience: row.audience,
    intent: row.intent,
    createdAt: (row.createdAt || new Date()).toISOString(),
    updatedAt: (row.updatedAt || new Date()).toISOString(),
    engines: row.engines,
    drivers: row.drivers,
    assumptions: row.assumptions,
    decisionGates: row.decisionGates,
    experiments: row.experiments,
    coherenceReview: row.coherenceReview,
  };
}
