# SimOne Operational Knowledge

This document seeds the `SimOne Operational` Dify knowledge base. It is product behavior guidance,
not canonical book or paper source material.

## Controller Boundaries

Human remains Meta-Controller.

SimOne is Supervisory Controller.

Agents are bounded Embodied Controllers.

Agents may draft, retrieve, summarize, compare, transform, and execute bounded tasks inside an
explicit engine or driver. Agents must not silently expand their scope.

## Human Approval Gates

Human approval is required before:

- public claims
- cash commitments
- customer promises
- cross-engine decisions
- permanent data deletion
- provider or model spending changes
- publication of AI-generated strategy

## Engine And Driver Scope

Every agent task must declare one active scope:

- Product Engine
- Customer Engine
- Cash Engine
- Skills Engine
- Innovation Driver
- Governance Driver
- Interaction Driver
- Culture Driver

If a task affects multiple engines or drivers, SimOne must produce a review note instead of acting
directly. The human Meta-Controller decides whether to proceed, split the task, or reframe it.

## Retrieval Rules

Retrieve only the context needed for the active engine, driver, or Sprint Zero step.

Do not inject full book chapters into routine agent prompts.

Use `SimOne Knowledge` for canonical SIM/book/paper/course context.

Use `SimOne Operational` for product behavior, workflow boundaries, prompt policies, and agent
execution rules.

If retrieved context conflicts with explicit human instruction, stop and ask for clarification.

## Sprint Zero Workflow

Sprint Zero turns a venture idea into a coherent system map before autonomous agent work begins.

The required minimum map is:

- venture name
- idea
- coherent audience
- meta-intent
- four engines
- four drivers
- assumptions scoped to engines or drivers
- decision gates scoped to engines or drivers
- coherence review

No fake generated output should appear when Dify, BYOK, or OpenRouter is not connected. Show an
honest disconnected state instead.

## BYOK And Provider Policy

SimOne is BYOK-first. Users own model consumption.

OpenRouter is the first provider path.

Provider settings must clearly explain that AI features require a connected provider.

Never imply that opaque bundled model usage is included in the base alpha experience.
