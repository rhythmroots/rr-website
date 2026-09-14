# Exercise pages

Canonical: `handouts/E String Note Exercise/`. Clone it for other string drills (B string, etc.). Adult: no mascot. Kids: no mascot either — small practice pick instead.

Versioned files live in the same folder: `{stem}-adult-v.X.Y` and `{stem}-kids-v.X.Y`. Bump the version when that variant changes; keep the old files.

## Page

Adult:

```css
html,
body,
.page {
	background: #fff;
}
```

No cream `--paper` page fill, no radial sage/blush/ochre washes.

Kids: cream `--paper` plus the sage/blush/ochre washes used on other kids sheets. Colored exercise cards (blush / ochre / sage). No lede. No Reading / Left hand / Feel kickers. Keep the `rhythmroots.studio` footer card. Do not add a character or the grass/logo footer lockup.

Kids type matches the exercise mockup, not the adult sheet: load Fraunces italic 600/700 and **Sour Gummy 500**. Page title stays italic Fraunces ~36px. Exercise titles (`One note at a time`, etc.) are Sour Gummy 500. Jagged marker-stroke SVGs sit behind the eyebrow, Fret map, exercise titles, and footer quote (not rounded pills). **Fret map** stays on its own row so it never overlaps the Open chip. Under-staff letters/fingers are smaller (~12px / 10px) in a shorter viewBox (`860 / 148`).

Page padding `0.3in 0.36in 0.24in`. Then inset **header** and **hero** so they line up with type inside the cards (not the card’s outer edge):

```css
header,
.hero {
	padding: 0 0.12in;
}
```

Fret map, exercise cards, tip row, and footer stay full content width. Adult fret map uses the same sand fill and thin sage-mist border as `.song`. Kids fret map is chips only, with a sage **Fret map** label on its own row so it never overlaps the Open chip.

## Fret map

Five chips, first-position high E (or the matching string). Meta line is **Open / Fret 1 / Fret 2 / …** — no circled ①.

| Chip               | Background                                     | Type (letter + meta)                                  |
| ------------------ | ---------------------------------------------- | ----------------------------------------------------- |
| Open (E / B / …)   | `--forest`                                     | `--paper` (cream) — same as the forest footer         |
| Naturals (F, G, …) | `--terracotta`                                 | `--paper` — same fill as the “Plant the roots” footer |
| Sharps (F♯, G♯, …) | `color-mix(in oklab, var(--ochre) 42%, white)` | `--forest`                                            |

```css
.fret .note {
	font-size: 18px;
}
.fret .meta {
	font-size: 12px;
	color: inherit; /* same as the letter — never ochre/blush overrides */
}
```

## Exercise cards

```css
.song {
	background: color-mix(in oklab, var(--sand) 55%, white);
	border: 1px solid color-mix(in oklab, var(--sage-mist) 38%, white);
	border-radius: 14px;
	padding: 0.12in;
	display: flex;
	flex-direction: column;
	justify-content: center; /* equal space above the title and below the labels */
}
.song-head h2 {
	color: #000;
}
```

Section titles only (`1 · One note at a time`). No “Mm. 1–5 · quarters”.

Tip row stays colored (blush / sage-mist / ochre). A Practice Beats card uses BPM steps, e.g. 55 → 65 → 75.

## Staff (black Bravura)

Staff space = 14. Adult clef: `treble-clef-staff-adult.d.txt` (G-line y=82). Draw the clef **under** the staff lines.

**Color:** every staff path, stem, barline, time signature, note name, and finger number is `#000000`. Not forest, not terracotta.

**Do not flex-stretch the SVG** (that makes oval noteheads round):

```css
.staff-art {
	width: 100%;
	height: auto;
	aspect-ratio: 860 / 172;
	flex: 0 0 auto;
	display: block;
}
```

`viewBox` matches that ratio. `preserveAspectRatio="xMidYMin meet"`.

**4/4** is two Bravura `time-sig-4` glyphs at the D-line and G-line (`translate(78,54)` and `(78,82)` on the 860-wide staff). Never Fraunces “4”.

**Notes:** scale the head + sharp together (~0.82) so they sit in the staff. Keep stem length staff-relative (3.5sp = 49). Down-stems (high notes) attach on the **left** of the tilted oval — not floating off the head:

```html
<g transform="translate(x,y)">
	<g transform="scale(0.82)"><!-- sharp + notehead-black --></g>
	<rect x="-5.80" y="0" width="1.50" height="49.00" />
</g>
```

Sharp ~1.25sp left of the unscaled head, inside the scaled group. Extra advance before every sharp. Place barlines so a following sharp never sits on the bar (`~24px` clearance from note-x after scale).

High E first-position Y: E=47, F/F♯=40, G/G♯=33. Stems down.

When rewriting the three (or more) `<svg class="staff-art">` blocks, replace **all of them in one pass**. Sequential `re.sub(..., count=1)` will overwrite system 1 with system 3 because the new SVG still matches the pattern.

## Labels under the staff

Show a **letter** and a **finger number** only when the pitch changes from the previous note. Reset that memory at the start of each system.

```html
<text … font-size="18" font-weight="700" fill="#000000">F♯</text>
<text … font-size="15" font-weight="600" fill="#000000">2</text>
```

Leave enough viewBox below the staff (labels ~y=126 / y=150 in a 172-tall box) so large type does not hit stems.

High E first-position fingers: open E=0, F=1, F♯=2, G=3, G♯=4.
