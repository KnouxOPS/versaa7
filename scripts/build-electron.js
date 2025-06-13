#!/usr/bin/env node

import { build } from "esbuild";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

async function buildElectron() {
  console.log("🔨 Building Electron main process...");

  // Ensure output directory exists
  const outputDir = join(rootDir, "dist", "electron");
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Build main process
    await build({
      entryPoints: [join(rootDir, "electron", "main.ts")],
      bundle: true,
      outfile: join(outputDir, "main.js"),
      platform: "node",
      format: "cjs",
      external: ["electron"],
      target: "node18",
      sourcemap: false,
      minify: process.env.NODE_ENV === "production",
      define: {
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "production",
        ),
      },
    });

    // Copy preload script
    const preloadSource = join(rootDir, "electron", "preload.js");
    const preloadDest = join(outputDir, "preload.js");

    if (existsSync(preloadSource)) {
      const preloadContent = readFileSync(preloadSource, "utf8");
      writeFileSync(preloadDest, preloadContent);
      console.log("📄 Copied preload script");
    }

    console.log("✅ Electron build completed successfully!");

    // Display output info
    console.log(`📁 Output directory: ${outputDir}`);
    console.log("📦 Built files:");
    console.log("   - main.js (main process)");
    console.log("   - preload.js (renderer preload)");
  } catch (error) {
    console.error("❌ Electron build failed:", error);
    process.exit(1);
  }
}

// Run the build
buildElectron();
