@echo off
REM Ultimate Setup Script - All issues fixed
REM This script creates virtual environment and installs all dependencies with detailed logging
REM Place this script in the same folder as links.txt

echo ========================================
echo Universal Scraper Windows Setup - FINAL VERSION
echo ========================================
echo.

REM Enable delayed expansion for better variable handling
setlocal enabledelayedexpansion

REM Clean up extensionless files first (only if they exist)
echo [0/10] Checking for cleanup...
set cleanup_needed=0
for %%f in (*.0 *.1) do (
    if exist "%%f" (
        set cleanup_needed=1
        goto cleanup_found
    )
)
goto cleanup_done

:cleanup_found
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

:cleanup_done
echo.

REM Try multiple Python detection methods
echo [1/10] Checking Python installation...

REM Method 1: Try python command
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Python using 'python' command
    set PYTHON_CMD=python
    goto python_found
)

REM Method 2: Try python3 command
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Python using 'python3' command
    set PYTHON_CMD=python3
    goto python_found
)

REM Method 3: Try py launcher
py --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Python using 'py' launcher
    set PYTHON_CMD=py
    goto python_found
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
echo [2/10] Checking virtual environment...
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
        echo This might be due to Python installation issues
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

REM Smart dependency checking with detailed logging
echo [3/10] Checking installed dependencies...
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
if %core_missing% equ 0 (
    if %playwright_missing% equ 0 (
        echo All required dependencies are already installed
        echo Skipping dependency installation
        goto check_browsers
    )
)

echo Some dependencies are missing, installing only what's needed...
echo.

REM Upgrade pip only if needed
echo [4/10] Checking pip version...
%PYTHON_CMD% -m pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo pip not working, upgrading...
    %PYTHON_CMD% -m pip install --upgrade pip --force-reinstall
    if %errorlevel% neq 0 (
        echo WARNING: pip upgrade failed, continuing...
    )
) else (
    echo pip is working fine
)
echo.

REM Install only missing core dependencies
if %core_missing% equ 1 (
    echo [5/10] Installing missing core dependencies...
    %PYTHON_CMD% -m pip install requests>=2.28.0
    if %errorlevel% neq 0 (
        echo WARNING: requests installation failed, continuing...
    )
    %PYTHON_CMD% -m pip install beautifulsoup4>=4.12.0
    if %errorlevel% neq 0 (
        echo WARNING: beautifulsoup4 installation failed, continuing...
    )
    %PYTHON_CMD% -m pip install lxml>=4.9.0
    if %errorlevel% neq 0 (
        echo WARNING: lxml installation failed, continuing...
    )
    echo Core dependencies installation completed
)

REM Install Playwright only if missing
if %playwright_missing% equ 1 (
    echo [6/10] Installing Playwright...
    %PYTHON_CMD% -m pip install playwright>=1.40.0,<1.50.0
    if %errorlevel% neq 0 (
        echo WARNING: playwright installation failed, continuing...
    )
    %PYTHON_CMD% -m pip install pyee>=13.0.0,<14.0.0
    if %errorlevel% neq 0 (
        echo WARNING: pyee installation failed, continuing...
    )
    %PYTHON_CMD% -m pip install playwright-stealth>=1.0.6
    if %errorlevel% neq 0 (
        echo WARNING: playwright-stealth installation failed, continuing...
    )
    echo Playwright installation completed
)
echo.

REM Install additional packages (only if not already installed)
echo [7/10] Checking additional packages...
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
echo [8/10] Checking Playwright browsers...
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
    echo Installing Chromium (primary browser)...
    %PYTHON_CMD% -m playwright install chromium
    if %errorlevel% neq 0 (
        echo WARNING: chromium installation failed, continuing...
    )
    echo Installing Firefox (secondary browser)...
    %PYTHON_CMD% -m playwright install firefox
    if %errorlevel% neq 0 (
        echo WARNING: firefox installation failed, continuing...
    )
    echo Installing WebKit (fallback browser)...
    %PYTHON_CMD% -m playwright install webkit
    if %errorlevel% neq 0 (
        echo WARNING: webkit installation failed, continuing...
    )
    echo Browser installation completed
)
echo.

REM Create necessary directories
echo [9/10] Creating directories...
if not exist "scraped_data" mkdir scraped_data
if not exist "logs" mkdir logs
echo Directories created
echo.

REM Check for links.txt
echo [10/10] Checking for links.txt...
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

REM Create debug log file
echo Creating debug log...
echo Debug log started at %date% %time% > debug.log
echo Setup completed, starting scraper... >> debug.log

REM Run universal scraper with error handling
echo ========================================
echo Running Universal Scraper (Final Mode)
echo ========================================
echo.

%PYTHON_CMD% universal_scraper_fixed_v2.py --batch links.txt --output scraped_data

REM Capture exit code
set scraper_exit_code=%errorlevel%

echo.
echo Scraper exit code: %scraper_exit_code% >> debug.log

if %scraper_exit_code% neq 0 (
    echo.
    echo ========================================
    echo SCRAPER EXECUTION FAILED
    echo ========================================
    echo Exit code: %scraper_exit_code%
    echo.
    echo Debugging information:
    echo - Check debug.log for details
    echo - Try running with a different URL
    echo - Check internet connection
    echo - Verify URL is accessible
    echo.
    echo Common solutions:
    echo 1. Network timeout - Increase timeout in scraper
    echo 2. Site blocking - Try different URL
    echo 3. Browser issue - Reinstall browsers
    echo 4. Dependencies missing - Check installation logs
    echo.
    echo Press any key to view debug log...
    pause >nul
    
    REM Show debug log
    echo.
    echo ========================================
    echo DEBUG LOG CONTENTS
    echo ========================================
    type debug.log
    echo ========================================
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b %scraper_exit_code%
) else (
    echo.
    echo ========================================
    echo Scraping Completed Successfully!
    echo ========================================
    echo.
    echo Check the scraped_data folder for results
    echo Debug log saved to debug.log
    echo.
    echo Press any key to exit...
    pause >nul
)
