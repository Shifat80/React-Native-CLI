const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

class Logger {
  constructor(verbose = false) {
    this.verbose = verbose;
    this.logFile = null;
  }

  enableFileLogging(logPath) {
    this.logFile = logPath;
    // Ensure log directory exists
    fs.ensureDirSync(path.dirname(logPath));
  }

  info(message, data = null) {
    const formattedMessage = chalk.blue('ℹ ') + message;
    console.log(formattedMessage);
    this.writeToFile('INFO', message, data);
  }

  success(message, data = null) {
    const formattedMessage = chalk.green('✅ ') + message;
    console.log(formattedMessage);
    this.writeToFile('SUCCESS', message, data);
  }

  warning(message, data = null) {
    const formattedMessage = chalk.yellow('⚠️  ') + message;
    console.log(formattedMessage);
    this.writeToFile('WARNING', message, data);
  }

  error(message, data = null) {
    const formattedMessage = chalk.red('❌ ') + message;
    console.error(formattedMessage);
    this.writeToFile('ERROR', message, data);
  }

  debug(message, data = null) {
    if (this.verbose) {
      const formattedMessage = chalk.gray('🔍 ') + message;
      console.log(formattedMessage);
    }
    this.writeToFile('DEBUG', message, data);
  }

  step(step, total, message) {
    const progress = chalk.cyan(`[${step}/${total}]`);
    const formattedMessage = `${progress} ${message}`;
    console.log(formattedMessage);
    this.writeToFile('STEP', `${step}/${total} - ${message}`);
  }

  writeToFile(level, message, data = null) {
    if (!this.logFile) return;

    try {
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level,
        message,
        ...(data && { data })
      };

      const logLine = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(this.logFile, logLine);
    } catch (error) {
      // Fail silently for file logging errors
    }
  }

  printSeparator() {
    console.log(chalk.gray('─'.repeat(50)));
  }

  printHeader(title) {
    console.log('\n' + chalk.cyan.bold(`🚀 ${title}`) + '\n');
  }

  printSubHeader(title) {
    console.log(chalk.blue.bold(`📋 ${title}`));
  }
}

module.exports = Logger;
