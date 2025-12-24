#!/usr/bin/env python3

from PIL import Image
import os

# Working directory
work_dir = "/var/www/jexactyl/public/favicons"
source_image = os.path.join(work_dir, "Neo-002-Transparent-Sized.png")

# Define all the favicon sizes and names
favicon_configs = [
    # Android Chrome icons
    ("android-chrome-192x192.png", 192),
    ("android-chrome-512x512.png", 512),
    ("android-icon-36x36.png", 36),
    ("android-icon-48x48.png", 48),
    ("android-icon-72x72.png", 72),
    ("android-icon-96x96.png", 96),
    ("android-icon-144x144.png", 144),
    ("android-icon-192x192.png", 192),
    
    # Apple icons
    ("apple-icon-57x57.png", 57),
    ("apple-icon-60x60.png", 60),
    ("apple-icon-72x72.png", 72),
    ("apple-icon-76x76.png", 76),
    ("apple-icon-114x114.png", 114),
    ("apple-icon-120x120.png", 120),
    ("apple-icon-144x144.png", 144),
    ("apple-icon-152x152.png", 152),
    ("apple-icon-180x180.png", 180),
    ("apple-icon-precomposed.png", 180),
    ("apple-icon.png", 180),
    ("apple-touch-icon.png", 180),
    
    # Standard favicons
    ("favicon-16x16.png", 16),
    ("favicon-32x32.png", 32),
    ("favicon-96x96.png", 96),
    
    # MS icons
    ("ms-icon-70x70.png", 70),
    ("ms-icon-144x144.png", 144),
    ("ms-icon-150x150.png", 150),
    ("ms-icon-310x310.png", 310),
    
    # Other
    ("mstile-150x150.png", 150),
]

print(f"Opening source image: {source_image}")
img = Image.open(source_image)

# Convert to RGBA if not already (to preserve transparency)
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Generate all the different sized icons
for filename, size in favicon_configs:
    print(f"Creating {filename} ({size}x{size})...")
    
    # Resize the image using high-quality Lanczos resampling
    resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
    
    # Save to the favicons folder
    output_path = os.path.join(work_dir, filename)
    resized_img.save(output_path, "PNG")

# Generate the .ico file (favicon.ico with multiple sizes)
print("Creating favicon.ico...")
ico_sizes = [(16, 16), (32, 32), (48, 48)]
ico_images = [img.resize(size, Image.Resampling.LANCZOS) for size in ico_sizes]
ico_path = os.path.join(work_dir, "favicon.ico")
ico_images[0].save(ico_path, format='ICO', sizes=ico_sizes)

print(f"\n✅ All favicons generated successfully!")
print(f"Total files created: {len(favicon_configs) + 1}")
