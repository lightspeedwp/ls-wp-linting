# Documentation Index

Quick navigation guide for the linting skill documentation.

## Where to Start

- **New to this skill?** → Start with [WORDPRESS.md](WORDPRESS.md) for WordPress-specific setup with block themes (wp-scripts) and block plugins (wp-build)
- **Configuring linters?** → See [CONFIGURATION.md](CONFIGURATION.md) for all supported tools, config file reference, and setup instructions
- **Setting up CI/CD?** → Read [CI-CD.md](CI-CD.md) for GitHub Actions integration, caching strategies, and workflow examples
- **Debugging issues?** → Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for 30+ solutions to common problems across all tools
- **Git hooks & automation?** → [LEFTHOOK.md](LEFTHOOK.md) for pre-commit hook setup and Git automation

## By Use Case

### I'm setting up a new WordPress block theme or plugin

1. Read [WORDPRESS.md — Block Themes](WORDPRESS.md#block-themes-wp-scripts) or [Block Plugins](WORDPRESS.md#block-plugins-wp-build)
2. Follow configuration steps in [CONFIGURATION.md](CONFIGURATION.md)
3. Set up CI/CD with [CI-CD.md](CI-CD.md) or Git hooks with [LEFTHOOK.md](LEFTHOOK.md)

### I have a linting error and need to fix it

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for your tool (ESLint, Prettier, markdownlint, etc.)
2. Reference the tool's section in [CONFIGURATION.md](CONFIGURATION.md) for detailed config
3. Check [WORDPRESS.md — Common Issues](WORDPRESS.md#common-issues) if WordPress-specific

### I want to understand a specific tool in detail

- **ESLint & Prettier** → [CONFIGURATION.md — JavaScript/TypeScript](CONFIGURATION.md#javascripttypescript), deep focus in [references/javascript-typescript.md](../references/javascript-typescript.md)
- **markdownlint** → [CONFIGURATION.md — Markdown](CONFIGURATION.md#markdown), deep focus in [references/markdown.md](../references/markdown.md)
- **YAML/JSON (GitHub Actions)** → [CONFIGURATION.md — YAML/JSON](CONFIGURATION.md#yamljson), deep focus in [references/yaml-github-actions.md](../references/yaml-github-actions.md) and [references/json.md](../references/json.md)
- **PHPStan (PHP)** → [CONFIGURATION.md — PHP](CONFIGURATION.md#php), deep focus in [references/php.md](../references/php.md)
- **package.json** → [CONFIGURATION.md — Package Management](CONFIGURATION.md#package-management), deep focus in [references/npm.md](../references/npm.md)

### I'm setting up GitHub Actions CI

1. Read [CI-CD.md — Quick Start](CI-CD.md#quick-start) for immediate setup
2. Check [CI-CD.md — Full Workflow Examples](CI-CD.md#full-workflow-examples) for block themes vs. plugins
3. Review [CI-CD.md — Caching Strategies](CI-CD.md#caching-strategies) for optimization

### I want to automate linting with Git hooks

1. Read [LEFTHOOK.md — Installation](LEFTHOOK.md#installation) for setup
2. Understand [LEFTHOOK.md — Hook Types](LEFTHOOK.md#hook-types) (pre-commit, pre-push, etc.)
3. See [LEFTHOOK.md — Usage Patterns](LEFTHOOK.md#usage-patterns) for configuration examples

## Document Details

| Document | Length | Best For | Key Sections |
|----------|--------|----------|--------------|
| **WORDPRESS.md** | 531 lines | WordPress setup & best practices | Block themes, block plugins, coding standards, CI/CD integration |
| **CONFIGURATION.md** | 456 lines | Tool reference & config files | All 8+ tools, config file reference, rule examples |
| **CI-CD.md** | 600 lines | GitHub Actions workflows | Quick start, full examples, caching, coverage, PHP linting |
| **TROUBLESHOOTING.md** | 456 lines | Problem solving | 30+ common issues with solutions across all tools |
| **LEFTHOOK.md** | 371 lines | Git hooks automation | Installation, config, hook types, usage patterns |
| **IMPLEMENTATION_SEQUENCE.md** | ~200 lines | Optimization roadmap | 3-phase optimization plan, success criteria, validation |
| **BUILD_SUMMARY.md** | ~200 lines | Project overview | Features, structure, testing, deployment status |
| **DEPLOYMENT_READY.md** | ~250 lines | Release readiness | Deployment checklist, verification steps, go-live guide |

## Focused reference files

`SKILL.md` routes each task to one of these, so Claude reads only what the task needs:

| File | Covers |
| --- | --- |
| [javascript-typescript.md](../references/javascript-typescript.md) | ESLint, Prettier, TypeScript, flat config |
| [css-scss.md](../references/css-scss.md) | stylelint and `@wordpress/stylelint-config` |
| [markdown.md](../references/markdown.md) | markdownlint and `wp-scripts lint-md-docs` |
| [theme-json-block-json.md](../references/theme-json-block-json.md) | `theme.json` and `block.json` schema validation |
| [json.md](../references/json.md) | JSON syntax and schemas |
| [npm.md](../references/npm.md) | `package.json` and dependencies |
| [php.md](../references/php.md) | PHPStan, PHPCS, WordPress Coding Standards |
| [yaml-github-actions.md](../references/yaml-github-actions.md) | GitHub Actions and YAML |
| [lefthook-pre-commit.md](../references/lefthook-pre-commit.md) | Lefthook pre-commit and pre-push hooks |

These used to be separate sub-skills in `sub-skills/`. Claude Code does not load nested skills, so they are now reference files linked from `SKILL.md`.

`BUILD_SUMMARY.md`, `DEPLOYMENT_READY.md` and `IMPLEMENTATION_SEQUENCE.md` are historical records of an earlier plan. `RELEASING.md` is the release process moved here from `.claude/instructions/`.

---

**Last Updated**: 2026-11-03
