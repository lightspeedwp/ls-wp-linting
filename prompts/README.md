# Prompt Templates

Reusable workflow templates for common linting setup and debugging tasks.

## Available Prompts

### `debug-eslint.prompt.md`

**Purpose**: Step-by-step ESLint debugging workflow

**Use when**:
- ESLint configuration is broken or conflicting
- Need systematic troubleshooting approach
- Want guidance before implementing fixes
- Debugging ESLint errors in block themes or plugins

**Workflow**:
1. Configuration validation steps
2. Gather and inspect error information
3. Identify root cause
4. Fix verification process

**Best for**: Users who want a guided, systematic approach to debugging ESLint issues.

---

### `setup-wordpress-linting.prompt.md`

**Purpose**: Complete 11-step WordPress linting setup guide

**Use when**:
- Starting a new WordPress block theme or plugin
- Need to configure all linting tools from scratch
- Want to ensure best practices are followed
- Onboarding a team to standard linting setup

**Coverage**:
- Prerequisites (Node.js, npm, etc.)
- Dependency installation
- Configuration files for all tools
- npm scripts setup
- GitHub Actions CI/CD
- Pre-commit hooks (Lefthook)
- Testing and verification
- WordPress-specific setup

**Best for**: Complete setup workflows, team onboarding, ensuring consistency across projects.

---

## How to Use Prompts

### Option 1: Reference in Conversation
When asking Claude for help, reference the prompt:

```
"Can you run the debug-eslint.prompt.md workflow to help me fix my config?"
```

### Option 2: Copy & Paste Content
Copy the prompt content into the chat directly for a focused session.

### Option 3: Use as Reference
Review the prompt structure as a checklist for your own debugging or setup process.

---

## Prompt Structure

Both prompts follow this structure:

1. **Context** — What problem are we solving?
2. **Prerequisites** — What do you need before starting?
3. **Steps** — Numbered, actionable workflow steps
4. **Verification** — How to confirm success
5. **Next Steps** — Where to go from here

---

## Creating New Prompts

If you create additional workflow prompts:

1. Save with `.prompt.md` extension
2. Add brief description to this README
3. Follow the structure above (Context → Prerequisites → Steps → Verification → Next Steps)
4. Include WordPress-specific guidance where applicable
5. Reference main documentation and the reference files in `references/` where relevant

---

**Last Updated**: 2026-10-30
