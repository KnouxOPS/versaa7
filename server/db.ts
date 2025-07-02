import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;

let pool: Pool | null = null;
let db: any = null;

if (!DATABASE_URL) {
  console.warn(
    "⚠️  DATABASE_URL not set. Database functionality will be limited.",
  );
  console.warn("   Run 'npm run setup' to configure your database connection.");

  // Set to null for development when no URL is provided
  pool = null;
  db = null;
} else if (DATABASE_URL.includes("placeholder")) {
  console.warn(
    "⚠️  Using placeholder DATABASE_URL. Database functionality will be limited.",
  );
  console.warn(
    "   Run 'npm run setup' to configure your actual database connection.",
  );

  // Set to null for development with placeholder URL
  pool = null;
  db = null;
} else {
  // Real database connection
  pool = new Pool({ connectionString: DATABASE_URL });
  db = drizzle({ client: pool, schema });
  console.log("✅ Database connection established");
}

export { pool, db };
