# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-16

### Added
- 🚀 Initial release of Setup React Native CLI
- 📱 Support for both React Native CLI and Expo frameworks
- 📝 TypeScript and JavaScript project templates
- 📦 Automatic package manager detection (npm, yarn, pnpm, bun)
- 🧩 Pre-configured popular packages:
  - NativeWind (TailwindCSS for React Native)
  - React Navigation (Stack + Bottom Tabs)
  - Axios (HTTP client)
  - Zustand (State management)
  - Firebase (Authentication & Firestore)
  - React Query (TanStack Query)
  - AsyncStorage (Local storage)
  - Reanimated (Animations)
  - Expo Vector Icons / React Native Vector Icons
  - Lottie (After Effects animations)
- 🗂️ Organized project structure with `src/` folders
- 🔧 Automatic package configuration and setup
- 🔄 Optional Git repository initialization
- 💻 IDE integration (VSCode, Cursor)
- ⚙️ Interactive CLI with helpful prompts
- 🛡️ Comprehensive error handling and validation
- 📖 Detailed documentation and examples

### Features
- Interactive project setup wizard
- Automatic dependency installation
- Package-specific configuration files
- Project structure generation
- Git integration with initial commit
- IDE launcher integration
- Verbose logging and debugging options
- Configuration file support (.setuprc.json)
- Cross-platform compatibility (Windows, macOS, Linux)

### Supported Packages Configuration
- **NativeWind**: Auto-generates `tailwind.config.js` and `babel.config.js`
- **React Navigation**: Complete navigation setup with TypeScript types
- **Firebase**: Different configurations for Expo vs React Native CLI
- **Zustand**: Example store with TypeScript interfaces
- **React Query**: QueryClient setup with provider pattern

### Development
- Modular architecture with separate utilities
- Comprehensive test suite
- Production readiness checks
- Automated package manager detection
- System requirements validation
- Error handling with retry mechanisms
