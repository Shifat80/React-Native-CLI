# Setup React Native CLI

A powerful CLI tool that automates the setup of React Native projects with popular packages and configurations.

## Features

- 🚀 **Multiple Frameworks**: Support for both React Native CLI and Expo
- 📝 **Language Choice**: JavaScript or TypeScript support
- 📦 **Package Manager Detection**: Automatically detects npm, yarn, pnpm, or bun
- 🧩 **Popular Packages**: Pre-configured setup for common React Native packages
- 🗂️ **Project Structure**: Creates organized `src/` folder structure
- 🔧 **Auto Configuration**: Automatic setup and configuration for selected packages
- 🔄 **Git Integration**: Optional Git repository initialization
- 💻 **IDE Integration**: Open project in VSCode or Cursor automatically

## Installation

### Global Installation
```bash
npm install -g setup-rn-cli
```

### Local Usage (npx)
```bash
npx setup-rn-cli
```

## Usage

Simply run the CLI and follow the interactive prompts:

```bash
setup-rn
```

## Supported Packages

### UI & Styling
- **NativeWind**: TailwindCSS for React Native with automatic configuration
- **Expo Vector Icons**: Icon library (Expo) or React Native Vector Icons (CLI)

### Navigation
- **React Navigation**: Complete navigation solution with Stack and Bottom Tab navigators

### State Management
- **Zustand**: Lightweight state management with example store
- **React Query**: Server state management with TanStack Query

### Backend & Services
- **Firebase**: Complete Firebase setup with authentication and Firestore
- **Axios**: HTTP client for API calls

### Storage & Animation
- **AsyncStorage**: Persistent local storage
- **Reanimated**: High-performance animations
- **Lottie**: After Effects animations

## Project Structure

The CLI creates a well-organized project structure:

```
your-project/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── assets/         # Images, fonts, etc.
│   ├── hooks/          # Custom React hooks
│   ├── context/        # React Context providers
│   ├── utils/          # Utility functions
│   ├── services/       # API services
│   ├── types/          # TypeScript type definitions
│   └── store/          # State management
├── App.tsx/jsx         # Main App component
└── ...                 # Standard RN/Expo files
```

## Package Manager Support

The CLI automatically detects your preferred package manager:
- **npm** (default fallback)
- **yarn**
- **pnpm**
- **bun**

Detection is based on lock files in the current directory or globally available package managers.

## Examples

### Create a TypeScript Expo project with NativeWind and React Navigation:
```bash
setup-rn
# Select: Expo, TypeScript, enter project name
# Check: NativeWind, React Navigation
# Choose: Yes to Git, Yes to install dependencies
```

### Create a JavaScript React Native CLI project with Firebase and Zustand:
```bash
setup-rn
# Select: React Native CLI, JavaScript, enter project name
# Check: Firebase, Zustand, AsyncStorage
# Choose: Yes to Git, Yes to install dependencies, VSCode
```

## Package-Specific Configurations

### NativeWind
- Creates `tailwind.config.js` configured for React Native
- Sets up `global.css` with Tailwind directives
- Updates `babel.config.js` with NativeWind plugin

### React Navigation
- Installs all required navigation dependencies
- Creates navigation structure with Stack and Tab navigators
- Sets up proper TypeScript types (if TypeScript is selected)

### Firebase
- **Expo**: Sets up Firebase v9 SDK with auth and firestore
- **React Native CLI**: Configures React Native Firebase with helper functions
- Creates `src/config/firebase.js` with initialization code

### Zustand
- Creates example store in `src/store/useStore.js`
- Includes TypeScript interfaces (if TypeScript is selected)
- Provides usage examples

### React Query
- Sets up QueryClient with sensible defaults
- Creates provider component
- Includes example query hook

## Development

### Local Development
```bash
git clone <repository>
cd setup-rn-cli
npm install
npm link
```

### Testing
```bash
# Test the CLI locally
setup-rn
```

## Requirements

- Node.js 14.0.0 or higher
- npm, yarn, pnpm, or bun
- Git (optional, for repository initialization)
- React Native development environment (for React Native CLI projects)
- Expo CLI (for Expo projects)

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing issues for solutions
- Refer to React Native or Expo documentation for framework-specific questions
