import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn(
    "⚠️  DATABASE_URL not set. Database functionality will be limited.",
  );
  console.warn("   Run 'npm run setup' to configure your database connection.");

  // Create a mock database for development when no URL is provided
  export const pool = null;
  export const db = null;
} else if (DATABASE_URL.includes("placeholder")) {
  console.warn(
    "⚠️  Using placeholder DATABASE_URL. Database functionality will be limited.",
  );
  console.warn(
    "   Run 'npm run setup' to configure your actual database connection.",
  );

  // Create a mock database for development with placeholder URL
  export const pool = null;
  export const db = null;
} else {
  // Real database connection
  export const pool = new Pool({ connectionString: DATABASE_URL });
  export const db = drizzle({ client: pool, schema });
  console.log("✅ Database connection established");
}
