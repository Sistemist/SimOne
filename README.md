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
```

`WEB3FORMS_ACCESS_KEY` is optional for notifications. `DATABASE_URL` is required for signup
storage and alpha venture sync. `AUTH_SECRET` or `NEXTAUTH_SECRET` keeps workspace sessions
stable; `NEXTAUTH_URL` should match the deployed site URL. Use generated production values before
deployment. Do not use a public Web3Forms key in the browser for SimOne leads.

Apply the alpha database tables with:

```bash
npm run db:migrate
```

The local `.env.local` file is ignored by git.
