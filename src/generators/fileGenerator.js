const fs = require('fs-extra');
const path = require('path');

class FileGenerator {
  static async createProjectStructure(projectPath, answers) {
    const { language } = answers;
    const ext = language === 'typescript' ? 'tsx' : 'jsx';
    const jsExt = language === 'typescript' ? 'ts' : 'js';

    // Create src directory structure
    const srcStructure = [
      'src',
      'src/components',
      'src/screens',
      'src/navigation',
      'src/assets',
      'src/hooks',
      'src/context',
      'src/utils',
      'src/services',
      'src/types',
      'src/store'
    ];

    for (const dir of srcStructure) {
      await fs.ensureDir(path.join(projectPath, dir));
    }

    // Create main App file
    await this.createAppFile(projectPath, answers);

    // Create example screen
    await this.createHomeScreen(projectPath, language, ext);

    // Create navigation index
    await this.createNavigationIndex(projectPath, language, jsExt);

    // Create .gitignore
    await this.createGitIgnore(projectPath);

    // Create example component
    await this.createExampleComponent(projectPath, language, ext);

    // Create types file if TypeScript
    if (language === 'typescript') {
      await this.createTypesFile(projectPath);
    }
  }

  static async createAppFile(projectPath, answers) {
    const { language, framework, packages } = answers;
    const ext = language === 'typescript' ? 'tsx' : 'jsx';
    const isTS = language === 'typescript';
    const hasNavigation = packages.includes('react-navigation');

    let imports = [];
    let content = [];

    // Base imports
    imports.push(`import React from 'react';`);

    if (hasNavigation) {
      imports.push(`import { NavigationContainer } from '@react-navigation/native';`);
      imports.push(`import AppNavigator from './src/navigation';`);
    } else {
      imports.push(`import { View, Text, StyleSheet, StatusBar } from 'react-native';`);
      imports.push(`import HomeScreen from './src/screens/HomeScreen';`);
    }

    if (packages.includes('nativewind')) {
      imports.push(`import './global.css';`);
    }

    // App component
    if (hasNavigation) {
      content.push(`const App${isTS ? ': React.FC' : ''} = () => {`);
      content.push(`  return (`);
      content.push(`    <NavigationContainer>`);
      content.push(`      <AppNavigator />`);
      content.push(`    </NavigationContainer>`);
      content.push(`  );`);
      content.push(`};`);
    } else {
      content.push(`const App${isTS ? ': React.FC' : ''} = () => {`);
      content.push(`  return (`);
      content.push(`    <View style={styles.container}>`);
      content.push(`      <StatusBar barStyle="dark-content" />`);
      content.push(`      <HomeScreen />`);
      content.push(`    </View>`);
      content.push(`  );`);
      content.push(`};`);
      content.push(``);
      content.push(`const styles = StyleSheet.create({`);
      content.push(`  container: {`);
      content.push(`    flex: 1,`);
      content.push(`  },`);
      content.push(`});`);
    }

    content.push(``);
    content.push(`export default App;`);

    const appContent = [...imports, '', ...content].join('\n');

    await fs.writeFile(path.join(projectPath, `App.${ext}`), appContent);
  }

  static async createHomeScreen(projectPath, language, ext) {
    const isTS = language === 'typescript';

    const content = `import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const HomeScreen${isTS ? ': React.FC' : ''} = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Setup React Native!</Text>
        <Text style={styles.subtitle}>Your project is ready to go 🚀</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
  },
});

export default HomeScreen;`;

    await fs.writeFile(path.join(projectPath, 'src', 'screens', `HomeScreen.${ext}`), content);
  }

  static async createNavigationIndex(projectPath, language, jsExt) {
    const isTS = language === 'typescript';

    const content = `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';

${isTS ? `
export type RootStackParamList = {
  Home: undefined;
  // Add more screen types here
};

export type TabParamList = {
  HomeTab: undefined;
  // Add more tab types here
};
` : ''}

const Stack = createNativeStackNavigator${isTS ? '<RootStackParamList>' : ''}();
const Tab = createBottomTabNavigator${isTS ? '<TabParamList>' : ''}();

const TabNavigator${isTS ? ': React.FC' : ''} = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          // Add tab bar icon here
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator${isTS ? ': React.FC' : ''} = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;`;

    await fs.writeFile(path.join(projectPath, 'src', 'navigation', `index.${jsExt}`), content);
  }

  static async createGitIgnore(projectPath) {
    const content = `# OSX
#
.DS_Store

# Xcode
#
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
project.xcworkspace

# Android/IntelliJ
#
build/
.idea
.gradle
local.properties
*.iml
*.hprof
.cxx/

# node.js
#
node_modules/
npm-debug.log
yarn-error.log

# BUCK
buck-out/
\\.buckd/
*.keystore
!debug.keystore

# fastlane
#
# It is recommended to not store the screenshots in the git repo. Instead, use fastlane to re-generate the
# screenshots whenever they are needed.
# For more information about the recommended setup visit:
# https://docs.fastlane.tools/best-practices/source-control/

*/fastlane/report.xml
*/fastlane/Preview.html
*/fastlane/screenshots
*/fastlane/test_output

# Bundle artifacts
*.jsbundle

# CocoaPods
/ios/Pods/

# Expo
.expo/
dist/
web-build/

# Temporary files created by Metro to check the health of the file watcher
.metro-health-check*

# Environment variables
.env
.env.local
.env.production

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/`;

    await fs.writeFile(path.join(projectPath, '.gitignore'), content);
  }

