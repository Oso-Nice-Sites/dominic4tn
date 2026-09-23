#!/usr/bin/env python3
"""Regenerate the 2x2 photo collage used as the "Why I'm Running" section's
image on the homepage (uploaded to Sanity — see README, "Attaching a photo
from the command line").

The four source photos are campaign material, not committed to this repo
(binary images don't belong in git history here — see the README's Content
management section). Ask the campaign for the originals, drop them next to
this script (or edit SRC/photos below), then run:

    python3 -m pip install --user Pillow   # if not already installed
    python3 scripts/make-why-collage.py

This writes why-collage.jpg next to this script. Requires Pillow.
"""

from pathlib import Path

from PIL import Image, ImageOps

SRC = Path(__file__).parent
OUT = SRC / "why-collage.jpg"

# Top-left, top-right, bottom-left, bottom-right.
PHOTOS = [
    "P1070260.JPG",       # standing by the field, TSSAA gear + scoreboard
    "P1070263.JPG",       # writing on the lineup card in the dugout
    "P1070292.JPG",       # calling a play at third base
    "P1070318 copy.JPG",  # fist pump
]

GUTTER = 16
BACKGROUND = "#fbf9f2"  # site's --color-cream-50 (src/app/globals.css)
CANVAS_W, CANVAS_H = 1600, 2000  # overall 4:5, matching PhotoFrame's aspect-[4/5]
TILE_W = (CANVAS_W - GUTTER) // 2
TILE_H = (CANVAS_H - GUTTER) // 2


def cover_crop(img: Image.Image, target_w: int, target_h: int) -> Image.Image:
    """Center-crop `img` to the target aspect ratio, then resize to exact size."""
    src_ratio = img.width / img.height
    target_ratio = target_w / target_h
    if src_ratio > target_ratio:
        new_w = int(img.height * target_ratio)
        left = (img.width - new_w) // 2
        img = img.crop((left, 0, left + new_w, img.height))
    else:
        new_h = int(img.width / target_ratio)
        top = (img.height - new_h) // 2
        img = img.crop((0, top, img.width, top + new_h))
    return img.resize((target_w, target_h), Image.LANCZOS)


def main() -> None:
    canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), BACKGROUND)
    positions = [(0, 0), (TILE_W + GUTTER, 0), (0, TILE_H + GUTTER), (TILE_W + GUTTER, TILE_H + GUTTER)]

    for name, (x, y) in zip(PHOTOS, positions):
        path = SRC / name
        if not path.exists():
            raise SystemExit(f"Missing source photo: {path}\nSee this script's module docstring.")
        img = ImageOps.exif_transpose(Image.open(path))
        canvas.paste(cover_crop(img, TILE_W, TILE_H), (x, y))

    canvas.save(OUT, "JPEG", quality=90)
    print(f"Wrote {OUT} ({canvas.width}x{canvas.height})")


if __name__ == "__main__":
    main()
