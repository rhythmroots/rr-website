#!/usr/bin/env python3
"""Transparent PNG cutouts + SVG wrappers for redhead girl poses."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(__file__).resolve().parent
DST = Path("/Users/crawfordjpaul/Local Sites/rr-website/src/lib/assets/characters/redhead girl")
POSES = ["idle", "wave", "pencil", "point", "guitar"]
CREAM = np.array([255.0, 240.0, 217.0])


def dilate(mask: np.ndarray, n: int = 2) -> np.ndarray:
    m = mask.copy()
    for _ in range(n):
        nxt = m.copy()
        nxt[1:] |= m[:-1]
        nxt[:-1] |= m[1:]
        nxt[:, 1:] |= m[:, :-1]
        nxt[:, :-1] |= m[:, 1:]
        m = nxt
    return m


def remove_background(im: Image.Image, pose: str) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(np.float64)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    dist = np.sqrt(((rgb - CREAM) ** 2).sum(axis=2))
    mx = rgb.max(axis=2)
    chroma = mx - rgb.min(axis=2)
    warm = r - b
    rg = r - g
    yy = np.arange(h)[:, None]
    xx = np.arange(w)[None, :]

    is_coral = (r > 170) & (g < 180) & (b < 160) & (r > g + 15) & (r > b + 20)
    is_blue = (b > r + 3) & (b > 50) & (chroma > 15)
    is_hair = (r > 70) & (r > g + 15) & (r > b + 20) & (g < 135) & (chroma > 30)
    is_wood = (r > 125) & (g > 80) & (b < 135) & (warm > 30) & (chroma > 30) & (g < 190)
    is_dark = mx < 95

    near_blue = dilate(is_blue, 5)
    near_shoe = dilate(is_coral | (is_dark & (yy > int(h * 0.75))), 10) & (yy > int(h * 0.72))
    face_zone = yy < int(h * 0.42)

    is_cool_white = (
        (mx > 215)
        & (chroma < 48)
        & (warm < 25)
        & (rg < 10)
        & (b > 200)
        & (near_shoe | face_zone)
    )

    if pose == "pencil":
        is_ink = (
            (mx < 70)
            & (yy > int(h * 0.40))
            & (yy < int(h * 0.62))
            & (xx > int(w * 0.32))
            & (xx < int(w * 0.68))
        )
        near_ink = dilate(is_ink, 5)
        far_from_jeans = ~dilate(is_blue, 14)
        is_notebook = (
            near_ink
            & far_from_jeans
            & (yy > int(h * 0.40))
            & (yy < int(h * 0.62))
            & (mx > 210)
            & (chroma < 60)
            & (warm > 8)
        )
    else:
        is_notebook = np.zeros((h, w), dtype=bool)

    is_skin = (
        near_blue
        & (yy < int(h * 0.90))
        & (dist > 50)
        & (r > 175)
        & (g > 110)
        & (g < 185)
        & (b > 80)
        & (b < 175)
        & (warm > 30)
        & (chroma > 35)
        & (chroma < 140)
    )

    hard_protect = (
        is_coral | is_blue | is_hair | is_wood | is_skin | is_cool_white | is_dark | is_notebook
    )

    is_cream = (
        ~hard_protect
        & (warm > 12)
        & ((dist < 52) | ((mx > 205) & (chroma < 62) & (dist < 90)))
    )
    is_peach = (
        (yy >= int(h * 0.72))
        & ~hard_protect
        & ~is_cool_white
        & ~is_notebook
        & (warm > 20)
        & (g > 150)
        & (g < 230)
        & (r > 155)
        & (chroma > 18)
        & (chroma < 115)
        & (dist > 12)
        & (dist < 125)
    )

    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    def try_add(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not visited[y, x] and (is_cream[y, x] or is_peach[y, x]):
            visited[y, x] = True
            q.append((x, y))

    for x in range(w):
        try_add(x, 0)
        try_add(x, h - 1)
    for y in range(h):
        try_add(0, y)
        try_add(w - 1, y)
    while q:
        x, y = q.popleft()
        try_add(x - 1, y)
        try_add(x + 1, y)
        try_add(x, y - 1)
        try_add(x, y + 1)

    visited |= is_cream
    visited |= is_peach

    # Force-clear warm pale between jean runs (above shoes)
    blueish = is_blue | ((b > 70) & (b > r) & (chroma > 10))
    force_pale = (
        ~is_blue
        & ~is_coral
        & ~is_skin
        & ~is_hair
        & ~is_wood
        & ~is_notebook
        & ~is_cool_white
        & (warm > 10)
        & (mx > 190)
        & (chroma < 70)
    )
    shoe_y = int(h * 0.78)
    for y in range(int(h * 0.38), shoe_y):
        xs = np.where(blueish[y])[0]
        if len(xs) < 2:
            continue
        runs: list[tuple[int, int]] = []
        start = prev = int(xs[0])
        for x in xs[1:]:
            x = int(x)
            if x > prev + 2:
                runs.append((start, prev))
                start = x
            prev = x
        runs.append((start, prev))
        if len(runs) < 2:
            continue
        left, right = runs[0][1] + 1, runs[-1][0] - 1
        if right <= left:
            continue
        for x in range(left, right + 1):
            if force_pale[y, x] or is_cream[y, x]:
                visited[y, x] = True

    # Pencil sitting: punch all non-notebook cream/peach in lower body
    if pose == "pencil":
        pocket = (
            (yy > int(h * 0.58))
            & ~hard_protect
            & ~is_cool_white
            & ~is_notebook
            & (
                is_cream
                | is_peach
                | ((warm > 14) & (mx > 195) & (chroma < 75) & (dist < 95))
            )
        )
        visited |= pocket

    pale_ground = (
        (yy >= int(h * 0.78))
        & ~hard_protect
        & ~is_cool_white
        & ~is_notebook
        & (warm > 12)
        & (g > 140)
        & (g < 235)
        & (r > 145)
        & (chroma < 125)
    )
    grow_q: deque[tuple[int, int]] = deque()
    ys, xs = np.where(visited & (yy >= int(h * 0.75)))
    for y, x in zip(ys, xs):
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx] and pale_ground[ny, nx]:
                visited[ny, nx] = True
                grow_q.append((nx, ny))
    while grow_q:
        x, y = grow_q.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx] and pale_ground[ny, nx]:
                visited[ny, nx] = True
                grow_q.append((nx, ny))

    shoeish = is_coral | is_cool_white | (is_dark & (yy > int(h * 0.72)))
    for y in range(int(h * 0.75), h):
        row_anchor = blueish[y] | shoeish[y]
        runs = []
        x = 0
        while x < w:
            if row_anchor[x]:
                x0 = x
                while x < w and row_anchor[x]:
                    x += 1
                runs.append((x0, x - 1))
            else:
                x += 1
        if len(runs) < 2:
            continue
        left, right = runs[0][1] + 1, runs[-1][0] - 1
        if right <= left:
            continue
        for x in range(left, right + 1):
            if pale_ground[y, x] or (force_pale[y, x] and not is_cool_white[y, x]):
                visited[y, x] = True

    char = hard_protect
    for x in range(w):
        ys_c = np.where(char[:, x])[0]
        if len(ys_c) == 0:
            continue
        bottom = int(ys_c.max())
        for y in range(bottom + 1, h):
            if (pale_ground[y, x] or is_cream[y, x] or is_peach[y, x]) and not is_cool_white[y, x]:
                visited[y, x] = True

    grow = visited.copy()
    for _ in range(3):
        nxt = grow.copy()
        nxt[1:] |= grow[:-1]
        nxt[:-1] |= grow[1:]
        nxt[:, 1:] |= grow[:, :-1]
        nxt[:, :-1] |= grow[:, 1:]
        grow = nxt
    fringe = (
        grow
        & ~visited
        & ~hard_protect
        & ~is_cool_white
        & ~is_notebook
        & (warm > 8)
        & (mx > 185)
        & (chroma < 70)
        & ((dist < 80) | ((r > 205) & (g > 190) & (warm > 8)))
    )

    alpha = np.full((h, w), 255, dtype=np.uint8)
    alpha[visited] = 0
    strength = np.clip((50 - dist) / 50.0, 0, 1)
    alpha[fringe] = (255 * (1 - np.maximum(strength[fringe], 0.8))).astype(np.uint8)

    out = arr.copy()
    out[:, :, 3] = alpha
    return Image.fromarray(out)


def crop_alpha(im: Image.Image, pad: int = 2) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    return im.crop(
        (max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad))
    )


def main() -> None:
    DST.mkdir(parents=True, exist_ok=True)
    for name in POSES:
        cut = crop_alpha(remove_background(Image.open(SRC / f"{name}.png"), name))
        cut.save(DST / f"{name}.png", optimize=True)
        ww, hh = cut.size
        (DST / f"{name}.svg").write_text(
            f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {ww} {hh}" width="{ww}" height="{hh}">
  <title>Rhythm Roots redhead girl — {name}</title>
  <image width="{ww}" height="{hh}" href="{name}.png" xlink:href="{name}.png" preserveAspectRatio="xMidYMid meet"/>
</svg>
"""
        )
        print(name, cut.size)


if __name__ == "__main__":
    main()
