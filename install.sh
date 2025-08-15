#!/bin/bash

# Setup React Native CLI Installation Script

set -e

echo "🚀 Installing Setup React Native CLI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//' | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install the CLI globally
echo "📦 Installing Setup RN CLI globally..."

if command -v npm &> /dev/null; then
    npm install -g setup-rn-cli
elif command -v yarn &> /dev/null; then
    yarn global add setup-rn-cli
elif command -v pnpm &> /dev/null; then
    pnpm add -g setup-rn-cli
else
    echo "❌ No package manager found. Please install npm, yarn, or pnpm."
    exit 1
fi

echo "✅ Setup RN CLI installed successfully!"
echo ""
echo "🎯 Usage:"
echo "  setup-rn"
echo ""
echo "📖 For more information:"
echo "  setup-rn --help"
echo ""
echo "Happy coding! 🎉"
