import "server-only";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Die Umgebungsvariable DATABASE_URL fehlt.");
}

export const sql = neon(databaseUrl);