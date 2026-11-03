# Lefthook and pre-commit linting

Run linters on staged files before each commit, and the full suite before each push, with [Lefthook](https://lefthook.dev/).

## Install

```bash
npm install --save-dev lefthook
npx lefthook install
```

`npx lefthook install` writes the Git hooks. Run it again after changing hook names in `lefthook.yml`.

## Example lefthook.yml for a block theme or plugin

```yaml
pre-commit:
  parallel: true
  jobs:
    - name: lint-js
      glob: "*.{js,jsx,ts,tsx}"
      run: npx wp-scripts lint-js {staged_files}
    - name: lint-style
      glob: "*.{css,scss}"
      run: npx wp-scripts lint-style {staged_files}
    - name: format
      glob: "*.{js,jsx,ts,tsx,json,yml,yaml}"
      run: npx wp-scripts format {staged_files}
      stage_fixed: true
    - name: phpcs
      glob: "*.php"
      run: vendor/bin/phpcs {staged_files}

pre-push:
  jobs:
    - run: npm run lint
    - run: npm test
```

- `{staged_files}` passes only the staged files that match `glob`, so commits stay fast.
- `stage_fixed: true` re-stages files that a formatter changed. It works only on `pre-commit`.
- `jobs` is the current syntax (Lefthook 1.10 and later). The older `commands:` map still works.
- Keep the slow checks (full test suite, type check) in `pre-push` or CI.

## Skipping and debugging

- Skip one run: `LEFTHOOK=0 git commit -m "..."`. Prefer fixing the failure; CI runs the same checks.
- Skip one job: `LEFTHOOK_EXCLUDE=phpcs git commit -m "..."`.
- Run a hook by hand: `npx lefthook run pre-commit`.
- Hooks not running: check that `.git/hooks/pre-commit` exists, and run `npx lefthook install` again.

## Agent tooling note

Hooks call linters and npm scripts directly; don't wrap them in `.sh` files. LightSpeed agent tooling is TypeScript run with `tsx`. A hook that needs custom logic should run `npx tsx scripts/<name>.ts`.

## Sources

- [Lefthook jobs](https://lefthook.dev/configuration/jobs), [stage_fixed](https://lefthook.dev/configuration/stage_fixed) and [LEFTHOOK_EXCLUDE](https://lefthook.dev/usage/envs/LEFTHOOK_EXCLUDE)
- [`@wordpress/scripts`](https://github.com/WordPress/gutenberg/tree/trunk/packages/scripts)
- This skill's longer guide: [docs/LEFTHOOK.md](../docs/LEFTHOOK.md)
