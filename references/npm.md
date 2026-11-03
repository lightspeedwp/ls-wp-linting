# npm linting

Specialized expertise in package.json validation, npm dependency management, and npm configuration optimization for WordPress development.

## Supported Tools

- **npm-pkg-json-lint** - Comprehensive package.json validation and linting
- **npm audit** - Dependency security vulnerability scanning and reporting
- **npm ls** - Dependency tree analysis and conflict detection
- **npm install/ci** - Dependency installation validation and lock file consistency

## Common Tasks

### Validate package.json Structure

Ensure package.json meets npm standards and WordPress project requirements:

1. **Check required fields**:
   - `name` - Unique package identifier
   - `version` - Semver format (major.minor.patch)
   - `description` - Package purpose
   - For WordPress: `scripts`, `devDependencies`

2. **Validate field values**:
   - Name: lowercase, hyphens only (no spaces/underscores)
   - Version: matches semver (e.g., 1.0.0, not v1.0.0)
   - Scripts: proper command syntax
   - Dependencies: valid package names and version ranges

3. **Check for common errors**:
   - Typos in dependency names
   - Invalid version specifiers
   - Conflicting script definitions
   - Missing fields for WordPress projects

### Debug Dependency Conflicts

When npm shows warnings like "peer dependency not found" or "version mismatch":

1. **Identify conflict** - Which dependencies are conflicting?
2. **Check versions** - Use `npm ls <package-name>` to see installed versions
3. **Review constraints** - Check package.json version specifiers
4. **Find compatible versions** - Search npm registry for compatible versions
5. **Update strategy** - Choose to update major version, minor, or patch

**Common causes**:
- ESLint/Prettier conflicts (need eslint-config-prettier)
- React version mismatches with plugins
- WordPress package version constraints
- Node version incompatibilities

### Audit Security Issues

Find and fix security vulnerabilities in dependencies:

```bash
npm audit              # Find vulnerabilities
npm audit fix          # Auto-fix where possible
npm audit fix --force  # Force major version updates (risky)
```

**Types of fixes**:
- **Low** - Can usually be ignored for development
- **Medium** - Should fix before deployment
- **High/Critical** - Must fix immediately

## Configuration Files

| File | Purpose | Validator | When Needed |
|------|---------|-----------|------------|
| `package.json` | npm project metadata | npm-pkg-json-lint | Always (root) |
| `package-lock.json` | Dependency lock file | npm ci (validates) | Production/CI |
| `.npmrc` | npm configuration | npm (reads) | Custom npm settings |

## Quick Reference

### "peer dependency not found" Warning
→ The dependency declares a peer dependency not installed
```bash
# Install the missing peer dependency
npm install peer-package-name --save-dev

# Or update version constraint in package.json
# Change: "eslint": "^8.0.0"
# To: "eslint": "^9.0.0" (if peer dep requires 9+)
```

### "cannot find module" Error
→ Dependency is declared but not installed
```bash
# Reinstall dependencies from lock file
npm ci  # Use instead of npm install in CI

# Or locally:
rm package-lock.json
npm install
```

### Version Conflict Between Dependencies
→ Two packages require incompatible versions
```bash
# Check what versions are installed
npm ls eslint

# Find compatible version
npm view eslint versions

# Update package.json to compatible range
# Change: "eslint": "^8.0.0"
# To: "eslint": "^8.50.0" (compatible with both)
```

### "npm ERR! audit severity" in CI
→ Security vulnerability found; fix required
```bash
npm audit
npm audit fix           # Auto-fix if possible
# If not fixable, escalate or use --force
```

## WordPress-Specific

For WordPress block themes and plugins:

- **Must-have deps**: `@wordpress/scripts` (themes) or `@wordpress/scripts` (plugins)
- **@wordpress/scripts** - Build, ESLint, stylelint, Prettier and test commands. From version 36, `test-unit-js` runs the project's own Vitest (install `vitest` and `vite`); Jest is only available through the maintenance-only `test-unit-jest`.
- **@wordpress/build** - Build tool for WordPress plugins
- **Standard devDeps**: `@wordpress/scripts`, `vitest`, `@testing-library/react` for component tests

**WordPress package.json structure**:
```json
{
  "name": "my-block-theme",
  "version": "1.0.0",
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "lint:js": "wp-scripts lint-js",
    "format:js": "wp-scripts format-js"
  },
  "devDependencies": {
    "@wordpress/scripts": "^27.0.0",
    "eslint": "^8.50.0"
  }
}
```

### Common WordPress package.json Issues

1. **Missing wp-scripts** → `npm install --save-dev @wordpress/scripts`
2. **Conflicting ESLint versions** → Use wp-scripts ESLint, not standalone
3. **Wrong version of wp-scripts** → Check theme/plugin documentation for required version
4. **Missing peer dependencies** → Install required npm packages explicitly

---

**Parent Skill**: linting
