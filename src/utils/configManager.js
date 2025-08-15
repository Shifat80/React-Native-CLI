const fs = require('fs-extra');
const path = require('path');

class ConfigManager {
  constructor() {
    this.configPath = path.join(process.cwd(), '.setuprc.json');
  }

  async loadConfig() {
    try {
      if (await fs.pathExists(this.configPath)) {
        const config = await fs.readJson(this.configPath);
        return config;
      }
    } catch (error) {
      // Config file doesn't exist or is invalid, return defaults
    }

    return this.getDefaultConfig();
  }

  async saveConfig(config) {
    try {
      await fs.writeJson(this.configPath, config, { spaces: 2 });
    } catch (error) {
      console.warn('Warning: Could not save configuration file');
    }
  }

  getDefaultConfig() {
    return {
      defaultFramework: 'expo',
      defaultLanguage: 'typescript',
      defaultPackages: [],
      defaultGitInit: true,
      defaultInstallDeps: true,
      defaultIDE: 'None'
    };
  }
}

module.exports = ConfigManager;
