@echo off
REM Batch script to adjust the logo for circular display
REM This script requires Python 3 and Pillow to be installed

echo ========================================
echo Logo Adjustment Script
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo Python found!
echo.

REM Check if Pillow is installed
python -c "import PIL" >nul 2>&1
if errorlevel 1 (
    echo Pillow library not found. Installing...
    python -m pip install Pillow
    if errorlevel 1 (
        echo ERROR: Failed to install Pillow
        echo Please run: pip install Pillow
        pause
        exit /b 1
    )
)

echo Running logo adjustment script...
echo.
python adjust_logo.py

echo.
echo Press any key to exit...
pause >nul
