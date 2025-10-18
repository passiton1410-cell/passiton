# Logo Adjustment Guide

## Problem
The current logo (`public/logo3.jpeg`) has elements positioned too close to the edges:
- Pen icon (bottom left)
- School building icon (bottom right)

These elements get cut off when the logo is displayed in a circular format.

## Solution
This package includes scripts to automatically adjust the logo by adding padding around all edges, ensuring all elements are visible when displayed as a circular image.

## Files Included
- `adjust_logo.py` - Python script that performs the adjustment
- `adjust_logo.bat` - Windows batch file for easy execution (just double-click)

## Prerequisites
- Python 3.x installed ([Download here](https://www.python.org/downloads/))
- Pillow library (will be auto-installed by the batch script)

## How to Use

### Option 1: Double-Click (Easiest)
1. Simply double-click `adjust_logo.bat`
2. The script will:
   - Check for Python
   - Install Pillow if needed
   - Adjust the logo
   - Create a circular preview

### Option 2: Run Python Script Directly
1. Open Command Prompt or Terminal
2. Navigate to this directory:
   ```
   cd "C:\Users\Shrut Sharma\Desktop\passiton"
   ```
3. Install Pillow (if not already installed):
   ```
   pip install Pillow
   ```
4. Run the script:
   ```
   python adjust_logo.py
   ```

## Output Files
After running the script, you'll get two new files in the `public` folder:

1. **`logo3-adjusted.jpeg`** - The adjusted logo with padding
   - Use this file in your application where you display the logo circularly

2. **`logo3-circular-preview.png`** - A preview showing how the logo looks in circular format
   - Review this file to verify all elements are visible
   - If anything is still cut off, you can increase the padding percentage

## Adjusting Padding
If you need more or less padding:

1. Open `adjust_logo.py` in a text editor
2. Find this line (near the bottom):
   ```python
   adjusted_img = add_circular_padding(input_path, output_path, padding_percent=18)
   ```
3. Change `padding_percent=18` to a higher or lower value:
   - Higher value = more padding = safer but smaller logo elements
   - Lower value = less padding = larger elements but risk of cutting off
4. Save and run the script again

## Using the Adjusted Logo
Once you're happy with the adjusted logo:

1. Option A: Replace the original:
   - Backup `public/logo3.jpeg` first
   - Rename `public/logo3-adjusted.jpeg` to `public/logo3.jpeg`

2. Option B: Update your code to use the new file:
   - Change references from `logo3.jpeg` to `logo3-adjusted.jpeg`

## Troubleshooting

### "Python is not installed"
- Download and install Python from https://www.python.org/downloads/
- Make sure to check "Add Python to PATH" during installation

### "Failed to install Pillow"
- Try manually: `pip install Pillow`
- If that fails, try: `python -m pip install --user Pillow`

### "Module not found" error
- Make sure Pillow is installed: `pip list | grep Pillow`
- Reinstall if needed: `pip install --upgrade Pillow`

### Still having issues?
- Ensure you're in the correct directory
- Try running as administrator
- Check that Python and pip are in your system PATH

## Technical Details
- **Padding:** 18% on all sides (customizable)
- **Format:** Square output for optimal circular display
- **Quality:** High-quality JPEG output (95% quality, optimized)
- **Safe circular area:** All elements positioned well within the circular crop zone

## Support
If you encounter any issues or need to adjust the padding further, modify the `padding_percent` parameter in the script as described above.
