# Setup React Native CLI - Project Structure

This document outlines the complete structure of the Setup React Native CLI project.

## 📁 Project Structure

```
setup-rn-cli/
├── 📄 package.json                 # Package configuration and dependencies
├── 📄 index.js                     # Main CLI entry point
├── 📄 README.md                    # Comprehensive documentation
├── 📄 LICENSE                      # MIT License
├── 📄 .setuprc.example.json        # Example configuration file
├── 📄 install.sh                   # Unix installation script
├── 📄 install.bat                  # Windows installation script
├── 📄 test.js                      # Automated testing script
├── 📄 PROJECT_STRUCTURE.md         # This file
│
└── 📁 src/                         # Source code directory
    ├── 📁 generators/              # File generation utilities
    │   └── 📄 fileGenerator.js     # Creates project files and configurations
    │
    ├── 📁 initializers/            # Project initialization
    │   └── 📄 projectInitializer.js # Handles RN CLI and Expo project creation
    │
    ├── 📁 installers/              # Package installation
    │   └── 📄 dependencyInstaller.js # Manages package installation
    │
    ├── 📁 templates/               # File templates
    │   └── 📄 app.template         # App component template
    │
    └── 📁 utils/                   # Utility modules
        ├── 📄 configManager.js     # User configuration management
        ├── 📄 errorHandler.js      # Error handling and retry logic
        ├── 📄 gitManager.js        # Git repository management
        ├── 📄 ideLauncher.js       # IDE integration (VSCode, Cursor)
        ├── 📄 logger.js            # Logging and output formatting
        ├── 📄 packageManagerDetector.js # Detects npm/yarn/pnpm/bun
        ├── 📄 templateManager.js   # Template processing
        └── 📄 validator.js         # Input validation and system checks
```

## 🔧 Core Components

### Main CLI (index.js)
- Entry point for the CLI application
- Handles command-line arguments and user interaction
- Orchestrates the entire project creation process
- Implements error handling and logging

### Package Manager Detection
- Automatically detects available package managers
- Supports npm, yarn, pnpm, and bun
- Uses lock files and global availability for detection

### Project Initialization
- **Expo**: Creates projects using `create-expo-app`
- **React Native CLI**: Creates projects using `react-native init`
- Supports both TypeScript and JavaScript templates

### File Generation
- Creates organized `src/` directory structure
- Generates boilerplate files for screens, components, navigation
- Creates configuration files for selected packages
- Handles TypeScript type definitions

### Package Installation & Configuration
- **NativeWind**: TailwindCSS for React Native
- **React Navigation**: Navigation with Stack and Tab navigators
- **Firebase**: Authentication and Firestore setup
- **Zustand**: State management with example store
- **React Query**: Server state management
- **Axios**: HTTP client configuration
- **AsyncStorage**: Local storage solution
- **Reanimated**: High-performance animations
- **Vector Icons**: Icon libraries (Expo/RN specific)
- **Lottie**: After Effects animations

## 🚀 Features

### Interactive Prompts
- Framework selection (Expo vs React Native CLI)
- Language choice (TypeScript vs JavaScript)
- Project name validation
- Package selection with checkboxes
- Git repository initialization
- Dependency installation options
- IDE integration (VSCode, Cursor)

### Automatic Configuration
- Package-specific setup and configuration
- Babel configuration for NativeWind
- Navigation structure for React Navigation
- Firebase configuration files
- State management setup
- TypeScript type definitions

### Error Handling
- Comprehensive error handling with user-friendly messages
- Retry mechanisms for network operations
- Graceful degradation when optional features fail
- Detailed logging for debugging

### System Integration
- Git repository initialization with initial commit
- IDE integration for immediate development
- Package manager detection and usage
- System requirements validation

## 📦 Package Dependencies

### Runtime Dependencies
- `inquirer`: Interactive command-line prompts
- `chalk`: Terminal string styling
- `ora`: Elegant terminal spinners
- `fs-extra`: Enhanced file system operations
- `execa`: Process execution utility

### Development Dependencies
- Node.js 14.0.0 or higher
- Git (optional, for repository initialization)
- Package manager (npm, yarn, pnpm, or bun)

## 🎯 Usage Patterns

### Basic Usage
```bash
setup-rn
```

### Advanced Usage
```bash
setup-rn --verbose --log
```

### Configuration File
Create `.setuprc.json` in your project directory:
```json
{
  "defaultFramework": "expo",
  "defaultLanguage": "typescript",
  "defaultPackages": ["nativewind", "react-navigation"],
  "defaultGitInit": true,
  "defaultInstallDeps": true,
  "defaultIDE": "vscode"
}
```

## 🧪 Testing

### Automated Tests
```bash
npm test
```

### Manual Testing
```bash
npm run test:manual
```

## 📚 Documentation

- **README.md**: User documentation and getting started guide
- **LICENSE**: MIT License details
- **PROJECT_STRUCTURE.md**: This technical overview
- Inline code documentation throughout the codebase

## 🔄 Development Workflow

1. **Local Development**: `npm link` to test locally
2. **Testing**: Run automated tests before publishing
3. **Publishing**: Standard npm publishing workflow
4. **Maintenance**: Regular updates for React Native ecosystem changes

## 🎉 Key Benefits

- **Zero Configuration**: Works out of the box with sensible defaults
- **Flexible**: Supports multiple frameworks and configurations
- **Extensible**: Easy to add new packages and templates
- **Reliable**: Comprehensive error handling and validation
- **User-Friendly**: Clear prompts and helpful error messages
- **Production-Ready**: Follows best practices for CLI tools
