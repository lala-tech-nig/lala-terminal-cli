#!/usr/bin/env node
import { runCommandWithMonitor } from "../src/index.js";

const args = process.argv.slice(2);
const cmd = args.shift();

runCommandWithMonitor(cmd, args);
