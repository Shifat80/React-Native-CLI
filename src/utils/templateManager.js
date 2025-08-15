const fs = require('fs-extra');
const path = require('path');

class TemplateManager {
  static async createFromTemplate(templateName, outputPath, variables = {}) {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.template`);

    if (await fs.pathExists(templatePath)) {
      let content = await fs.readFile(templatePath, 'utf8');

      // Replace variables in template
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, value);
      }

      await fs.writeFile(outputPath, content);
      return true;
    }

    return false;
  }

  static getAvailableTemplates() {
    const templatesDir = path.join(__dirname, '..', 'templates');

    try {
      const files = fs.readdirSync(templatesDir);
      return files
        .filter(file => file.endsWith('.template'))
        .map(file => file.replace('.template', ''));
    } catch (error) {
      return [];
    }
  }
}

module.exports = TemplateManager;
