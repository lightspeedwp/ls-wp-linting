# Agents

`linting.md` is the agent role for this skill. It preloads the `linting` skill and adds working rules for diagnosing and fixing lint problems.

Claude Code does not load agents from inside a skill folder. Install it as a user-level agent:

```bash
ln -s ~/.claude/skills/linting/agents/linting.md ~/.claude/agents/linting.md
```

A symlink keeps the installed agent in step with this repository. Copy the file instead if you want a fixed version.
