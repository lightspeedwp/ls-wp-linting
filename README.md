# Linting Skill for WordPress Development

A Claude Code skill for debugging, configuring and automating linters in WordPress block themes and plugins.

## Features

- **JavaScript and TypeScript**: ESLint flat config with `@wordpress/eslint-plugin`, Prettier, migration from `.eslintrc`
- **CSS and SCSS**: stylelint with `@wordpress/stylelint-config`
- **Markdown**: markdownlint and `wp-scripts lint-md-docs`
- **PHP**: PHPStan, PHPCS and the WordPress Coding Standards
- **JSON, package.json, theme.json and block.json**: syntax, npm and schema validation
- **GitHub Actions and YAML**: actionlint and yamllint
- **Git hooks**: Lefthook pre-commit and pre-push setups
- **WordPress tooling**: `@wordpress/scripts` (themes and plugins) and `@wordpress/build` (plugins)

## Installation

```bash
git clone https://github.com/lightspeedwp/ls-wp-linting.git ~/.claude/skills/linting
```

Claude Code loads the skill from `~/.claude/skills/linting/SKILL.md`. To work on the skill's own tooling, also run `npm install` (Node 22.12 or later).

The optional agent role in `agents/linting.md` is installed separately. See [agents/README.md](agents/README.md).

## Quick Start

Ask Claude about any linting problem:

```text
"My ESLint and Prettier are conflicting, can you fix my config?"
"Why is markdownlint failing on this file?"
"How do I set up stylelint for my block theme's SCSS?"
"Validate my theme.json against the schema."
```

`SKILL.md` routes each task to a focused reference file in `references/`:

| Reference | Covers |
| --- | --- |
| `javascript-typescript.md` | ESLint, Prettier, TypeScript |
| `css-scss.md` | stylelint |
| `markdown.md` | markdownlint |
| `theme-json-block-json.md` | `theme.json` and `block.json` schemas |
| `json.md` | JSON syntax and schemas |
| `npm.md` | `package.json` and dependencies |
| `php.md` | PHPStan, PHPCS, WPCS |
| `yaml-github-actions.md` | GitHub Actions and YAML |
| `lefthook-pre-commit.md` | Lefthook hooks |

Longer guides are in [docs/](docs/README.md).

## Project Structure

```text
linting/
├── SKILL.md                 # Skill entry point and task routing
├── references/              # Focused reference files, one per tool area
├── docs/                    # Longer guides (configuration, CI/CD, troubleshooting)
├── prompts/                 # Task-specific prompts
├── agents/                  # Agent role (install to ~/.claude/agents/)
├── scripts/
│   ├── validate-config.ts   # Checks this repository's own config files
│   └── __tests__/           # Vitest suite
├── assets/                  # Templates and examples
├── vitest.config.ts         # Tests and 80% coverage thresholds
├── tsconfig.json            # Type checking
└── eslint.config.js         # Linting for this repository
```

## Development

The skill's own tooling is TypeScript run with `tsx` and tested with Vitest. There are no shell scripts.

```bash
npm install
npm test                  # Vitest with coverage; fails below 80% on any metric
npm run typecheck         # tsc --noEmit
npm run lint              # ESLint and markdownlint
npm run validate:config   # check this repository's config files
npm run validate          # lint, type check and test
```

## Prompts

- `prompts/debug-eslint.prompt.md`: ESLint debugging workflow
- `prompts/setup-wordpress-linting.prompt.md`: WordPress project setup

## Contributing

1. Create a branch named for the work, following the LightSpeed branching strategy (`{type}/{scope}-{title}`).
2. Update the relevant reference file and, if you add one, the routing table in `SKILL.md`.
3. Add or update tests for any tooling change. `npm run validate` must pass.
4. Open a pull request using the template in `.github/`.

## License

Part of the LightSpeed WP open-source toolkit. See [LICENSE](LICENSE).

## Support

- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- The relevant file in `references/`
- [Issues](https://github.com/lightspeedwp/ls-wp-linting/issues)
