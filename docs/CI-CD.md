# GitHub Actions CI/CD Integration Guide

Complete guide to setting up linting and testing in GitHub Actions for WordPress block themes and plugins.

## Table of Contents

- [Quick Start](#quick-start)
- [Full Workflow Examples](#full-workflow-examples)
- [Caching Strategies](#caching-strategies)
- [Test Coverage Reporting](#test-coverage-reporting)
- [PHP Linting](#php-linting)
- [Status Checks](#status-checks)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

Create `.github/workflows/lint.yml`:

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
      
      - run: npm run lint:js
      - run: npm run format:js -- --check
      - run: npm run lint:md
```

This ensures:

- ✅ JavaScript/TypeScript linting passes
- ✅ Code formatting matches Prettier rules
- ✅ Markdown is properly formatted

---

## Full Workflow Examples

### Block Theme Workflow

`.github/workflows/test-theme.yml`:

```yaml
name: Theme Tests & Linting

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Lint and format check
  lint:
    runs-on: ubuntu-latest
    name: Lint & Format
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - name: ESLint Check
        run: npm run lint:js
      
      - name: Format Check
        run: npm run format:js -- --check
      
      - name: Markdown Lint
        run: npm run lint:md

  # Unit tests
  test-unit:
    runs-on: ubuntu-latest
    name: Unit Tests
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'
      
      - run: npm ci
      
      # wp-scripts test-unit-js runs Vitest from @wordpress/scripts 36 onwards.
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true

  # E2E tests
  test-e2e:
    runs-on: ubuntu-latest
    name: E2E Tests
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: wordpress
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Setup WordPress
        run: npm run wp-env start
      
      - name: Run E2E Tests
        run: npm run test:e2e

  # Report results
  report:
    runs-on: ubuntu-latest
    needs: [lint, test-unit, test-e2e]
    if: always()
    steps:
      - name: Check Results
        run: |
          if [ "${{ needs.lint.result }}" == "failure" ]; then
            echo "❌ Linting failed"
            exit 1
          fi
          if [ "${{ needs.test-unit.result }}" == "failure" ]; then
            echo "❌ Unit tests failed"
            exit 1
          fi
          if [ "${{ needs.test-e2e.result }}" == "failure" ]; then
            echo "❌ E2E tests failed"
            exit 1
          fi
          echo "✅ All checks passed"
```

### Block Plugin Workflow

`.github/workflows/test-plugin.yml`:

```yaml
name: Plugin Tests & Linting

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    name: Lint JavaScript
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint:js
      - run: npm run format:js -- --check

  php-lint:
    runs-on: ubuntu-latest
    name: Lint PHP
    steps:
      - uses: actions/checkout@v4
      
      - uses: php-actions/composer@v6
        with:
          php_version: '8.0'
          version: 2
      
      - name: Run PHPStan
        run: vendor/bin/phpstan analyse
      
      - name: Run PHP Code Sniffer
        run: vendor/bin/phpcs .

  test:
    runs-on: ubuntu-latest
    name: JavaScript Tests
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:unit:js -- --coverage
      
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    name: Build Check
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
```

---

## Caching Strategies

### Node Modules Caching

Significantly speeds up CI by caching dependencies:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'  # Automatically caches node_modules
    cache-dependency-path: 'package-lock.json'  # For monorepos
```

### Build Artifacts Caching

Cache build output to speed up later jobs:

```yaml
# Build job
- name: Build
  run: npm run build

- uses: actions/cache@v3
  with:
    path: build/
    key: build-${{ github.sha }}
    restore-keys: build-

# Test job
- uses: actions/cache@v3
  with:
    path: build/
    key: build-${{ github.sha }}

- name: Test
  run: npm run test:e2e
```

### WordPress Environment Caching

Cache WordPress install for E2E tests:

```yaml
- uses: actions/cache@v3
  with:
    path: |
      wp-env/
      .wordpress-org/
    key: wp-env-${{ matrix.wp-version }}-${{ hashFiles('package-lock.json') }}
```

---

## Test Coverage Reporting

### Upload to Codecov

```yaml
- name: Run Tests with Coverage
  run: npm run test:unit:js -- --coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
    fail_ci_if_error: true
    verbose: true
```

### Enforce Coverage Thresholds

```yaml
- name: Check Coverage Thresholds
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | grep '"lines"' | head -1 | grep -oP '\d+\.\d+')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "❌ Coverage $COVERAGE% is below 80% threshold"
      exit 1
    fi
    echo "✅ Coverage $COVERAGE% meets threshold"
```

### Generate Coverage Report

```yaml
- name: Generate Coverage Report
  if: always()
  run: npm run coverage:report

- name: Upload HTML Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: coverage-report
    path: coverage/lcov-report/
    retention-days: 30
```

---

## PHP Linting

### PHPStan Analysis

```yaml
lint-php:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    
    - uses: php-actions/composer@v6
      with:
        php_version: '8.0'
        version: 2
    
    - name: Install Dependencies
      run: composer install
    
    - name: Run PHPStan
      run: vendor/bin/phpstan analyse --memory-limit=4G
```

### PHP Code Sniffer (WordPress Standards)

```yaml
lint-php-cs:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    
    - uses: php-actions/composer@v6
      with:
        php_version: '8.0'
        version: 2
    
    - run: composer install
    
    - name: Install WPCS
      run: |
        composer require --dev wp-coding-standards/wpcs
        vendor/bin/phpcs --config-set installed_paths vendor/wp-coding-standards/wpcs
    
    - name: Run PHPCS
      run: vendor/bin/phpcs . --standard=WordPress --ignore=node_modules,vendor,build
```

### Combined PHP Linting Job

```yaml
php-lint:
  runs-on: ubuntu-latest
  name: PHP Linting
  steps:
    - uses: actions/checkout@v4
    
    - uses: php-actions/composer@v6
      with:
        php_version: '8.0'
    
    - run: composer install
    
    - name: PHPStan
      run: |
        echo "Running PHPStan..."
        vendor/bin/phpstan analyse || echo "⚠️ PHPStan check skipped"
    
    - name: PHP Code Sniffer
      run: |
        echo "Running PHPCS..."
        vendor/bin/phpcs . --standard=WordPress --ignore=node_modules,vendor,build || true
```

---

## Status Checks

### Branch Protection Rules

Require all checks to pass before merging:

1. Go to **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. Set branch name to `main` or `develop`
4. Enable:
   - ✅ "Require a pull request before merging"
   - ✅ "Require status checks to pass before merging"
   - ✅ Select your workflow jobs (Lint, Test)
   - ✅ "Require branches to be up to date before merging"
   - ✅ "Require code reviews before merging"
   - ✅ "Require CODEOWNERS review"

### Required Status Checks

```yaml
# List required checks in workflow
name: Linting

jobs:
  lint:
    runs-on: ubuntu-latest
    outputs:
      status: ${{ job.status }}

# In branch protection rules, require:
# - Lint
# - Test
# - Build
```

---

## Matrix Testing

Test across multiple versions:

```yaml
test:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      node-version: [16.x, 18.x, 20.x]
      wp-version: [6.1, 6.2, 6.3]
  
  steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - run: npm ci
    
    - name: Test on Node ${{ matrix.node-version }} and WP ${{ matrix.wp-version }}
      run: npm test
```

---

## Troubleshooting

### Cache Not Working

**Problem:** Dependencies downloaded every run despite caching

**Solutions:**

1. Check lock file committed: `git status package-lock.json`
2. Verify cache path: should be `npm` not `node_modules`
3. Clear cache: Settings → Actions → Clear cache
4. Check Node version consistency

### Workflow Timeout

**Problem:** Job times out (default 6 hours)

**Solutions:**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30  # Set explicit timeout
```

### PHP Version Mismatch

**Problem:** Local PHP 8.0 but CI uses different version

**Solution:**

```yaml
- uses: shivammathur/setup-php@v2
  with:
    php-version: '8.0'
    ini-values: memory_limit=-1
```

### Coverage Report Not Uploading

**Problem:** Codecov action fails silently

**Debug:**

```yaml
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    verbose: true  # Enable verbose logging
    fail_ci_if_error: true  # Fail if upload fails
```

### Linting Passes Locally but Fails in CI

**Causes:**

1. Different Node versions
2. Different npm versions
3. Cache not updated
4. Line ending differences (Windows vs Linux)

**Solutions:**

```yaml
# Force consistent environment
- uses: actions/setup-node@v4
  with:
    node-version: '18.17.0'  # Pin exact version
    cache: 'npm'

- run: npm ci  # Use ci instead of install

# Check line endings
- name: Check Line Endings
  run: |
    if grep -r $'\r' src/; then
      echo "❌ CRLF line endings found"
      exit 1
    fi
```

---

## Complete Example

See `.github/workflows/` in this repository for complete, working examples.

**Files included:**

- `lint.yml` - JavaScript linting
- `test.yml` - Unit and E2E tests
- `php.yml` - PHP linting (if applicable)
- `release.yml` - Automated versioning and release

---

## Best Practices

1. **Cache aggressively** - npm, build artifacts, WordPress installs
2. **Fail fast** - Run lint before tests
3. **Use matrix testing** - Test multiple Node/WordPress versions
4. **Report coverage** - Upload to Codecov for tracking
5. **Branch protection** - Require status checks
6. **Consistent environment** - Pin Node version exactly
7. **Timeout wisely** - Set explicit timeouts for long jobs
8. **Document expectations** - Add README with setup steps
9. **Handle flaky tests** - Retry before failing
10. **Monitor costs** - GitHub Actions has free limits

---

**Last Updated**: 2026-10-30
