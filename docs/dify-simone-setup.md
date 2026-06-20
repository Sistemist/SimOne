# SimOne Dify Setup

## Knowledge Bases

Create two Dify knowledge bases for SimOne.

1. `SimOne Knowledge`
   - Clone from the current `Sysdom Knowledge` base.
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
DIFY_SIM_KNOWLEDGE_ID=...
```
