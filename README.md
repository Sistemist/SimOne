# SimOne

SimOne is the first public signup page for the SIM-native agent-company concept.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Signup Service

The signup form posts to `/api/signup`, which stores the lead in the owner-controlled
`early_access_leads` table before optionally notifying through Web3Forms.

The Drizzle schema also includes `early_access_leads` as the owner-controlled durable lead table.
Web3Forms should be treated as notification/anti-spam only, not the long-term source of truth.

Set these environment variables locally and in Vercel:

```bash
DATABASE_URL=...
WEB3FORMS_ACCESS_KEY=...
AUTH_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
OPENROUTER_API_KEY=...
DIFY_API_KEY=...
DIFY_BASE_URL=https://dify.tissuu.ai/v1
DIFY_KNOWLEDGE_MODE=shared
DIFY_SHARED_KNOWLEDGE_ID=...
```

`WEB3FORMS_ACCESS_KEY` is optional for notifications. `DATABASE_URL` is required for signup
storage and alpha venture sync. `AUTH_SECRET` or `NEXTAUTH_SECRET` keeps workspace sessions
stable; `NEXTAUTH_URL` should match the deployed site URL. Use generated production values before
deployment. Do not use a public Web3Forms key in the browser for SimOne leads.

The repo is linked to the existing Vercel project named `simone`, so the landing page and `/app`
workspace deploy together unless a separate project is intentionally created later. Add production
secrets in Vercel Project Settings -> Environment Variables for that `simone` project.

For the alpha, SimOne can reuse the existing Tissuu/Sysdom Dify knowledge setup. The preferred
SimOne names are listed above, but the readiness check also accepts the existing Tissuu names:
`DIFY_API_URL` for the base URL, `DIFY_KB_API_KEY` for the knowledge API key, and
`DIFY_DATASET_ID` for the shared knowledge/dataset ID.

Apply the alpha database tables with:

```bash
npm run db:migrate
```

The local `.env.local` file is ignored by git.
