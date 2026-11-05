# JSON linting

Specialized expertise in JSON file validation, JSON5 support, and schema-based validation for WordPress projects.

## Supported Tools

- **JSON validators** - Native JSON5 syntax validation and parsing
- **JSON Schema** - Schema-based validation with proper error reporting
- **npm-pkg-json-lint** - package.json specific validation and best practices
- **Prettier** - JSON formatting and beautification

## Common Tasks

### Debug JSON Syntax Errors

When users encounter "Unexpected token" or parsing errors:

1. **Validate JSON structure** - Check for missing commas, trailing commas, or quote mismatches
2. **Test parsing** - Use `node -e "JSON.parse(require('fs').readFileSync('file.json'))"` to locate exact error
3. **Fix systematically** - Address JSON structure issues, verify nested object/array nesting
4. **Verify formatting** - Run through Prettier to ensure consistent style

**Common causes**:

- Missing commas between properties
- Trailing commas in objects/arrays (not allowed in JSON)
- Unescaped quotes or newlines in strings
- Unclosed braces or brackets

### Validate package.json Structure

Ensure package.json meets npm standards and WordPress project requirements:

- ✅ Required fields: `name`, `version`, `description`
- ✅ Proper semver format in version
- ✅ Valid script definitions
- ✅ Correct dependency vs. devDependency classification
- ✅ WordPress-specific fields (if block theme/plugin)

**Tools**: Use `npm-pkg-json-lint` or validate manually against [npm package.json schema](https://docs.npmjs.com/cli/configuring-npm/package-json)

### Fix JSON Schema Compliance

When JSON files must match a specific schema (like theme.json or block.json):

1. **Identify schema** - theme.json, block.json, or custom schema URL
2. **Get schema definition** - Check schema URL (e.g., schemas.wp.org for WordPress)
3. **Validate against schema** - Use JSON Schema validator
4. **Report differences** - Show which fields don't match required schema

## Configuration Files

| File | Purpose | Validator | When Needed |
|------|---------|-----------|------------|
| `package.json` | npm package metadata | npm-pkg-json-lint | Always (root-level) |
| `tsconfig.json` | TypeScript configuration | JSON Schema validator | TypeScript projects |
| `theme.json` | Block theme configuration | JSON Schema (wp schemas) | WordPress block themes |
| `block.json` | Block definition | JSON Schema (wp schemas) | WordPress blocks |
| `.prettierrc` | Prettier configuration | JSON validator | Formatting-dependent projects |
| Any `.json` | Custom config files | Native JSON validator | As needed |

## Quick Reference

### "Expected comma" Error

→ Check line before error for missing comma after property value

```json
{
  "name": "my-project"  // ← Missing comma here
  "version": "1.0.0"
}
```

### "Unexpected token }" Error

→ Usually a trailing comma before closing brace

```json
{
  "name": "my-project",  // ← Trailing comma not allowed in JSON
}
```

### "Unexpected end of JSON input" Error

→ Missing closing brace or bracket

```json
{
  "name": "my-project",
  "version": "1.0.0"
// ← Missing closing }
```

### Validate JSON Without Errors

```bash
# Test JSON syntax
node -e "JSON.parse(require('fs').readFileSync('package.json'))"

# If it returns without error, JSON is valid
# If it throws, the error message shows the problem
```

## WordPress-Specific

For WordPress block themes and plugins:

- **theme.json** - Validated against WordPress schemas; defines block theme configuration
- **block.json** - Validated against WordPress block schema; defines individual block metadata
- **package.json** - Must include `wp-scripts` or `wp-build` dependencies for linting integration

Test WordPress JSON files with:

```bash
npm run build    # WordPress tools validate JSON during build
```

---

**Parent Skill**: linting
