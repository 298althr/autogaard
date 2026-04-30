@echo off
REM Smart Setup Script - Checks dependencies first, only installs if needed
REM This script creates virtual environment and installs all dependencies efficiently
REM Place this script in the same folder as links.txt

echo ========================================
echo Universal Scraper Windows Setup - SMART VERSION
echo ========================================
echo.

REM Clean up extensionless files first (only if they exist)
echo [0/9] Checking for cleanup...
set cleanup_needed=0
for %%f in (*.0 *.1) do (
    if exist "%%f" (
        set cleanup_needed=1
        goto :cleanup_found
    )
)

:cleanup_done
if %cleanup_needed% equ 1 (
    echo Cleaning up package files...
    for %%f in (*.0 *.1) do (
        if exist "%%f" (
            echo Removing: %%f
            del "%%f"
        )
    )
    echo Cleanup completed
) else (
    echo No cleanup needed
)
echo.

REM Try multiple Python detection methods
echo [1/9] Checking Python installation...

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

REM Check if virtual environment already exists
echo [2/9] Checking virtual environment...
if exist "venv" (
    echo Virtual environment already exists
    echo Checking if environment is healthy...
    
    REM Test if venv is working
    call venv\Scripts\activate.bat
    %PYTHON_CMD% --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo Virtual environment is healthy
        set venv_ok=1
    ) else (
        echo Virtual environment is corrupted, recreating...
        set venv_ok=0
        call deactivate 2>nul
        rmdir /s /q venv
    )
) else (
    echo No virtual environment found
    set venv_ok=0
)

if %venv_ok% equ 0 (
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
) else (
    echo Activating existing virtual environment...
    call venv\Scripts\activate.bat
    echo Virtual environment activated
)
echo.

REM Smart dependency checking
echo [3/9] Checking installed dependencies...
echo Testing core packages...

REM Check if core dependencies are installed
%PYTHON_CMD% -c "import requests, bs4" >nul 2>&1
if %errorlevel% neq 0 (
    echo Core packages missing, will install
    set core_missing=1
) else (
    echo Core packages found
    set core_missing=0
)

%PYTHON_CMD% -c "import playwright" >nul 2>&1
if %errorlevel% neq 0 (
    echo Playwright missing, will install
    set playwright_missing=1
) else (
    echo Playwright found
    set playwright_missing=0
)

REM Check if all dependencies are satisfied
if %core_missing% equ 0 if %playwright_missing% equ 0 (
    echo All required dependencies are already installed
    echo Skipping dependency installation
    goto :check_browsers
)

echo Some dependencies are missing, installing only what's needed...
echo.

REM Upgrade pip only if needed
echo [4/9] Checking pip version...
%PYTHON_CMD% -m pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo pip not working, upgrading...
    %PYTHON_CMD% -m pip install --upgrade pip --force-reinstall
) else (
    echo pip is working fine
)
echo.

REM Install only missing core dependencies
if %core_missing% equ 1 (
    echo [5/9] Installing missing core dependencies...
    %PYTHON_CMD% -m pip install requests>=2.28.0
    %PYTHON_CMD% -m pip install beautifulsoup4>=4.12.0
    %PYTHON_CMD% -m pip install lxml>=4.9.0
    echo Core dependencies installed
)

REM Install Playwright only if missing
if %playwright_missing% equ 1 (
    echo [6/9] Installing Playwright...
    %PYTHON_CMD% -m pip install playwright>=1.40.0,<1.50.0
    %PYTHON_CMD% -m pip install pyee>=13.0.0,<14.0.0
    %PYTHON_CMD% -m pip install playwright-stealth>=1.0.6
    echo Playwright installed
)

REM Install additional packages (only if not already installed)
echo [7/9] Checking additional packages...
%PYTHON_CMD% -c "import pandas, numpy, tqdm" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing additional packages...
    %PYTHON_CMD% -m pip install pandas>=2.0.0
    %PYTHON_CMD% -m pip install numpy>=1.24.0
    %PYTHON_CMD% -m pip install tqdm>=4.64.0
    %PYTHON_CMD% -m pip install python-dotenv>=1.0.0
    %PYTHON_CMD% -m pip install fake-useragent>=1.4.0
    %PYTHON_CMD% -m pip install Pillow>=10.0.0
    %PYTHON_CMD% -m pip install imageio>=2.31.0
    %PYTHON_CMD% -m pip install tenacity>=8.2.0
    %PYTHON_CMD% -m pip install pyyaml>=6.0
    %PYTHON_CMD% -m pip install loguru>=0.7.0
    %PYTHON_CMD% -m pip install rich>=13.0.0
    echo Additional packages installed
) else (
    echo Additional packages already installed
)
echo.

:check_browsers
REM Check if Playwright browsers are installed
echo [8/9] Checking Playwright browsers...
%PYTHON_CMD% -m playwright install --help >nul 2>&1
if %errorlevel% neq 0 (
    echo Playwright CLI not available, installing browsers anyway
    set browsers_missing=1
) else (
    echo Checking browser installation...
    %PYTHON_CMD% -c "import playwright; print('browsers available')" >nul 2>&1
    if %errorlevel% neq 0 (
        echo Browsers need to be installed
        set browsers_missing=1
    ) else (
        echo Browsers already installed
        set browsers_missing=0
    )
)

if %browsers_missing% equ 1 (
    echo Installing Playwright browsers...
    %PYTHON_CMD% -m playwright install chromium
    %PYTHON_CMD% -m playwright install firefox
    %PYTHON_CMD% -m playwright install webkit
    echo Browsers installed
)
echo.

REM Create necessary directories
echo [9/9] Creating directories...
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
echo Running Universal Scraper (Smart Mode)
echo ========================================
echo.

%PYTHON_CMD% universal_scraper_fixed.py --batch links.txt --output scraped_data

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
