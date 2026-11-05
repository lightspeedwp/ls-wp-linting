# Linting Troubleshooting Guide

Solutions to common linting problems in WordPress projects.

## ESLint Issues

### Error: Config file not found

**Symptoms**: `ESLint config file not found` or linting skipped entirely

**Solutions**:

1. Create `eslint.config.cjs` (modern) or `.eslintrc.json` (legacy)
2. Verify file is in project root
3. Check file name spelling (case-sensitive)
4. Run with debug: `npx eslint --debug . 2>&1 | grep -i config`

### Error: "Rule X is deprecated"

**Symptoms**: `Warning: Rule X is deprecated`

**Solutions**:

1. Update ESLint: `npm install --save-dev eslint@latest`
2. Update rule plugins: `npm update`
3. Replace deprecated rule in config:
   - Old: `no-spaced-func` → New: `func-call-spacing`
   - Old: `newline-before-return` → Remove (ESLint 8+)
4. Check changelog for breaking changes

### Error: "No files matching pattern"

**Symptoms**: ESLint runs but finds no files

**Solutions**:

```bash
# Test the pattern first
ls src/**/*.js

# If no output, check glob syntax
# Common issues:
# - Missing quotes: npm run lint src/**/*.js  (shell expands, wrong)
#   FIX: Use quotes: "src/**/*.js"
# - Wrong path: check if src/ exists
# - Wrong extension: *.jsx instead of *.js
```

### Error: "Cannot find module @babel/eslint-parser"

**Symptoms**: ESLint can't parse file

**Solutions**:

```bash
npm install --save-dev @babel/eslint-parser

# Then add to config:
# eslint.config.cjs:
languageOptions: {
  parser: babelParser,
  ecmaVersion: 2021
}
```

### Error: Conflicting ESLint and Prettier rules

**Symptoms**:

- ESLint says add semicolon, Prettier removes it
- ESLint wants different spacing than Prettier

**Solutions**:

1. Install `eslint-config-prettier`: `npm install --save-dev eslint-config-prettier`
2. Load it LAST in config:

   ```javascript
   // eslint.config.cjs
   const prettier = require('eslint-config-prettier');
   module.exports = [
     /* other configs */
     prettier  // MUST be last
   ];
   ```

3. Never use ESLint for formatting (indent, semi, quotes, etc.)
4. Run Prettier separately or via VSCode

### File not linting

**Symptoms**: File exists but ESLint skips it

**Solutions**:

1. Check `.eslintignore`:

   ```bash
   # Remove matching files
   cat .eslintignore | grep myfile.js
   ```

2. Check config `files` pattern:

   ```javascript
   { files: ['**/*.js'], rules: {...} }  // Only matches .js
   // If you want .jsx too:
   { files: ['**/*.{js,jsx}'], rules: {...} }
   ```

3. Run with debug: `npx eslint --debug myfile.js 2>&1 | head -20`

## Prettier Issues

### Error: "Configuration file not found"

**Symptoms**: Prettier doesn't format, says no config

**Solutions**:

1. Create `.prettierrc` or `prettier.config.js`
2. Or add to `package.json`:

   ```json
   {
     "prettier": {
       "singleQuote": true,
       "semi": true
     }
   }
   ```

3. Verify default prettier behavior: `npx prettier --version && npx prettier --help`

### Files not formatted

**Symptoms**: Run `npm run format` but files unchanged

**Solutions**:

```bash
# Check if files need formatting
npx prettier --check . --list-different

# See what would change
npx prettier --diff src/index.js

# Force format (warning: writes files)
npx prettier --write .
```

### Conflict: Prettier reformats after ESLint

**Symptoms**: Format, ESLint fails; lint, Prettier reformats

**Solutions**:

1. Use `eslint-config-prettier` (see above)
2. Never use ESLint rules for formatting:
   - ❌ `indent`, `semi`, `quotes`, `comma-dangle`, `space-before-function-paren`
   - ✅ Use Prettier for these
3. Test: `npm run lint:js && npm run format:js -- --check`
   - If this passes, your setup is correct

### Line length mismatch

**Symptoms**: `printWidth: 80` in Prettier, ESLint uses different

**Solutions**:

```json
// .prettierrc
{ "printWidth": 80 }

// eslint.config.cjs - don't set max-len at all
// If you must: make it match Prettier's printWidth or disable
{ rules: { 'max-len': 'off' } }
```

## markdownlint Issues

### Error: "Config not found"

**Symptoms**: Markdown linting skipped or using defaults

**Solutions**:

1. Create `.markdownlint-cli2.mjs` or `.markdownlint.json`
2. Check file location: must be in project root
3. Test explicitly: `markdownlint-cli2 --config .markdownlint-cli2.mjs README.md`

### Rule MD001: "Heading hierarchy"

**Symptoms**: `MD001 heading-increment: Top-level heading must be H1`

**Solutions**:

```markdown
# Wrong - starts with H2
## Section

# Correct
# Heading 1
## Heading 2
```

### Rule MD013: "Line too long"

**Symptoms**: `MD013 line-length: Line too long`

**Solutions**:

1. Wrap long lines
2. Or disable rule per line:

   ```markdown
   <!-- markdownlint-disable-next-line MD013 -->
   This is a very long line that exceeds the configured printWidth limit
   ```

3. Or set in config:

   ```json
   { "rules": { "MD013": { "line_length": 120 } } }
   ```

### Ignore file not working

