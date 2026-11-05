# Prompt: Set Up Linting for WordPress Block Theme or Plugin

Use this prompt to set up complete linting infrastructure for a new or existing WordPress block theme or plugin project.

## Prerequisites

- Node.js 18+ installed
- Existing WordPress block theme or plugin repository
- npm (or pnpm/yarn)

## Step-by-Step Setup

### 1. Verify Project Type

**Block Theme** has:

- `style.css` with `Template` header (or no Template)
- `functions.php`
- `theme.json`
- Often uses `@wordpress/scripts`

**Block Plugin** has:

- `plugin.php` header file
- `src/` directory for blocks
- `package.json` with `@wordpress/scripts`
- `block.json` files for blocks

### 2. Initialize npm (if needed)

```bash
# If no package.json exists
npm init -y

# Or for WordPress starter:
npm init -y --scope=@myorg
```

### 3. Install Dependencies

```bash
# wp-scripts (includes ESLint, Prettier, build tools)
npm install --save-dev @wordpress/scripts

# Markdown linting
npm install --save-dev markdownlint-cli2 @github/markdownlint-github

# Additional tools
npm install --save-dev eslint-config-prettier prettier

# Optional: PHPStan for PHP files
# Install composer dependencies (see WordPress PHP section)
```

### 4. Create Configuration Files

#### ESLint Configuration (extends wp-scripts)

**File**: `.eslintrc.json`

```json
{
  "extends": "@wordpress/eslint-config",
  "rules": {
    "no-console": "warn",
    "camelcase": ["error", { "properties": "never" }]
  }
}
```

Or **modern flat config** `eslint.config.cjs`:

```javascript
const js = require('@eslint/js');
const wpScripts = require('@wordpress/eslint-config/shared-config');

module.exports = [
  js.configs.recommended,
  wpScripts,
  {
    rules: {
      'no-console': 'warn'
    }
  }
];
```

#### Prettier Configuration

**File**: `.prettierrc`

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### Markdownlint Configuration

**File**: `.markdownlint-cli2.mjs`

```javascript
import github from '@github/markdownlint-github';

export default {
  config: {
    extends: [github],
    rules: {
      MD013: { line_length: 120 }
    }
  }
};
```

#### Ignore Files

**File**: `.eslintignore`

```
node_modules/
dist/
build/
.next/
coverage/
*.min.js
vendor/
```

**File**: `.prettierignore`

```
node_modules
dist
build
coverage
*.lock
```

**File**: `.markdownlintignore`

```
node_modules/
vendor/
.git/
dist/
build/
```

### 5. Add npm Scripts

Update `package.json` scripts:

```json
{
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "lint:js": "wp-scripts lint-js",
    "format:js": "wp-scripts format",
    "lint:md": "markdownlint-cli2 '**/*.md'",
    "lint:md:fix": "markdownlint-cli2 --fix '**/*.md'",
    "lint": "npm run lint:js && npm run lint:md",
    "format": "npm run format:js && npm run lint:md:fix",
    "test": "wp-scripts test-unit-js --coverage"
  }
}
```

### 6. Create .gitignore

**File**: `.gitignore`

```
# Node
node_modules/
npm-debug.log*
.npm

# Build outputs
dist/
build/
.wp-env/

# Dependencies
composer.lock
package-lock.json

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# WordPress
wp-content/plugins/*/
wp-content/themes/*/
!wp-content/plugins/my-plugin/
!wp-content/themes/my-theme/
```

### 7. Set Up GitHub Actions (Optional but Recommended)

**File**: `.github/workflows/lint.yml`

```yaml
name: Linting

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Lint JavaScript
        run: npm run lint:js
      
      - name: Lint Markdown
        run: npm run lint:md
      
      - name: Check formatting
        run: npm run format:js -- --check
```

### 8. Set Up Pre-commit Hooks (Optional)

```bash
# Install Husky
npm install --save-dev husky lint-staged

# Initialize Husky
npx husky install

# Create pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

Update `package.json`:

```json
{
  "lint-staged": {
    "*.js": "eslint --fix",
    "*.{jsx,js,json,md}": "prettier --write",
    "*.md": "markdownlint-cli2"
  }
}
```

### 9. Test the Setup

```bash
# Run all linting
npm run lint

# Test formatting
npm run format

# Check individual tools
npm run lint:js
npm run lint:md

# Run with fix
npm run lint:js -- --fix
npm run lint:md:fix
```

### 10. Fix Any Issues

If linting fails:

1. **ESLint errors**: `npm run lint:js -- --fix` (auto-fixes most)
2. **Format issues**: `npm run format:js`
3. **Markdown**: `npm run lint:md:fix`
4. **Remaining issues**: See [TROUBLESHOOTING.md](/docs/TROUBLESHOOTING.md)

### 11. Commit Everything

```bash
git add .
git commit -m "chore: add linting configuration"
git push origin feature/linting-setup
```

---

## WordPress Block Theme Specifics

Additional considerations for block themes:

### theme.json Validation

```bash
# No built-in JSON validator yet
# Manually check against schema:
# https://schemas.wp.org/wp/6.0/theme.json

# Use online validator or VSCode with JSON schema extension
```

### PHP Linting (if needed)

```bash
# Install PHP_CodeSniffer via Composer
composer require --dev wp-coding-standards/wpcs

# Or PHPStan for static analysis
composer require --save-dev phpstan/phpstan
```

---

## WordPress Block Plugin Specifics

Additional considerations for block plugins:

### block.json Validation

```javascript
// ESLint can validate block.json with custom rules
// Typically handled by wp-scripts
```

### Main Plugin File Checks

Ensure `plugin.php` header is valid:

```php
<?php
/**
 * Plugin Name: My Block Plugin
 * Plugin URI: https://example.com
 * Description: A custom block plugin
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL-2.0-or-later
 * Text Domain: my-block-plugin
 * Domain Path: /languages
 * Requires at least: 5.9
 * Requires PHP: 7.4
 */
```

---

## Next Steps

1. **Run linting**: `npm run lint`
2. **Set up GitHub Actions**: Push workflow file to `.github/workflows/`
3. **Fix issues**: Use troubleshooting guide if needed
4. **Set pre-commit hooks** (optional): Follow step 8 above
5. **Document in README**: Add linting instructions for contributors

---

## Verification Checklist

- [ ] `package.json` has wp-scripts installed
- [ ] All config files created (ESLint, Prettier, markdownlint)
- [ ] npm scripts work: `npm run lint`, `npm run format`
- [ ] `npm run lint` passes without errors
- [ ] GitHub Actions workflow set up (if applicable)
- [ ] Pre-commit hooks working (if applicable)
- [ ] Documentation updated in README
- [ ] Initial commit made with linting setup

---

**Last Updated**: 2026-10-30
