# 📋 Release Checklist for Setup React Native CLI

## Pre-Release Preparation

### 1. Code Quality & Testing
- [ ] All features implemented and working
- [ ] Code reviewed and cleaned up
- [ ] All console.log statements removed or replaced with proper logging
- [ ] No TODO comments in production code
- [ ] Run `npm test` - all tests pass
- [ ] Run `npm run prepare-release` - all checks pass
- [ ] Test CLI manually with different configurations

### 2. Documentation
- [ ] README.md is up to date with latest features
- [ ] CHANGELOG.md updated with new version changes
- [ ] All examples in documentation work correctly
- [ ] API documentation is accurate
- [ ] Installation instructions are correct

### 3. Package Configuration
- [ ] package.json version is correct
- [ ] package.json dependencies are up to date
- [ ] package.json keywords are comprehensive
- [ ] Author information is correct
- [ ] Repository URLs are correct
- [ ] .npmignore excludes unnecessary files
- [ ] Files listed in package.json "files" array are correct

### 4. Version Control
- [ ] All changes committed to git
- [ ] Working directory is clean (`git status`)
- [ ] On correct branch (main/master)
- [ ] Remote repository is up to date

### 5. NPM Setup
- [ ] Logged in to npm (`npm whoami`)
- [ ] Correct npm registry (`npm config get registry`)
- [ ] Package name is available (search npm)
- [ ] Have permission to publish (if scoped package)

## Release Process

### Step 1: Final Preparation
```bash
# Run comprehensive checks
npm run prepare-release

# Final test
npm test
```

### Step 2: Version Bump
Choose appropriate version bump:

```bash
# For bug fixes (1.0.0 → 1.0.1)
npm run version:patch

# For new features (1.0.0 → 1.1.0)  
npm run version:minor

# For breaking changes (1.0.0 → 2.0.0)
npm run version:major
```

### Step 3: Publish to NPM
```bash
# Publish to npm
npm publish

# For scoped packages (if applicable)
npm publish --access public
```

### Step 4: Verify Publication
```bash
# Check package info
npm info setup-rn-cli

# Test global installation
npm install -g setup-rn-cli
setup-rn --version
setup-rn --help

# Test with npx
npx setup-rn-cli --version
```

### Step 5: GitHub Release
```bash
# Push tags to trigger GitHub Actions
git push origin --tags

# Or create release manually on GitHub
```

## Post-Release

### 1. Verification
- [ ] Package appears on npm registry
- [ ] Global installation works: `npm install -g setup-rn-cli`
- [ ] CLI commands work: `setup-rn --version`, `setup-rn --help`
- [ ] NPX usage works: `npx setup-rn-cli`
- [ ] GitHub release created (if using actions)
- [ ] Documentation links work

### 2. Announcement
- [ ] Update repository README with latest version
- [ ] Post on social media (Twitter, LinkedIn, etc.)
- [ ] Announce in relevant communities (Reddit, Discord, etc.)
- [ ] Update personal/company website
- [ ] Add to portfolio/project list

### 3. Monitoring
- [ ] Monitor npm download stats
- [ ] Watch for GitHub issues
- [ ] Check for user feedback
- [ ] Monitor error reports (if analytics implemented)

## Emergency Rollback

If issues are discovered after release:

```bash
# Unpublish recent version (within 72 hours)
npm unpublish setup-rn-cli@1.0.0

# Or deprecate version
npm deprecate setup-rn-cli@1.0.0 "This version has issues, please upgrade"

# Publish hotfix
npm version patch
npm publish
```

## Commands Summary

### Complete Release Workflow
```bash
# 1. Prepare
npm run prepare-release

# 2. Version bump
npm run version:patch  # or minor/major

# 3. Publish  
npm publish

# 4. Verify
npm info setup-rn-cli
npm install -g setup-rn-cli
setup-rn --version
```

### Quick Release (for patches)
```bash
npm run prepare-release && npm run version:patch && npm publish
```

## Notes

- **First Release**: Extra testing recommended
- **Major Versions**: Consider pre-release versions (1.0.0-beta.1)
- **Breaking Changes**: Update major version and document migration
- **Security**: Never commit sensitive data or tokens
- **Backup**: Keep local backup of working version before publishing

## Support

After release, be prepared to:
- Respond to GitHub issues quickly
- Provide documentation updates
- Release patches for critical bugs
- Maintain backward compatibility when possible

---

**Remember**: Once published to npm, versions cannot be changed. Always test thoroughly!
