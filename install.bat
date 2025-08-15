@echo off
REM Setup React Native CLI Installation Script for Windows

echo 🚀 Installing Setup React Native CLI...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

echo ✅ Node.js found:
node --version

REM Install the CLI globally
echo 📦 Installing Setup RN CLI globally...

where npm >nul 2>nul
if %errorlevel% equ 0 (
    npm install -g setup-rn-cli
    goto :success
)

where yarn >nul 2>nul
if %errorlevel% equ 0 (
    yarn global add setup-rn-cli
    goto :success
)

where pnpm >nul 2>nul
if %errorlevel% equ 0 (
    pnpm add -g setup-rn-cli
    goto :success
)

echo ❌ No package manager found. Please install npm, yarn, or pnpm.
exit /b 1

:success
echo ✅ Setup RN CLI installed successfully!
echo.
echo 🎯 Usage:
echo   setup-rn
echo.
echo 📖 For more information:
echo   setup-rn --help
echo.
echo Happy coding! 🎉
