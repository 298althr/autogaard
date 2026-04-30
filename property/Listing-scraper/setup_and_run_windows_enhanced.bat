@echo off
REM Universal Scraper Windows Setup & Run Script - Enhanced Version
REM This script creates virtual environment and installs all dependencies
REM Place this script in the same folder as links.txt

echo ========================================
echo Universal Scraper Windows Setup
echo ========================================
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

REM Method 4: Check common Python paths
echo Checking common Python installation paths...
if exist "C:\Python311\python.exe" (
    echo Found Python at C:\Python311\python.exe
    set PYTHON_CMD=C:\Python311\python.exe
    goto :python_found
)

if exist "C:\Python310\python.exe" (
    echo Found Python at C:\Python310\python.exe
    set PYTHON_CMD=C:\Python310\python.exe
    goto :python_found
)

if exist "C:\Python39\python.exe" (
    echo Found Python at C:\Python39\python.exe
    set PYTHON_CMD=C:\Python39\python.exe
    goto :python_found
)

if exist "C:\Python38\python.exe" (
    echo Found Python at C:\Python38\python.exe
    set PYTHON_CMD=C:\Python38\python.exe
    goto :python_found
)

REM Method 5: Search in Program Files
echo Searching in Program Files...
if exist "C:\Program Files\Python311\python.exe" (
    echo Found Python at C:\Program Files\Python311\python.exe
    set PYTHON_CMD=C:\Program Files\Python311\python.exe
    goto :python_found
)

if exist "C:\Program Files\Python310\python.exe" (
    echo Found Python at C:\Program Files\Python310\python.exe
    set PYTHON_CMD=C:\Program Files\Python310\python.exe
    goto :python_found
)

REM Python not found
echo ERROR: Python is not installed or not in PATH
echo.
echo Please try these solutions:
echo 1. Install Python from https://python.org (check "Add to PATH")
echo 2. Use the py launcher: py -m pip install ...
echo 3. Add Python to PATH manually
echo.
echo Current PATH:
echo %PATH%
echo.
echo Press any key to continue (this will not close)...
pause >nul
exit /b 1

:python_found
echo Python command: %PYTHON_CMD%
%PYTHON_CMD% --version
echo Python detected successfully
echo.

REM Check if virtual environment already exists
echo [2/8] Checking virtual environment...
if exist "venv" (
    echo Virtual environment already exists
    echo Activating existing environment...
    call venv\Scripts\activate.bat
    echo Virtual environment activated
) else (
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
)
echo.

REM Check if dependencies are already installed
echo [3/8] Checking installed dependencies...
%PYTHON_CMD% -c "import playwright, bs4, requests" >nul 2>&1
if %errorlevel% equ 0 (
    echo All required dependencies are already installed
    echo Skipping dependency installation
    goto :install_browsers
)
echo Some dependencies are missing, installing...
echo.

REM Upgrade pip
echo [4/8] Upgrading pip...
%PYTHON_CMD% -m pip install --upgrade pip
if %errorlevel% neq 0 (
    echo ERROR: Failed to upgrade pip
    echo This might be due to network issues or Python installation
    echo Press any key to continue...
    pause >nul
    exit /b 1
)
echo pip upgraded successfully
echo.

REM Install required packages
echo [5/8] Installing required packages...
%PYTHON_CMD% -m pip install playwright>=1.40.0
if %errorlevel% neq 0 (
    echo WARNING: Failed to install playwright-stealth, continuing...
)
%PYTHON_CMD% -m pip install playwright-stealth>=1.0.6
%PYTHON_CMD% -m pip install beautifulsoup4>=4.12.0
%PYTHON_CMD% -m pip install lxml>=4.9.0
%PYTHON_CMD% -m pip install requests>=2.28.0
%PYTHON_CMD% -m pip install requests-html>=0.10.0
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

echo Package installation completed
echo.

:install_browsers

REM Install Playwright browsers
echo [6/8] Installing Playwright browsers...
%PYTHON_CMD% -m playwright install chromium
if %errorlevel% neq 0 (
    echo WARNING: Failed to install chromium browser, continuing...
)
%PYTHON_CMD% -m playwright install firefox
if %errorlevel% neq 0 (
    echo WARNING: Failed to install firefox browser, continuing...)
%PYTHON_CMD% -m playwright install webkit
if %errorlevel% neq 0 (
    echo WARNING: Failed to install webkit browser, continuing...)

echo Browser installation completed
echo.

REM Create necessary directories
echo [7/8] Creating directories...
if not exist "scraped_data" mkdir scraped_data
if not exist "logs" mkdir logs
echo Directories created successfully
echo.

REM Check for links.txt
echo [8/8] Checking for links.txt...
if not exist "links.txt" (
    echo ERROR: links.txt not found in current directory
    echo Please create links.txt with one URL per line
    echo Example links.txt:
    echo https://www.zillow.com/homedetails/330-Las-Colinas-Blvd-924-Irving-TX-75039/67968866_zpid/
    echo https://www.amazon.com/dp/B08N5WRWNW
    echo.
    echo Press any key to continue...
    pause >nul
    exit /b 1
)

echo links.txt found successfully
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
    echo Please add at least one valid URL to links.txt
    echo.
    echo Press any key to continue...
    pause >nul
    exit /b 1
)

echo Found %link_count% links to process
echo.

REM Run universal scraper
echo ========================================
echo Running Universal Scraper
echo ========================================
echo.

%PYTHON_CMD% universal_scraper_windows.py --batch links.txt --output scraped_data

if %errorlevel% neq 0 (
    echo ERROR: Scraper execution failed
    echo This might be due to missing dependencies or network issues
    echo Check the error message above for details
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
echo Check the following folders for results:
echo - scraped_data\ (contains all scraped data)
echo - logs\ (contains scraping logs)
echo.
echo Each URL will have its own folder with:
echo - property_data.json (complete data)
echo - photos\ (downloaded images)
echo - scraping_log.txt (activity log)
echo.
echo Press any key to exit...
pause >nul