**Symptoms**: Files in `.markdownlintignore` still lint

**Solutions**:

```bash
# Check if pattern works
markdownlint-cli2 --list-files | grep ignored-file

# Test glob patterns:
# node_modules/     ✓ matches dir (with slash)
# *.min.md          ✓ matches extension
# dist              ✗ needs trailing slash for dir
# ^build            ✗ anchors not supported, use **/pattern
```

### Parse error on YAML frontmatter

**Symptoms**: `MD000 parse error` at top of file

**Solutions**:

```markdown
---
title: "My Document"
date: 2026-10-30
---

# Heading starts after frontmatter
```

Ensure:

- 3 dashes above and below
- Valid YAML inside
- Blank line after closing dashes

## PHP/PHPStan Issues

### Error: "Config file not found"

**Symptoms**: PHPStan says no config

**Solutions**:

1. Create `phpstan.neon` in project root
2. Check spelling: `phpstan.neon` not `phpstan.yml` or `phpstan.json`
3. Test: `vendor/bin/phpstan analyse --debug`

### Error: "Call to undefined method"

**Symptoms**: PHPStan reports method doesn't exist (but it does)

**Solutions**:

1. This is often correct - method may be dynamic in WordPress
2. Exclude pattern:

   ```neon
   ignoreErrors:
     - '#Call to an undefined method#'
     - '#Undefined property#'
   ```

3. Add stubs for dynamic methods (plugin ecosystem)

### Performance: Analysis too slow

**Symptoms**: `phpstan analyse` takes > 30 seconds

**Solutions**:

1. Lower analysis level (default 5):

   ```neon
   parameters:
     level: 3  # Lower level = faster
   ```

2. Exclude more paths:

   ```neon
   excludePaths:
     - tests
     - vendor
     - node_modules
   ```

3. Use `--memory-limit`:

   ```bash
   vendor/bin/phpstan analyse --memory-limit=4G
   ```

## GitHub Actions CI Issues

### Error: "Setup Node failed"

**Symptoms**: GitHub Actions workflow fails at setup step

**Solutions**:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'   # Specify version
    cache: 'npm'         # Cache dependencies
    cache-dependency-path: 'package-lock.json'  # If in subdirectory
```

### Linting passes locally but fails in CI

**Symptoms**: `npm run lint` works on machine, fails in GitHub Actions

**Solutions**:

1. Check Node version:

   ```bash
   # Locally
   node --version

   # In CI
   echo "Node: ${{ matrix.node-version }}"
   ```

2. Check cache:

   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
       cache-dependency-path: '**/package-lock.json'  # If monorepo
   ```

3. Clean dependencies:

   ```yaml
   - run: npm ci  # Use ci instead of install
   ```

4. Check `.gitignore` doesn't exclude config files

### Error: "eslintignore not honored"

**Symptoms**: CI lints files that are in `.eslintignore`

**Solutions**:

1. Verify `.eslintignore` is committed: `git status .eslintignore`
2. Use absolute paths in CI:

   ```yaml
   - run: npm run lint -- --ignore-path ./.eslintignore
   ```

3. Or use config directly:

   ```javascript
   // eslint.config.cjs
   module.exports = [
     {
       ignores: ['node_modules/', 'dist/']
     },
     // ... rules
   ];
   ```

## wp-scripts/WordPress Issues

### Error: wp-scripts command not found

**Symptoms**: `wp-scripts: command not found`

**Solutions**:

```bash
# Install as dev dependency
npm install --save-dev @wordpress/scripts

# Or use npx
npx @wordpress/scripts lint-js
```

### wp-scripts ESLint extends aren't working

**Symptoms**: wp-scripts config not loading WordPress rules

**Solutions**:

```javascript
// .eslintrc.json - wp-scripts uses this
{
  "extends": "@wordpress/eslint-config",
  "rules": {
    // Custom overrides
  }
}
```

Not working? Override completely:

```javascript
// eslint.config.cjs - modern flat config
module.exports = [
  {
    files: ['**/*.js'],
    rules: {
      'camelcase': ['error', { properties: 'never' }],
      'no-var': 'error'
    }
  }
];
```

### PHPStan with WordPress plugins

**Symptoms**: PHPStan reports undefined methods (WordPress dynamic)

**Solutions**:

```neon
# phpstan.neon
parameters:
  level: 5
  ignoreErrors:
    - '#Dynamic property#'
    - '#Undefined property.*\\$_'
    - '#Call to undefined method.*'
    
  reportUnmatchedIgnoredErrors: false
```

Or use WordPress stubs (if available):

```bash
composer require phpstan/phpstan-wordpress --dev
```

## General Debugging

### Enable debug mode

```bash
# ESLint
npm run lint -- --debug 2>&1 | head -50

# Prettier  
npx prettier --debug-check . 2>&1 | head -50

# markdownlint
markdownlint-cli2 --show-errors .

# PHPStan
vendor/bin/phpstan analyse --debug
```

### Check configuration

```bash
# ESLint - print resolved config
npx eslint --print-config src/index.js | head -50

# Prettier - show resolved config
npx prettier --resolved-config-path .

# markdownlint
markdownlint-cli2 --list-files
```

### Run with verbose output

```bash
# npm scripts with debug
npm run lint -- --verbose

# Global debug env
DEBUG=* npm run lint
```

---

**Last Updated**: 2026-10-30  
**For more help**: Check specific tool documentation or open an issue
