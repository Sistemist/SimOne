import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const ventures = pgTable("ventures", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerEmail: text("owner_email").notNull(),
  name: text("name").notNull(),
  idea: text("idea").notNull().default(""),
  audience: text("audience").notNull().default(""),
  intent: text("intent").notNull().default(""),
  engines: jsonb("engines").notNull(),
  drivers: jsonb("drivers").notNull(),
  assumptions: jsonb("assumptions").notNull(),
  decisionGates: jsonb("decision_gates").notNull(),
  experiments: jsonb("experiments").notNull(),
  coherenceReview: text("coherence_review").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const agentRuns = pgTable("agent_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  ventureId: uuid("venture_id")
    .notNull()
    .references(() => ventures.id),
  engineOrDriver: text("engine_or_driver").notNull(),
  task: text("task").notNull(),
  status: text("status").notNull().default("draft"),
  modelProvider: text("model_provider").notNull().default("openrouter"),
  retrievalSource: text("retrieval_source").notNull().default("dify"),
  humanApproval: text("human_approval").notNull().default("required"),
  trace: jsonb("trace").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