  static async createExampleComponent(projectPath, language, ext) {
    const isTS = language === 'typescript';

    const content = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

${isTS ? `
interface ExampleComponentProps {
  title?: string;
  subtitle?: string;
}
` : ''}

const ExampleComponent${isTS ? ': React.FC<ExampleComponentProps>' : ''} = ({ title = 'Example', subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
});

export default ExampleComponent;`;

    await fs.writeFile(path.join(projectPath, 'src', 'components', `ExampleComponent.${ext}`), content);
  }

  static async createTypesFile(projectPath) {
    const content = `// Global type definitions

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppState {
  isLoading: boolean;
  user: User | null;
  theme: 'light' | 'dark';
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}`;

    await fs.writeFile(path.join(projectPath, 'src', 'types', 'index.ts'), content);
  }

  static async configurePackages(projectPath, answers) {
    const { packages, language, framework } = answers;

    for (const pkg of packages) {
      switch (pkg) {
        case 'nativewind':
          await this.configureNativeWind(projectPath, framework);
          break;
        case 'firebase':
          await this.configureFirebase(projectPath, language, framework);
          break;
        case 'zustand':
          await this.configureZustand(projectPath, language);
          break;
        case 'react-query':
          await this.configureReactQuery(projectPath, language);
          break;
      }
    }
  }

  static async configureNativeWind(projectPath, framework) {
    // Create tailwind.config.js
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`;

    await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);

    // Create global.css
    const globalCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

    await fs.writeFile(path.join(projectPath, 'global.css'), globalCSS);

    // Update babel.config.js
    const babelConfigPath = path.join(projectPath, 'babel.config.js');

    if (await fs.pathExists(babelConfigPath)) {
      const babelContent = await fs.readFile(babelConfigPath, 'utf8');

      // Add nativewind plugin to babel config
      const updatedContent = babelContent.replace(
        /plugins:\s*\[(.*?)\]/s,
        (match, plugins) => {
          const cleanPlugins = plugins.trim();
          const hasTrailingComma = cleanPlugins.endsWith(',');
          const newPlugin = '"nativewind/babel"';

          if (cleanPlugins === '') {
            return `plugins: [${newPlugin}]`;
          } else {
            return `plugins: [${cleanPlugins}${hasTrailingComma ? '' : ','} ${newPlugin}]`;
          }
        }
      );

      await fs.writeFile(babelConfigPath, updatedContent);
    }
  }

  static async configureFirebase(projectPath, language, framework) {
    const jsExt = language === 'typescript' ? 'ts' : 'js';
    const isExpo = framework === 'expo';

    let content;

    if (isExpo) {
      content = `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config object
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;`;
    } else {
      content = `import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase is automatically initialized in React Native Firebase
export { auth, firestore };

// Helper functions
export const getCurrentUser = () => auth().currentUser;

export const signIn = async (email${language === 'typescript' ? ': string' : ''}, password${language === 'typescript' ? ': string' : ''}) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signUp = async (email${language === 'typescript' ? ': string' : ''}, password${language === 'typescript' ? ': string' : ''}) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};`;
    }

    await fs.writeFile(path.join(projectPath, 'src', 'config', `firebase.${jsExt}`), content);
  }

  static async configureZustand(projectPath, language) {
    const jsExt = language === 'typescript' ? 'ts' : 'js';
    const isTS = language === 'typescript';

    const content = `import { create } from 'zustand';

${isTS ? `
interface AppState {
  count: number;
  user: { id: string; name: string } | null;
  isLoading: boolean;
  increment: () => void;
  decrement: () => void;
  setUser: (user: { id: string; name: string } | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}
` : ''}

export const useAppStore = create${isTS ? '<AppState>' : ''}((set) => ({
  count: 0,
  user: null,
  isLoading: false,

  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),

  reset: () => set({ count: 0, user: null, isLoading: false }),
}));

// Example usage:
// const { count, increment, decrement } = useAppStore();`;

    await fs.writeFile(path.join(projectPath, 'src', 'store', `useStore.${jsExt}`), content);
  }

  static async configureReactQuery(projectPath, language) {
    const jsExt = language === 'typescript' ? 'ts' : 'js';
    const isTS = language === 'typescript';

    const content = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

// Provider component
export const QueryProvider${isTS ? ': React.FC<{ children: React.ReactNode }>' : ''} = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

// Custom hook example
export const useExampleQuery = () => {
  return useQuery({
    queryKey: ['example'],
    queryFn: async () => {
      // Replace with your API call
      const response = await fetch('https://api.example.com/data');
      return response.json();
    },
  });
};`;

    await fs.writeFile(path.join(projectPath, 'src', 'hooks', `useQuery.${jsExt}`), content);
  }
}

module.exports = FileGenerator;
