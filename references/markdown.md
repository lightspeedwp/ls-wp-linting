# Markdown linting

markdownlint for READMEs, docs and changelogs in WordPress themes, plugins and skills.

## With @wordpress/scripts

```json
{
  "scripts": {
    "lint:md:docs": "wp-scripts lint-md-docs"
  }
}
```

`wp-scripts lint-md-docs` runs markdownlint with the WordPress `.markdownlint.json` preset and ignores `build`, `node_modules` and `vendor`. Override it with your own `.markdownlint.json` (see the markdownlint-cli options).

## With markdownlint-cli2 directly

This skill's own repository uses this form:

```json
{
  "scripts": {
    "lint:markdown": "markdownlint-cli2 '**/*.md' '!node_modules/**'"
  }
}
```

- Configure rules in `.markdownlint.json`, `.markdownlint.yaml`, `.markdownlint-cli2.jsonc` or `.markdownlint-cli2.mjs`. With no config file, markdownlint's defaults apply.
- Quote globs so the shell does not expand them.
- Fix what can be fixed automatically with `markdownlint-cli2 --fix '**/*.md'`.

## Rules that come up most

| Rule | What it checks | Typical fix |
| --- | --- | --- |
| MD013 | Line length | Disable for prose-heavy docs (`"MD013": false`) or raise the limit |
| MD022 / MD031 / MD032 | Blank lines around headings, code fences, lists | Add a blank line before and after |
| MD024 | Duplicate headings | `"MD024": { "siblings_only": true }` for changelogs |
| MD033 | Inline HTML | Allow specific elements: `"MD033": { "allowed_elements": ["details", "summary"] }` |
| MD040 | Fenced code without a language | Add the language after the opening fence |
| MD041 | First line is not a top-level heading | Start the file with `# Title`, or disable for files with front matter |

## Front matter

markdownlint skips YAML front matter at the top of a file. If MD041 still fires on files that start with front matter, set `"MD041": false` or use `"front_matter_title": ""`.

## Sources

- [`@wordpress/scripts` lint-md-docs](https://github.com/WordPress/gutenberg/tree/trunk/packages/scripts#lint-md-docs)
- [markdownlint rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)
