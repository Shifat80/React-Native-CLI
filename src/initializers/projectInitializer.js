const execa = require('execa');
const path = require('path');

class ProjectInitializer {
  static async initialize(answers, packageManager) {
    const { projectName, framework, language } = answers;

    if (framework === 'expo') {
      await this.initializeExpo(projectName, language);
    } else {
      await this.initializeReactNativeCLI(projectName, language);
    }
  }

  static async initializeExpo(projectName, language) {
    const template = language === 'typescript' ? 'blank-typescript' : 'blank';

    try {
      await execa('npx', [
        'create-expo-app',
        projectName,
        '--template',
        template
      ], {
        stdio: 'pipe'
      });
    } catch (error) {
      throw new Error(`Failed to create Expo project: ${error.message}`);
    }
  }

  static async initializeReactNativeCLI(projectName, language) {
    const args = ['react-native', 'init', projectName];

    if (language === 'typescript') {
      args.push('--template', 'react-native-template-typescript');
    }

    try {
      await execa('npx', args, {
        stdio: 'pipe'
      });
    } catch (error) {
      throw new Error(`Failed to create React Native CLI project: ${error.message}`);
    }
  }
}

module.exports = ProjectInitializer;
