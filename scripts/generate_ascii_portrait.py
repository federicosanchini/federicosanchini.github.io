#!/usr/bin/env python3
"""Generate a responsive, animated ASCII SVG portrait from a photograph."""

from __future__ import annotations

import argparse
import html
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


RAMP = " .`:-=+*#%@"
COLS = 72
CHAR_WIDTH = 7.2
FONT_SIZE = 12
LINE_HEIGHT = 13.5
PADDING = 12


def portrait_lines(image: Image.Image, cols: int) -> list[str]:
    image = ImageOps.exif_transpose(image).convert("RGB")

    # Tight portrait crop: hair to upper chest, with enough shoulder silhouette.
    image = image.crop((150, 285, 1050, 1450))
    gray = ImageOps.grayscale(image)
    gray = gray.filter(ImageFilter.GaussianBlur(radius=0.45))
    gray = ImageOps.autocontrast(gray, cutoff=(1, 1))
    gray = ImageEnhance.Contrast(gray).enhance(1.18)

    width, height = gray.size
    rows = round(cols * (height / width) * 0.48)
    gray = gray.resize((cols, rows), Image.Resampling.LANCZOS)

    lines: list[str] = []
    for row in range(rows):
        characters = []
        for col in range(cols):
            brightness = gray.getpixel((col, row))
            darkness = max(0.0, min(1.0, 1.0 - brightness / 255.0))

            # Remove the pale wall while preserving the softer tones of the face.
            if brightness > 224:
                characters.append(" ")
                continue

            level = darkness ** 0.72
            index = min(len(RAMP) - 1, round(level * (len(RAMP) - 1)))
            characters.append(RAMP[index])

        lines.append("".join(characters).rstrip())

    while lines and sum(character != " " for character in lines[0]) < 4:
        lines.pop(0)
    while lines and sum(character != " " for character in lines[-1]) < 4:
        lines.pop()
    return lines


def build_svg(lines: list[str], cols: int) -> str:
    width = round(cols * CHAR_WIDTH + 2 * PADDING)
    height = round(len(lines) * LINE_HEIGHT + 2 * PADDING)

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}" role="img" aria-labelledby="title description">',
        '<title id="title">ASCII portrait of Federico Sanchini</title>',
        '<desc id="description">A photographic portrait reconstructed from animated typographic characters.</desc>',
        """<defs>
  <linearGradient id="portrait-gradient" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#8cf2c6"/>
    <stop offset="1" stop-color="#7eb6ff"/>
  </linearGradient>
</defs>
<style>
  text {
    fill: url(#portrait-gradient);
    font-family: "DM Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 12px;
  }
  .row-reveal {
    width: 0;
    animation: reveal .18s ease-out var(--delay) forwards;
  }
  @keyframes reveal { to { width: var(--row-width); } }
  @media (prefers-reduced-motion: reduce) {
    .row-reveal { width: var(--row-width); animation: none; }
  }
</style>""",
    ]

    for index, line in enumerate(lines):
        y = PADDING + index * LINE_HEIGHT
        row_width = max(1, len(line)) * CHAR_WIDTH
        delay = index * 0.045
        safe_line = html.escape(line)
        parts.extend(
            [
                f'<clipPath id="row-{index}"><rect class="row-reveal" x="{PADDING}" y="{y:.1f}" '
                f'height="{LINE_HEIGHT:.1f}" style="--row-width:{row_width:.1f}px;--delay:{delay:.3f}s"/></clipPath>',
                f'<text x="{PADDING}" y="{y + FONT_SIZE:.1f}" xml:space="preserve" '
                f'clip-path="url(#row-{index})">{safe_line}</text>',
            ]
        )

    parts.append("</svg>")
    return "\n".join(parts)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--cols", type=int, default=COLS)
    args = parser.parse_args()

    with Image.open(args.input) as image:
        lines = portrait_lines(image, args.cols)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(build_svg(lines, args.cols), encoding="utf-8")
    print(f"Generated {args.output} ({args.cols} columns, {len(lines)} rows)")


if __name__ == "__main__":
    main()
