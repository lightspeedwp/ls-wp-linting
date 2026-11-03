# YAML linting

Specialized expertise in YAML/JSON linting, GitHub Actions workflow validation, and CI/CD configuration for WordPress development.

## Supported Tools

- **actionlint** - GitHub Actions workflow validation and error detection
- **Spectral** - JSON/YAML schema linting with OpenAPI support
- **yamllint** - YAML syntax validation and style checking
- **GitHub Actions Schema** - Official workflow syntax validation

## Common Tasks

### Debug GitHub Actions Workflow Errors

When workflows fail or GitHub shows validation errors:

1. **Identify error type** - Syntax, schema, or runtime?
2. **Check file location** - Workflows must be in `.github/workflows/`
3. **Validate YAML syntax** - Use actionlint or yamllint
4. **Check action syntax** - Verify step format and parameters
5. **Test locally** - Run actionlint before pushing

**Common issues**:
- Missing required fields (name, jobs, runs-on)
- Incorrect indentation (YAML is whitespace-sensitive)
- Wrong action names or parameters
- Invalid environment variable syntax

### Fix YAML Syntax Errors

YAML syntax errors are typically indentation or structure issues:

```yaml
# ✅ Good - proper YAML syntax
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

# ❌ Bad - wrong indentation
name: CI
on: push
jobs:
test:    # Wrong level of indentation
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v4
```

**Common causes**:
- Mixing tabs and spaces (use spaces only)
- Incorrect nesting depth
- Missing colons after keys
- Unclosed strings or structures

### Validate Workflow Parameters

Ensure workflow steps have correct parameters:

```yaml
# ✅ Correct action format
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'

# ❌ Wrong parameter format
- uses: actions/setup-node@v4
  with: node-version: '18'   # Invalid YAML

# ❌ Wrong parameter names
- uses: actions/setup-node@v4
  with:
    nodejs-version: '18'     # Should be 'node-version'
```

## Configuration Files

| File | Purpose | Validator | WordPress Use |
|------|---------|-----------|--------------|
| `.github/workflows/*.yml` | GitHub Actions workflows | actionlint | CI/CD linting, testing, deployment |
| `.github/actionlint.yaml` | actionlint configuration | YAML | Custom rule validation |
| `.github/workflows/lint.yml` | Example: linting workflow | actionlint | Check code quality |
| `.github/workflows/test.yml` | Example: test workflow | actionlint | Run tests in CI |

## Quick Reference

### "Field is not defined" Error
→ Missing required field in workflow or step

**Fix**:
```yaml
# Bad: missing 'runs-on'
jobs:
  test:
    steps:
      - run: npm test

# Good: include required fields
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

### "Invalid character" Error
→ YAML syntax issue (usually indentation or colon)

**Fix**:
```yaml
# Bad: tabs instead of spaces
jobs:
→test:      # Should be spaces
→  runs-on: ubuntu-latest

# Good: spaces for indentation
jobs:
  test:
    runs-on: ubuntu-latest
```

### "Unknown action" Error
→ Action doesn't exist or wrong version

**Fix**:
```bash
# Verify action exists on GitHub Marketplace
# Format: owner/repo@ref (e.g., actions/checkout@v4)

# Good: published action with tag
- uses: actions/checkout@v4

# Good: published action with SHA
- uses: actions/checkout@abc1234def5678

# Bad: wrong version
- uses: actions/checkout@master  # Should use @v4 or specific SHA
```

### "Cache path not found" Warning
→ Cache path doesn't exist or is empty

**Fix**:
```yaml
# Make sure cache path exists before caching
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'              # Caches node_modules based on package-lock.json

- run: npm ci                 # Installs, creates node_modules
- run: npm test
```

## GitHub Actions Patterns

### Basic WordPress Linting Workflow

```yaml
name: Linting

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
      
      - run: npm ci
      - run: npm run lint:js
      - run: npm run format:js -- --check
      - run: npm run lint:md
```

### WordPress Block Theme CI

```yaml
name: Theme Tests

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
      - run: npm ci
      - run: npm run lint:js
      - run: npm run format:js -- --check
  
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
```

### WordPress PHP Linting

```yaml
name: PHP Linting

on: [push, pull_request]

jobs:
  lint-php:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: php-actions/composer@v6
        with:
          php_version: '8.0'
      
      - run: vendor/bin/phpstan analyse
```

## Validate Locally

Before pushing workflows:

```bash
# Install actionlint
brew install actionlint    # macOS
# or choco install actionlint  # Windows

# Validate all workflows
actionlint .github/workflows/*.yml

# Validate single file
actionlint .github/workflows/lint.yml
```

---

**Parent Skill**: linting
