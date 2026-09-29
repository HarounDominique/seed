import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const fail = (message) => {
  throw new Error(message);
};

const readJson = async (relativePath) => {
  try {
    return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
  } catch (error) {
    fail(`Invalid or unreadable JSON at ${relativePath}: ${error.message}`);
  }
};

const codexManifest = await readJson(".codex-plugin/plugin.json");
await stat(path.join(root, ".claude-plugin/plugin.json"));

if (codexManifest.name !== "seed") fail("Codex manifest must be named seed");
if (codexManifest.skills !== "./skills/") fail("Codex manifest must load ./skills/");

const commands = (await readdir(path.join(root, "commands")))
  .filter((entry) => entry.endsWith(".md"))
  .map((entry) => entry.slice(0, -3))
  .sort();

const skillsRoot = path.join(root, "skills");
const skillDirectories = [];
for (const entry of await readdir(skillsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.startsWith("seed-")) continue;
  try {
    await stat(path.join(skillsRoot, entry.name, "SKILL.md"));
    skillDirectories.push(entry.name.slice("seed-".length));
  } catch {
    // Empty development directories are ignored; only loadable skills count.
  }
}
skillDirectories.sort();

if (commands.length !== skillDirectories.length) {
  fail(`Expected ${commands.length} Codex skills, found ${skillDirectories.length}`);
}

for (const command of commands) {
  if (!skillDirectories.includes(command)) {
    fail(`Missing Codex skill for commands/${command}.md`);
  }

  const skillPath = path.join(skillsRoot, `seed-${command}`, "SKILL.md");
  const skill = await readFile(skillPath, "utf8");
  if (!skill.startsWith("---\n") || !skill.includes(`name: seed-${command}`)) {
    fail(`Skill ${skillPath} is missing valid frontmatter`);
  }
  if (!skill.includes(`commands/${command}.md`)) {
    fail(`Skill ${skillPath} does not delegate to its Claude-shared workflow`);
  }
  if (!skill.includes("context/codex-runtime.md")) {
    fail(`Skill ${skillPath} does not load the Codex runtime guidance`);
  }
  if (skill.includes("${CLAUDE_PLUGIN_ROOT}")) {
    fail(`Skill ${skillPath} contains a Claude-only plugin-root placeholder`);
  }
}

console.log(`Codex compatibility OK: ${commands.length} command skills, Claude manifest preserved.`);
