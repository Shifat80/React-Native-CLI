#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const execa = require('execa');

const PackageManagerDetector = require('./src/utils/packageManagerDetector');
const ProjectInitializer = require('./src/initializers/projectInitializer');
const DependencyInstaller = require('./src/installers/dependencyInstaller');
const FileGenerator = require('./src/generators/fileGenerator');
const GitManager = require('./src/utils/gitManager');
const IDELauncher = require('./src/utils/ideLauncher');
const ErrorHandler = require('./src/utils/errorHandler');
const Validator = require('./src/utils/validator');
const Logger = require('./src/utils/logger');
const ConfigManager = require('./src/utils/configManager');

class SetupRNCliApp {
  constructor() {
    this.packageManager = null;
    this.answers = {};
    this.projectPath = '';
    this.logger = new Logger(process.argv.includes('--verbose'));
    this.configManager = new ConfigManager();

    // Enable file logging if requested
    if (process.argv.includes('--log')) {
      const logPath = path.join(process.cwd(), 'setup-rn-cli.log');
      this.logger.enableFileLogging(logPath);
    }
  }  async run() {
    try {
      this.logger.printHeader('Welcome to Setup React Native CLI!');

      // Check system requirements
      await this.checkSystemRequirements();

      // Load user configuration
      const config = await this.configManager.loadConfig();

      // Detect package manager
      this.packageManager = PackageManagerDetector.detect();
      this.logger.info(`Detected package manager: ${this.packageManager}`);

      // Get user inputs
      this.answers = await this.promptUser(config);

      // Validate project name
      await this.validateInputs();

      // Set project path
      this.projectPath = path.resolve(process.cwd(), this.answers.projectName);

      // Check if directory exists
      await this.checkDirectoryExists();

      // Initialize project
      await this.initializeProject();

      // Setup project structure
      await this.setupProjectStructure();

      // Install selected packages
      await this.installSelectedPackages();

      // Configure selected packages
      await this.configurePackages();

      // Initialize Git if requested
      if (this.answers.initGit) {
        await this.initializeGit();
      }

      // Install dependencies if requested
      if (this.answers.installDependencies) {
        await this.installDependencies();
      }

      // Open in IDE if requested
      if (this.answers.openIDE !== 'None') {
        await this.openInIDE();
      }

      this.printSuccessMessage();

    } catch (error) {
      ErrorHandler.handle(error, 'CLI execution');
      process.exit(1);
    }
  }

  async checkSystemRequirements() {
    this.logger.info('Checking system requirements...');

    const requirements = await Validator.validateSystemRequirements();

    if (!requirements.node.compatible) {
      throw new Error('Node.js version 14.0.0 or higher is required');
    }

    this.logger.debug(`Node.js version: ${requirements.node.version}`);

    if (!requirements.git.available) {
      this.logger.warning('Git is not available. Git initialization will be skipped.');
    }
  }

  async validateInputs() {
    const nameValidation = Validator.validateProjectName(this.answers.projectName);

    if (!nameValidation.isValid) {
      throw new Error(`Invalid project name:\n${nameValidation.errors.join('\n')}`);
    }
  }

  async checkDirectoryExists() {
    const dirValidation = await Validator.validateDirectory(this.projectPath);

    if (dirValidation.exists && !dirValidation.isEmpty) {
      throw new Error(`Directory ${this.answers.projectName} already exists and is not empty!`);
    }
  }

