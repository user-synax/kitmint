# KitMint — Design System Reference

> **IMPORTANT FOR ALL AI AGENTS**: Before doing ANY UI work in this project, read this file completely. Every color, font, spacing, component pattern, and animation rule is defined here. Do not invent values. Do not use defaults. Reference this file for every frontend decision.

---

## 1. Brand Identity

**Product**: KitMint  
**Tagline**: *Turn an idea into a brand — in 60 seconds.*  
**Aesthetic Direction**: Dark SaaS — confident, minimal, product-forward. Not a portfolio. Not a landing page template. Think Vercel + Linear but with a green identity.  
**Tone**: Calm, fast, capable. No decorative clutter. Every element earns its place.

---

## 2. Color Palette

All colors defined as CSS variables in `globals.css`. Use these variables **always** — never hardcode hex values in components.

```css
:root {
  /* Brand */
  --primary:         #16A34A;   /* Green-700 — CTA, active states, highlights */
  --primary-hover:   #15803D;   /* Green-800 — hover state for primary elements */
  --primary-muted:   #14532D1A; /* Green with 10% opacity — subtle backgrounds */
  --primary-text:    #4ADE80;   /* Green-400 — green text on dark backgrounds */

  /* Surfaces */
  --background:      #0A0A0A;   /* Primary app background */
  --surface:         #111111;   /* Cards, sidebars, modals */
  --surface-2:       #1A1A1A;   /* Elevated containers, hover states on cards */
  --surface-3:       #222222;   /* Input backgrounds, code blocks */

  /* Text */
  --text-primary:    #F9FAFB;   /* Headlines, labels, primary content */
  --text-secondary:  #9CA3AF;   /* Metadata, supporting text, placeholders */
  --text-muted:      #6B7280;   /* Disabled states, timestamps */

  /* Borders */
  --border:          #1F2937;   /* Default border */
  --border-muted:    #111827;   /* Subtle dividers */
  --border-active:   #16A34A;   /* Focused inputs, selected state */

  /* Semantic */
  --success:         #16A34A;
  --warning:         #D97706;
  --warning-bg:      #D977061A;
  --error:           #DC2626;
  --error-bg:        #DC26261A;

  /* Neutral grays */
  --secondary:       #4B5563;
  --neutral:         #9CA3AF;
}
```

### Color Usage Rules
- **Never** use `--primary` as a background on large surfaces. Use `--primary-muted` instead.
- `--surface-2` is for hover states on `--surface` elements only.
- `--text-secondary` for all secondary labels. `--text-muted` for disabled only.
- Green (`--primary-text`) on dark backgrounds for inline text highlights.
- `--border` on cards. `--border-active` only on focused/selected interactive elements.

---

## 3. Typography

Fonts loaded from Google Fonts in `layout.js`.

```js
// app/layout.js
import { DM_Sans, JetBrains_Mono } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
})
```

