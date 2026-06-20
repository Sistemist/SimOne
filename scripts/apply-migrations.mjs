import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required to apply migrations.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const migrationDir = resolve("db/migrations");
const migrationFiles = (await readdir(migrationDir))
  .filter((file) => file.endsWith(".sql"))
  .sort();

for (const file of migrationFiles) {
  const migration = await readFile(resolve(migrationDir, file), "utf8");
  await sql.transaction([sql.query(migration)]);
  console.log(`Applied ${file}.`);
}
