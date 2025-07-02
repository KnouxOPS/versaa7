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

// Configuration
const APP_NAME = "KNOUX-VERSA";
const VERSION = "1.0.0";
const DESCRIPTION = "The Uncensored AI Nexus - Local Image Editor";
const AUTHOR = "Sadek Elgazar";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n🔄 Step ${step}: ${message}`, "cyan");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

// Check if required dependencies are installed
async function checkDependencies() {
  logStep(1, "Checking dependencies...");

  try {
    const packageJson = JSON.parse(
      readFileSync(join(rootDir, "package.json"), "utf8"),
    );

    const requiredDeps = [
      "electron",
      "electron-builder",
      "concurrently",
      "wait-on",
    ];

    const missing = [];

    for (const dep of requiredDeps) {
      if (!packageJson.devDependencies[dep] && !packageJson.dependencies[dep]) {
        missing.push(dep);
      }
    }

    if (missing.length > 0) {
      logWarning(`Missing dependencies: ${missing.join(", ")}`);
      log("Installing missing dependencies...");

      await execAsync(`npm install --save-dev ${missing.join(" ")}`, {
        cwd: rootDir,
      });
      logSuccess("Dependencies installed successfully");
    } else {
      logSuccess("All dependencies are present");
    }
  } catch (error) {
    logError(`Dependency check failed: ${error.message}`);
    throw error;
  }
}

// Clean previous builds
async function cleanBuild() {
  logStep(2, "Cleaning previous builds...");

  const cleanDirs = [
    join(rootDir, "dist"),
    join(rootDir, "build"),
    join(rootDir, "release"),
    join(rootDir, "out"),
  ];

  for (const dir of cleanDirs) {
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      log(`   Removed: ${dir}`);
    }
  }

  logSuccess("Build directories cleaned");
}

// Build the React frontend
async function buildFrontend() {
  logStep(3, "Building React frontend...");

  try {
    const { stdout, stderr } = await execAsync("npm run build", {
      cwd: rootDir,
    });

    if (stderr && !stderr.includes("warning")) {
      logWarning(`Build warnings: ${stderr}`);
    }

    // Verify build output
    const distDir = join(rootDir, "dist", "public");
    if (!existsSync(distDir)) {
      throw new Error("Build output directory not found");
    }

    if (!existsSync(join(distDir, "index.html"))) {
      throw new Error("index.html not found in build output");
    }

    logSuccess("Frontend build completed");
  } catch (error) {
    logError(`Frontend build failed: ${error.message}`);
    throw error;
  }
}

// Build Electron main process
async function buildElectron() {
  logStep(4, "Building Electron main process...");

  try {
    await execAsync("npm run electron:compile", { cwd: rootDir });

    // Verify Electron build
    const electronDir = join(rootDir, "dist", "electron");
    if (!existsSync(join(electronDir, "main.js"))) {
      throw new Error("Electron main.js not found");
    }

    if (!existsSync(join(electronDir, "preload.js"))) {
      throw new Error("Electron preload.js not found");
    }

    logSuccess("Electron build completed");
  } catch (error) {
    logError(`Electron build failed: ${error.message}`);
    throw error;
  }
}

// Copy essential files
async function copyEssentialFiles() {
  logStep(5, "Copying essential files...");

  try {
    const distDir = join(rootDir, "dist");

    // Copy VIP key
    const vipKeySource = join(rootDir, "vip.key");
    if (existsSync(vipKeySource)) {
      copyFileSync(vipKeySource, join(distDir, "vip.key"));
      log("   Copied: vip.key");
    }

    // Copy assets if they exist
    const assetsDir = join(rootDir, "assets");
    if (existsSync(assetsDir)) {
      const distAssetsDir = join(distDir, "assets");
      if (!existsSync(distAssetsDir)) {
        mkdirSync(distAssetsDir, { recursive: true });
      }

      // Copy icon files
      const iconFiles = ["icon.ico", "icon.png", "icon.icns"];
      for (const iconFile of iconFiles) {
        const iconPath = join(assetsDir, iconFile);
        if (existsSync(iconPath)) {
          copyFileSync(iconPath, join(distAssetsDir, iconFile));
          log(`   Copied: ${iconFile}`);
        }
      }
    }

    // Create or update package.json for distribution
    const distPackageJson = {
      name: "knoux-versa",
      version: VERSION,
      description: DESCRIPTION,
      main: "electron/main.js",
      author: AUTHOR,
      license: "MIT",
      homepage: "./",
    };

    writeFileSync(
      join(distDir, "package.json"),
      JSON.stringify(distPackageJson, null, 2),
    );

    logSuccess("Essential files copied");
  } catch (error) {
    logError(`File copying failed: ${error.message}`);
    throw error;
  }
}

// Package with Electron Builder
async function packageApp() {
  logStep(6, "Packaging application...");

  try {
    log("Starting Electron Builder...");

    // Use electron-builder to create the executable
    const { stdout, stderr } = await execAsync(
      "npx electron-builder --win --publish=never",
      {
        cwd: rootDir,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      },
    );

    if (stderr && !stderr.includes("warning")) {
      logWarning(`Packaging warnings: ${stderr}`);
    }

    // Check for output
    const releaseDir = join(rootDir, "release");
    if (existsSync(releaseDir)) {
      logSuccess("Application packaged successfully!");

      // List generated files
      log("\n📦 Generated files:", "bright");

      try {
        const { stdout: lsOutput } = await execAsync(`dir /b "${releaseDir}"`, {
          shell: true,
        });
        const files = lsOutput
          .trim()
          .split("\n")
          .filter((f) => f.trim());

        for (const file of files) {
          if (file.includes(".exe")) {
            log(`   🚀 ${file}`, "green");
          } else {
            log(`   📁 ${file}`);
          }
        }
      } catch (err) {
        // Fallback if dir command fails
        log(`   Check the release/ directory for generated files`);
      }
    } else {
      throw new Error("Release directory not found after packaging");
    }
  } catch (error) {
    logError(`Packaging failed: ${error.message}`);
    throw error;
  }
}

// Verify the final executable
async function verifyExecutable() {
  logStep(7, "Verifying executable...");

  try {
    const releaseDir = join(rootDir, "release");
    const files = await execAsync(`dir /b "${releaseDir}"`, { shell: true });

    const exeFiles = files.stdout
      .split("\n")
      .filter((file) => file.includes(".exe") && !file.includes("blockmap"));

    if (exeFiles.length > 0) {
      const exeFile = exeFiles[0].trim();
      const exePath = join(releaseDir, exeFile);

      if (existsSync(exePath)) {
        const stats = await execAsync(
          `powershell "(Get-Item '${exePath}').length"`,
        );
        const sizeBytes = parseInt(stats.stdout.trim());
        const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);

        logSuccess(`Executable created: ${exeFile} (${sizeMB} MB)`);

        // Provide final instructions
        log("\n🎉 Build completed successfully!", "bright");
        log(`\n📍 Your executable is located at:`, "cyan");
        log(`   ${exePath}`, "bright");
        log(`\n🚀 To distribute your app:`, "yellow");
        log(`   1. Test the executable on a clean Windows machine`);
        log(`   2. The app includes all dependencies and runs offline`);
        log(
          `   3. VIP features require the vip.key file in the same directory`,
        );

        return exePath;
      }
    }

    throw new Error("No executable file found in release directory");
  } catch (error) {
    logError(`Executable verification failed: ${error.message}`);
    throw error;
  }
}

// Main build process
async function main() {
  const startTime = Date.now();

  log("🚀 KNOUX VERSA - Building Windows EXE", "bright");
  log("=" * 50, "cyan");

  try {
    await checkDependencies();
    await cleanBuild();
    await buildFrontend();
    await buildElectron();
    await copyEssentialFiles();
    await packageApp();
    const exePath = await verifyExecutable();

    const endTime = Date.now();
    const buildTime = ((endTime - startTime) / 1000).toFixed(1);

    log("\n" + "=" * 50, "green");
    log(`✅ BUILD SUCCESSFUL (${buildTime}s)`, "bright");
    log("=" * 50, "green");

    return exePath;
  } catch (error) {
    log("\n" + "=" * 50, "red");
    log("❌ BUILD FAILED", "bright");
    log("=" * 50, "red");
    logError(`Error: ${error.message}`);

    log("\n🔧 Troubleshooting tips:", "yellow");
    log("1. Ensure Node.js 18+ is installed");
    log("2. Run 'npm install' to install dependencies");
    log("3. Check that all source files are present");
    log("4. Verify Windows build tools are available");

    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  log("KNOUX VERSA - EXE Builder", "bright");
  log("\nUsage: npm run build-exe [options]");
  log("\nOptions:");
  log("  --help, -h     Show this help message");
  log("  --clean-only   Only clean build directories");
  log("  --no-verify    Skip executable verification");
  log("\nDescription:");
  log(
    "  Builds a complete Windows EXE for KNOUX VERSA with all dependencies included.",
  );
  log(
    "  The resulting executable runs completely offline with local AI processing.",
  );

  process.exit(0);
}

if (process.argv.includes("--clean-only")) {
  cleanBuild()
    .then(() => {
      logSuccess("Clean completed");
      process.exit(0);
    })
    .catch((error) => {
      logError(`Clean failed: ${error.message}`);
      process.exit(1);
    });
} else {
  main();
}
