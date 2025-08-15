const chalk = require('chalk');

class ErrorHandler {
  static handle(error, context = '') {
    console.error(chalk.red.bold('\n❌ Error occurred:'));

    if (context) {
      console.error(chalk.red(`Context: ${context}`));
    }

    if (error.code) {
      console.error(chalk.red(`Code: ${error.code}`));
    }

    console.error(chalk.red(`Message: ${error.message}`));

    if (error.stack && process.env.DEBUG) {
      console.error(chalk.gray('\nStack trace:'));
      console.error(chalk.gray(error.stack));
    }

    // Provide helpful suggestions based on error type
    this.provideSuggestions(error);

    console.error(chalk.yellow('\n💡 Tips:'));
    console.error(chalk.yellow('  - Ensure you have the required dependencies installed'));
    console.error(chalk.yellow('  - Check your internet connection'));
    console.error(chalk.yellow('  - Try running with --verbose for more details'));
    console.error(chalk.yellow('  - Check the project documentation for troubleshooting'));
  }

  static provideSuggestions(error) {
    const message = error.message.toLowerCase();

    if (message.includes('command not found') || message.includes('spawn') && message.includes('enoent')) {
      console.error(chalk.yellow('\n💡 Suggestion: Make sure the required command is installed and available in your PATH'));
    }

    if (message.includes('network') || message.includes('timeout') || message.includes('fetch')) {
      console.error(chalk.yellow('\n💡 Suggestion: Check your internet connection and try again'));
    }

    if (message.includes('permission') || message.includes('eacces')) {
      console.error(chalk.yellow('\n💡 Suggestion: You might need to run with administrator privileges or check file permissions'));
    }

    if (message.includes('space') || message.includes('enospc')) {
      console.error(chalk.yellow('\n💡 Suggestion: Check available disk space'));
    }

    if (message.includes('git')) {
      console.error(chalk.yellow('\n💡 Suggestion: Make sure Git is installed and configured properly'));
    }
  }

  static async withRetry(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;

        console.log(chalk.yellow(`⚠️  Attempt ${i + 1} failed, retrying in ${delay}ms...`));
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

module.exports = ErrorHandler;
