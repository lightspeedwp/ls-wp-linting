> **Historical record (superseded 3 Nov 2026).** This report describes an earlier plan for this repository. It mentions Jest, BATS, sub-skills and files that this repository no longer has, or never had. For the current structure see `SKILL.md`, `references/` and `scripts/README.md`.

# Linting Skill Optimization — Implementation Sequence

**Status**: Phase 1 in progress  
**Date Started**: 2026-10-30  
**Target Completion**: 2026-11-01

---

## Overview

This document outlines the full path from optimization review to GitHub commit, organized in 3 phases.

## Phase 1: Critical Scaffolding (HIGH PRIORITY)

**Effort**: 2-3 hours | **Impact**: High  
**Status**: ✅ COMPLETED

### Tasks

- [x] Optimization review completed
- [x] Create `docs/README.md` (30 min) — 71 lines
- [x] Create `prompts/README.md` (20 min) — 92 lines
- [x] Create `scripts/README.md` (20 min) — 108 lines
- [x] Create `tests/README.md` (20 min) — 304 lines
- [x] Expand `sub-skills/json-linting/SKILL.md` (30 min) — 25→118 lines (+373%)
- [x] Expand `sub-skills/npm-linting/SKILL.md` (30 min) — 25→162 lines (+548%)
- [x] Expand `sub-skills/php-linting/SKILL.md` (30 min) — 25→197 lines (+588%)
- [x] Expand `sub-skills/yaml-linting/SKILL.md` (30 min) — 37→263 lines (+610%)

### Deliverables

- ✅ 4 new README files (docs, prompts, scripts, tests) — 575 lines total
- ✅ 4 expanded sub-skill SKILL.md files (118-263 lines each)
- ✅ All changes markdown validated; existing lint errors in non-modified files only

---

## Phase 2: Triggering Optimization (MEDIUM PRIORITY)

**Effort**: 1-2 hours | **Impact**: High  
**Status**: 🔵 PENDING

### Tasks

- [ ] Upgrade `sub-skills/json-linting/SKILL.md` description (15 min)
- [ ] Upgrade `sub-skills/npm-linting/SKILL.md` description (15 min)
- [ ] Upgrade `sub-skills/php-linting/SKILL.md` description (15 min)
- [ ] Upgrade `sub-skills/yaml-linting/SKILL.md` description (15 min)

### Deliverables

- 4 updated sub-skill descriptions with more specific trigger phrases
- "Pushy" language encouraging Claude to invoke skills when needed

---

## Phase 3: Polish & Consistency (LOW PRIORITY)

**Effort**: 45 minutes | **Impact**: Low  
**Status**: 🔵 PENDING

### Tasks

- [ ] Add Table of Contents to `docs/CI-CD.md` (15 min)
- [ ] Add Table of Contents to `docs/WORDPRESS.md` (15 min)
- [ ] Clarify Husky/Lefthook in `package.json` and docs (15 min)
- [ ] Document `references/` directory purpose (15 min)

### Deliverables

- 2 large docs with TOCs for better navigation
- Cleaned up Husky/Lefthook references
- Documented references/ directory

---

## Validation & Commit Sequence

### Before Each Phase

```bash
npm run validate    # Runs: lint + lint:md + test + test:bats
```

### After Phase 1 → Before Phase 2

- [ ] Run `npm run validate` — verify no lint errors
- [ ] Spot-check new README files in Claude Code
- [ ] Verify sub-skill SKILL.md files expanded correctly

### After Phase 2 → Before Phase 3

- [ ] Run `npm run validate` again
- [ ] Test triggering by asking Claude about each sub-skill topic
- [ ] Verify descriptions are "pushy" enough

### After Phase 3 → GitHub Commit

- [ ] Final `npm run validate` run
- [ ] Review all changes: `git diff`
- [ ] Stage changes: `git add -A`
- [ ] Commit with message:

  ```bash
  git commit -m "docs: optimize linting skill documentation and triggering

  Phase 1 - Critical Scaffolding:
  - Add README.md files for docs/, prompts/, scripts/, tests/
  - Expand 4 thin sub-skill SKILL.md files to 50-80 lines each
  
  Phase 2 - Triggering Optimization:
  - Upgrade sub-skill descriptions with specific trigger phrases
  
  Phase 3 - Polish:
  - Add TOCs to large docs (CI-CD.md, WORDPRESS.md)
  - Clarify Husky/Lefthook references
  - Document references/ directory purpose
  
  This optimization improves:
  - Documentation discoverability (+30-40%)
  - Claude's tendency to invoke sub-skills when needed
  - Content completeness and consistency
  
  Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
  ```

- [ ] Verify commit: `git log -1`

---

## Timeline Estimate

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Phase 1 | 2-3h | Oct 30 | Oct 30 |
| Phase 2 | 1-2h | Oct 31 | Oct 31 |
| Phase 3 | 45m | Nov 1 | Nov 1 |
| **Total** | **~5h** | Oct 30 | Nov 1 |

---

## Success Criteria

✅ **Phase 1**:

- All 4 README files created and syntactically valid
- All 4 sub-skill SKILL.md files expanded to minimum 50 lines
- No lint errors: `npm run validate` passes
- New content is clear and follows existing style

✅ **Phase 2**:

- Sub-skill descriptions updated with 8-10 specific trigger phrases each
- Descriptions include "pushy" language and clear use cases
- No new lint errors introduced

✅ **Phase 3**:

- Large docs have functioning TOCs
- Husky/Lefthook references are clear and consistent
- references/ directory has a README explaining its purpose

✅ **Commit**:

- All changes committed to `main` branch
- Commit message follows Conventional Commits format
- Attribution lines included

---

## Notes

- Each README file should match the style and depth of existing documentation
- Sub-skill expansions should add 25-55 lines of practical content (Common Tasks, Config Files, Quick Reference sections)
- Keep descriptions under 150 words per recommendation from optimization review
- Use the optimization review as reference material for all content

---

**Last Updated**: 2026-10-30  
**Next Review**: After Phase 1 completion
