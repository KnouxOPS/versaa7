#!/usr/bin/env node

import { exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

async function testBuild() {
  console.log("🧪 Testing KNOUX VERSA build process...\n");

  const tests = [
    {
      name: "Frontend Build",
      command: "npm run build",
      check: () => existsSync(join(rootDir, "dist", "public", "index.html")),
    },
    {
      name: "Electron Compile",
      command: "npm run electron:compile",
      check: () => existsSync(join(rootDir, "dist", "electron", "main.js")),
    },
  ];

  for (const test of tests) {
    try {
      console.log(`⏳ Running: ${test.name}...`);

      const { stdout, stderr } = await execAsync(test.command, {
        cwd: rootDir,
      });

      if (test.check()) {
        console.log(`✅ ${test.name} - PASSED`);
      } else {
        console.log(`❌ ${test.name} - FAILED (output missing)`);
        return false;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED`);
      console.error(`   Error: ${error.message}`);
      return false;
    }
  }

  console.log("\n🎉 All build tests passed!");
  console.log("✅ Ready for full EXE packaging");
  console.log("\n💡 Run 'npm run build-exe' to create the final executable");

  return true;
}

testBuild().catch((error) => {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
});
