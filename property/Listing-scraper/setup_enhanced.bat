@echo off
echo ========================================
echo Universal Scraper Windows Setup - ENHANCED VERSION
echo ========================================
echo.

REM Clean up extensionless files
echo [1/8] Cleaning up package files...
for %%f in (*.0 *.1) do (
    if exist "%%f" (
        echo Removing: %%f
        del "%%f"
    )
)
echo Cleanup completed
echo.

REM Check Python installation
echo [2/8] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Python using 'python' command
    set PYTHON_CMD=python
    goto python_found
)

python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Python using 'python3' command
    set PYTHON_CMD=python3
    goto python_found
)

py --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Python using 'py' launcher
    set PYTHON_CMD=py
    goto python_found
)

echo ERROR: Python is not installed or not in PATH
echo Please install Python from https://python.org
echo.
pause
exit /b 1

:python_found
echo Python command: %PYTHON_CMD%
%PYTHON_CMD% --version
echo Python detected successfully
echo.

REM Check virtual environment
echo [3/8] Checking virtual environment...
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
        pause
        exit /b 1
    )
    echo Virtual environment created successfully
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
    echo Virtual environment activated
)
echo.

REM Check dependencies
echo [4/8] Checking installed dependencies...
%PYTHON_CMD% -c "import playwright, bs4, requests" >nul 2>&1
if %errorlevel% equ 0 (
    echo All required dependencies are already installed
    echo Skipping dependency installation
    goto install_browsers
)

echo Some dependencies are missing, installing...
echo.

REM Upgrade pip
echo [5/8] Upgrading pip...
%PYTHON_CMD% -m pip install --upgrade pip
echo.

REM Install packages
echo [6/8] Installing required packages...
%PYTHON_CMD% -m pip install playwright>=1.40.0
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
echo.

:install_browsers
REM Install browsers
echo [7/8] Installing Playwright browsers...
%PYTHON_CMD% -m playwright install chromium
%PYTHON_CMD% -m playwright install firefox
%PYTHON_CMD% -m playwright install webkit
echo.

REM Create directories
echo [8/8] Creating directories...
if not exist "scraped_data" mkdir scraped_data
if not exist "logs" mkdir logs
echo Directories created
echo.

REM Check for links.txt
if not exist "links.txt" (
    echo ERROR: links.txt not found
    echo Please create links.txt with one URL per line
    echo.
    pause
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
    pause
    exit /b 1
)

echo Found %link_count% links to process
echo.

REM Create debug log
echo Creating debug log...
echo Debug log started at %date% %time% > debug.log

REM Run enhanced scraper
echo ========================================
echo Running Universal Scraper (Enhanced Mode)
echo ========================================
echo.

%PYTHON_CMD% universal_scraper_enhanced.py --batch links.txt --output scraped_data

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
    echo.
    echo Press any key to view debug log...
    pause
    
    echo.
    echo ========================================
    echo DEBUG LOG CONTENTS
    echo ========================================
    type debug.log
    echo ========================================
    echo.
    pause
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
    pause
)
