# Rhythm Roots notation glyphs

Bravura (SMuFL) outlines for print handouts. Prefer these over hand-drawn ellipses/rects.

## Card icons (`viewBox="0 0 80 56"`)

| File | Symbol |
|------|--------|
| `whole-note.path.svg` | Whole note |
| `half-note.path.svg` | Half note |
| `quarter-note.path.svg` | Quarter note |
| `eighth-note.path.svg` | Eighth note |
| `quarter-rest.path.svg` | Quarter rest |

Use `fill="currentColor"` (or `#0d2b2a`) and inline the `<path d="...">` from the matching `.d.txt` when embedding in handout HTML.

## Staff clefs

Pre-transformed for letter handouts with staff space = 14px:

- `treble-clef-staff-kids.d.txt` — G-line at y=78
- `treble-clef-staff-adult.d.txt` — G-line at y=82

Draw the clef **under** staff lines so lines pass through the glyph.

## Staff noteheads (`staffSpace = 14`)

Centered at `(0,0)` — place with `transform="translate(x,y)"` where `y` is the pitch line/space:

| File | Symbol |
|------|--------|
| `notehead-black.d.txt` | Filled head (quarter / eighth) |
| `notehead-half.d.txt` | Open head (half note) |
| `accidental-sharp.d.txt` | Sharp (♯) — place ~1.25sp left of notehead |

Add a stem as a rect (~0.14×3.5 staff spaces). Do **not** scale the card-icon quarter/half glyphs onto a staff — those are for value cards only.
