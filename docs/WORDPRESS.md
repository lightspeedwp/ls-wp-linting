# WordPress Block Theme & Plugin Linting Guide

Complete linting setup and best practices for WordPress block themes and plugins.

## Table of Contents

- [Block Themes (wp-scripts)](#block-themes-wp-scripts)
- [Block Plugins (wp-build)](#block-plugins-wp-build)
- [WordPress Coding Standards](#wordpress-coding-standards)
- [Common Issues](#common-issues)
- [CI/CD Integration](#cicd-integration)

---

## Block Themes (wp-scripts)

### What is wp-scripts?

`@wordpress/scripts` is the WordPress standard build tool for block themes. It includes:
- **ESLint** with WordPress coding standards
- **Prettier** for code formatting
- **Webpack** for bundling
- **Testing infrastructure** (`wp-scripts test-unit-js`, which runs Vitest from @wordpress/scripts 36)

### Installation

```bash
npm install --save-dev @wordpress/scripts
```

### Package.json Scripts

```json
{
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "lint:js": "wp-scripts lint-js",
    "format:js": "wp-scripts format-js",
    "test:unit": "wp-scripts test-unit-js",
    "test:e2e": "wp-scripts test-e2e"
  }
}
```

### ESLint Configuration for Block Themes

wp-scripts provides a default ESLint config. Customize by creating `.eslintrc.json`:

```json
{
  "extends": "@wordpress/eslint-config",
  "rules": {
    "no-console": "warn",
    "camelcase": ["error", { "properties": "never", "ignoreDestructuring": true }],
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

**Key WordPress Rules:**
- `camelcase` with `properties: never` - WordPress uses snake_case for properties
- `ignoreDestructuring: true` - Allow destructuring even if vars are snake_case
- `no-console` as warning - WordPress outputs warnings, not errors
- `no-var` - Modern JavaScript only

### Prettier Configuration for Block Themes

Create `.prettierrc`:

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

### Theme Structure

WordPress block themes follow this structure:

```
my-block-theme/
├── style.css              # Theme header & styles
├── theme.json             # Block theme config
├── functions.php          # PHP functions
├── index.php              # Fallback template
├── templates/             # Block templates
│   ├── index.html
│   └── single.html
├── parts/                 # Reusable template parts
│   ├── header.html
│   └── footer.html
├── src/                   # Source files
│   ├── js/
│   │   └── main.js
│   └── scss/
│       └── style.scss
└── package.json
```

### theme.json Linting

`theme.json` defines theme configuration. While no built-in linter exists, validate against schema:

```json
{
  "$schema": "https://schemas.wp.org/wp/6.3/theme.json",
  "version": 2,
  "settings": {
    "color": {
      "palette": [
        { "name": "Black", "slug": "black", "color": "#000000" }
      ]
    },
    "typography": {
      "fontSizes": [
        { "name": "Small", "slug": "small", "size": "0.875rem" }
      ]
    }
  },
  "styles": {
    "color": { "background": "white", "text": "black" }
  }
}
```

**Validation:**
- Use VSCode with JSON schema extension
- Test with `wp-scripts build` (fails on invalid theme.json)
- Check schema at [schemas.wp.org](https://schemas.wp.org/wp/6.3/theme.json)

### PHP Linting in Block Themes

Block themes may include PHP. Lint with PHPStan:

```bash
composer require --dev phpstan/phpstan
```

Create `phpstan.neon`:

```neon
parameters:
  level: 5
  paths:
    - functions.php
    - inc/
  excludePaths:
    - tests/
    - vendor/
```

Run:

```bash
vendor/bin/phpstan analyse
```

### Best Practices for Block Themes

1. **Use wp-scripts defaults** - Don't override unless necessary
2. **Follow WordPress naming conventions** - snake_case for PHP, camelCase for JS
3. **Lint before commit** - `npm run lint:js` on every change
4. **Format regularly** - `npm run format:js` to maintain consistency
5. **Test in CI** - Run linting in GitHub Actions before merge
6. **Document custom rules** - If extending ESLint config, comment why
7. **Use Lefthook** - Automate linting with Git hooks
8. **Validate theme.json** - Test with `wp-scripts build`

---

## Block Plugins (wp-build)

### What is wp-build?

`@wordpress/scripts` also supports block plugins. Block plugins are traditional WordPress plugins containing blocks.

### Installation

```bash
npm install --save-dev @wordpress/scripts
```

### Plugin Structure

```
my-block-plugin/
├── plugin.php             # Plugin header & main file
├── package.json
├── src/
│   ├── index.js           # Entry point
│   ├── blocks/
│   │   ├── my-block/
│   │   │   ├── index.js
│   │   │   ├── block.json
│   │   │   ├── edit.js
│   │   │   └── save.js
│   │   └── another-block/
│   └── block-styles/
├── build/                 # Compiled output
└── .wordpress-org/        # Plugin Marketplace
```

### block.json Structure

Each block needs a `block.json` descriptor:

```json
{
  "apiVersion": 3,
  "name": "my-plugin/my-block",
  "title": "My Custom Block",
  "category": "widgets",
  "icon": "smiley",
  "description": "A custom block for my plugin",
  "supports": {
    "html": false,
    "align": ["left", "center", "right"],
    "color": {
      "background": true,
      "text": true
    },
    "spacing": {
      "padding": true,
      "margin": true
    }
  },
  "example": {
    "attributes": {
      "message": "Hello World"
    }
  }
}
```

**Validation:**
- Test with `wp-scripts build` (fails on invalid block.json)
- Check schema at [developer.wordpress.org](https://developer.wordpress.org/block-editor/)
- VSCode JSON schema extension recommended

### Plugin PHP Header

`plugin.php` must include proper WordPress headers:

```php
<?php
/**
 * Plugin Name: My Block Plugin
 * Plugin URI: https://example.com/my-plugin
 * Description: A collection of custom blocks
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0-html
 * Text Domain: my-plugin
 * Domain Path: /languages
 * Requires at least: 5.9
 * Requires PHP: 7.4
 * Tested up to: 6.3
 */

defined( 'ABSPATH' ) || exit;

// Your plugin code...
```

### ESLint Configuration for Block Plugins

Create `.eslintrc.json` (extends wp-scripts):

```json
{
  "extends": "@wordpress/eslint-config",
  "rules": {
    "no-console": "warn",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  }
}
```

### Block Plugin Best Practices

1. **Validate block.json** - Test with `wp-scripts build`
2. **Use block namespacing** - `namespace/block-name` format
3. **Register blocks properly** - Include required metadata
4. **Test block rendering** - Use Vitest unit tests for edit/save
5. **Use WordPress hooks** - `wp_enqueue_scripts`, `enqueue_block_assets`
6. **Version your plugin** - Update version in plugin.php and package.json
7. **Internationalize strings** - Use `__()` and `_e()` for translations
8. **Lint before release** - Full validation in CI/CD

---

## WordPress Coding Standards

### JavaScript/ESLint Standards

**Variable Naming:**
```javascript
// ✓ Good - camelCase for variables
const blockSettings = {
  // ✓ Good - snake_case for properties from WordPress
  render_callback: 'my_render_function'
};

// ❌ Bad - PascalCase for variables
const BlockSettings = {};

// ❌ Bad - Don't mix styles inconsistently
const myVARiable = '';
```

**No console in production:**
```javascript
// ✓ Good - console only in development
if ( process.env.NODE_ENV === 'development' ) {
  console.log( 'Debug info' );
}

// ❌ Bad - console in production code
console.log( 'This will ship' );
```

**Use const, not var:**
```javascript
// ✓ Good
const settings = {};
let count = 0;

// ❌ Bad
var settings = {};
var count = 0;
```

**Always use semicolons:**
```javascript
// ✓ Good
const name = 'My Block';
const attributes = { name };

// ❌ Bad
const name = 'My Block'
const attributes = { name }
```

### PHP Coding Standards

WordPress PHP follows PSR-2 with modifications:

```php
// ✓ Good - snake_case for functions and variables
function register_my_block() {
  $block_args = array(
    'render_callback' => 'my_block_render'
  );
  register_block_type( 'my-plugin/my-block', $block_args );
}

// ✓ Good - spaces around operators
$total = $price * $quantity;

// ✓ Good - proper WordPress function usage
$post = get_post( $post_id );
if ( $post ) {
  echo wp_kses_post( $post->post_content );
}

// ❌ Bad - camelCase for functions
function registerMyBlock() {}

// ❌ Bad - no spaces around operators
$total=$price*$quantity;
```

### Markdown Standards

```markdown
# Proper Heading Structure

Start with H1, increment properly.

## Section 2

Content here.

### Subsection 2.1

More content.

## Section 3

Continue logically.
```

---

## Common Issues

### Theme.json Not Linting

**Problem:** theme.json looks correct but `wp-scripts build` fails

**Solutions:**
1. Validate JSON syntax: `node -e "JSON.parse(require('fs').readFileSync('theme.json'))"`
2. Check schema version matches: `"$schema": "https://schemas.wp.org/wp/6.3/theme.json"`
3. Test with simpler config first, add complexity gradually
4. Check VSCode for red squiggles (use JSON schema extension)

### Block.json Parse Errors

**Problem:** Block not registering, "block.json not found" error

**Solutions:**
1. Verify `block.json` path: should be in block folder (e.g., `src/blocks/my-block/block.json`)
2. Check spelling: `block.json` (not `blocks.json` or `Block.json`)
3. Ensure valid JSON: `node -e "JSON.parse(require('fs').readFileSync('src/blocks/my-block/block.json'))"`
4. Test with `wp-scripts build`: provides detailed error messages

### ESLint and WordPress Conflict

**Problem:** ESLint enforces camelCase but WordPress needs snake_case for properties

**Solution:** Use proper ESLint rules:

```json
{
  "extends": "@wordpress/eslint-config",
  "rules": {
    "camelcase": [
      "error",
      {
        "properties": "never",
        "ignoreDestructuring": true
      }
    ]
  }
}
```

This allows:
```javascript
// ✓ Valid with proper rules
const response = {
  render_callback: 'my_function',  // snake_case OK for properties
  myVariable: 'value'               // camelCase OK for regular vars
};
```

### PHP Functions Not Found

**Problem:** PHPStan reports undefined WordPress functions

**Solution:** Install WordPress stubs:

```bash
composer require --dev phpstan/phpstan-wordpress
```

Then update `phpstan.neon`:

```neon
includes:
  - vendor/phpstan/phpstan-wordpress/extension.neon
```

---

## CI/CD Integration

See [CI-CD.md](CI-CD.md) for complete GitHub Actions integration guide.

**Quick setup:**

```yaml
# .github/workflows/lint.yml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm install
      - run: npm run lint:js
      - run: npm run format:js -- --check
```

---

## Debugging Workflow

When linting fails in your block theme or plugin:

1. **Read the error message carefully** - It usually tells you exactly what's wrong
2. **Run locally first** - Reproduce the error before fixing
3. **Check the file** - Use ESLint/Prettier to auto-fix when possible
4. **Validate configs** - Ensure `.eslintrc.json`, `.prettierrc`, `theme.json`, `block.json` are valid
5. **Test the build** - Run `wp-scripts build` to catch issues early
6. **Review WordPress standards** - Double-check against WordPress coding standards
7. **Ask for help** - Use the `/linting` skill with full error messages and config files

---

## Resources

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [wp-scripts Documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Block Themes Handbook](https://developer.wordpress.org/themes/block-themes/)
- [Plugin Handbook - Blocks](https://developer.wordpress.org/plugins/blocks/)

---

**Last Updated**: 2026-10-30