```css
/* globals.css */
--font-sans: 'DM Sans', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Type Scale

| Token       | Size     | Weight | Line Height | Usage                        |
|-------------|----------|--------|-------------|------------------------------|
| `display`   | 3.5rem   | 800    | 1.1         | Hero headings only           |
| `h1`        | 2.25rem  | 700    | 1.2         | Page titles                  |
| `h2`        | 1.75rem  | 700    | 1.25        | Section headings             |
| `h3`        | 1.25rem  | 600    | 1.3         | Card titles, modal headers   |
| `body-lg`   | 1.0625rem| 400    | 1.6         | Landing page body            |
| `body`      | 0.9375rem| 400    | 1.6         | Default body text            |
| `body-sm`   | 0.875rem | 400    | 1.5         | Secondary descriptions       |
| `label`     | 0.8125rem| 500    | 1.4         | Form labels, tags, badges    |
| `code`      | 0.875rem | 400    | 1.6         | Code blocks, mono content    |

### Typography Rules
- **Display headings** (hero): `font-weight: 800`, `letter-spacing: -0.02em`
- **H1–H2**: `font-weight: 700`, `letter-spacing: -0.015em`
- **H3 and below**: `font-weight: 600`, `letter-spacing: -0.01em`
- **Body**: `font-weight: 400`, normal tracking
- **All code/hex/technical values**: always use `--font-mono`
- Never use `font-weight: 900` — DM Sans 800 is the max

---

## 4. Spacing System

Base unit: `4px` (Tailwind default). Use only these spacing values:

```
4px   (1)  — micro gaps, icon padding
8px   (2)  — tight inline spacing
12px  (3)  — compact component padding
16px  (4)  — default padding
20px  (5)  — comfortable padding
24px  (6)  — section internal padding
32px  (8)  — card padding
40px  (10) — section gap
48px  (12) — large section padding
64px  (16) — page section gap
80px  (20) — hero padding
```

---

## 5. Border Radius

| Token       | Value    | Usage                                |
|-------------|----------|--------------------------------------|
| `rounded-sm`| 4px      | Badges, tags, small chips            |
| `rounded`   | 6px      | Buttons, inputs                      |
| `rounded-md`| 8px      | Cards, dropdowns                     |
| `rounded-lg`| 12px     | Modals, large cards                  |
| `rounded-xl`| 16px     | Feature cards, kit preview containers|
| `rounded-full`| 9999px | Avatars, pill badges only            |

---

## 6. Component Patterns

### Buttons

```
Primary:    bg-[--primary] text-white hover:bg-[--primary-hover]
Ghost:      bg-transparent border border-[--border] text-[--text-secondary] hover:bg-[--surface-2] hover:text-[--text-primary]
Destructive: bg-transparent border border-[--error-bg] text-[--error] hover:bg-[--error-bg]
```

- Height: `h-9` (36px) default, `h-10` (40px) for CTAs
- Padding: `px-4` default, `px-6` for primary CTAs
- Font: `text-sm font-medium`
- **No `hover:scale` or `hover:transform` animations on buttons — ever.**
- Loading state: replace label with spinner, keep same width

### Cards

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 8px; /* rounded-md */
```

- Hover state: `hover:bg-[--surface-2] hover:border-[--border-active]/30`
- **No box-shadow on cards.** Border only.
- Padding inside cards: `p-6` default, `p-4` for compact cards

### Inputs / Textareas

```css
background: var(--surface-3);
border: 1px solid var(--border);
border-radius: 6px;
color: var(--text-primary);
```

- Focus: `border-[--border-active]` with `outline-none ring-0`
- Placeholder: `text-[--text-muted]`
- Font size: `text-sm`
- Height: `h-10` for inputs

### Badges / Tags

```
Default: bg-[--surface-2] text-[--text-secondary] border border-[--border]
Green:   bg-[--primary-muted] text-[--primary-text]
Warning: bg-[--warning-bg] text-[--warning]
Error:   bg-[--error-bg] text-[--error]
```

- Size: `text-xs font-medium px-2 py-0.5 rounded-sm`

### Dividers
- Use `border-[--border-muted]` for horizontal rules
- `<Separator />` from shadcn with `className="bg-[--border-muted]"`

---

## 7. Kit Card (Core Component)

The kit card is the most important component in this app. It appears in the gallery, dashboard, and history.

```
Structure:
┌─────────────────────────────────┐
│ Color swatch bar (5 colors)     │  ← h-2, full width, no border-radius on top
├─────────────────────────────────┤
│ [Brand name]        [Plan badge]│  ← h3 + badge
│ [Tagline]                       │  ← text-sm text-secondary
│                                 │
│ [Font pair]    [Views]          │  ← label + icon
│ [Time ago]                      │  ← text-muted
└─────────────────────────────────┘
```

- Card: `rounded-md overflow-hidden` (so color bar clips)
- Color bar: 5 divs flex, each `flex-1 h-2`
- On hover: show "View Kit →" overlay with `bg-black/60`

---

## 8. Layout

### Page Layout
```
Max width: 1200px (max-w-[1200px] mx-auto)
Horizontal padding: px-4 (mobile), px-6 (md), px-8 (lg)
```

### Navbar
- Height: `h-14`
- Background: `bg-[--background]/80 backdrop-blur-md`
- Border bottom: `border-b border-[--border-muted]`
- Logo: `text-base font-700 text-[--text-primary]` + green dot accent
- Sticky: `sticky top-0 z-50`

