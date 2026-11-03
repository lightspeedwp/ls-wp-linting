> **Note (3 Nov 2026).** This guide describes a Lefthook setup that this repository does not ship (there is no `lefthook.yml` here, and the Jest and BATS hooks it mentions were never added). For current Lefthook guidance for WordPress projects, see [references/lefthook-pre-commit.md](../references/lefthook-pre-commit.md).

# Lefthook Configuration Guide

This skill includes a comprehensive **lefthook** configuration that enforces linting and testing standards before commits and pushes.

## What is Lefthook?

[Lefthook](https://github.com/evilmartians/lefthook) is a fast, language-agnostic Git hooks framework written in Go. It enables parallel execution of pre-commit, commit-msg, pre-push, and post-merge hooks.

**Why Lefthook over Husky?**
- ⚡ **Faster** - Written in Go, runs hooks in parallel
- 🔧 **Simpler** - Single YAML config file, no extra dependencies
- 🎯 **More reliable** - Fewer environment issues across platforms
- 📝 **Better for monorepos** - Supports per-directory configs

## Installation

Lefthook installs automatically when you run:

```bash
npm install
```

The `prepare` script in `package.json` handles installation:

```bash
# Manual installation if needed
npm run lefthook:install
```

## Configuration Overview

The `lefthook.yml` file defines five hook types:

### 1. Pre-commit Hooks

Run **before** a commit is created. Validates and auto-fixes code.

**Hooks:**
- **eslint** - Lint JavaScript files, auto-fix enabled
- **prettier** - Format JS/JSON files, auto-fix enabled
- **markdownlint** - Validate markdown, auto-fix enabled
- **package-json** - Validate package.json syntax
- **jest-config** - Validate jest.config.js syntax
- **eslint-config** - Validate .eslintrc.json syntax
- **prettier-config** - Validate .prettierrc syntax
- **secrets** - Check for hardcoded secrets/API keys

**Example:**
```bash
# Automatically triggered when you run: git commit
# Files are linted, fixed in-place, and re-staged
```

### 2. Pre-push Hooks

Run **before** a push to remote. Ensures tests pass.

**Hooks:**
- **tests** - Run full Jest test suite
- **integration-tests** - Run Bats integration tests

**Example:**
```bash
# Triggered when you run: git push
# Full test suite must pass before push succeeds
```

### 3. Commit-msg Hook

Validates commit message format follows **Conventional Commits**.

**Format:**
```
type(scope): subject
```

**Valid types:** feat, fix, chore, docs, style, refactor, perf, test, ci, revert

**Examples:**
- ✅ `feat(eslint): add flat config support`
- ✅ `fix(prettier): resolve formatting conflicts`
- ✅ `chore(deps): update dependencies`
- ❌ `updated eslint config` (wrong format)

### 4. Post-merge Hook

Runs **after** a merge completes. Auto-installs dependencies if `package.json` changed.

**Example:**
```bash
# After: git pull origin main
# If package.json changed, automatically runs: npm install
```

### 5. Manual Commands

Available via `npm run lefthook -- run <command>`:

| Command | Description |
|---------|-------------|
| `validate-all` | Run full validation pipeline |
| `coverage` | Generate and open coverage report |
| `test-changed` | Run tests for changed files only |
| `test` | Run Jest and Bats tests |
| `help` | Show available npm scripts |

**Usage:**
```bash
npm run lefthook:validate      # Full validation
npm run lefthook -- run help    # Show available commands
```

## Usage

### Standard Workflow

```bash
# 1. Make changes
vim src/index.js

# 2. Stage files
git add .

# 3. Commit (pre-commit hooks run automatically)
git commit -m "feat(eslint): add support for flat config"
# Output: ✓ eslint passed
# Output: ✓ prettier formatted files
# Output: ✓ markdownlint passed
# Output: ✓ no secrets detected

# 4. Push (pre-push hooks run automatically)
git push origin my-feature
# Output: Running tests...
# Output: PASS  __tests__/linting.test.js (15.2s)
# Output: PASS  tests/javascript-linting.bats
```

### What Happens at Each Stage

**Pre-commit:**
1. ESLint checks JavaScript files
2. Prettier formats code (auto-fixes, re-stages)
3. markdownlint checks markdown files (auto-fixes)
4. Config files validated (no auto-fix, errors fail commit)
5. Secrets check scans for hardcoded credentials

**Commit message validation:**
- Enforces Conventional Commits format
- Rejects non-conforming messages with clear error

**Pre-push:**
- Full Jest test suite runs
- Bats integration tests run
- Push blocked if any tests fail

**Post-merge:**
- If `package.json` changed, `npm install` runs automatically

## Skipping Hooks

### Skip All Hooks

```bash
git commit --no-verify
git push --no-verify
```

### Skip Specific Situations

Hooks automatically skip during:
- Merge commits (`git merge`)
- Rebase commits (`git rebase`)
- Amend commits (`git commit --amend`)

## Configuration Details

### Pre-commit File Glob Patterns

Files are matched using glob patterns:

```yaml
glob: "**/*.{js,jsx}"              # Matches .js and .jsx files
exclude: "^(node_modules|dist)"    # Excludes directories
```

**Common patterns:**
- `**/*.js` - All JavaScript files
- `src/**/*.jsx` - JSX in src folder
- `__tests__/**/*` - Test files
- `*.md` - Markdown in root only
- `**/*.md` - Markdown everywhere

### Stage Fixed Files

```yaml
stage_fixed: true
```

When enabled, auto-fixed files are automatically re-staged for commit. Useful for formatters like Prettier and markdownlint.

## Troubleshooting

### Hooks Not Running

**Problem:** Pre-commit hooks not executing

**Solution:**
```bash
# Reinstall lefthook
npm run lefthook:install

# Verify installation
ls -la .lefthook/
# Should see: generated files and hooks
```

### Commit Blocked by Linting

**Problem:** Commit fails due to ESLint errors

**Solutions:**
```bash
# Auto-fix ESLint errors
npm run lint:fix

# Then try commit again
git add .
git commit -m "fix: resolve linting errors"
```

### Commit Message Rejected

**Problem:** "Commit message must follow Conventional Commits format"

**Solution:** Use proper format:
```bash
git commit -m "type(scope): subject"

# Examples:
git commit -m "feat(eslint): add flat config"
git commit -m "fix(prettier): resolve conflicts"
git commit -m "docs: update readme"
```

### Post-merge npm install Fails

**Problem:** `npm install` doesn't run after merge

**Reason:** Hooks skip during merge by default (to avoid conflicts)

**Manual fix:**
```bash
npm install  # Run manually after merge
```

### Performance Issues

**Problem:** Hooks taking too long

**Solution:** Lefthook runs hooks in parallel by default. To optimize:

```yaml
# In lefthook.yml
parallel: true  # Already enabled
```

Individual commands run sequentially, but different commands run in parallel.

## Advanced Configuration

### Custom Commands

Add custom hooks to `lefthook.yml`:

```yaml
pre-commit:
  commands:
    my-custom-check:
      glob: "**/*.js"
      run: my-check-script.sh {staged_files}
      stage_fixed: true
```

### Conditional Execution

Skip hooks based on branch:

```yaml
pre-push:
  commands:
    tests:
      run: npm test
      skip: [merge, rebase]
      only: [main, develop]  # Only on these branches
```

### Environment Variables

Pass env vars to hooks:

```yaml
env:
  NODE_ENV: test
  CI: true
```

## Integrating with CI/CD

Lefthook checks run locally. In CI, run the same commands:

```yaml
# .github/workflows/test.yml
- run: npm test
- run: npm run lint
- run: npm run test:bats
- run: git log -1 --oneline  # Validate commit msg format
```

## Best Practices

1. **Always fix auto-fixable issues:**
   ```bash
   npm run lint:fix
   npm run lint:md:fix
   ```

2. **Write clear commit messages:**
   ```bash
   git commit -m "feat(config): add new ESLint rule"
   # Not: "updated stuff"
   ```

3. **Don't skip hooks in normal development:**
   - Use `--no-verify` only when troubleshooting
   - Hooks catch issues early

4. **Keep hooks fast:**
   - Exclude large directories (node_modules, dist, coverage)
   - Run tests before pushing, not on every commit

5. **Document custom hooks:**
   - Add comments to `lefthook.yml`
   - Update this guide for team members

## Comparison with Alternatives

| Feature | Lefthook | Husky | pre-commit |
|---------|----------|-------|------------|
| Speed | ⚡⚡⚡ Fast (Go) | ⚡⚡ Medium (Node) | ⚡⚡ Medium (Python) |
| Config | YAML (simple) | JS (flexible) | YAML (complex) |
| Parallel | ✅ Yes | ❌ No | ✅ Yes |
| Setup | Auto-installs | Manual | Manual |
| Language | Go | Node | Python |

## References

- [Lefthook Documentation](https://github.com/evilmartians/lefthook)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

## Support

For issues:
1. Check `.lefthook-local.yml` for local overrides
2. Review error messages carefully
3. Run `npm run lefthook:help` to see available commands
4. Check logs in `.lefthook/` directory

---

**Last Updated:** 2026-10-30
