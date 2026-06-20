# SimOne Dify Setup

## Alpha Decision

For the alpha, SimOne can reuse the existing Tissuu/Sysdom Dify knowledge base instead of forcing a
clone immediately.

This is acceptable while:

- retrieval is scoped to the active engine, driver, or Sprint Zero step
- operational SimOne rules stay outside canonical book/paper/source docs
- agent output remains gated behind human approval
- retrieved context is treated as supporting evidence, not as an always-on prompt dump

Create a separate SimOne corpus later if retrieval becomes noisy, Tissuu-specific agent context leaks
into SimOne answers, or production ownership/audit boundaries require separation.

## Knowledge Bases

Preferred later-state setup:

1. `SimOne Knowledge`
   - Clone or recreate from the current shared `Sysdom/Tissuu Knowledge` base when needed.
   - Keep canonical Markdown sources enabled:
     - `paper-v5.md`
     - `paper_figure_index.md`
     - `book_figure_index.md`
     - `han-kay-context.md`
     - Conscious Systems chapter Markdown files.
   - Prefer disabling duplicate PDFs unless page-level citation is needed.

2. `SimOne Operational`
   - Add product rules, Sprint Zero workflow, agent boundary rules, and prompt policies.
   - Keep this separate from the book/paper knowledge so operational behavior can evolve without polluting canonical SIM retrieval.

## Retrieval Policy

- Retrieve only the context needed for the active engine, driver, or Sprint Zero step.
- Do not inject full book chapters into agent prompts.
- Every agent task must include the active engine or driver boundary.
- Human approval is required for public claims, cash commitments, customer promises, and cross-engine decisions.

## Environment Variables

Add these to Vercel after the Dify app/dataset is ready:

```bash
DIFY_API_KEY=...
DIFY_BASE_URL=https://dify.tissuu.ai/v1
DIFY_KNOWLEDGE_MODE=shared
DIFY_SHARED_KNOWLEDGE_ID=...

# Later, after a dedicated SimOne corpus exists:
DIFY_KNOWLEDGE_MODE=dedicated
DIFY_SIM_KNOWLEDGE_ID=...
```