  async promptUser(config) {
    return await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Which React Native framework would you like to use?',
        choices: [
          { name: 'Expo (Recommended for beginners)', value: 'expo' },
          { name: 'React Native CLI (More control, requires setup)', value: 'rn-cli' }
        ],
        default: config.defaultFramework || 'expo'
      },
      {
        type: 'list',
        name: 'language',
        message: 'Which language would you like to use?',
        choices: [
          { name: 'TypeScript (Recommended)', value: 'typescript' },
          { name: 'JavaScript', value: 'javascript' }
        ],
        default: config.defaultLanguage || 'typescript'
      },
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        validate: (input) => {
          const validation = Validator.validateProjectName(input);
          return validation.isValid || validation.errors[0];
        }
      },
      {
        type: 'checkbox',
        name: 'packages',
        message: 'Select packages to install:',
        choices: [
          { name: 'NativeWind (TailwindCSS for React Native)', value: 'nativewind' },
          { name: 'React Navigation (Stack + Bottom Tabs)', value: 'react-navigation' },
          { name: 'Axios (HTTP client)', value: 'axios' },
          { name: 'Zustand (State management)', value: 'zustand' },
          { name: 'Firebase', value: 'firebase' },
          { name: 'React Query (TanStack Query)', value: 'react-query' },
          { name: 'AsyncStorage', value: 'async-storage' },
          { name: 'Reanimated', value: 'reanimated' },
          { name: 'Expo Vector Icons', value: 'vector-icons' },
          { name: 'Lottie (Animations)', value: 'lottie' }
        ],
        default: config.defaultPackages || []
      },
      {
        type: 'confirm',
        name: 'initGit',
        message: 'Initialize Git repository?',
        default: config.defaultGitInit !== undefined ? config.defaultGitInit : true
      },
      {
        type: 'confirm',
        name: 'installDependencies',
        message: 'Install dependencies now?',
        default: config.defaultInstallDeps !== undefined ? config.defaultInstallDeps : true
      },
      {
        type: 'list',
        name: 'openIDE',
        message: 'Open project in IDE?',
        choices: [
          { name: 'VSCode', value: 'vscode' },
          { name: 'Cursor', value: 'cursor' },
          { name: 'None', value: 'None' }
        ],
        default: config.defaultIDE || 'None'
      }
    ]);
  }

  validateProjectName() {
    // This method is now handled in validateInputs()
    // Keeping for backwards compatibility
  }

  async initializeProject() {
    const spinner = ora('🏗️  Initializing React Native project...').start();
    try {
      await ErrorHandler.withRetry(async () => {
        await ProjectInitializer.initialize(this.answers, this.packageManager);
      });
      spinner.succeed('✅ Project initialized successfully!');
    } catch (error) {
      spinner.fail('❌ Failed to initialize project');
      throw error;
    }
  }

  async setupProjectStructure() {
    const spinner = ora('📁 Setting up project structure...').start();
    try {
      await FileGenerator.createProjectStructure(this.projectPath, this.answers);
      spinner.succeed('✅ Project structure created!');
    } catch (error) {
      spinner.fail('❌ Failed to create project structure');
      throw error;
    }
  }

  async installSelectedPackages() {
    if (this.answers.packages.length > 0) {
      const spinner = ora('📦 Installing selected packages...').start();
      try {
        await ErrorHandler.withRetry(async () => {
          await DependencyInstaller.installPackages(
            this.projectPath,
            this.answers.packages,
            this.packageManager,
            this.answers.framework
          );
        });
        spinner.succeed('✅ Packages installed successfully!');
      } catch (error) {
        spinner.fail('❌ Failed to install packages');
        throw error;
      }
    }
  }

  async configurePackages() {
    if (this.answers.packages.length > 0) {
      const spinner = ora('⚙️  Configuring packages...').start();
      try {
        await FileGenerator.configurePackages(this.projectPath, this.answers);
        spinner.succeed('✅ Packages configured successfully!');
      } catch (error) {
        spinner.fail('❌ Failed to configure packages');
        throw error;
      }
    }
  }

  async initializeGit() {
    const spinner = ora('🔧 Initializing Git repository...').start();
    try {
      await GitManager.initialize(this.projectPath);
      spinner.succeed('✅ Git repository initialized!');
    } catch (error) {
      spinner.fail('❌ Failed to initialize Git repository');
      this.logger.warning('Git initialization failed, but continuing...');
    }
  }

  async installDependencies() {
    const spinner = ora(`📦 Installing dependencies with ${this.packageManager}...`).start();
    try {
      process.chdir(this.projectPath);
      await ErrorHandler.withRetry(async () => {
        await execa(this.packageManager, ['install'], { stdio: 'pipe' });
      });
      spinner.succeed('✅ Dependencies installed successfully!');
    } catch (error) {
      spinner.fail('❌ Failed to install dependencies');
      throw error;
    }
  }

  async openInIDE() {
    const spinner = ora(`🚀 Opening project in ${this.answers.openIDE}...`).start();
    try {
      await IDELauncher.open(this.projectPath, this.answers.openIDE);
      spinner.succeed(`✅ Project opened in ${this.answers.openIDE}!`);
    } catch (error) {
      spinner.fail(`❌ Failed to open project in ${this.answers.openIDE}`);
      this.logger.warning('You can manually open the project in your preferred IDE');
    }
  }

  printSuccessMessage() {
    console.log(chalk.green.bold('\n🎉 Project created successfully!\n'));
    console.log(chalk.cyan('📁 Project location:'), this.projectPath);
    console.log(chalk.cyan('📦 Package manager:'), this.packageManager);
    console.log(chalk.cyan('🔧 Framework:'), this.answers.framework === 'expo' ? 'Expo' : 'React Native CLI');
    console.log(chalk.cyan('📝 Language:'), this.answers.language);

    if (this.answers.packages.length > 0) {
      console.log(chalk.cyan('📦 Installed packages:'), this.answers.packages.join(', '));
    }

    console.log(chalk.yellow.bold('\n🚀 Next steps:'));
    console.log(chalk.white(`  cd ${this.answers.projectName}`));

    if (!this.answers.installDependencies) {
      console.log(chalk.white(`  ${this.packageManager} install`));
    }

    if (this.answers.framework === 'expo') {
      console.log(chalk.white('  npx expo start'));
    } else {
      console.log(chalk.white('  npx react-native run-android'));
      console.log(chalk.white('  npx react-native run-ios'));
    }

    console.log(chalk.green.bold('\nHappy coding! 🎯\n'));
  }
}

// Run the CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  // Handle CLI arguments
  if (args.includes('--help') || args.includes('-h')) {
    console.log(chalk.cyan.bold('\n🚀 Setup React Native CLI\n'));
    console.log(chalk.white('Create React Native projects with popular packages and configurations.\n'));
    console.log(chalk.yellow.bold('Usage:'));
    console.log(chalk.white('  setup-rn [options]\n'));
    console.log(chalk.yellow.bold('Options:'));
    console.log(chalk.white('  --help, -h     Show help information'));
    console.log(chalk.white('  --version, -v  Show version number'));
    console.log(chalk.white('  --verbose      Enable verbose logging'));
    console.log(chalk.white('  --log          Enable file logging'));
    console.log(chalk.white('\nExamples:'));
    console.log(chalk.gray('  setup-rn                # Interactive mode'));
    console.log(chalk.gray('  setup-rn --verbose      # Verbose output'));
    console.log(chalk.gray('  setup-rn --log          # Save logs to file'));
    console.log(chalk.green.bold('\nHappy coding! 🎯\n'));
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    const packageJson = require('./package.json');
    console.log(chalk.cyan(`v${packageJson.version}`));
    process.exit(0);
  }


  const app = new SetupRNCliApp();
  app.run().catch((error) => {
    ErrorHandler.handle(error, 'CLI startup');
    process.exit(1);
  });
}

module.exports = SetupRNCliApp;