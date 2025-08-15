#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

class CLITester {
  constructor() {
    this.testDir = path.join(__dirname, 'test-projects');
    this.tests = [
      {
        name: 'expo-typescript-basic',
        framework: 'expo',
        language: 'typescript',
        packages: []
      },
      {
        name: 'expo-javascript-full',
        framework: 'expo',
        language: 'javascript',
        packages: ['nativewind', 'react-navigation', 'zustand', 'axios']
      },
      {
        name: 'rn-cli-typescript-navigation',
        framework: 'rn-cli',
        language: 'typescript',
        packages: ['react-navigation', 'reanimated']
      }
    ];
  }

  async runTests() {
    console.log(chalk.cyan.bold('🧪 Running Setup RN CLI Tests\n'));

    // Clean test directory
    await fs.remove(this.testDir);
    await fs.ensureDir(this.testDir);

    for (const test of this.tests) {
      await this.runSingleTest(test);
    }

    console.log(chalk.green.bold('\n✅ All tests completed!'));
  }

  async runSingleTest(test) {
    console.log(chalk.yellow(`\n🔬 Testing: ${test.name}`));

    const projectPath = path.join(this.testDir, test.name);

    try {
      // Simulate CLI inputs
      const inputs = [
        test.framework,
        test.language,
        test.name,
        ...test.packages,
        '', // End package selection
        'n', // Don't init git
        'n', // Don't install deps
        'None' // No IDE
      ].join('\n');

      // Run CLI with simulated inputs
      process.chdir(this.testDir);
      execSync(`echo "${inputs}" | node ${path.join(__dirname, 'index.js')}`, {
        stdio: 'pipe',
        encoding: 'utf8'
      });

      // Verify project structure
      await this.verifyProjectStructure(projectPath, test);

      console.log(chalk.green(`✅ ${test.name} - PASSED`));

    } catch (error) {
      console.log(chalk.red(`❌ ${test.name} - FAILED`));
      console.log(chalk.red(`Error: ${error.message}`));
    }
  }

  async verifyProjectStructure(projectPath, test) {
    const expectedFiles = [
      'package.json',
      `App.${test.language === 'typescript' ? 'tsx' : 'jsx'}`,
      'src/screens/HomeScreen.' + (test.language === 'typescript' ? 'tsx' : 'jsx'),
      'src/components/ExampleComponent.' + (test.language === 'typescript' ? 'tsx' : 'jsx'),
      '.gitignore'
    ];

    for (const file of expectedFiles) {
      const filePath = path.join(projectPath, file);
      if (!await fs.pathExists(filePath)) {
        throw new Error(`Missing expected file: ${file}`);
      }
    }

    // Check for package-specific files
    if (test.packages.includes('nativewind')) {
      const tailwindConfig = path.join(projectPath, 'tailwind.config.js');
      if (!await fs.pathExists(tailwindConfig)) {
        throw new Error('Missing tailwind.config.js for NativeWind');
      }
    }

    if (test.packages.includes('react-navigation')) {
      const navigationIndex = path.join(projectPath, 'src/navigation/index.' + (test.language === 'typescript' ? 'ts' : 'js'));
      if (!await fs.pathExists(navigationIndex)) {
        throw new Error('Missing navigation index file');
      }
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new CLITester();
  tester.runTests().catch(console.error);
}

module.exports = CLITester;
