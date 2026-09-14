---
name: rhythm-roots-handouts
description: >-
  Creates and updates Rhythm Roots print handouts — letter-size HTML, Bravura
  notation, kids vs adult variants, character mascots, exercise/practice sheets,
  and Chrome PDF/PNG export. Use when creating, editing, restyling, or exporting
  files under handouts/, or when the user mentions handouts, worksheets, lesson
  PDFs, exercise pages, fret maps, kids/adult versions, guitar notation, or
  mascots.
---

# Rhythm Roots handouts

Letter (8.5×11) HTML in `handouts/`, printed to PDF via headless Chrome.

Before drawing notation or inventing layout, read a recent sibling and copy its tokens.

| Kind | Canonical |
|------|-----------|
| Lesson / explainer | `handouts/Hold and Play/`, `handouts/Parts of the Guitar Kids/` |
| Exercise / practice | `handouts/E String Note Exercise/` — see [exercise-pages.md](exercise-pages.md) |

## Workflow

1. **Match audience** — Kids or adult (or both). Kids: warmer copy, shorter sentences, mascot. Adult: tighter language, no mascot.
2. **Clone, don’t invent** — Copy CSS variables, page chrome, header, and footer from the nearest existing handout of the same kind.
3. **Write HTML** in a new or existing folder (see Naming).
4. **Reuse assets** from `handouts/assets/` and `handouts/characters/`. Generate a new illustration only when nothing fits; then cut out cream/white backgrounds.
5. **Render** PDF + PNG with [scripts/render.sh](scripts/render.sh).
6. **Inspect the PNG** (open the image). Fix overflow, empty bands, colliding type, swashed `&`, and clipped mascots. Re-render until the page is tight.

```
Task progress:
- [ ] Audience + sibling template chosen (lesson vs exercise)
- [ ] HTML on a fixed letter page
- [ ] Bravura glyphs only (no fake notes)
- [ ] PDF + PNG rendered
- [ ] PNG inspected and spacing fixed
```

## Naming & files

| What | Pattern | Example |
|------|---------|---------|
| Folder | Title Case | `handouts/Hold and Play/` |
| Kids/adult pair | suffix the folder | `Parts of the Guitar Kids/`, `Parts of the Guitar Adult/` |
| HTML / PDF / PNG | kebab-case | `hold-and-play.html` |
| Kids filename | `-kids` when the pair needs it | `eb-strings-kids.html` |
| Versioned exercise files | `{stem}-adult-v.X.Y` / `{stem}-kids-v.X.Y` | `e-string-note-exercise-adult-v.1.0.html` |

Keep prior versions. When an exercise sheet changes, **bump that variant’s version** (`v.1.0` → `v.1.1`) and write new `.html` / `.pdf` / `.png` beside it. Do not overwrite the previous version.

Ship `.html` + letter PDF (+ PNG preview) in the same folder.

Relative assets only: `../assets/`, `../characters/`. Logo: `../assets/logo.png` (not `logo-color.png`).

## Page chrome

Fixed page — do not let content paginate accidentally:

```css
@page { size: letter portrait; margin: 0; }
html, body { width: 8.5in; height: 11in; }
.page { width: 8.5in; height: 11in; overflow: hidden; }
```

Also set `-webkit-print-color-adjust: exact; print-color-adjust: exact`.

**Structure:** logo header → optional pills → terracotta eyebrow + Fraunces title + lede → content → footer.

**Fonts:** Fraunces (display) + Outfit (sans), loaded from Google Fonts.

**Colors** (copy from an existing `:root`): `--forest #475d53`, `--terracotta #d05e53`, `--sage`, `--ochre`, `--blush`, `--sand`, `--paper #faf7f1`.

**Lesson pages** may use cream `--paper` and soft radial washes. **Adult exercise pages** are flat **white** (`#fff`) — no cream page fill, no gradient blobs. **Kids exercise pages** use cream `--paper` and the same sage/blush/ochre washes as other kids sheets.

**Footer** (every page): terracotta block with kicker `Rhythm Roots` + quote `Plant the roots. Find the rhythm.` and forest block with `rhythmroots.studio`.

**Ampersands:** Fraunces ships a swashed `&` that fails at title size. Wrap it: `<span class="amp">&amp;</span>` with `font-family: var(--sans)`.

**Multi-page:** one `.page` per letter sheet (see `E B Strings Kids`). Repeat header + footer on each.

## Kids vs adult

