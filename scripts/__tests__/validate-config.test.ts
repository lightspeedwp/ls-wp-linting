import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CONFIG_FILES, ConfigValidator, ValidateConfigCli, nodeSyntaxChecker } from '../validate-config.ts';

const VALID_PACKAGE = '{"name":"x","version":"1.0.0","scripts":{}}';

describe('ValidateConfigCli', () => {
  let root: string;
  let lines: string[];
  const io = {
    log: (message: string) => lines.push(message),
    error: (message: string) => lines.push(message),
  };

  const write = (file: string, content: string) => writeFileSync(path.join(root, file), content);
  const run = (...argv: string[]) => new ValidateConfigCli(new ConfigValidator(root), root, io).run(argv);

  beforeEach(() => {
    root = mkdtempSync(path.join(os.tmpdir(), 'validate-config-'));
    lines = [];
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  // Characterisation: output matches the previous validate-config.js line for line.
  it('reports every tool valid with the previous output and exit code 0', () => {
    write('eslint.config.js', 'export default [];\n');
    write('.prettierrc.json', '{"semi":true}\n');
    write('.markdownlint.json', '{"default":true}\n');
    write('package.json', VALID_PACKAGE);

    expect(run()).toBe(0);
    expect(lines).toEqual([
      '🔍 Validating linting configuration files...\n',
      '✅ eslint: Config valid (JavaScript)',
      '   File: eslint.config.js',
      '✅ prettier: Config valid (JSON)',
      '   File: .prettierrc.json',
      '✅ markdownlint: Config valid (JSON)',
      '   File: .markdownlint.json',
      '✅ packageJson: Config valid (JSON)',
      '   File: package.json',
      '',
      '✅ All configurations are valid!',
    ]);
  });

  it('reports malformed JSON with the parser message, as before', () => {
    write('.prettierrc.json', '{"semi":');
    expect(run('prettier')).toBe(1);
    expect(lines).toEqual([
      '🔍 Validating linting configuration files...\n',
      '❌ prettier: Config invalid',
      '   File: .prettierrc.json',
      expect.stringMatching(/^ {3}Error: .*JSON/),
      '',
      '❌ Some configurations are invalid. See above for details.',
    ]);
  });

  it('reports a missing config file and fails, as before', () => {
    expect(run('eslint')).toBe(1);
    expect(lines).toContain(
      `⚠️  eslint: No config file found (searched: ${CONFIG_FILES.eslint.join(', ')})`,
    );
  });

  it('rejects an unknown tool, as before', () => {
    expect(run('nope')).toBe(1);
    expect(lines).toContain('Unknown tool: nope');
  });

  it('validates the first config file in search order', () => {
    write('eslint.config.cjs', 'module.exports = [];\n');
    write('.eslintrc.json', '{ not json');
    expect(run('eslint')).toBe(0);
    expect(lines).toContain('   File: eslint.config.cjs');
  });

  // Repairs (PRD L-REV-02, L-REV-03, L-REV-04).
  it('fails a JavaScript config with a syntax error even if it mentions export default', () => {
    write('eslint.config.js', '// export default\nconst = ;\n');
    expect(run('eslint')).toBe(1);
    expect(lines).toContain('❌ eslint: Config invalid');
    expect(lines.some((line) => /^ {3}Error: .*SyntaxError/.test(line))).toBe(true);
  });

  it('accepts a YAML config and says its syntax was not checked', () => {
    write('.prettierrc.yaml', 'semi: true\n');
    expect(run('prettier')).toBe(0);
    expect(lines).toContain('✅ prettier: Config valid (YAML)');
    expect(lines).toContain('   ⚠️  YAML syntax not checked: no YAML parser is bundled with this skill');
  });

  it('treats a YAML .prettierrc as YAML and a JSON one as JSON', () => {
    write('.prettierrc', 'semi: true\n');
    expect(run('prettier')).toBe(0);
    expect(lines).toContain('✅ prettier: Config valid (YAML)');

    lines = [];
    write('.prettierrc', '{"semi": true}');
    expect(run('prettier')).toBe(0);
    expect(lines).toContain('✅ prettier: Config valid (JSON)');
  });

  it('lists each missing package.json field instead of "Error: undefined"', () => {
    write('package.json', '{"description":"x"}');
    expect(run('packageJson')).toBe(1);
    expect(lines).toEqual(
      expect.arrayContaining([
        '   Issue: Missing "name" field',
        '   Issue: Missing "version" field',
        '   Issue: Missing "scripts" field',
      ]),
    );
    expect(lines.some((line) => line.includes('undefined'))).toBe(false);
  });

  it('reports malformed package.json', () => {
    write('package.json', '{');
    expect(run('packageJson')).toBe(1);
    expect(lines.some((line) => line.startsWith('   Error: '))).toBe(true);
  });

  it('reports a config that cannot be read', () => {
    // Point the lookup at a directory, which readFileSync cannot read.
    const validator = new ConfigValidator(root);
    vi.spyOn(validator, 'findConfigFile').mockReturnValue(root);
    expect(new ValidateConfigCli(validator, root, io).run(['eslint'])).toBe(1);
    expect(lines.some((line) => line.startsWith('❌ eslint: Error reading config - '))).toBe(true);
  });

  it('uses console output by default', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    write('package.json', VALID_PACKAGE);
    expect(new ValidateConfigCli(new ConfigValidator(root), root).run(['packageJson'])).toBe(0);
    expect(log).toHaveBeenCalledWith('✅ packageJson: Config valid (JSON)');
  });
});

describe('ConfigValidator', () => {
  it('uses the injected syntax checker for JavaScript configs', () => {
    const checker = vi.fn().mockReturnValue('SyntaxError: boom');
    const result = new ConfigValidator('/tmp', checker).validateFile('eslint', '/tmp/eslint.config.mjs', 'x');
    expect(checker).toHaveBeenCalledWith('/tmp/eslint.config.mjs');
    expect(result).toEqual({ valid: false, error: 'SyntaxError: boom' });
  });

  it('recognises tool keys', () => {
    expect(ConfigValidator.isTool('markdownlint')).toBe(true);
    expect(ConfigValidator.isTool('toString')).toBe(false);
  });
});

describe('nodeSyntaxChecker', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(os.tmpdir(), 'syntax-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('accepts valid JavaScript without running it', () => {
    const file = path.join(dir, 'ok.cjs');
    // Running this file would throw; a syntax check must not.
    writeFileSync(file, 'throw new Error("executed");\n');
    expect(nodeSyntaxChecker(file)).toBeUndefined();
  });

  it('returns the SyntaxError line for invalid JavaScript', () => {
    const file = path.join(dir, 'bad.mjs');
    writeFileSync(file, 'export default {\n');
    expect(nodeSyntaxChecker(file)).toMatch(/SyntaxError/);
  });

  it('falls back to a generic message when node reports no error line', () => {
    expect(nodeSyntaxChecker(path.join(dir, 'missing.js'))).toBeTypeOf('string');
  });
});
