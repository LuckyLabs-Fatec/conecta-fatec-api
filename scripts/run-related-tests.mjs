import { spawnSync } from "node:child_process";

const files = process.argv
  .slice(2)
  .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"))
  .filter((file) => !file.endsWith("routes.integration.spec.ts"));

if (files.length === 0) {
  process.exit(0);
}

const result = spawnSync("pnpm", [
  "vitest",
  "related",
  "--run",
  "--exclude",
  "**/*.integration.spec.ts",
  ...files,
], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});

process.exit(result.status ?? 1);