| | Kids | Adult |
|---|---|---|
| Copy | Friendly, spoken, “let’s” / “!” ok | Compact, instructional |
| Mascot | Lesson pages: girl or boy from `handouts/characters/`. Exercise pages: **no mascot** (practice pick instead) | None |
| Notation | Same Bravura glyphs; kids clef file | Adult clef file |

Prefer existing cutouts (`guitar-cutout.png`, `boy1-tshirt-point-left.png`, `neighbors.png`) over regenerating poses.

## Exercise pages

Canonical: `handouts/E String Note Exercise/`. Clone it for B-string and later drills. Full engraving rules: [exercise-pages.md](exercise-pages.md).

- Adult: white page; header + hero `padding: 0 0.12in` so logo/title/pills line up with type inside the cards
- Kids: cream page + washes; numbered color cards; small practice pick (no character); no lede; no Reading / Left hand / Feel kickers; keep `rhythmroots.studio` footer card; Fret map is sage italic type **above** the chips (never overlapping Open); jagged marker strokes behind eyebrow / Fret map / exercise titles / footer quote; exercise titles use **Sour Gummy 500**
- Fret map chips: open = forest + cream type; naturals (F, G) = terracotta + cream type (same fill as the footer quote box); sharps (F♯, G♯) = ochre mix + **forest** type. Meta under each letter is larger (~12px) and `color: inherit`
- Exercise cards: thin light-green border (`sage-mist` mixed with white), equal padding (~0.12in), `justify-content: center`
- Section titles only (no “Mm. 1–5 · quarters”). Titles, staff, note names, and finger numbers are **black** (`#000`)
- Note names and finger numbers under the staff only when the pitch changes (reset each system). Size them large (letters ~18px, fingers ~15px)
- Bravura staff, black fill/stroke. Do **not** `flex`-stretch the SVG (that rounds noteheads). Use `width: 100%; height: auto; aspect-ratio: …; flex: 0 0 auto`
- When regenerating multiple staff SVGs, replace **all** of them in one pass

## Music notation (required)

Use **Bravura / SMuFL** from `handouts/assets/notation/`. Never hand-draw ellipses, rect stacks, or scribble clefs.

Read `handouts/assets/notation/README.md` + `manifest.json` before placing any symbol. Inline `<path d="…">` from the matching `.d.txt`.

- **Lesson / card icons:** fill `#475d53` or `currentColor`
- **Exercise staves:** fill and stroke `#000000`
- **Card icons** (`viewBox="0 0 80 56"`): `whole-note`, `half-note`, `quarter-note`, `eighth-note`, `quarter-rest`
- **Staff noteheads** (staffSpace=14, centered at 0,0): `notehead-black`, `notehead-half` — `translate(x,y)` + stem rect. Do **not** scale card-icon glyphs onto a staff
- **Sharp:** `accidental-sharp` — center on pitch, ~1.25sp left of notehead
- **Clef:** `treble-clef-staff-kids.d.txt` / `treble-clef-staff-adult.d.txt` — draw **under** staff lines
- **4/4:** Bravura `time-sig-4` stacked on the D-line and G-line — not Fraunces text
- **New symbol:** extract from Bravura (SMuFL), add files, update `manifest.json`

```html
<!-- ✅ card glyph -->
<svg viewBox="0 0 80 56" aria-hidden="true">
  <path fill="#475d53" d="…from quarter-note.d.txt"/>
</svg>
```

## Illustrations

Need a new drawing (pose, pick grip, etc.):

1. Match existing character style (clean outlines, flat cel-shading, warm palette). Use `handouts/characters/girl/samples/` as style refs.
2. Flood-fill cream/white backgrounds to alpha. Reuse the flood-fill approach in `handouts/characters/*/make_transparent_cutouts.py` or `handouts/Hold and Play/make_cutouts.py`.
3. Place cutouts on `--paper`; framed photos (wood/scene backgrounds) can keep a rounded panel. Exercise pages sit on white.

## Render

From repo root:

```bash
.cursor/skills/rhythm-roots-handouts/scripts/render.sh "handouts/Hold and Play/hold-and-play.html"
```

Requires Google Chrome at `/Applications/Google Chrome.app`. Writes `<name>.pdf` and a 2× `<name>.png` beside the HTML.

`--virtual-time-budget=6000` is required so Google Fonts load over `file://`.

## Done when

- One letter sheet per `.page`, nothing clipped, no large empty bands
- Notation is Bravura, not placeholders
- Lesson kids sheets have a mascot; adult sheets do not. Exercise kids sheets use a small practice pick, not a character
- Exercise pages match `E String Note Exercise` (adult: white page; kids: cream + washes; black staff; fret-map chips)
- `.html`, `.pdf`, and `.png` exist in the handout folder
