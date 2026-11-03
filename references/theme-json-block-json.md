# theme.json and block.json validation

Schema validation for block theme `theme.json` (and style variations) and block `block.json` files.

## Point each file at its schema

Editors such as VS Code validate and autocomplete as you type once the file names its schema:

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3
}
```

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "lightspeed/hero"
}
```

Use `trunk` to follow the latest WordPress, or a version path such as `https://schemas.wp.org/wp/6.8/theme.json` to match the minimum WordPress version the project supports.

## Validate from the command line or CI

Both schemas are JSON Schema draft-07. `ajv-cli` validates them; download the schema first, because `ajv-cli` does not fetch remote schemas:

```bash
curl -sL https://schemas.wp.org/trunk/theme.json -o /tmp/theme.schema.json
npx ajv-cli@5 validate -s /tmp/theme.schema.json -d theme.json --spec=draft7 --strict=false --all-errors

curl -sL https://schemas.wp.org/trunk/block.json -o /tmp/block.schema.json
npx ajv-cli@5 validate -s /tmp/block.schema.json -d "src/**/block.json" --spec=draft7 --strict=false
```

- `--strict=false` is needed because the WordPress schemas use keywords that Ajv's strict mode rejects.
- Validate style variations (`styles/*.json`) against the same `theme.json` schema.
- `must NOT have additional properties` means a key the schema doesn't know: usually a typo, or a key from a newer WordPress than the schema version you chose.

## What the schema does not catch

- Preset slugs referenced elsewhere (`var:preset|color|primary`, `--wp--preset--color--primary`) that don't exist in `settings`.
- Block names in `styles.blocks` that aren't registered.
- `version` mismatches: version 3 changes some defaults, such as `settings.typography.defaultFontSizes` and spacing size generation.

Check these by reading `theme.json` alongside the templates, patterns and stylesheets that use it. For theme.json structure and design guidance, use the `wp-block-themes` skill; for block registration, use `wp-block-development`.

## Sources

- [theme.json schema](https://schemas.wp.org/trunk/theme.json) and [block.json schema](https://schemas.wp.org/trunk/block.json)
- [Global settings and styles (theme.json)](https://developer.wordpress.org/block-editor/how-to-guides/themes/global-settings-and-styles/)
- [block.json metadata](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)
- [ajv-cli](https://github.com/ajv-validator/ajv-cli)
