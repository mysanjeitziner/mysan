
import { betterAuth } from "better-auth";
import { Pool } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Die Umgebungsvariable DATABASE_URL fehlt.");
}

const pool = new Pool({
  connectionString: databaseUrl,
});

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000",

  database: pool,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },

  trustedOrigins: [
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ],
});
