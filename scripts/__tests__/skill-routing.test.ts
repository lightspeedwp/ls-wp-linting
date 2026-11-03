// Guards the skill's routing: every relative link in SKILL.md and the
// reference files must resolve, and no nested SKILL.md may exist, because
// Claude Code does not load nested skills.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (relative: string) => readFileSync(path.join(root, relative), 'utf8');

/** Relative Markdown link targets, without anchors, external URLs or in-page links. */
function relativeLinks(markdown: string): string[] {
  const targets = [...markdown.matchAll(/\]\(([^)\s]+)\)/g)].map((match) => match[1]);
  return targets
    .filter((target) => !/^(https?:|mailto:|#)/.test(target))
    .map((target) => target.split('#')[0]);
}

function findSkillFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    if (entry === 'node_modules' || entry === '.git' || entry === 'coverage') {
      return [];
    }
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      return findSkillFiles(full);
    }
    return entry === 'SKILL.md' ? [path.relative(root, full)] : [];
  });
}

const referenceFiles = readdirSync(path.join(root, 'references')).filter((file) => file.endsWith('.md'));

describe('skill routing', () => {
  it('has exactly one SKILL.md, at the root', () => {
    expect(findSkillFiles(root)).toEqual(['SKILL.md']);
  });

  it('routes to every reference file', () => {
    const linked = new Set(relativeLinks(read('SKILL.md')).map((target) => path.normalize(target)));
    for (const file of referenceFiles.filter((name) => name !== 'README.md')) {
      expect(linked, `SKILL.md does not link references/${file}`).toContain(path.join('references', file));
    }
  });

  it.each(['SKILL.md', ...referenceFiles.map((file) => `references/${file}`)])(
    'resolves every relative link in %s',
    (file) => {
      const base = path.dirname(path.join(root, file));
      for (const target of relativeLinks(read(file))) {
        expect(existsSync(path.resolve(base, target)), `${file} links to missing ${target}`).toBe(true);
      }
    },
  );

  it('keeps reference files free of skill frontmatter', () => {
    for (const file of referenceFiles) {
      expect(read(`references/${file}`).startsWith('---\nname:'), file).toBe(false);
    }
  });
});
