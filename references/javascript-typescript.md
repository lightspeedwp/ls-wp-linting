# JavaScript and TypeScript linting

ESLint and Prettier for WordPress block themes and plugins, through `@wordpress/scripts` or configured directly.

## With @wordpress/scripts (preferred)

```json
{
  "scripts": {
    "lint:js": "wp-scripts lint-js",
    "lint:js:src": "wp-scripts lint-js ./src",
    "format": "wp-scripts format"
  }
}
```

- `wp-scripts lint-js` lints JavaScript **and TypeScript** with the rules from `@wordpress/eslint-plugin`. It looks for a flat config (`eslint.config.*`) first and falls back to a legacy `.eslintrc.*`.
- `build`, `node_modules` and `vendor` are ignored by default. Add more to `ignores` in a flat config; `--ignore-path` was removed with eslintrc.
- `wp-scripts format` runs Prettier (with `@wordpress/prettier-config`) over JavaScript, JSON, TypeScript and YAML. Exclude paths with `.prettierignore`.

## Flat config with @wordpress/eslint-plugin

```js
// eslint.config.mjs
import wordpress from '@wordpress/eslint-plugin';

export default [ ...wordpress.configs.recommended ];
```

| Preset | Use for |
| --- | --- |
| `recommended` | Default. ES2015+, JSX, a11y, React, JSDoc. Enables TypeScript support when `typescript` is installed. |
| `recommended-with-formatting` | Native ESLint formatting rules instead of Prettier; never activates the Prettier or TypeScript integration. |
| `esnext` | Modern JavaScript without the React rules. |
| `test-unit` | Vitest tests with explicit imports (Jest at `@wordpress/eslint-plugin` < 27). |

Migrating from `.eslintrc`: replace `extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ]` with the flat config above. ESLint 10 does not read `.eslintrc.*` at all, and the plugin's eslintrc wrapper is deprecated.

## TypeScript

- Install `typescript` as a dev dependency. The `recommended` preset then enables the `@typescript-eslint` integration.
- Type errors are not lint errors. Run `tsc --noEmit` separately (for example as `npm run typecheck`).
- A project-specific flat config whose `files` globs list only `**/*.js` will silently skip `.ts` files. Check the globs when TypeScript files are not being linted.

## ESLint and Prettier conflicts

1. Use one owner for formatting. With `wp-scripts`, Prettier formats and ESLint checks code quality.
2. If you compose your own config, add `eslint-config-prettier` last so it switches off rules that fight Prettier.
3. Confirm with `npx eslint --print-config path/to/file.js` to see which rules are active for a file.

## Common errors

| Error | Likely cause | Fix |
| --- | --- | --- |
| `ESLint couldn't find a configuration file` | No `eslint.config.*` and no `.eslintrc.*` | Add the flat config above |
| `Parsing error: Unexpected token` in `.ts` | TypeScript integration not active | Install `typescript`; check the preset |
| Rules from `@wordpress/eslint-plugin` missing | Old eslintrc config ignored by ESLint 10 | Migrate to flat config |
| `--ignore-path` not recognised | Removed with eslintrc | Use `ignores` in the flat config |

## Sources

- [`@wordpress/scripts` lint-js and format](https://github.com/WordPress/gutenberg/tree/trunk/packages/scripts#lint-js)
- [`@wordpress/eslint-plugin`](https://github.com/WordPress/gutenberg/tree/trunk/packages/eslint-plugin)
- [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files)
