const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

class GitManager {
  static async initialize(projectPath) {
    // Change to project directory
    const originalCwd = process.cwd();
    process.chdir(projectPath);

    try {
      // Initialize git repository
      await execa('git', ['init'], { stdio: 'pipe' });

      // Add all files
      await execa('git', ['add', '.'], { stdio: 'pipe' });

      // Create initial commit
      await execa('git', ['commit', '-m', 'Initial commit - Setup React Native project'], { stdio: 'pipe' });

    } catch (error) {
      throw new Error(`Failed to initialize Git repository: ${error.message}`);
    } finally {
      // Restore original working directory
      process.chdir(originalCwd);
    }
  }

  static async isGitAvailable() {
    try {
      await execa('git', ['--version'], { stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = GitManager;
