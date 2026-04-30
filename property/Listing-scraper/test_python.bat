# Quick Python Detection Test
# Run this first to find your Python installation

echo Testing Python detection methods...
echo.

echo Method 1: python command
python --version 2>nul || echo FAILED
echo.

echo Method 2: python3 command
python3 --version 2>nul || echo FAILED
echo.

echo Method 3: py launcher
py --version 2>nul || echo FAILED
echo.

echo Method 4: Common paths
if exist "C:\Python311\python.exe" echo Found: C:\Python311\python.exe
if exist "C:\Python310\python.exe" echo Found: C:\Python310\python.exe
if exist "C:\Python39\python.exe" echo Found: C:\Python39\python.exe
if exist "C:\Python38\python.exe" echo Found: C:\Python38\python.exe
echo.

echo Method 5: Program Files
if exist "C:\Program Files\Python311\python.exe" echo Found: C:\Program Files\Python311\python.exe
if exist "C:\Program Files\Python310\python.exe" echo Found: C:\Program Files\Python310\python.exe
echo.

echo Current PATH:
echo %PATH%
echo.

echo Press any key to continue...
pause
