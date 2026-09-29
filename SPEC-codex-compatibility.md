# Spec: Native Codex compatibility

## Objective

Extend SEED so the same repository can be installed as both a Claude Code
plugin and a Codex plugin. Claude's existing manifest, commands, agents, hooks,
and behavior must remain unchanged. Codex must receive the same workflow as
discoverable, independently loadable skills with portable references to the
plugin's own files.

## Commands

- Validate manifests and generated skill parity: `node scripts/validate-codex-compatibility.mjs`
- Validate JavaScript syntax: `node --check scripts/*.mjs`
- Validate the repository: `git diff --check`

## Project Structure

- `.claude-plugin/` — existing Claude Code distribution, unchanged.
- `.codex-plugin/plugin.json` — native Codex manifest.
- `skills/seed-*/SKILL.md` — one Codex skill per existing SEED command.
- `scripts/validate-codex-compatibility.mjs` — deterministic parity and manifest checks.
- `docs/` — compatibility documentation and migration notes.

## Code Style

Codex skill files use YAML frontmatter with a stable `name` and concise
`description`, followed by the command's existing workflow. References use the
portable `${CODEX_PLUGIN_ROOT}` placeholder rather than Claude-only variables.

## Testing Strategy

- Assert the Codex manifest is valid JSON and declares every command skill.
- Assert every Claude command has exactly one Codex skill counterpart.
- Assert no Codex skill contains `${CLAUDE_PLUGIN_ROOT}`.
- Run JavaScript syntax checks and `git diff --check`.

## Boundaries

- Always: preserve Claude files and command semantics; keep scripts Node-only and cross-platform.
- Ask first: changing the workflow itself, adding runtime dependencies, or removing Claude support.
- Never: silently fork the workflow, commit credentials, or claim Claude slash-command parity where Codex only supports skill invocation.

## Success Criteria

1. Claude's existing plugin manifest and command tree remain byte-for-byte unchanged.
2. Codex discovers a plugin named `seed` with fourteen native skills.
3. Each skill contains the corresponding command workflow and portable plugin-root references.
4. Validation fails on missing counterparts, invalid manifests, or Claude-only placeholders.
5. README documents installation and invocation for both clients.

## Open Questions

- Codex exposes these entries as skills rather than Claude's `/seed:<command>` slash commands; the Codex-native invocation is `$seed-<command>`.
