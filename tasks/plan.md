# Plan: Native Codex compatibility

1. Add the Codex manifest and generate one skill wrapper per Claude command.
2. Add portable path guidance and a parity validator.
3. Document dual-client installation and invocation.
4. Run validation, inspect the diff, commit, push, and open a PR.

Risks: Codex and Claude expose different extension primitives. The shared
workflow stays in the existing Markdown files; Codex skills are generated
copies with only frontmatter and placeholder translation, so behavior drift is
detected by the validator and Claude's distribution remains untouched.
