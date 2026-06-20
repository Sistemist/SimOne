# SimOne Linear Backlog

Live Linear project: https://linear.app/sysdom/project/simone-76d0765d8e1c

## Project

- Name: `SimOne`
- Team: `Sysdom Agents`
- Summary: `SIM-native Sprint Zero product for course students and conscious builders.`
- Target month: `2026-08`
- Priority: `High`
- Status: `Backlog`

## Alpha Direction

Build SimOne as a SIM-native Sprint Zero product, using the current landing page visual language for
the app dashboard rather than cloning Paperclip or starting from a generic dashboard template.

- Custom SIM UI, not template-first.
- First app screens: venture onboarding, SIM canvas, engine/driver workspace, Sprint Zero flow.
- Human remains Meta-Controller; SimOne acts as Supervisory Controller; agents remain bounded
  Embodied Controllers.
- AI output must stay grounded in SIM knowledge and operational boundaries rather than large static
  prompt injection.

## Milestones

- `Foundation`: Auth, persistence, signup reliability, and base routes.
- `SIM Workbench`: Venture onboarding, SIM canvas, engines, drivers, assumptions, metrics, gates,
  and coherence review.
- `AI/RAG Layer`: Dify knowledge setup, operational retrieval rules, and BYOK/OpenRouter integration
  path.
- `Course Alpha`: Course/demo readiness, seeded ventures, and visual QA.

## Issues

| ID | Milestone | Issue | Status |
| --- | --- | --- | --- |
| `SYS-147` | Foundation | Configure auth and alpha workspace routes | In progress locally |
| `SYS-148` | Foundation | Add Neon/Drizzle schema for ventures and agent runs | In progress locally |
| `SYS-149` | Foundation | Fix Web3Forms signup on free tier | Backlog |
| `SYS-157` | Foundation | Persist early-access leads outside Web3Forms retention | In progress locally |
| `SYS-150` | SIM Workbench | Build venture onboarding | In progress locally |
| `SYS-151` | SIM Workbench | Build engine and driver editor | In progress locally |
| `SYS-152` | SIM Workbench | Build Sprint Zero assumptions and decision gates | In progress locally |
| `SYS-153` | AI/RAG Layer | Clone Sysdom Knowledge into SimOne Knowledge | Backlog |
| `SYS-154` | AI/RAG Layer | Create SimOne Operational knowledge base | In progress locally |
| `SYS-155` | AI/RAG Layer | Add BYOK/OpenRouter provider settings | Backlog |
| `SYS-156` | Course Alpha | Run visual QA and seed sample ventures | In progress locally |

## Acceptance Tests In Repo

- `getWorkspaceEntryPath sends an empty alpha workspace to onboarding`
  - Guards `SYS-147`.
- `getWorkspaceEntryPath resumes the first saved venture`
  - Guards `SYS-147` and course/demo continuity.
- `createVenture maps all four engines and all four drivers for Sprint Zero`
  - Guards `SYS-150` and `SYS-151`.
- `createVenture scopes Sprint Zero assumptions and decision gates to engines or drivers`
  - Guards `SYS-152`.
- `createSampleVenture provides a course-ready Sprint Zero demo`
  - Guards `SYS-156`.
- `earlyAccessLeads stores durable signup fields outside Web3Forms`
  - Guards `SYS-157`.
- `normalizeSignupPayload trims fields and lowercases email`
  - Guards `SYS-157`.
- `normalizeSignupPayload rejects invalid email`
  - Guards `SYS-157`.
- `parseWeb3FormsResponse handles JSON and plain text errors`
  - Guards Web3Forms notification fallback under `SYS-157`.
- `initial migration creates the durable early access lead table`
  - Guards `SYS-148` and `SYS-157`.
- `venture persistence keeps owner and Sprint Zero structure intact`
  - Guards `SYS-148`.
- `normalizeAlphaCredentials trims identity and lowercases email`
  - Guards `SYS-147`.
