import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // gunakan dialect, bukan driver
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
