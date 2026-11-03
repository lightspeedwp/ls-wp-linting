> **Note (3 Nov 2026).** Moved from the skill-local `.claude/instructions/` folder, which Claude Code does not read. The content is unchanged. Its tag and remote-branch deletion steps are an open review item (L-OBS-14 in the LS-4751 PRD); confirm before following them.

# Release Process

Step-by-step guide for releasing the linting skill.

## Pre-Release Checklist

- [ ] All tests passing (`npm run test:all`)
- [ ] All documentation updated and links verified
- [ ] CHANGELOG.md updated with new features/fixes
- [ ] Version bumped in `package.json`
- [ ] Git is clean (no uncommitted changes)
- [ ] On `main` branch and up-to-date with origin

## Release Steps

### 1. Prepare Release Branch

```bash
# Create release branch
git checkout -b release/v1.1.0

# Ensure you're on latest main
git pull origin main
```

### 2. Update Version

Follow Semantic Versioning (MAJOR.MINOR.PATCH):

```bash
# Update package.json version
npm version minor  # or major, patch

# This updates package.json and creates a git tag
git log --oneline -1  # Verify the change
```

### 3. Update CHANGELOG.md

Add new section at top:

```markdown
## [1.1.0] - 2026-10-31

### Added
- New feature description
- Another feature

### Fixed
- Bug fix description

### Changed
- Breaking change or enhancement

### Docs
- Documentation updates
```

### 4. Update README.md

If version is referenced:
```bash
# Update if needed
sed -i '' 's/Version: .*/Version: 1.1.0/' README.md
```

### 5. Run Full Test Suite

```bash
npm run test:all
npm run lint
npm run lint:fix  # Auto-fix any issues
```

### 6. Commit Changes

```bash
git add package.json CHANGELOG.md README.md

git commit -m "chore: release v1.1.0

- Update version in package.json
- Update CHANGELOG.md with new features
- Verify all tests pass

Closes #123"
```

### 7. Create Pull Request

```bash
git push -u origin release/v1.1.0

# Create PR using GitHub CLI
gh pr create --title "Release: v1.1.0" \
  --body "Release v1.1.0 with new features and fixes.\n\nSee CHANGELOG.md for details."
```

Wait for:
- CI/CD to pass
- Code review approval
- All tests passing

### 8. Merge to Main

```bash
# After approval, merge the PR
gh pr merge --merge
```

### 9. Tag Release

```bash
# Pull latest main
git checkout main
git pull origin main

# Create GitHub release tag
git tag -a v1.1.0 -m "Release v1.1.0"

git push origin v1.1.0
```

### 10. Create GitHub Release

```bash
# Create release on GitHub
gh release create v1.1.0 \
  --title "v1.1.0" \
  --notes-file CHANGELOG.md
```

Or manually:
1. Go to https://github.com/lightspeedwp/linting/releases
2. Click "Draft a new release"
3. Tag version: `v1.1.0`
4. Title: `v1.1.0`
5. Description: Copy from CHANGELOG.md
6. Publish release

## Post-Release

### Verify Release
```bash
# Check GitHub release
gh release view v1.1.0

# Verify tag
git tag -l v1.1.0
```

### Update Next Development Version

```bash
# Switch to new branch for next development
git checkout -b develop/v1.2.0-dev

# Update version to next dev version
npm version prerelease

# Commit
git add package.json
git commit -m "chore: bump to v1.2.0-dev for next release"

git push -u origin develop/v1.2.0-dev
```

### Notify Team

Post in Slack/Teams:
> 🎉 **v1.1.0 Released**
> 
> New features:
> - Feature 1
> - Feature 2
>
> See https://github.com/lightspeedwp/linting/releases/tag/v1.1.0

## Troubleshooting

### Failed Release
If something goes wrong:

```bash
# Revert the tag
git tag -d v1.1.0
git push origin :refs/tags/v1.1.0

# Delete release branch
git branch -D release/v1.1.0
git push origin --delete release/v1.1.0

# Start over
git checkout main
git pull origin main
```

### Hotfix Release
For urgent fixes:

```bash
# Create hotfix branch from latest tag
git checkout -b hotfix/v1.1.1 v1.1.0

# Make fix
# ... edit files ...

# Run tests
npm run test:all

# Update version
npm version patch

# Commit and PR as normal
git add package.json CHANGELOG.md
git commit -m "fix: urgent fix for issue #456"

git push -u origin hotfix/v1.1.1
```

## Version Numbering

**Format**: MAJOR.MINOR.PATCH

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes to skill interface or sub-skills
  - Example: Renaming sub-skills, changing trigger behavior
  
- **MINOR** (1.0.0 → 1.1.0): New features, new sub-skills, non-breaking enhancements
  - Example: New linting tool support, improved docs
  
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, documentation, test improvements
  - Example: Fix config parsing, update docs

## Release Cadence

- **Patches**: As needed (hotfixes)
- **Minor releases**: Monthly or as features ready
- **Major releases**: Quarterly or as needed

---

**Last Updated**: 2026-10-31
