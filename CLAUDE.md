# Working on the linting skill

Instructions for Claude Code when working on this repository (`lightspeedwp/ls-wp-linting`).

## What this repository is

- `SKILL.md` is the skill entry point. It routes each task to one file in `references/`. Keep it short; put tool detail in the reference files.
- `references/*.md` are plain reference files, not skills. Claude Code does not load nested skills, so never add `SKILL.md` files below the root.
- `docs/` holds longer guides. `docs/BUILD_SUMMARY.md`, `DEPLOYMENT_READY.md` and `IMPLEMENTATION_SEQUENCE.md` are historical records; do not treat them as current.
- `agents/linting.md` is the agent role. Claude Code does not load it from here; it is installed to `~/.claude/agents/` (see `agents/README.md`).

## Guidance for user projects

- Recommend `@wordpress/scripts` commands (`lint-js`, `lint-style`, `lint-md-docs`, `lint-pkg-json`, `format`, `test-unit-js`) for WordPress themes and plugins.
- Cite only commands, packages and config keys that exist. Check the package README or schema before adding a new one.
- User projects follow their own build and test setup. The TypeScript rules below apply only to this repository's own tooling.

## Scripting standards (this repository's own tooling)

- Never add shell scripts (`.sh`) or BATS tests. Write tooling in TypeScript and run it with `tsx`.
- Every script has Vitest tests in a `__tests__/` folder beside it. `npm test` enforces at least 80% statements, branches, functions and lines through the thresholds in `vitest.config.ts`. Don't reach the threshold with blanket exclusions.
- Keep side effects (file system, child processes, network) behind injectable collaborators, and keep the CLI entry point thin.
- Run `npm run validate` (lint, type check and tests) before handing work over.

## Open decisions (LS-4751 PRD)

- Whether a markdownlint config file is required (L-DEC-05). `npm run validate:config` currently reports it missing.
- Whether `package.json` `main` (`index.js`, which does not exist) should be removed (L-DEC-06).
- Whether ESLint should lint `.ts` files with `typescript-eslint` (L-DEC-15).
- Whether a YAML parser should be added so YAML configs are syntax-checked (L-DEC-02).
