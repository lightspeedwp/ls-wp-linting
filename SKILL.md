---
name: linting
description: Linting and code quality guidance for WordPress block themes and plugins - ESLint and Prettier (JavaScript and TypeScript), stylelint (CSS and SCSS), markdownlint, PHPStan and PHPCS, JSON, package.json, theme.json and block.json schemas, GitHub Actions YAML, and Lefthook pre-commit hooks, through @wordpress/scripts or configured directly. Use this skill whenever the user mentions linting, static analysis, code quality, WordPress coding standards, formatting, pre-commit hooks, or any error from a linter or validator, even if they don't name a specific tool.
---

# Linting for WordPress development

Debug, configure and automate linters for WordPress block themes, block plugins and full sites.

## How to work

1. Find out what the project already uses before changing anything. Read `package.json` scripts, the config files in the table below, `composer.json` and `.github/workflows/`.
2. Prefer `@wordpress/scripts` (`wp-scripts lint-js`, `lint-style`, `lint-md-docs`, `lint-pkg-json`, `format`) in WordPress projects. It carries the WordPress rule sets and ignores `build`, `node_modules` and `vendor`.
3. Read the reference file for the tool involved (see "What to read for each task") before answering in depth.
4. Reproduce the error with the project's own command. Fix the cause rather than disabling the rule, and say when a rule is being turned off and why.
5. Check that a CI workflow exists before saying a check runs in CI.

## What to read for each task

| Task | Read |
| --- | --- |
| ESLint, Prettier, TypeScript linting, flat config migration | [references/javascript-typescript.md](references/javascript-typescript.md) |
| CSS and SCSS (stylelint, `@wordpress/stylelint-config`) | [references/css-scss.md](references/css-scss.md) |
| Markdown (markdownlint, `lint-md-docs`) | [references/markdown.md](references/markdown.md) |
| `theme.json`, style variations and `block.json` schema validation | [references/theme-json-block-json.md](references/theme-json-block-json.md) |
| JSON syntax and JSON schema errors | [references/json.md](references/json.md) |
| `package.json`, npm dependency and peer conflicts | [references/npm.md](references/npm.md) |
| PHP: PHPStan levels, PHPCS and WordPress Coding Standards | [references/php.md](references/php.md) |
| GitHub Actions workflows and YAML (actionlint, yamllint) | [references/yaml-github-actions.md](references/yaml-github-actions.md) |
| Pre-commit and pre-push hooks with Lefthook | [references/lefthook-pre-commit.md](references/lefthook-pre-commit.md) |
| Longer guides: setup patterns, CI caching, troubleshooting | [docs/README.md](docs/README.md) |

## Config files by tool

| Tool | Config files |
| --- | --- |
| ESLint | `eslint.config.{js,mjs,cjs}` (flat config); legacy `.eslintrc.*` is not read by ESLint 10 |
| Prettier | `.prettierrc`, `.prettierrc.json`, `.prettierrc.yaml`, `prettier.config.js`; ignores in `.prettierignore` |
| stylelint | `.stylelintrc.json`, `stylelint.config.js` |
| markdownlint | `.markdownlint.json`, `.markdownlint.yaml`, `.markdownlint-cli2.jsonc`, `.markdownlint-cli2.mjs` |
| PHPStan | `phpstan.neon`, `phpstan.neon.dist` |
| PHPCS | `phpcs.xml`, `phpcs.xml.dist`, `.phpcs.xml.dist` |
| npm-package-json-lint | `.npmpackagejsonlintrc.json` (used by `wp-scripts lint-pkg-json`) |
| Lefthook | `lefthook.yml` |
| Build tooling | `@wordpress/scripts` (themes and plugins), `@wordpress/build` (plugins) |

## Quick fixes

- **ESLint and Prettier fight:** let Prettier own formatting. With `wp-scripts` this is already set up; in a custom flat config, put `eslint-config-prettier` last.
- **Rules ignored after upgrading to ESLint 10:** the project still has `.eslintrc.*`. Migrate to `eslint.config.mjs` with `...wordpress.configs.recommended`.
- **`.ts` files not linted:** the config's `files` globs only match `.js`, or `typescript` isn't installed.
- **stylelint `Unknown word` in SCSS:** use `@wordpress/stylelint-config/scss`.
- **`theme.json` changes not taking effect:** validate it against `https://schemas.wp.org/trunk/theme.json` first; an unknown key is ignored silently.

## This skill's own tooling

`scripts/validate-config.ts` checks the skill repository's own config files: `npm run validate:config`, or `npm run validate:config -- eslint` for one tool. It is TypeScript run with `tsx`, tested with Vitest (`npm test`, 80% coverage enforced). It is not a linter for user projects; use the project's own tools for those.
