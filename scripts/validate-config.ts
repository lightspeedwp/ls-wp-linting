/**
 * Validate this skill's linting configuration files.
 *
 * Usage:
 *   npx tsx scripts/validate-config.ts              # validate all
 *   npx tsx scripts/validate-config.ts eslint       # one tool: eslint, prettier, markdownlint, packageJson
 *
 * JavaScript configs are syntax-checked with `node --check`, which parses the
 * file without running it. JSON configs are parsed. YAML configs are found and
 * reported, but their syntax is not checked because no YAML parser is bundled.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export type ToolKey = 'eslint' | 'prettier' | 'markdownlint' | 'packageJson';

export interface ValidationResult {
  valid: boolean;
  format?: string;
  error?: string;
  issues?: string[];
  warnings?: string[];
}

/** Returns an error message when the file is not valid JavaScript, otherwise undefined. */
export type SyntaxChecker = (filePath: string) => string | undefined;

export const nodeSyntaxChecker: SyntaxChecker = (filePath) => {
  const result = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
  if (result.status === 0) {
    return undefined;
  }
  const lines = result.stderr.split('\n').map((line) => line.trim());
  return lines.find((line) => /Error/.test(line)) ?? 'JavaScript syntax check failed';
};

/** Search order matters: the first file found is the one validated. */
export const CONFIG_FILES: Record<ToolKey, readonly string[]> = {
  eslint: ['eslint.config.cjs', 'eslint.config.js', '.eslintrc.json', '.eslintrc.js'],
  prettier: ['.prettierrc', '.prettierrc.json', '.prettierrc.yaml', 'prettier.config.js'],
  markdownlint: ['.markdownlint.json', '.markdownlint.yaml', '.markdownlint-cli2.mjs'],
  packageJson: ['package.json'],
};

const JS_EXTENSIONS = new Set(['.js', '.cjs', '.mjs']);
const YAML_EXTENSIONS = new Set(['.yaml', '.yml']);

export class ConfigValidator {
  constructor(
    private readonly root: string,
    private readonly checkSyntax: SyntaxChecker = nodeSyntaxChecker,
  ) {}

  static isTool(tool: string): tool is ToolKey {
    return Object.hasOwn(CONFIG_FILES, tool);
  }

  findConfigFile(tool: ToolKey): string | null {
    for (const file of CONFIG_FILES[tool]) {
      const fullPath = path.join(this.root, file);
      if (existsSync(fullPath)) {
        return fullPath;
      }
    }
    return null;
  }

  /** Validates one config file by its format. */
  validateFile(tool: ToolKey, filePath: string, content: string): ValidationResult {
    if (tool === 'packageJson') {
      return this.validatePackageJson(content);
    }

    const extension = path.extname(filePath);
    if (JS_EXTENSIONS.has(extension)) {
      const error = this.checkSyntax(filePath);
      return error ? { valid: false, error } : { valid: true, format: 'JavaScript' };
    }

    // `.prettierrc` has no extension and may hold JSON or YAML.
    const looksLikeJson = extension !== '' || /^\s*[[{]/.test(content);
    if (YAML_EXTENSIONS.has(extension) || !looksLikeJson) {
      return {
        valid: true,
        format: 'YAML',
        warnings: ['YAML syntax not checked: no YAML parser is bundled with this skill'],
      };
    }

    try {
      JSON.parse(content);
      return { valid: true, format: 'JSON' };
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }
  }

  private validatePackageJson(content: string): ValidationResult {
    let pkg: Record<string, unknown>;
    try {
      pkg = JSON.parse(content) as Record<string, unknown>;
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }

    const issues: string[] = [];
    for (const field of ['name', 'version', 'scripts']) {
      if (!pkg[field]) {
        issues.push(`Missing "${field}" field`);
      }
    }
    return issues.length > 0 ? { valid: false, format: 'JSON', issues } : { valid: true, format: 'JSON' };
  }
}

export interface CliIO {
  log: (message: string) => void;
  error: (message: string) => void;
}

export class ValidateConfigCli {
  constructor(
    private readonly validator: ConfigValidator,
    private readonly root: string,
    private readonly io: CliIO = { log: console.log, error: console.error },
  ) {}

  /** Runs the CLI and returns the exit code. */
  run(argv: readonly string[]): number {
    const toolArg = argv[0];
    const tools = toolArg ? [toolArg] : (Object.keys(CONFIG_FILES) as ToolKey[]);

    this.io.log('🔍 Validating linting configuration files...\n');

    let allValid = true;
    for (const tool of tools) {
      if (!this.validateTool(tool)) {
        allValid = false;
      }
    }

    this.io.log('');
    if (allValid) {
      this.io.log('✅ All configurations are valid!');
      return 0;
    }
    this.io.log('❌ Some configurations are invalid. See above for details.');
    return 1;
  }

  private validateTool(tool: string): boolean {
    if (!ConfigValidator.isTool(tool)) {
      this.io.error(`Unknown tool: ${tool}`);
      return false;
    }

    const configPath = this.validator.findConfigFile(tool);
    if (!configPath) {
      this.io.log(`⚠️  ${tool}: No config file found (searched: ${CONFIG_FILES[tool].join(', ')})`);
      return false;
    }

    let content: string;
    try {
      content = readFileSync(configPath, 'utf8');
    } catch (error) {
      this.io.error(`❌ ${tool}: Error reading config - ${(error as Error).message}`);
      return false;
    }

    const result = this.validator.validateFile(tool, configPath, content);
    const relative = path.relative(this.root, configPath);

    if (result.valid) {
      this.io.log(`✅ ${tool}: Config valid (${result.format})`);
      this.io.log(`   File: ${relative}`);
      for (const warning of result.warnings ?? []) {
        this.io.log(`   ⚠️  ${warning}`);
      }
      return true;
    }

    this.io.log(`❌ ${tool}: Config invalid`);
    this.io.log(`   File: ${relative}`);
    if (result.error) {
      this.io.log(`   Error: ${result.error}`);
    }
    for (const issue of result.issues ?? []) {
      this.io.log(`   Issue: ${issue}`);
    }
    return false;
  }
}

const isEntryPoint = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isEntryPoint) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  process.exitCode = new ValidateConfigCli(new ConfigValidator(root), root).run(process.argv.slice(2));
}