### Sidebar (Dashboard only)
- Width: `w-56`
- Background: `bg-[--surface]`
- Border right: `border-r border-[--border]`

---

## 9. Animation Rules

**Allowed animations:**
```css
/* Fade in — use for page content, modals */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Pulse — use for loading skeleton only */
/* Spin — use for loading spinners only */
```

**Forbidden:**
- `hover:scale-*` — never
- `hover:translate-*` — never
- `hover:-translate-y-*` — never
- `transition-transform` on interactive elements — never
- Any animation on buttons that moves them

**Allowed on hover:**
- `hover:bg-*` color transitions
- `hover:text-*` color transitions
- `hover:border-*` color transitions
- `hover:opacity-*`
- `transition-colors duration-150` — always this duration, never longer

---

## 10. Loading & Empty States

### Skeleton
```
bg-[--surface-2] animate-pulse rounded-md
```
- Match exact dimensions of the content it replaces
- Never use a spinner for content that takes >1s to load — use skeleton

### Empty State
```
border border-dashed border-[--border] rounded-lg p-12 text-center
Icon (24px) text-[--text-muted] mx-auto mb-3
h3 text-[--text-primary] font-600 mb-1
p text-[--text-secondary] text-sm mb-4
[CTA Button]
```

### Spinner
```
w-4 h-4 border-2 border-[--border] border-t-[--primary] rounded-full animate-spin
```

---

## 11. shadcn/ui Configuration

```json
// components.json
{
  "style": "new-york",
  "rsc": true,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  }
}
```

**shadcn components used in this project:**
`Button`, `Input`, `Textarea`, `Card`, `Badge`, `Separator`, `Dialog`, `Sheet`, `DropdownMenu`, `Avatar`, `Tooltip`, `Toast (Sonner)`, `Skeleton`, `Tabs`

Override shadcn defaults in `globals.css` to match this design system — do not edit component files directly.

---

## 12. Kit Generation UI Flow

```
[Home] 
  → Input: "Describe your startup idea" (Textarea, max 280 chars)
  → Button: "Generate Kit" (Primary, full-width on mobile)
  → Guest: allowed 1 generation
  
[Generating State]
  → Full page overlay with animated steps:
    "Naming your brand..."
    "Picking your colors..."  
    "Writing your copy..."
  → Each step fades in with 600ms delay
  → Do NOT use a generic spinner here — this moment must feel premium

[Kit Result Page] /kit/[slug]
  → Brand names (3 options, selectable)
  → Color palette (5 swatches with hex + name)
  → Font pairing display
  → Landing page hero copy
  → Twitter thread (expandable)
  → ProductHunt description
  → Pricing copy
  → Actions: [Publish to Gallery] [Copy all] [Sign up to save]
```

---

## 13. File Structure Reference

```
kitmint/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   └── settings/
│   ├── gallery/
│   ├── kit/[slug]/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── generate-kit/
│   │   └── kit/
│   ├── globals.css
│   └── layout.js
├── components/
│   ├── ui/          ← shadcn components only
│   ├── kit/         ← KitCard, KitResult, ColorSwatch
│   ├── layout/      ← Navbar, Sidebar, Footer
│   └── shared/      ← LoadingSteps, EmptyState, Skeleton
├── lib/
│   ├── db.js        ← mongoose connection
│   ├── groq.js      ← groq client + prompt
│   └── auth.js      ← nextauth config
├── models/
│   ├── Kit.js
│   └── User.js
├── design.md        ← THIS FILE
└── .env.local
```

---

## 14. Do Not

- Do not use `Inter`, `Roboto`, `Arial`, or system fonts anywhere
- Do not hardcode hex values — always use CSS variables
- Do not add `box-shadow` to cards — border only
- Do not use `hover:scale` or `hover:translate` on any element
- Do not use purple, blue, or indigo as accent colors — green is the only accent
- Do not add gradients to buttons
- Do not use `rounded-full` on anything except avatars and pill badges
- Do not write inline styles — Tailwind classes or CSS variables only
- Do not use `@apply` excessively — only for truly repeated patterns
