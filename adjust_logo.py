#!/usr/bin/env python3
"""
Logo Adjustment Script for Circular Display
This script adds padding to the logo to ensure all elements (pen icon and school building)
are visible when displayed in a circular format.
"""

from PIL import Image, ImageDraw
import os

def add_circular_padding(input_path, output_path, padding_percent=15):
    """
    Add padding to an image to ensure all elements are visible in circular crop.

    Args:
        input_path: Path to the input image
        output_path: Path to save the adjusted image
        padding_percent: Percentage of padding to add (default 15%)
    """
    # Open the original image
    img = Image.open(input_path)

    # Get original dimensions
    orig_width, orig_height = img.size

    # Calculate the padding amount
    # For circular display, we need to ensure the diagonal is well within bounds
    # The safe circular area is approximately 70.7% of the square's diagonal
    # We'll add padding to make sure all elements fit within this safe circle
    padding_px = int(max(orig_width, orig_height) * (padding_percent / 100))

    # Calculate new dimensions
    new_width = orig_width + (2 * padding_px)
    new_height = orig_height + (2 * padding_px)

    # Make it square for better circular display
    new_size = max(new_width, new_height)

    # Create a new image with padding
    # Use the background color from the original image (sample from corner)
    bg_color = img.getpixel((5, 5)) if img.mode == 'RGB' else (245, 245, 240, 255)
    new_img = Image.new(img.mode, (new_size, new_size), bg_color)

    # Calculate position to paste the original image (centered)
    paste_x = (new_size - orig_width) // 2
    paste_y = (new_size - orig_height) // 2

    # Paste the original image onto the new image
    new_img.paste(img, (paste_x, paste_y))

    # Save the adjusted image
    new_img.save(output_path, quality=95, optimize=True)

    print(f"Logo adjusted successfully!")
    print(f"Original size: {orig_width}x{orig_height}")
    print(f"New size: {new_size}x{new_size}")
    print(f"Padding added: {padding_px}px on each side")
    print(f"Saved to: {output_path}")

    return new_img

def create_circular_preview(input_path, output_path):
    """
    Create a circular preview of the logo to verify it looks good.

    Args:
        input_path: Path to the input image
        output_path: Path to save the circular preview
    """
    # Open the image
    img = Image.open(input_path)

    # Create a square image if not already
    size = max(img.size)
    if img.size[0] != img.size[1]:
        square_img = Image.new(img.mode, (size, size), (245, 245, 240, 255))
        paste_x = (size - img.size[0]) // 2
        paste_y = (size - img.size[1]) // 2
        square_img.paste(img, (paste_x, paste_y))
        img = square_img

    # Create a circular mask
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)

    # Apply the mask
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0))
    output.putalpha(mask)

    # Save the circular preview
    output.save(output_path, 'PNG')
    print(f"Circular preview created: {output_path}")

    return output

def main():
    # Define paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(script_dir, "public", "logo3.jpeg")
    output_path = os.path.join(script_dir, "public", "logo3-adjusted.jpeg")
    preview_path = os.path.join(script_dir, "public", "logo3-circular-preview.png")

    # Check if input file exists
    if not os.path.exists(input_path):
        print(f"Error: Input file not found: {input_path}")
        return

    print("Starting logo adjustment...")
    print("=" * 60)

    # Add padding to the logo
    adjusted_img = add_circular_padding(input_path, output_path, padding_percent=18)

    print("\nCreating circular preview...")
    print("=" * 60)

    # Create a circular preview
    create_circular_preview(output_path, preview_path)

    print("\n" + "=" * 60)
    print("DONE!")
    print("=" * 60)
    print(f"\nAdjusted logo saved to: {output_path}")
    print(f"Circular preview saved to: {preview_path}")
    print("\nPlease check the circular preview to verify all elements are visible.")
    print("If you need more padding, you can run this script again with a higher")
    print("padding_percent value (currently set to 18%).")

if __name__ == "__main__":
    main()
