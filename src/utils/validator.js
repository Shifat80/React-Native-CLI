const fs = require('fs-extra');
const path = require('path');

class Validator {
  static validateProjectName(name) {
    const errors = [];

    if (!name || name.trim() === '') {
      errors.push('Project name cannot be empty');
    }

    if (name.includes(' ')) {
      errors.push('Project name cannot contain spaces');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      errors.push('Project name can only contain letters, numbers, hyphens, and underscores');
    }

    if (name.length < 2) {
      errors.push('Project name must be at least 2 characters long');
    }

    if (name.length > 100) {
      errors.push('Project name cannot be longer than 100 characters');
    }

    // Check for reserved names
    const reservedNames = [
      'node_modules', 'npm', 'yarn', 'pnpm', 'bun',
      'react', 'react-native', 'expo', 'android', 'ios',
      'src', 'lib', 'dist', 'build', 'public', 'assets'
    ];

    if (reservedNames.includes(name.toLowerCase())) {
      errors.push(`"${name}" is a reserved name and cannot be used`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static async validateDirectory(dirPath) {
    try {
      const exists = await fs.pathExists(dirPath);
      if (exists) {
        const stat = await fs.stat(dirPath);
        if (stat.isDirectory()) {
          const files = await fs.readdir(dirPath);
          return {
            exists: true,
            isEmpty: files.length === 0,
            files: files.length
          };
        }
      }
      return { exists: false, isEmpty: true, files: 0 };
    } catch (error) {
      return { exists: false, isEmpty: true, files: 0, error: error.message };
    }
  }

  static async validateSystemRequirements() {
    const requirements = {
      node: await this.checkNodeVersion(),
      git: await this.checkGitAvailability(),
      expo: await this.checkExpoAvailability(),
      reactNative: await this.checkReactNativeAvailability()
    };

    return requirements;
  }

  static async checkNodeVersion() {
    try {
      const version = process.version;
      const majorVersion = parseInt(version.slice(1).split('.')[0]);
      return {
        available: true,
        version: version,
        compatible: majorVersion >= 14
      };
    } catch (error) {
      return { available: false, compatible: false };
    }
  }

  static async checkGitAvailability() {
    try {
      const { execSync } = require('child_process');
      const version = execSync('git --version', { encoding: 'utf8' }).trim();
      return { available: true, version };
    } catch (error) {
      return { available: false };
    }
  }

  static async checkExpoAvailability() {
    try {
      const { execSync } = require('child_process');
      const version = execSync('npx expo --version', { encoding: 'utf8' }).trim();
      return { available: true, version };
    } catch (error) {
      return { available: false };
    }
  }

  static async checkReactNativeAvailability() {
    try {
      const { execSync } = require('child_process');
      execSync('npx react-native --version', { stdio: 'ignore' });
      return { available: true };
    } catch (error) {
      return { available: false };
    }
  }
}

module.exports = Validator;
