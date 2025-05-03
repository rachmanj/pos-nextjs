const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Set environment variables to prevent file system access issues
process.env.NODE_ENV = "production";
process.env.NEXT_TELEMETRY_DISABLED = "1";
process.env.NEXT_DISABLE_FS_TRACING = "1";
process.env.NO_SYMLINKS = "1";

// This forces Node to use the project directory only
process.env.NODE_PATH = path.resolve(__dirname);

// Path to local next binary
const nextBinPath = path.join(
  __dirname,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next"
);

// Check if the next binary exists
if (!fs.existsSync(nextBinPath)) {
  console.error(`Next.js binary not found at: ${nextBinPath}`);
  process.exit(1);
}

console.log(`Using Next.js binary: ${nextBinPath}`);

// Run the build command with isolation
const buildProcess = spawn(nextBinPath, ["build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    // Explicitly prevent access to Windows system directories
    CHDIR: process.cwd(),
    HOME: process.cwd(),
    USERPROFILE: process.cwd(),
    APPDATA: process.cwd(),
    LOCALAPPDATA: process.cwd(),
  },
  cwd: process.cwd(),
  shell: process.platform === "win32", // Use shell on Windows
});

buildProcess.on("error", (err) => {
  console.error("Failed to start build process:", err);
  process.exit(1);
});

buildProcess.on("exit", (code) => {
  process.exit(code);
});
