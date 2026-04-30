@echo off
REM Universal Scraper Windows Setup & Run Script
REM This script installs all dependencies and runs the scraper
REM Place this script in the same folder as links.txt

echo ========================================
echo Universal Scraper Windows Setup
echo ========================================
echo.

REM Check if Python is installed
echo [1/6] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

python --version
echo Python detected successfully
echo.

REM Upgrade pip
echo [2/6] Upgrading pip...
python -m pip install --upgrade pip
if %errorlevel% neq 0 (
    echo ERROR: Failed to upgrade pip
    pause
    exit /b 1
)
echo pip upgraded successfully
echo.

REM Install required packages
echo [3/6] Installing required packages...
python -m pip install playwright>=1.40.0
python -m pip install playwright-stealth>=1.0.6
python -m pip install beautifulsoup4>=4.12.0
python -m pip install lxml>=4.9.0
python -m pip install requests>=2.28.0
python -m pip install requests-html>=0.10.0
python -m pip install pandas>=2.0.0
python -m pip install numpy>=1.24.0
python -m pip install python-dotenv>=1.0.0
python -m pip install tqdm>=4.64.0
python -m pip install fake-useragent>=1.4.0
python -m pip install Pillow>=10.0.0
python -m pip install imageio>=2.31.0
python -m pip install tenacity>=8.2.0
python -m pip install pyyaml>=6.0
python -m pip install loguru>=0.7.0
python -m pip install rich>=13.0.0

if %errorlevel% neq 0 (
    echo ERROR: Failed to install required packages
    pause
    exit /b 1
)
echo All packages installed successfully
echo.

REM Install Playwright browsers
echo [4/6] Installing Playwright browsers...
python -m playwright install chromium
python -m playwright install firefox
python -m playwright install webkit

if %errorlevel% neq 0 (
    echo ERROR: Failed to install Playwright browsers
    pause
    exit /b 1
)
echo Playwright browsers installed successfully
echo.

REM Create necessary directories
echo [5/6] Creating directories...
if not exist "scraped_data" mkdir scraped_data
if not exist "logs" mkdir logs
echo Directories created successfully
echo.

REM Check for links.txt
echo [6/6] Checking for links.txt...
if not exist "links.txt" (
    echo ERROR: links.txt not found in current directory
    echo Please create links.txt with one URL per line
    echo Example links.txt:
    echo https://www.zillow.com/homedetails/330-Las-Colinas-Blvd-924-Irving-TX-75039/67968866_zpid/
    echo https://www.amazon.com/dp/B08N5WRWNW
    pause
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
    pause
    exit /b 1
)

echo Found %link_count% links to process
echo.

REM Run the universal scraper
echo ========================================
echo Running Universal Scraper
echo ========================================
echo.

python universal_scraper.py --batch links.txt --output scraped_data

if %errorlevel% neq 0 (
    echo ERROR: Scraper execution failed
    pause
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
