# Codex runtime

SEED's source-of-truth workflow lives in the repository's `commands/`,
`context/`, `agents/`, `templates/`, and `scripts/` directories. When a SEED
skill names one of those files, read it before acting and follow its complete
workflow.

Codex loads this plugin as a skill bundle rather than Claude's slash-command
registry. The Claude plugin-root placeholder in shared source files means the
installed SEED plugin root; resolve it to the directory containing `commands/`
and `context/`. Do not pass that placeholder literally to a shell command.

Use the Codex-native skill name (`$seed-go`, `$seed-spec`, etc.) as the entry
point. Preserve the same preconditions, memory-bank updates, gates, and
verification described by the source command. Never silently skip a phase.

When a source command refers to a Claude sub-agent, perform the same role in
the current Codex turn or use Codex subagent delegation when available. Keep
the command's required output and update files exactly as specified.
