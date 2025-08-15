const execa = require('execa');
const path = require('path');

class DependencyInstaller {
  static async installPackages(projectPath, packages, packageManager, framework) {
    const packageMap = this.getPackageMap(framework);
    const dependencies = [];
    const devDependencies = [];

    for (const pkg of packages) {
      if (packageMap[pkg]) {
        dependencies.push(...packageMap[pkg].dependencies);
        if (packageMap[pkg].devDependencies) {
          devDependencies.push(...packageMap[pkg].devDependencies);
        }
      }
    }

    // Change to project directory
    process.chdir(projectPath);

    // Install regular dependencies
    if (dependencies.length > 0) {
      await this.runInstallCommand(packageManager, dependencies, false);
    }

    // Install dev dependencies
    if (devDependencies.length > 0) {
      await this.runInstallCommand(packageManager, devDependencies, true);
    }

    // Handle special cases that require additional setup
    for (const pkg of packages) {
      await this.handleSpecialPackages(pkg, packageManager, framework);
    }
  }

  static async runInstallCommand(packageManager, packages, isDev = false) {
    const commands = {
      npm: isDev ? ['install', '--save-dev'] : ['install'],
      yarn: isDev ? ['add', '--dev'] : ['add'],
      pnpm: isDev ? ['add', '--save-dev'] : ['add'],
      bun: isDev ? ['add', '--dev'] : ['add']
    };

    const args = [...commands[packageManager], ...packages];

    try {
      await execa(packageManager, args, { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`Failed to install packages: ${error.message}`);
    }
  }

  static async handleSpecialPackages(pkg, packageManager, framework) {
    switch (pkg) {
      case 'reanimated':
        if (framework === 'rn-cli') {
          // React Native CLI requires additional linking for Reanimated
          try {
            await execa('npx', ['react-native', 'link', 'react-native-reanimated'], { stdio: 'pipe' });
          } catch (error) {
            // Linking might fail in newer versions, but it's not critical
            console.warn('Warning: Automatic linking failed. Please follow manual setup instructions for Reanimated.');
          }
        }
        break;
      case 'vector-icons':
        if (framework === 'rn-cli') {
          try {
            await execa('npx', ['react-native', 'link', 'react-native-vector-icons'], { stdio: 'pipe' });
          } catch (error) {
            console.warn('Warning: Automatic linking failed for Vector Icons. Please follow manual setup instructions.');
          }
        }
        break;
    }
  }

  static getPackageMap(framework) {
    const isExpo = framework === 'expo';

    return {
      'nativewind': {
        dependencies: ['nativewind'],
        devDependencies: ['tailwindcss']
      },
      'react-navigation': {
        dependencies: isExpo
          ? [
              '@react-navigation/native',
              '@react-navigation/native-stack',
              '@react-navigation/bottom-tabs',
              'react-native-screens',
              'react-native-safe-area-context'
            ]
          : [
              '@react-navigation/native',
              '@react-navigation/native-stack',
              '@react-navigation/bottom-tabs',
              'react-native-screens',
              'react-native-safe-area-context',
              'react-native-gesture-handler'
            ]
      },
      'axios': {
        dependencies: ['axios']
      },
      'zustand': {
        dependencies: ['zustand']
      },
      'firebase': {
        dependencies: isExpo
          ? ['firebase', 'expo-firebase-core']
          : ['@react-native-firebase/app', '@react-native-firebase/auth', '@react-native-firebase/firestore']
      },
      'react-query': {
        dependencies: ['@tanstack/react-query']
      },
      'async-storage': {
        dependencies: isExpo
          ? ['@react-native-async-storage/async-storage']
          : ['@react-native-async-storage/async-storage']
      },
      'reanimated': {
        dependencies: isExpo
          ? ['react-native-reanimated']
          : ['react-native-reanimated']
      },
      'vector-icons': {
        dependencies: isExpo
          ? ['@expo/vector-icons']
          : ['react-native-vector-icons']
      },
      'lottie': {
        dependencies: isExpo
          ? ['lottie-react-native']
          : ['lottie-react-native']
      }
    };
  }
}

module.exports = DependencyInstaller;
