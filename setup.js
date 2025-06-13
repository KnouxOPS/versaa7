#!/usr/bin/env node

import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🚀 KNOUX VERSA Setup\n");
console.log("This script will help you configure your database connection.\n");

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function setup() {
  try {
    console.log("📊 Database Setup");
    console.log("To get your Neon database URL:");
    console.log("1. Go to https://neon.tech");
    console.log("2. Create a free account");
    console.log("3. Create a new project");
    console.log('4. Click "Connect" and copy the connection string\n');

    const dbUrl = await question("Enter your Neon database URL: ");

    if (!dbUrl || !dbUrl.startsWith("postgresql://")) {
      console.log(
        '❌ Invalid database URL. Please make sure it starts with "postgresql://"',
      );
      process.exit(1);
    }

    const envContent = `# Database Configuration
DATABASE_URL="${dbUrl}"

# Development Configuration
NODE_ENV=development
`;

    fs.writeFileSync(".env", envContent);
    console.log("✅ .env file created successfully!");
    console.log("\n🎯 Next steps:");
    console.log("1. Run: npm run db:push");
    console.log("2. Run: npm run dev");
    console.log("3. Open: http://localhost:3000\n");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
  } finally {
    rl.close();
  }
}

setup();
