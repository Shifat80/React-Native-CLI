#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

class ReleasePrep {
  constructor() {
    this.projectRoot = __dirname;
  }

  async run() {
    console.log(chalk.cyan.bold('🚀 Preparing Setup React Native CLI for Release\n'));
    
    try {
      await this.checkPrerequisites();
      await this.runTests();
      await this.validatePackage();
      await this.testLocalInstallation();
      this.showReleaseInstructions();
    } catch (error) {
      console.error(chalk.red('❌ Release preparation failed:'), error.message);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    console.log(chalk.blue('📋 Checking prerequisites...'));
    
    // Check if git is clean
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        throw new Error('Git working directory is not clean. Commit your changes first.');
      }
      console.log(chalk.green('✅ Git working directory is clean'));
    } catch (error) {
      throw new Error('Git check failed: ' + error.message);
    }

    // Check if npm is logged in
    try {
      const user = execSync('npm whoami', { encoding: 'utf8' });
      console.log(chalk.green(`✅ Logged in to npm as: ${user.trim()}`));
    } catch (error) {
      throw new Error('Not logged in to npm. Run: npm login');
    }

    // Check Node.js version
    const nodeVersion = process.version;
    console.log(chalk.green(`✅ Node.js version: ${nodeVersion}`));
  }

  async runTests() {
    console.log(chalk.blue('\n🧪 Running tests...'));
    
    try {
      execSync('npm test', { stdio: 'inherit' });
      console.log(chalk.green('✅ All tests passed'));
    } catch (error) {
      throw new Error('Tests failed. Fix issues before releasing.');
    }
  }

  async validatePackage() {
    console.log(chalk.blue('\n📦 Validating package...'));
    
    // Check package.json
    const packageJson = await fs.readJson(path.join(this.projectRoot, 'package.json'));
    
    const requiredFields = ['name', 'version', 'description', 'main', 'bin', 'author', 'license'];
    for (const field of requiredFields) {
      if (!packageJson[field]) {
        throw new Error(`Missing required field in package.json: ${field}`);
      }
    }
    console.log(chalk.green('✅ package.json is valid'));

    // Check required files
    const requiredFiles = ['index.js', 'README.md', 'LICENSE', 'CHANGELOG.md'];
    for (const file of requiredFiles) {
      if (!await fs.pathExists(path.join(this.projectRoot, file))) {
        throw new Error(`Missing required file: ${file}`);
      }
    }
    console.log(chalk.green('✅ All required files present'));

    // Check shebang
    const indexContent = await fs.readFile(path.join(this.projectRoot, 'index.js'), 'utf8');
    if (!indexContent.startsWith('#!/usr/bin/env node')) {
      throw new Error('Missing or incorrect shebang in index.js');
    }
    console.log(chalk.green('✅ Shebang is correct'));
  }

  async testLocalInstallation() {
    console.log(chalk.blue('\n🔧 Testing local installation...'));
    
    try {
      // Create package
      execSync('npm pack', { stdio: 'pipe' });
      const packageJson = await fs.readJson(path.join(this.projectRoot, 'package.json'));
      const tarballName = `setup-rn-cli-${packageJson.version}.tgz`;
      
      // Test installation
      execSync(`npm install -g ./${tarballName}`, { stdio: 'pipe' });
      
      // Test CLI commands
      const versionOutput = execSync('setup-rn --version', { encoding: 'utf8' });
      console.log(chalk.green(`✅ CLI version check: ${versionOutput.trim()}`));
      
      const helpOutput = execSync('setup-rn --help', { encoding: 'utf8', stdio: 'pipe' });
      if (!helpOutput.includes('Usage:')) {
        throw new Error('Help command output seems incorrect');
      }
      console.log(chalk.green('✅ CLI help command works'));
      
      // Cleanup
      execSync('npm uninstall -g setup-rn-cli', { stdio: 'pipe' });
      await fs.remove(path.join(this.projectRoot, tarballName));
      
      console.log(chalk.green('✅ Local installation test passed'));
    } catch (error) {
      throw new Error('Local installation test failed: ' + error.message);
    }
  }

  showReleaseInstructions() {
    const packageJson = require(path.join(this.projectRoot, 'package.json'));
    
    console.log(chalk.green.bold('\n🎉 Ready for Release!'));
    console.log(chalk.cyan('\n📋 Release Steps:'));
    console.log(chalk.white('1. Update version (if needed):'));
    console.log(chalk.gray('   npm version patch  # for bug fixes'));
    console.log(chalk.gray('   npm version minor  # for new features'));
    console.log(chalk.gray('   npm version major  # for breaking changes'));
    
    console.log(chalk.white('\n2. Publish to npm:'));
    console.log(chalk.gray('   npm publish'));
    
    console.log(chalk.white('\n3. Create GitHub release:'));
    console.log(chalk.gray('   git push origin --tags'));
    
    console.log(chalk.white('\n4. Verify publication:'));
    console.log(chalk.gray('   npm info setup-rn-cli'));
    console.log(chalk.gray('   npm install -g setup-rn-cli'));
    console.log(chalk.gray('   setup-rn --version'));
    
    console.log(chalk.blue(`\n📊 Current version: ${packageJson.version}`));
    console.log(chalk.blue(`📦 Package name: ${packageJson.name}`));
    console.log(chalk.yellow('\n⚠️  Make sure to update CHANGELOG.md before releasing!'));
    console.log(chalk.green.bold('\nHappy releasing! 🚀\n'));
  }
}

// Run release preparation
if (require.main === module) {
  const prep = new ReleasePrep();
  prep.run().catch(console.error);
}

module.exports = ReleasePrep;
