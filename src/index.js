import { execa } from "execa";
import { startMonitor, stopMonitor } from "./monitor.js";
import { startUI, updateUI, stopUI } from "./ui.js";

export async function runCommandWithMonitor(cmd, args = []) {
  console.clear();
  startUI(cmd, args);

  const child = execa(cmd, args, {
    all: true,
    env: { ...process.env, FORCE_COLOR: "1" },
  });

  const monitor = startMonitor((stats) => {
    updateUI({ ...stats, cmd, args });
  });

  try {
    await child;
    stopMonitor(monitor);
    stopUI(true);
  } catch {
    stopMonitor(monitor);
    stopUI(false);
  }
}
