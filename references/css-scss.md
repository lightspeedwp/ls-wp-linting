# CSS and SCSS linting

stylelint with the WordPress CSS Coding Standards, for theme and block stylesheets.

## With @wordpress/scripts (preferred)

```json
{
  "scripts": {
    "lint:style": "wp-scripts lint-style",
    "lint:css:src": "wp-scripts lint-style 'src/**/*.css'"
  }
}
```

- `wp-scripts lint-style` lints CSS, PCSS and SCSS with `@wordpress/stylelint-config`, ignoring `build`, `node_modules` and `vendor`.
- Quote globs (`'src/**/*.scss'`) so the shell does not expand them.
- Add `--fix` to apply automatic fixes.

## Choosing a preset

Put a `.stylelintrc.json` in the project root:

```json
{
  "extends": "@wordpress/stylelint-config/scss"
}
```

| Preset | Use for |
| --- | --- |
| `@wordpress/stylelint-config` | Plain CSS |
| `@wordpress/stylelint-config/scss` | SCSS (adds `stylelint-config-recommended-scss`) |
| `@wordpress/stylelint-config/stylistic` | CSS plus stylistic rules such as indentation |
| `@wordpress/stylelint-config/scss-stylistic` | SCSS plus stylistic rules adapted for SCSS |

When configuring stylelint directly rather than through `wp-scripts`, install the peers: `@wordpress/stylelint-config` 27 needs `stylelint` ^17.14.1 and `stylelint-scss` ^7.2.0.

## Block themes

- Prefer `theme.json` presets over hand-written CSS. Reference them as `var(--wp--preset--color--primary)` rather than hard-coding values. See [theme-json-block-json.md](theme-json-block-json.md).
- Stylelint does not know which custom properties `theme.json` generates. A typo in `--wp--preset--*` passes linting, so check the slug against `theme.json`.
- Keep block styles in the block's own `style.scss` and `editor.scss`, which `block.json` references.

## Common errors

| Error | Fix |
| --- | --- |
| `Unknown word` in `.scss` | Use the `scss` preset; the base preset parses plain CSS |
| `Unknown rule at-rule-no-unknown` for `@include` or `@use` | Use the `scss` preset, which swaps in `scss/at-rule-no-unknown` |
| `No files matching the pattern` | Quote the glob, and check that the path is relative to the project root |
| Indentation rules missing | Use a `stylistic` preset |

## Sources

- [`@wordpress/scripts` lint-style](https://github.com/WordPress/gutenberg/tree/trunk/packages/scripts#lint-style)
- [`@wordpress/stylelint-config`](https://github.com/WordPress/gutenberg/tree/trunk/packages/stylelint-config)
- [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
