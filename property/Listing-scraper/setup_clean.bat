@echo off
REM Clean Setup Script - Fixes dependency conflicts and network issues
REM This script creates virtual environment and installs all dependencies
REM Place this script in the same folder as links.txt

echo ========================================
echo Universal Scraper Windows Setup - CLEAN VERSION
echo ========================================
echo.

REM Clean up extensionless files first
echo [0/8] Cleaning up package files...
for %%f in (*.0) do (
    if exist "%%f" (
        echo Removing: %%f
        del "%%f"
    )
)
for %%f in (*.1) do (
    if exist "%%f" (
        echo Removing: %%f
        del "%%f"
    )
)
echo Cleanup completed
echo.

REM Try multiple Python detection methods
echo [1/8] Checking Python installation...

REM Method 1: Try python command
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Python using 'python' command
    set PYTHON_CMD=python
    goto :python_found
)

REM Method 2: Try python3 command
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Python using 'python3' command
    set PYTHON_CMD=python3
    goto :python_found
)

REM Method 3: Try py launcher
py --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Python using 'py' launcher
    set PYTHON_CMD=py
    goto :python_found
)

REM Python not found
echo ERROR: Python is not installed or not in PATH
echo Please install Python from https://python.org
echo Make sure to check "Add Python to PATH" during installation
echo.
echo Press any key to continue...
pause >nul
exit /b 1

:python_found
echo Python command: %PYTHON_CMD%
%PYTHON_CMD% --version
echo Python detected successfully
echo.

REM Remove existing venv to avoid conflicts
echo [2/8] Preparing virtual environment...
if exist "venv" (
    echo Removing existing virtual environment to fix conflicts...
    rmdir /s /q venv
    if %errorlevel% neq 0 (
        echo WARNING: Could not remove venv completely
    )
)

echo Creating new virtual environment...
%PYTHON_CMD% -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Failed to create virtual environment
    echo Press any key to continue...
    pause >nul
    exit /b 1
)
echo Virtual environment created successfully
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Virtual environment activated
echo.

REM Upgrade pip first
echo [3/8] Upgrading pip...
%PYTHON_CMD% -m pip install --upgrade pip --force-reinstall
if %errorlevel% neq 0 (
    echo WARNING: Failed to upgrade pip, continuing...
)
echo.

REM Install core dependencies first
echo [4/8] Installing core dependencies...
%PYTHON_CMD% -m pip install requests>=2.28.0
%PYTHON_CMD% -m pip install beautifulsoup4>=4.12.0
%PYTHON_CMD% -m pip install lxml>=4.9.0
echo Core dependencies installed
echo.

REM Install Playwright with compatible versions
echo [5/8] Installing Playwright (with compatible versions)...
%PYTHON_CMD% -m pip install playwright>=1.40.0,<1.50.0
%PYTHON_CMD% -m pip install pyee>=13.0.0,<14.0.0
%PYTHON_CMD% -m pip install playwright-stealth>=1.0.6
echo Playwright installed
echo.

REM Install remaining packages
echo [6/8] Installing additional packages...
%PYTHON_CMD% -m pip install pandas>=2.0.0
%PYTHON_CMD% -m pip install numpy>=1.24.0
%PYTHON_CMD% -m pip install python-dotenv>=1.0.0
%PYTHON_CMD% -m pip install tqdm>=4.64.0
%PYTHON_CMD% -m pip install fake-useragent>=1.4.0
%PYTHON_CMD% -m pip install Pillow>=10.0.0
%PYTHON_CMD% -m pip install imageio>=2.31.0
%PYTHON_CMD% -m pip install tenacity>=8.2.0
%PYTHON_CMD% -m pip install pyyaml>=6.0
%PYTHON_CMD% -m pip install loguru>=0.7.0
%PYTHON_CMD% -m pip install rich>=13.0.0
echo All packages installed
echo.

REM Install Playwright browsers
echo [7/8] Installing Playwright browsers...
%PYTHON_CMD% -m playwright install chromium
%PYTHON_CMD% -m playwright install firefox
%PYTHON_CMD% -m playwright install webkit
echo Browsers installed
echo.

REM Create necessary directories
echo [8/8] Creating directories...
if not exist "scraped_data" mkdir scraped_data
if not exist "logs" mkdir logs
echo Directories created
echo.

REM Check for links.txt
echo Checking for links.txt...
if not exist "links.txt" (
    echo ERROR: links.txt not found
    echo Please create links.txt with one URL per line
    echo.
    echo Press any key to continue...
    pause >nul
    exit /b 1
)

echo links.txt found
echo.

REM Read and validate links.txt
echo Validating links in links.txt...
set /a link_count=0
for /f "usebackq tokens=*" %%a in ("links.txt") do (
    set /a link_count+=1
    echo Link %%link_count%%: %%a
)

if %link_count% equ 0 (
    echo ERROR: No links found in links.txt
    echo Please add at least one valid URL
    echo.
    echo Press any key to continue...
    pause >nul
    exit /b 1
)

echo Found %link_count% links to process
echo.

REM Run universal scraper with network settings
echo ========================================
echo Running Universal Scraper (with network fixes)
echo ========================================
echo.

%PYTHON_CMD% universal_scraper_windows.py --batch links.txt --output scraped_data

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo SCRAPER EXECUTION FAILED
    echo ========================================
    echo.
    echo Common issues and solutions:
    echo 1. Network error - Check internet connection
    echo 2. Site blocking - Try different URL
    echo 3. Browser issue - Reinstall browsers
    echo 4. Dependencies missing - Check error above
    echo.
    echo Press any key to continue...
    pause >nul
    exit /b 1
)

echo.
echo ========================================
echo Scraping Completed Successfully!
echo ========================================
echo.
echo Check the scraped_data folder for results
echo.
echo Press any key to exit...
pause >nul
