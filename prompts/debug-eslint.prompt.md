# Prompt: Debug ESLint Configuration Issues

Use this prompt when you need to debug and fix ESLint problems in a WordPress project.

## How to Use This Prompt

When you encounter ESLint errors or configuration issues, share:

1. The error message(s)
2. Your ESLint config file (`eslint.config.cjs` or `.eslintrc.json`)
3. Your `package.json` (scripts section)
4. Node version: `node --version`

Then use this prompt to guide the debugging process.

---

## Debugging Workflow

### Step 1: Identify the Issue

Ask yourself:

- Is this a config file syntax error?
- Is this a rule conflict (ESLint vs Prettier)?
- Is this a missing parser or plugin?
- Is this files not being linted at all?
- Is this a version mismatch?

### Step 2: Gather Information

Run these commands and share output:

```bash
# Check ESLint version
npx eslint --version

# Print resolved config for a specific file
npx eslint --print-config src/index.js | head -50

# Run with debug output
npm run lint -- --debug 2>&1 | head -100

# Check what files are being linted
npx eslint --list-files . | head -20

# Check what files are ignored
npx eslint . --debug 2>&1 | grep -i ignored
```

### Step 3: Check Configuration

1. **Config file exists**: `ls eslint.config.cjs .eslintrc.* 2>/dev/null`
2. **Config syntax valid**:
   - JSON: `cat .eslintrc.json | python -m json.tool`
   - JS: `node -c eslint.config.cjs`
3. **Paths correct**: Files in config match actual project structure
4. **Rules valid**: Check ESLint documentation for rule names

### Step 4: Test the Fix

```bash
# Lint a single file
npx eslint src/index.js --debug

# Lint with specific config
npx eslint . --config eslint.config.cjs

# Test ignore patterns
npx eslint --list-files | grep pattern-to-test

# Dry run (don't write changes)
npx eslint . --fix --dry-run
```

### Step 5: Verify the Solution

```bash
# Full lint should pass
npm run lint

# Format should work
npm run format:js

# No warnings
npm run lint -- --max-warnings 0
```

---

## Common Issues and Fixes

### "Config file not found"

- Create `eslint.config.cjs` (modern) or `.eslintrc.json` (legacy)
- Verify in project root
- Check file name spelling

### "Rule X is deprecated"

- Update ESLint: `npm install --save-dev eslint@latest`
- Find replacement in changelog
- Update all references in config

### "Cannot find module..."

- Install missing plugin: `npm install --save-dev plugin-name`
- Update package-lock: `npm install`
- Clear cache: `npm cache clean --force`

### "Files not linting"

- Check `.eslintignore` patterns
- Verify file extensions match config `files` pattern
- Check if file is in project root or subdirectory

### "Prettier conflicts"

- Install: `npm install --save-dev eslint-config-prettier`
- Load LAST in config
- Disable formatting rules in ESLint

---

## WordPress-Specific Checks

For WordPress projects:

1. **wp-scripts installed**: `grep @wordpress/scripts package.json`
2. **Config extends WordPress**: `grep @wordpress/eslint-config .eslintrc.json`
3. **Scripts exist**: `grep lint package.json`
4. **Ignore patterns**: Check `.eslintignore` for `node_modules`, `dist`, etc.

---

## When to Ask for Help

Provide:

1. Complete error message (not truncated)
2. Config file(s) (sanitized if needed)
3. `package.json` scripts section
4. Output of debug commands above
5. What you've already tried to fix

Then Claude can provide specific, targeted fixes.

---

**Last Updated**: 2026-10-30