- `normalizeAlphaCredentials falls back to a builder name`
  - Guards `SYS-147`.
- `normalizeAlphaCredentials rejects invalid email`
  - Guards `SYS-147`.
- `getSessionOwnerEmail returns the normalized session owner`
  - Guards `SYS-147`.
- `normalizeVentureApiPayload accepts a wrapped venture payload`
  - Guards `SYS-147` and `SYS-148`.
- `normalizeVentureApiPayload rejects malformed venture payloads`
  - Guards `SYS-147` and `SYS-148`.
- `mergeVenturesByUpdatedAt keeps the newest version of each venture`
  - Guards `SYS-147` and `SYS-148`.
- `mergeVenturesByUpdatedAt sorts newest ventures first`
  - Guards `SYS-147` and `SYS-148`.
- `SimOne Operational knowledge defines agent boundaries`
  - Guards `SYS-154`.
- `createAgentRunDraft starts every agent task behind human approval`
  - Guards `SYS-154` and the future agent execution boundary.
- `canStartAgentRun blocks execution until a human approves`
  - Guards `SYS-154` and the future agent execution boundary.
- `canStartAgentRun blocks empty tasks even after approval`
  - Guards `SYS-154` and the future agent execution boundary.
- `normalizeAgentRunApiPayload accepts a wrapped agent run`
  - Guards `SYS-148` and `SYS-154`.
- `normalizeAgentRunApiPayload rejects malformed agent runs`
  - Guards `SYS-148` and `SYS-154`.
- `agent run persistence maps scope and trace fields`
  - Guards `SYS-148` and `SYS-154`.
- `agentRuns stores traceable human approval state`
  - Guards `SYS-148` and `SYS-154`.
- `agent run migration preserves approval updates`
  - Guards `SYS-148` and `SYS-154`.
- `getAiConfigStatusFromEnv marks Dify ready only when all retrieval settings exist`
  - Guards `SYS-153`, `SYS-154`, and `SYS-155`.
- `getAiConfigStatusFromEnv reports OpenRouter and Neon readiness without secrets`
  - Guards `SYS-148` and `SYS-155`.
- `createVentureExport wraps a venture with versioned metadata`
  - Guards `SYS-156` and course/demo portability.
- `parseVentureExport accepts a serialized venture export`
  - Guards `SYS-156` and course/demo portability.
- `parseVentureExport rejects malformed imports`
  - Guards `SYS-156` and course/demo portability.
- `summarizeSprintZeroReadiness reports an empty venture as unmapped`
  - Guards `SYS-151`, `SYS-152`, and `SYS-156`.
- `summarizeSprintZeroReadiness counts completed engine and driver specs`
  - Guards `SYS-151`, `SYS-152`, and `SYS-156`.
- `removeVentureById removes one venture without mutating the rest`
  - Guards `SYS-147` and local workspace management.

## Launch Risks

- Web3Forms Free stores submissions for only 30 days, so leads must be persisted somewhere we
  control before public traffic increases.
- Dify corpus duplication needs testing so retrieval does not mix PDFs/Markdown noisily.
- BYOK provider settings must not imply bundled opaque model usage.
- Cloud venture sync is account-gated and route-backed, but it intentionally stays local-only until
  `DATABASE_URL` is configured and migrations are applied.
- Alpha credential auth now has a stable development fallback; production must set `AUTH_SECRET` or
  `NEXTAUTH_SECRET`.
- Agent tasks can now be queued and approved locally, but actual execution remains intentionally
  disabled until Dify/OpenRouter configuration is connected.
- `/api/agent-runs` and the DB mapper now preserve the approval trace; the route still requires a
  signed-in owner and an existing persisted venture.
- Workspace readiness now reports Neon, Dify, and OpenRouter configuration status without exposing
  secrets.
- Import/export is available for local course/demo portability before cloud sync is configured.
- Sprint Zero review now summarizes mapping completion and the next missing engine/driver fields.
- `/app` now acts as a small local workspace hub with recent ventures, open, and delete controls.
