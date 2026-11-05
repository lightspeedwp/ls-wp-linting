# Scripts

This skill's own tooling. It is TypeScript run with [`tsx`](https://tsx.is/), with tests in `__tests__/` beside each script on [Vitest](https://vitest.dev/). Coverage below 80% fails `npm test`. No shell scripts.

| File | Purpose | Run with |
| --- | --- | --- |
| `validate-config.ts` | Checks this repository's own ESLint, Prettier, markdownlint and `package.json` config files | `npm run validate:config` |
| `__tests__/validate-config.test.ts` | Vitest suite for the validator | `npm test` |

## validate-config

```bash
npm run validate:config              # all tools
npm run validate:config -- eslint    # one tool
```

Tool keys: `eslint`, `prettier`, `markdownlint`, `packageJson`. The first file found in each tool's search order is validated:

| Tool | Search order |
| --- | --- |
| `eslint` | `eslint.config.cjs`, `eslint.config.js`, `.eslintrc.json`, `.eslintrc.js` |
| `prettier` | `.prettierrc`, `.prettierrc.json`, `.prettierrc.yaml`, `prettier.config.js` |
| `markdownlint` | `.markdownlint.json`, `.markdownlint.yaml`, `.markdownlint-cli2.mjs` |
| `packageJson` | `package.json` (must have `name`, `version` and `scripts`) |

How each format is checked:

- **JavaScript** (`.js`, `.cjs`, `.mjs`): syntax-checked with `node --check`, which parses the file without running it.
- **JSON**: parsed.
- **YAML**: found and reported, but the syntax is not checked, because no YAML parser is bundled.

Exit code `0` means every selected config is valid. `1` means one is invalid or missing, or the tool key is unknown.

This repository has no markdownlint config file, so a full run reports `markdownlint` as missing. Whether that config is required is an open decision (L-DEC-05 in the LS-4751 PRD).
