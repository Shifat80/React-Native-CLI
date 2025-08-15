const execa = require('execa');
const { execSync } = require('child_process');

class IDELauncher {
  static async open(projectPath, ide) {
    switch (ide.toLowerCase()) {
      case 'vscode':
        await this.openVSCode(projectPath);
        break;
      case 'cursor':
        await this.openCursor(projectPath);
        break;
      default:
        throw new Error(`Unsupported IDE: ${ide}`);
    }
  }

  static async openVSCode(projectPath) {
    try {
      // Try different possible VSCode commands
      const commands = ['code', 'code-insiders'];

      for (const command of commands) {
        try {
          await execa(command, [projectPath], { stdio: 'pipe' });
          return; // Success, exit
        } catch (error) {
          // Continue to next command
        }
      }

      throw new Error('VSCode command not found');
    } catch (error) {
      throw new Error(`Failed to open VSCode: ${error.message}`);
    }
  }

  static async openCursor(projectPath) {
    try {
      await execa('cursor', [projectPath], { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`Failed to open Cursor: ${error.message}`);
    }
  }

  static isIDEAvailable(ide) {
    try {
      const command = ide.toLowerCase() === 'vscode' ? 'code' : ide.toLowerCase();
      execSync(`${command} --version`, { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = IDELauncher;
