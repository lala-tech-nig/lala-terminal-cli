#!/usr/bin/env node
import { spawn } from "child_process";
import os from "os";
import dns from "dns";
import readline from "readline";

// ─────────────────────────────────────────────
// 🧠 Utility Functions
// ─────────────────────────────────────────────

const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let spinnerIndex = 0;

function clearScreen() {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

function getCPUUsage() {
  // Simulated but smooth CPU usage
  return (Math.random() * 50 + 20).toFixed(1);
}

function getRAMUsage() {
  const used = (os.totalmem() - os.freemem()) / 1024 / 1024 / 1024;
  return used.toFixed(2);
}

function getNetworkStats() {
  // pseudo live net speed for demo (in MB/s)
  return {
    down: (Math.random() * 4).toFixed(2),
    up: (Math.random() * 1.5).toFixed(2),
  };
}

function checkInternetConnection() {
  return new Promise((resolve) => {
    dns.lookup("google.com", (err) => {
      resolve(!err);
    });
  });
}

// ─────────────────────────────────────────────
// 💻 Main CLI Logic
// ─────────────────────────────────────────────

async function installPackage(pkgName) {
  console.clear();
  console.log("\x1b[32m💻  LALA CLI - Smart Terminal Monitor\x1b[0m");
  console.log("\x1b[32m────────────────────────────────────────────\x1b[0m");

  const startTime = Date.now();
  const npmProcess = spawn("npm", ["install", pkgName], { shell: true }); // ✅ Windows-compatible

  let isDone = false;
  let totalDownloaded = 0;
  let totalUploaded = 0;
  let offlineMode = false;

  const updateInterval = setInterval(async () => {
    if (isDone) return;

    const frame = spinnerFrames[spinnerIndex];
    spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;

    const uptime = ((Date.now() - startTime) / 1000).toFixed(1);
    const cpu = getCPUUsage();
    const ram = getRAMUsage();

    const hasInternet = await checkInternetConnection();

    if (!hasInternet) {
      offlineMode = true;
    } else if (offlineMode) {
      offlineMode = false;
    }

    clearScreen();
    console.log("\x1b[32m💻  LALA CLI - Smart Terminal Monitor\x1b[0m");
    console.log("\x1b[32m────────────────────────────────────────────\x1b[0m");
    console.log(`\x1b[32m${frame} Running: npm install ${pkgName}\x1b[0m\n`);

    if (offlineMode) {
      console.log(`\x1b[33m🌐 Offline Mode – Waiting for network…\x1b[0m\n`);
    } else {
      const net = getNetworkStats();
      totalDownloaded += parseFloat(net.down) / 10;
      totalUploaded += parseFloat(net.up) / 10;

      console.log(`\x1b[32m🌐 Network:\x1b[0m
   ↓ ${net.down} MB/s | ↑ ${net.up} MB/s
   Total Downloaded: ${totalDownloaded.toFixed(2)} MB | Uploaded: ${totalUploaded.toFixed(2)} MB
`);
    }

    console.log(`\x1b[32m🧠 System:\x1b[0m
   CPU: ${cpu}%   💾 RAM: ${ram} GB

\x1b[32m⏱ Elapsed:\x1b[0m ${uptime}s`);
  }, 1000);

  npmProcess.on("error", (err) => {
    console.log("\x1b[31m❌ Failed to start npm process. Ensure npm is in PATH.\x1b[0m");
    console.log(err.message);
    process.exit(1);
  });

  npmProcess.on("close", (code) => {
    isDone = true;
    clearInterval(updateInterval);
    clearScreen();

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log("\x1b[32m💻  LALA CLI - Smart Terminal Monitor\x1b[0m");
    console.log("\x1b[32m────────────────────────────────────────────\x1b[0m");

    if (code === 0) {
      console.log(`\x1b[32m✅ Completed in ${totalTime}s (Success)\x1b[0m\n`);
      console.log(
        `\x1b[32m📦 Total Downloaded: ${totalDownloaded.toFixed(
          2
        )} MB | Uploaded: ${totalUploaded.toFixed(2)} MB\x1b[0m`
      );
    } else {
      console.log(`\x1b[31m❌ Installation failed with code ${code}\x1b[0m\n`);
    }
  });
}

// ─────────────────────────────────────────────
// 🚀 CLI Runner
// ─────────────────────────────────────────────
const pkg = process.argv[2];
if (!pkg) {
  console.log("\x1b[33mUsage: lala <package-name>\x1b[0m");
  process.exit(1);
}
installPackage(pkg);
