# Homepage performance summary

Date: 14 September 2026  
Page: https://rhythmroots.studio/

This note records the PageSpeed Insights findings for the homepage and the code changes made to address them. Scores are Lighthouse **lab** results (emulated Moto G Power + Slow 4G on mobile). There was no Chrome UX Report field data for this origin yet.

## Scores

| Run | Mobile | Desktop | Notes |
|---|---|---|---|
| Baseline ([PSI](https://pagespeed.web.dev/analysis/https-rhythmroots-studio/1h8gigjl46?form_factor=mobile)) | **66** | **87** | Accessibility 96, Best Practices 100, SEO 100 |
| After image + font work | **91–92** | **100** | Lab variance between 91 and 92 |
| After LCP follow-up | *re-test after deploy* | *re-test after deploy* | Changes in this round are local until deployed |

### Baseline mobile lab metrics

| Metric | Value | Lighthouse points (of max) |
|---|---|---|
| Largest Contentful Paint | 13.9 s | 0 / 25 |
| First Contentful Paint | 3.3 s | 4 / 10 |
| Speed Index | 4.9 s | 7 / 10 |
| Total Blocking Time | 0 ms | 30 / 30 |
| Cumulative Layout Shift | 0 | 25 / 25 |
| **Performance** | | **66** |

Server TTFB was ~1 ms. JavaScript was not the problem (0.1 s execution, 0.5 s main-thread). The score was low because LCP contributed **zero** points.

### After first pass (still live when this was written)

| Metric | Mobile | Points |
|---|---|---|
| LCP | 2.9 s | 20 / 25 |
| FCP | 1.9 s | 9 / 10 |
| Speed Index | 4.2 s | 8 / 10 |
| TBT | 0 ms | 30 / 30 |
| CLS | 0 | 25 / 25 |
| **Performance** | **92** | |

Desktop was already at 100. Mobile was short of 100 because LCP was 0.4 s over the 2.5 s “good” line, FCP 0.1 s over 1.8 s, and Speed Index over 3.4 s.

## What was slow

1. **Hero banner PNG (LCP element)** — `rhythm-roots-banner-2.png` was 1,681 KiB. PSI estimated 1,640 KiB savings from a modern format. On Slow 4G that file alone explained the 13.9 s LCP.
2. **Oversized logos** — mobile header logo 1752×813 served at 276×128 (170 KiB). Desktop color logo 1824×870 (188 KiB) was `hidden` on phones but still downloaded. Footer logo 30 KiB for a 32 px-tall image.
3. **Google Fonts `@import`** — Fraunces + Outfit from `fonts.googleapis.com` were render-blocking. PSI estimated **1,960 ms** FCP delay, plus ~181 KiB of woff2 files.
4. **172 KiB favicon** — `rr-fav.png` was used as both the SVG and 32×32 icons. It competed with the LCP image on Slow 4G.
5. **Hero fade-in + Ken Burns on the LCP `<img>`** — text started at opacity 0 (`animation-fill-mode: both`), which hurt Speed Index. Scaling the LCP image itself delayed when Lighthouse counted the paint.

Total page weight at baseline: **2,350 KiB**, almost all first-party images.

## Changes

### 1. Responsive images (`@sveltejs/enhanced-img`)

Added the Vite plugin in `vite.config.ts` and switched homepage images to AVIF/WebP `srcset` with intrinsic width/height.

| Asset | Before | After (typical AVIF) |
|---|---|---|
| Hero `rhythm-roots-banner-2.png` | 1,681 KiB PNG | 14–61 KiB by viewport (640 / 960 / 1280 / 1900 w) |
| Mobile header `rr-logo-white-shadow.png` | 170 KiB | ~17 KiB at 400 w |
| Desktop header `rr-logo-color.png` | 188 KiB, also fetched on phones | ~44 KiB, `min-width: 1024px` only |
| Footer `rr-logo-white.png` | 30 KiB | ~3 KiB at 160 w |
| About photo `about-somer.webp` | 25 KiB (already WebP) | AVIF + srcset + `loading="lazy"` |

The hero is preloaded as AVIF with `fetchpriority="high"` and `sizes="100vw"`. The header uses a `<picture>` with a media query so phones do not download the desktop color logo. Below-fold images use `loading="lazy"`.

Files: `src/routes/+page.svelte`, `vite.config.ts`, `src/lib/enhanced-img-queries.d.ts`, `src/app.d.ts`, `src/lib/index.ts`.

### 2. Self-hosted fonts

Removed:

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:...&family=Outfit:...');
```

Self-host latin-only variable fonts via `@fontsource-variable/outfit` and `@fontsource-variable/fraunces` (`font-display: swap`). Outfit (32 KiB) is preloaded; Fraunces is not, so it does not compete with the LCP image on mobile.

Files: `src/routes/layout.css`, `src/routes/+layout.svelte`.

### 3. Favicon

Replaced `rr-fav.png` (172 KiB) with `favicon.svg` (~1 KiB) and `favicon-32.png` (374 B). Vite inlines both.

File: `src/routes/+layout.svelte`.

### 4. Motion / LCP paint

- Ken Burns zoom moved from the LCP `<img>` onto `.hero-media` (8 s, scale 1.08 → 1, was 14 s from 1.18).
- Removed the hero fade-up so heading and CTAs are visible on first paint.
- `prefers-reduced-motion` still disables the remaining animations.

File: `src/routes/layout.css`, `src/routes/+page.svelte`.

### 5. CSS trim

Dropped unused `@plugin '@tailwindcss/typography'` (no `prose` classes on the site).

## How to re-test

1. Deploy (`npm run deploy`).
2. Re-run [PageSpeed Insights](https://pagespeed.web.dev/) on https://rhythmroots.studio/ (mobile and desktop).
3. Target: mobile LCP ≤ 2.5 s, FCP ≤ 1.8 s, Speed Index ≤ 3.4 s.

## Still unused / leftover

These did not move the performance score and were left alone:

- Cloudflare Insights `beacon.min.js` (legacy JS ~11 KiB, cache 4 KiB).
- Accessibility 96 — contrast ratio, not speed.
- `rr-fav.png` is still in `src/lib/assets/` but is no longer linked from the layout.
