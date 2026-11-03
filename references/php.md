# PHP linting

Specialized expertise in PHP static analysis, type checking, and WordPress coding standards for block themes and plugins.

## Supported Tools

- **PHPStan** - Static PHP analysis with configurable analysis levels (0-9)
- **PHP_CodeSniffer (PHPCS)** - WordPress Coding Standards enforcement
- **Psalm** - PHP type checking and type inference
- **WordPress Coding Standards (WPCS)** - WordPress-specific PHP rules

## Common Tasks

### Configure PHPStan Analysis Levels

PHPStan has analysis levels 0-9 (higher = stricter):

| Level | Focus | Use Case |
|-------|-------|----------|
| 0 | Basic syntax | Syntax errors only |
| 1 | Basic types | Undefined variables, wrong method calls |
| 2 | Return types | Return type mismatches |
| 3 | Property types | Property type errors |
| 4 | Class constants | Constant type errors |
| 5 | Union types | Handles union/mixed types |
| 6 | Advanced types | Generic types, strict handling |
| 7 | Strict nullable | Strict null/undefined handling |
| 8 | Strict mixed | No mixed types allowed |
| 9 | Bleeding edge | Future PHP features |

**WordPress projects**: Start at level 5-6, increase gradually

**Setup**:
```neon
# phpstan.neon
parameters:
  level: 5
  paths:
    - src/
    - functions.php
  excludePaths:
    - tests/
    - vendor/
```

### Debug Static Analysis Errors

When PHPStan reports errors like "undefined method" or "undefined property":

1. **Read error message carefully** - Shows exact file, line, and problem
2. **Understand context** - Is it a real error or a false positive?
3. **Check WordPress stubs** - WordPress functions might need phpstan-wordpress
4. **Fix the issue** - Add type hints, fix method calls, or suppress if false positive
5. **Test locally** - Run `vendor/bin/phpstan analyse` to verify

**Common false positives**:
- WordPress functions (need phpstan-wordpress)
- Dynamic properties
- Plugin hooks and filters
- Dynamic function calls

### Apply WordPress Coding Standards

Follow WordPress PHP conventions:

```php
// ✅ Good - snake_case for functions and variables
function register_my_block() {
  $block_args = array(
    'render_callback' => 'my_block_render'
  );
  register_block_type( 'my-plugin/my-block', $block_args );
}

// ✅ Good - WordPress function usage
$post = get_post( $post_id );
if ( $post ) {
  echo wp_kses_post( $post->post_content );
}

// ❌ Bad - camelCase for functions
function registerMyBlock() {}

// ❌ Bad - direct output without escaping
echo $user_input;
```

## Configuration Files

| File | Purpose | Analysis |
|------|---------|----------|
| `phpstan.neon` | PHPStan configuration | Static analysis levels, paths |
| `phpstan.dist.neon` | Distributed configuration | Shared with team/CI |
| `.phpcs.xml.dist` | PHPCS rules configuration | WordPress standards |

## Quick Reference

### "Call to undefined method" Error
→ Method doesn't exist on class or is dynamically called

**Fix**:
```php
// Bad: method_exists not checked
$obj->dynamicMethod();

// Good: verify method exists
if ( method_exists( $obj, 'dynamicMethod' ) ) {
  $obj->dynamicMethod();
}

// Or: add proper type hint
/** @var MyClass $obj */
$obj->realMethod();
```

### "Property is undefined" Error
→ Accessing property that doesn't exist

**Fix**:
```php
// Bad: property_exists not checked
$value = $post->custom_property;

// Good: use WordPress helpers
$value = get_post_meta( $post->ID, 'custom_field', true );

// Or: add type definition
/**
 * @property string $custom_property
 */
class MyClass {}
```

### "Method signature mismatch" Warning
→ Method parameter count or types don't match parent/interface

**Fix**:
```php
// Ensure hook callbacks match expected signature
// WordPress hooks expect: function( $value, $arg2 = null )
add_filter( 'my_filter', function( $value ) {
  return $value;  // Must accept first parameter
});
```

### Install WordPress Stubs
→ PHPStan doesn't recognize WordPress functions
```bash
composer require --dev phpstan/phpstan-wordpress

# Add to phpstan.neon:
includes:
  - vendor/phpstan/phpstan-wordpress/extension.neon
```

## WordPress-Specific

For WordPress block themes and plugins:

- **Block themes (functions.php)** - Minimal PHP, mostly theme setup
- **Block plugins (plugin.php)** - More PHP, block registration and hooks
- **PHPStan level 5-6** recommended for WordPress projects
- **WordPress stubs** (phpstan-wordpress) required for function recognition

### Block Theme PHP Pattern
```php
<?php
// Minimal functions.php for block theme
function my_theme_setup() {
  add_theme_support( 'custom-logo' );
  add_theme_support( 'title-tag' );
}
add_action( 'after_setup_theme', 'my_theme_setup' );
```

### Block Plugin PHP Pattern
```php
<?php
/**
 * Plugin Name: My Block Plugin
 * Version: 1.0.0
 */

function register_my_block() {
  register_block_type( __DIR__ . '/src/blocks/my-block' );
}
add_action( 'init', 'register_my_block' );
```

---

**Parent Skill**: linting
