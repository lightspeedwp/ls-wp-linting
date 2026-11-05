# Assets

Bundled configuration templates, example files, and reference resources for the linting skill.

## Purpose

This directory holds ready-to-use templates and example configuration files that support linting setup across WordPress projects. These are static resources used as output or reference by the skill.

## Contents

### Configuration Templates

Example configuration files for common linting tools:

- ESLint config templates (`.eslintrc.js`, `.eslintrc.json`)
- Prettier config templates (`.prettierrc`, `.prettierrc.json`)
- PHPStan config (`phpstan.neon`)
- YAML linting config (`yamllint.yml`)
- Markdownlint config (`.markdownlintrc`)

### WordPress-Specific Examples

Pre-built configurations optimized for WordPress block themes and plugins:

- `wp-scripts` ESLint + Prettier setup
- WordPress PHP coding standards
- Block theme linting patterns
- Block plugin linting patterns

### Helper Scripts

Utility scripts that support linting workflows:

- Config validation helpers
- Setup automation scripts
- CI/CD integration examples

## Using Assets

When the skill suggests a configuration, it may reference templates from this directory. You can:

1. **Copy templates as-is** — Use pre-built configs directly in your project
2. **Customize** — Adapt templates to your team's standards
3. **Review** — Use as reference when setting up linting from scratch

## Adding New Assets

When adding new configuration templates or examples:

- Place them in this directory
- Name clearly with the tool/purpose (e.g., `eslintrc.wordpress-blocks.json`)
- Document in this README under the appropriate section
- Update references in SKILL.md if the skill mentions them

---

**Last Updated**: 2026-10-31
