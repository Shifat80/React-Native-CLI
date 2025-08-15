const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PackageManagerDetector {
  static detect() {
    // Check for lock files in current directory
    const lockFiles = {
      'package-lock.json': 'npm',
      'yarn.lock': 'yarn',
      'pnpm-lock.yaml': 'pnpm',
      'bun.lockb': 'bun'
    };

    for (const [lockFile, manager] of Object.entries(lockFiles)) {
      if (fs.existsSync(path.join(process.cwd(), lockFile))) {
        return manager;
      }
    }

    // Check which package managers are available globally
    const managers = ['bun', 'pnpm', 'yarn', 'npm'];

    for (const manager of managers) {
      try {
        execSync(`${manager} --version`, { stdio: 'ignore' });
        return manager;
      } catch (error) {
        // Manager not found, continue to next
      }
    }

    // Default fallback
    return 'npm';
  }

  static getInstallCommand(packageManager) {
    const commands = {
      npm: 'npm install',
      yarn: 'yarn add',
      pnpm: 'pnpm add',
      bun: 'bun add'
    };
    return commands[packageManager] || 'npm install';
  }

  static getDevInstallCommand(packageManager) {
    const commands = {
      npm: 'npm install --save-dev',
      yarn: 'yarn add --dev',
      pnpm: 'pnpm add --save-dev',
      bun: 'bun add --dev'
    };
    return commands[packageManager] || 'npm install --save-dev';
  }
}

module.exports = PackageManagerDetector;
