import chalk from "chalk";
import prettyBytes from "pretty-bytes";

let spinnerIndex = 0;
const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function startUI(cmd, args) {
  console.clear();
  console.log(chalk.green.bold("💻  LALA CLI - Smart Terminal Monitor"));
  console.log(chalk.gray("────────────────────────────────────────────"));
}

export function updateUI(stats) {
  process.stdout.write("\x1B[2J\x1B[0f"); // Clear screen without blinking
  const frame = spinnerFrames[spinnerIndex];
  spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;

  console.log(chalk.green.bold("💻  LALA CLI - Smart Terminal Monitor"));
  console.log(chalk.gray("────────────────────────────────────────────"));
  console.log(
    chalk.green(`${frame} Running:`),
    chalk.white(`npm ${stats.args.join(" ")}\n`)
  );

  console.log(chalk.green("🌐 Network:"));
  console.log(
    chalk.white(
      `   ↓ ${prettyBytes(stats.netDown)}/s | ↑ ${prettyBytes(stats.netUp)}/s`
    )
  );
  console.log(
    chalk.white(
      `   Total Downloaded: ${prettyBytes(stats.totalDown)} | Uploaded: ${prettyBytes(
        stats.totalUp
      )}\n`
    )
  );

  console.log(chalk.green("🧠 System:"));
  console.log(
    chalk.white(`   CPU: ${stats.cpu}%   💾 RAM: ${stats.ram} GB\n`)
  );

  console.log(chalk.gray(`⏱ Elapsed: ${stats.time}s`));
}

export function stopUI(success) {
  console.log(
    chalk.green(
      `\n✅ Completed in ${Math.floor(process.uptime())}s ${
        success ? chalk.green("(Success)") : chalk.red("(Failed)")
      }`
    )
  );
}
