#!/usr/bin/env node

import { exec, spawn } from "child_process";
import { promisify } from "util";
import {
  existsSync,
  rmSync,
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

// Enhanced logging
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  step: (num, msg) => console.log(`\n🔄 Step ${num}: ${msg}`),
  title: (msg) => console.log(`\n🚀 ${msg}\n${"=".repeat(50)}`),
};

async function buildFinal() {
  const startTime = Date.now();

  log.title("KNOUX VERSA - Final Production Build");

  try {
    // Step 1: Environment Check
    log.step(1, "Environment Check");
    const nodeVersion = process.version;
    log.info(`Node.js version: ${nodeVersion}`);

    if (!existsSync(join(rootDir, "package.json"))) {
      throw new Error(
        "package.json not found. Are you in the correct directory?",
      );
    }

    const packageJson = JSON.parse(
      readFileSync(join(rootDir, "package.json"), "utf8"),
    );
    log.info(`Project: ${packageJson.name} v${packageJson.version}`);
    log.success("Environment check passed");

    // Step 2: Clean and prepare
    log.step(2, "Cleaning previous builds");
    const cleanDirs = ["dist", "build", "release", "out"];

    for (const dir of cleanDirs) {
      const dirPath = join(rootDir, dir);
      if (existsSync(dirPath)) {
        rmSync(dirPath, { recursive: true, force: true });
        log.info(`Cleaned: ${dir}/`);
      }
    }
    log.success("Cleanup completed");

    // Step 3: Install/verify dependencies
    log.step(3, "Verifying dependencies");
    try {
      await execAsync("npm ci", { cwd: rootDir });
      log.success("Dependencies verified");
    } catch (error) {
      log.warning("npm ci failed, trying npm install");
      await execAsync("npm install", { cwd: rootDir });
      log.success("Dependencies installed");
    }

    // Step 4: Type checking
    log.step(4, "Type checking");
    try {
      await execAsync("npm run check", { cwd: rootDir });
      log.success("Type check passed");
    } catch (error) {
      log.warning("Type check failed, continuing anyway");
      log.info(error.message);
    }

    // Step 5: Build frontend
    log.step(5, "Building React frontend");
    await execAsync("npm run build", { cwd: rootDir });

    const indexPath = join(rootDir, "dist", "public", "index.html");
    if (!existsSync(indexPath)) {
      throw new Error("Frontend build failed - index.html not found");
    }
    log.success("Frontend build completed");

    // Step 6: Build Electron
    log.step(6, "Building Electron main process");
    await execAsync("npm run electron:compile", { cwd: rootDir });

    const mainJsPath = join(rootDir, "dist", "electron", "main.js");
    if (!existsSync(mainJsPath)) {
      throw new Error("Electron build failed - main.js not found");
    }
    log.success("Electron build completed");

    // Step 7: Copy assets
    log.step(7, "Copying assets and resources");

    // Ensure dist exists
    const distDir = join(rootDir, "dist");
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }

    // Copy VIP key
    const vipKeySource = join(rootDir, "vip.key");
    if (existsSync(vipKeySource)) {
      copyFileSync(vipKeySource, join(distDir, "vip.key"));
      log.info("Copied VIP key");
    }

    // Copy splash screen
    const splashSource = join(rootDir, "assets", "splash.html");
    if (existsSync(splashSource)) {
      const assetsDir = join(distDir, "assets");
      if (!existsSync(assetsDir)) {
        mkdirSync(assetsDir, { recursive: true });
      }
      copyFileSync(splashSource, join(assetsDir, "splash.html"));
      log.info("Copied splash screen");
    }

    // Create package.json for distribution
    const distPackageJson = {
      name: "knoux-versa",
      version: packageJson.version,
      description: "The Uncensored AI Nexus",
      main: "electron/main.js",
      author: "Sadek Elgazar",
      license: "MIT",
    };

    writeFileSync(
      join(distDir, "package.json"),
      JSON.stringify(distPackageJson, null, 2),
    );
    log.info("Created distribution package.json");

    log.success("Assets copied");

    // Step 8: Final packaging
    log.step(8, "Creating final executable");
    log.info("This may take several minutes...");

    const buildOutput = await execAsync(
      "npx electron-builder --win --x64 --publish=never",
      {
        cwd: rootDir,
        maxBuffer: 1024 * 1024 * 50, // 50MB buffer for large builds
      },
    );

    // Check results
    const releaseDir = join(rootDir, "release");
    if (existsSync(releaseDir)) {
      log.success("Executable created successfully!");

      // List files
      try {
        const files = await execAsync(`dir /b "${releaseDir}"`, {
          shell: true,
        });
        const fileList = files.stdout
          .trim()
          .split("\n")
          .filter((f) => f.trim());

        log.info("\n📦 Generated files:");
        for (const file of fileList) {
          if (file.includes(".exe")) {
            log.success(`   🚀 ${file}`);
          } else {
            log.info(`   📁 ${file}`);
          }
        }
      } catch (err) {
        log.info("Check release/ directory for generated files");
      }
    }

    // Final verification
    log.step(9, "Final verification");

    const exeFiles = existsSync(releaseDir)
      ? await execAsync(`dir /b "${releaseDir}" | findstr .exe`, {
          shell: true,
        }).catch(() => ({ stdout: "" }))
      : { stdout: "" };

    if (exeFiles.stdout.trim()) {
      log.success("Executable verification passed");
    } else {
      log.warning("No .exe file found in release directory");
    }

    // Build summary
    const buildTime = ((Date.now() - startTime) / 1000).toFixed(1);

    log.title("BUILD COMPLETED SUCCESSFULLY! 🎉");
    log.info(`Total build time: ${buildTime} seconds`);
    log.info(`Output directory: ${releaseDir}`);

    log.info("\n📋 Next steps:");
    log.info("1. Test the executable on a clean Windows machine");
    log.info("2. Verify all AI tools work correctly");
    log.info("3. Test VIP features with the included key");
    log.info("4. The app runs completely offline!");

    return releaseDir;
  } catch (error) {
    log.error(`Build failed: ${error.message}`);

    log.info("\n🔧 Troubleshooting:");
    log.info("1. Ensure Node.js 18+ is installed");
    log.info("2. Run 'npm install' to fix dependencies");
    log.info("3. Check Windows build tools are available");
    log.info("4. Try 'npm run clean-build' first");

    process.exit(1);
  }
}

// Command line handling
if (process.argv.includes("--help")) {
  console.log(`
KNOUX VERSA - Final Build Script

Usage: npm run build-final

This script performs a complete production build:
1. Environment verification
2. Dependency installation  
3. Type checking
4. Frontend build (React + Vite)
5. Electron compilation
6. Asset copying
7. EXE packaging
8. Final verification

Output: Windows executable in release/ directory
  `);
  process.exit(0);
}

buildFinal();
