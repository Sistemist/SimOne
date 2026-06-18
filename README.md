# SimOne

SimOne is the first public signup page for the SIM-native agent-company concept.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Signup Service

The signup form posts to `/api/signup`, which forwards the request to Web3Forms.

Set this environment variable locally and in Vercel:

```bash
WEB3FORMS_ACCESS_KEY=...
```

The local `.env.local` file is ignored by git.
