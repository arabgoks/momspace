# MomSpace Government Dashboard (Next.js) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the static HTML/CDN-React design prototype at `design_handoff_momspace/dashboard.jsx` into a real Next.js app for Dinas Kesehatan DKI Jakarta, with real routing between pages and every currently-decorative element made genuinely interactive — frontend/mockup only, no backend.

**Architecture:** A brand-new, independent Next.js 14 (App Router, TypeScript) project in a new top-level `dashboard/` folder in this repo, sibling to the Flutter app. The prototype's single-file `dashboard.jsx` is real, portable React (confirmed by reading it in full) — it is split into per-component `.tsx` files under `components/`, with static data extracted into `lib/data.ts` and design tokens into `lib/colors.ts`. Styling is ported using the same inline `style={{}}` objects the source already uses (not rewritten into Tailwind utility classes) — see Global Constraints for why.

**Tech Stack:** Next.js 14.2.x, React 18, TypeScript, App Router. No charting/mapping library (hand-rolled SVG, matching the source). No state-management library (page-local `useState` + one small Toast context, matching the source's own complexity level).

## Global Constraints

- **No backend, no auth.** All data is static (ported from `dashboard.jsx`) or local component state. All 5 routes are publicly reachable.
- **Node prerequisite:** this environment's Node is v16.20.2, below `create-next-app`'s minimum (18.18). Node must be upgraded to 20 LTS before Task 0's scaffold step — this is a hard blocker, not optional.
- **Styling: inline `style={{}}` objects ported directly from `design_handoff_momspace/dashboard.jsx`, not rewritten into Tailwind classes.** The source already expresses every visual value as inline styles; re-deriving equivalent Tailwind utility classes by hand is extra transcription work that risks subtle spacing/color drift for zero fidelity gain. `create-next-app` is still scaffolded with `--tailwind` (harmless, standard boilerplate) but components in this plan use inline styles exclusively, copied verbatim from the source with only these mechanical JS→TSX changes:
  - add types, `'use client'` where needed, real imports instead of the source's `Object.assign(window, {...})` globals.
  - **`fontFamily` values are rewritten to the `next/font` CSS variables, not left as literal family-name strings.** `next/font/google` (wired in Task 2) generates a hashed internal font-family name per font, exposed only via the CSS custom properties `--font-nunito`/`--font-quicksand`/`--font-jetbrains-mono` on `<html>`. A literal `fontFamily: 'Nunito'` string (as the source uses) would silently miss the self-hosted font and fall back to whatever "Nunito" the visitor's OS happens to have (usually nothing, so a generic sans-serif). Every component below therefore uses `fontFamily: 'var(--font-nunito)'` / `'var(--font-quicksand)'` / `'var(--font-jetbrains-mono)'` in place of the source's `'Nunito'` / `'Quicksand'` / `'JetBrains Mono'` — this is the one systematic rewrite applied when porting, everything else is copied as-is.
- **Design tokens:** the `const G = {...}` object and `gapColor()` function are ported verbatim into `lib/colors.ts` — do not alter any hex value.
- **Data:** the 14-kecamatan dataset, `TOP5`/`TOP10_BAR` derivations, and 6-month `TREND` data are ported verbatim into `lib/data.ts` — exact values are given in each task below, copied directly from `design_handoff_momspace/dashboard.jsx`.
- **Indonesian UI copy** is copied verbatim from the source where it exists; only the 3 no-spec pages (`aktivitas-pengguna`'s empty state, `pengaturan`'s toggles, `laporan-fasilitas`'s filter tabs) need freshly authored copy — keep it in the same voice (formal but plain, "Anda"-free, matches existing copy like "Butuh tindak lanjut").
- After every task, run `npm run build` in `dashboard/` and fix any TypeScript/build errors before proceeding.

---

## File Structure

```
dashboard/
  app/
    layout.tsx                       — fonts, ToastProvider, globals.css
    globals.css
    page.tsx                         — redirect('/peta-distribusi')
    (dashboard)/
      layout.tsx                     — Sidebar + main shell, shared by all 5 pages
      peta-distribusi/page.tsx
      gap-score/page.tsx
      laporan-fasilitas/page.tsx
      aktivitas-pengguna/page.tsx
      pengaturan/page.tsx
  components/
    layout/Sidebar.tsx               (client — usePathname)
    layout/TopBar.tsx
    layout/DateRangePicker.tsx       (client — popover state)
    ui/Panel.tsx
    ui/Toast.tsx                     (client — Context provider + hook)
    ui/Modal.tsx
    ui/SourcePill.tsx
    ui/LegendBadge.tsx
    ui/LegendDot.tsx
    icons/index.tsx                  — 9 icons ported verbatim
    dashboard/SummaryRow.tsx
    dashboard/ChoroplethMap.tsx      (client — hover state)
    dashboard/Tooltip.tsx
    dashboard/FlagMarker.tsx
    dashboard/GapTable.tsx           (client — expand/collapse state)
    dashboard/ProblemReports.tsx     (client — modal + status state)
    dashboard/ReportDetailModal.tsx
    dashboard/TrendChart.tsx
    dashboard/BarChartTop10.tsx
    dashboard/ScatterPlot.tsx
    dashboard/FormulaCard.tsx
  lib/
    colors.ts                        — G tokens + gapColor()
    data.ts                          — KECAMATAN/TOP5/TOP10_BAR/TREND/PROBLEM_REPORTS
    export.ts                        — downloadCSV()
    svg-utils.ts                     — avgX/avgY
  types/
    dashboard.ts                     — Kecamatan, TrendPoint, ProblemReport
  dashboard/.gitignore
  dashboard/README.md
```

---

### Task 0: Prerequisite check + scaffold

**Files:**
- Create: `dashboard/` (via `create-next-app`)
- Create: `dashboard/README.md`

**Interfaces:**
- Produces: a runnable Next.js 14 project at `dashboard/` with TypeScript, Tailwind (scaffolding only, see Global Constraints), ESLint, App Router, no `src/` directory.

- [ ] **Step 1: Verify Node version**

Run: `node -v`
Expected: `v18.18.0` or higher (ideally v20.x LTS). If the reported version is lower, **stop and install Node 20 LTS** (nvm-windows, or the official Windows installer from nodejs.org) before continuing — `create-next-app` will fail or misbehave on an older Node.

- [ ] **Step 2: Scaffold the project**

From the repo root (`D:\Gemastik\App\momspace`), run:

```bash
npx create-next-app@14 dashboard --typescript --eslint --tailwind --app --no-src-dir --import-alias "@/*" --use-npm
```

Answer any remaining interactive prompts with their default/highlighted option.

- [ ] **Step 3: Verify the scaffold builds**

Run: `cd dashboard && npm run build`
Expected: builds successfully (the default Next.js starter page).

- [ ] **Step 4: Add a scope-boundary README**

Create `dashboard/README.md`:

```markdown
# MomSpace — Dashboard Pemerintah

Government analytics web dashboard for Dinas Kesehatan DKI Jakarta, part of
the MomSpace GEMASTIK XIX 2026 submission (team Gemasfrik).

## Scope

**Frontend/mockup only — there is no backend.** All data on every page is
static, ported from the design prototype at
`../design_handoff_momspace/dashboard.jsx`. There is no authentication —
all routes are publicly reachable. This is intentional, not an oversight:
this build's purpose is to demonstrate the intended UI/UX and interaction
model, not to be a production system.

## Prerequisites

- Node.js 20 LTS or newer (this project will not scaffold or run correctly
  on Node < 18.18).

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/peta-distribusi`.

## Routes

| Route | Status |
|---|---|
| `/peta-distribusi` | Full — choropleth map, Gap Score table, problem reports, trend chart |
| `/gap-score` | Full — Top-10 bar chart, scatter plot, methodology card |
| `/laporan-fasilitas` | Full — extended problem-reports list with status filters |
| `/pengaturan` | Full — account card, local-only preference toggles |
| `/aktivitas-pengguna` | Intentional "coming soon" — no data spec exists for this in the source design; left honest rather than fabricated |
```

- [ ] **Step 5: Add dashboard-specific gitignore entries check**

`create-next-app` already generates `dashboard/.gitignore` with the standard Next.js entries (`node_modules`, `.next`, `.env*.local`, etc.) — verify it exists and do not modify the root Flutter `.gitignore`.

Run: `cat dashboard/.gitignore` (or open it) and confirm it contains at least `node_modules` and `.next`.

- [ ] **Step 6: Commit**

```bash
git add dashboard/
git commit -m "chore: scaffold Next.js dashboard project"
```

---

### Task 1: Types, static data, colors, SVG helpers, CSV export

**Files:**
- Create: `dashboard/types/dashboard.ts`
- Create: `dashboard/lib/colors.ts`
- Create: `dashboard/lib/data.ts`
- Create: `dashboard/lib/svg-utils.ts`
- Create: `dashboard/lib/export.ts`

**Interfaces:**
- Produces: `Kecamatan`, `TrendPoint`, `ProblemReport` types; `G` token object, `gapColor(score: number): string`; `KECAMATAN`, `TOP5`, `TOP10_BAR`, `TREND`, `PROBLEM_REPORTS` data; `avgX(points: string): number`, `avgY(points: string): number`; `downloadCSV(filename: string, rows: Record<string, string | number>[]): void`. Consumed by every later task.

- [ ] **Step 1: Create the types**

Create `dashboard/types/dashboard.ts`:

```typescript
export interface Kecamatan {
  name: string;
  gap: number;
  rooms: number;
  ibu: number;
  points: string;
}

export interface TrendPoint {
  m: string;
  pos: number;
  neg: number;
}

export type ProblemReportStatus = 'open' | 'resolved';

export interface ProblemReport {
  name: string;
  issue: string;
  time: string;
  initial: string;
  detail: string;
  status: ProblemReportStatus;
}
```

- [ ] **Step 2: Create the color tokens + ramp function**

Create `dashboard/lib/colors.ts` (ported verbatim from `design_handoff_momspace/dashboard.jsx`):

```typescript
export const G = {
  rose: '#E8A598',
  roseDk: '#D88B7C',
  roseLt: '#FBEEEA',
  roseDp: '#C97A6E',
  rose03: '#F2C6B8',
  rose05: '#F8DED4',
  sage: '#8FAF8F',
  sageLt: 'rgba(143,175,143,0.18)',
  sageDk: '#6B8A6B',
  muted: '#AAB995',
  surface: '#FEFEFE',
  surface2: '#FBF6F1',
  ink: '#333727',
  body: '#5C5347',
  line: 'rgba(60,40,30,0.08)',
  lineDk: 'rgba(60,40,30,0.12)',
  alert: '#E8998A',
} as const;

/** Gap-score color ramp (0 → 100). */
export function gapColor(score: number): string {
  if (score >= 80) return G.roseDp;
  if (score >= 65) return G.roseDk;
  if (score >= 50) return G.rose;
  if (score >= 35) return G.rose03;
  if (score >= 20) return G.rose05;
  return G.roseLt;
}
```

- [ ] **Step 3: Create the static data**

Create `dashboard/lib/data.ts` (ported verbatim from `design_handoff_momspace/dashboard.jsx`; `PROBLEM_REPORTS` additionally carries a `status`/`detail` field the source didn't need, for Task 5's modal):

```typescript
import type { Kecamatan, TrendPoint, ProblemReport } from '@/types/dashboard';

// 14 simplified Jakarta kecamatan regions for the choropleth.
// Coords are abstract — Jakarta-ish silhouette, not geographic truth.
export const KECAMATAN: Kecamatan[] = [
  // North
  { name: 'Penjaringan', gap: 81, rooms: 3, ibu: 5100, points: '60,40 200,40 260,90 200,140 80,140 50,90' },
  { name: 'Tanjung Priok', gap: 56, rooms: 5, ibu: 4900, points: '260,90 380,60 460,100 440,160 320,170 200,140' },
  { name: 'Cilincing', gap: 42, rooms: 4, ibu: 3600, points: '380,60 540,70 580,140 460,160 460,100' },
  // Central / West
  { name: 'Tambora', gap: 68, rooms: 3, ibu: 5800, points: '50,140 200,140 220,220 80,240' },
  { name: 'Taman Sari', gap: 76, rooms: 2, ibu: 3800, points: '200,140 320,170 320,240 220,220' },
  { name: 'Gambir', gap: 87, rooms: 2, ibu: 4200, points: '320,170 440,160 440,240 320,240' },
  { name: 'Sawah Besar', gap: 71, rooms: 4, ibu: 4600, points: '440,160 580,140 600,220 440,240' },
  // South-center / South
  { name: 'Grogol', gap: 48, rooms: 5, ibu: 4100, points: '80,240 220,220 240,320 110,340' },
  { name: 'Menteng', gap: 32, rooms: 8, ibu: 3400, points: '220,220 320,240 320,320 240,320' },
  { name: 'Setiabudi', gap: 24, rooms: 9, ibu: 3200, points: '320,240 440,240 440,320 320,320' },
  { name: 'Tebet', gap: 38, rooms: 6, ibu: 3700, points: '440,240 600,220 600,320 440,320' },
  { name: 'Kebayoran B.', gap: 28, rooms: 7, ibu: 4000, points: '110,340 240,320 260,430 130,450' },
  { name: 'Pancoran', gap: 41, rooms: 5, ibu: 4300, points: '240,320 440,320 420,430 260,430' },
  { name: 'Pasar Rebo', gap: 52, rooms: 4, ibu: 4800, points: '440,320 600,320 580,420 420,430' },
];

export const TOP5: Kecamatan[] = [...KECAMATAN].sort((a, b) => b.gap - a.gap).slice(0, 5);
export const TOP10_BAR: Kecamatan[] = [...KECAMATAN].sort((a, b) => b.gap - a.gap).slice(0, 10);

export const TREND: TrendPoint[] = [
  { m: 'Des', pos: 720, neg: 180 },
  { m: 'Jan', pos: 820, neg: 210 },
  { m: 'Feb', pos: 760, neg: 260 },
  { m: 'Mar', pos: 880, neg: 230 },
  { m: 'Apr', pos: 950, neg: 240 },
  { m: 'Mei', pos: 1020, neg: 227 },
];

export const PROBLEM_REPORTS: ProblemReport[] = [
  {
    name: 'Grand Indonesia · Lt. 3',
    issue: 'Kulkas mati',
    time: '2 jam lalu',
    initial: 'G',
    detail: 'Kulkas penyimpanan ASI di ruang laktasi Lt. 3 dilaporkan tidak menyala sejak pagi. Pengelola gedung sudah dihubungi via customer service.',
    status: 'open',
  },
  {
    name: 'Stasiun Sudirman',
    issue: 'Ruangan terkunci',
    time: '5 jam lalu',
    initial: 'S',
    detail: 'Ruang laktasi di area peron 2 terkunci sejak siang, petugas stasiun belum merespons permintaan akses.',
    status: 'open',
  },
  {
    name: 'RS Cipto Mangunkusumo',
    issue: 'Fasilitas rusak',
    time: '1 hari lalu',
    initial: 'R',
    detail: 'Kursi menyusui dan tirai privasi dilaporkan rusak di ruang laktasi lantai dasar gedung A.',
    status: 'open',
  },
];
```

- [ ] **Step 4: Create the SVG centroid helpers**

Create `dashboard/lib/svg-utils.ts` (ported verbatim):

```typescript
export function avgX(points: string): number {
  const pts = points.split(' ').map((p) => p.split(',').map(Number));
  return pts.reduce((s, [x]) => s + x, 0) / pts.length;
}

export function avgY(points: string): number {
  const pts = points.split(' ').map((p) => p.split(',').map(Number));
  return pts.reduce((s, [, y]) => s + y, 0) / pts.length;
}
```

- [ ] **Step 5: Create the CSV export helper**

Create `dashboard/lib/export.ts`:

```typescript
/** Client-side CSV export — builds a Blob and triggers a real download. No backend involved. */
export function downloadCSV(filename: string, rows: Record<string, string | number>[]): void {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const escapeCell = (value: string | number) => {
    const str = String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const csvLines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(',')),
  ];
  const csv = csvLines.join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 6: Verify it builds**

Run: `cd dashboard && npm run build`
Expected: builds successfully (these are library files with no consumers yet, so this mainly checks TypeScript syntax).

- [ ] **Step 7: Commit**

```bash
git add dashboard/types dashboard/lib
git commit -m "feat: port design tokens, static data, and helpers into the dashboard"
```

---

### Task 2: Fonts + root layout

**Files:**
- Modify: `dashboard/app/layout.tsx`
- Modify: `dashboard/app/globals.css`

**Interfaces:**
- Produces: CSS variables `--font-nunito`, `--font-quicksand`, `--font-jetbrains-mono` available globally, applied as the page's default font stack. Self-hosted via `next/font/google` (no runtime Google Fonts request — matches the plan's demo-day-reliability goal).

- [ ] **Step 1: Replace the root layout**

Replace the full contents of `dashboard/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Nunito, Quicksand, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-nunito',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'MomSpace — Dashboard Pemerintah',
  description: 'Dashboard analitik ruang laktasi untuk Dinas Kesehatan DKI Jakarta.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${nunito.variable} ${quicksand.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Replace globals.css**

Replace the full contents of `dashboard/app/globals.css`:

```css
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #F6EFEA;
  font-family: var(--font-quicksand), sans-serif;
  -webkit-font-smoothing: antialiased;
}

.mono {
  font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font: inherit;
}
```

Every component in this plan sets `fontFamily: 'Nunito'` / `'Quicksand'` / `'JetBrains Mono'` in its inline `style` objects (ported directly from the source) — these resolve correctly because `next/font`'s CSS variables are mapped by family name via the `html` element's class, and the browser falls back to the `body`'s `font-family` (Quicksand) for anything not explicitly set, matching the source's behavior.

- [ ] **Step 3: Verify it builds**

Run: `cd dashboard && npm run build`
Expected: builds successfully.

- [ ] **Step 4: Commit**

```bash
git add dashboard/app/layout.tsx dashboard/app/globals.css
git commit -m "feat: self-host Nunito/Quicksand/JetBrains Mono via next/font"
```

---

### Task 3: Icons + shared UI primitives (Panel, Toast, Modal, legend/source pills)

**Files:**
- Create: `dashboard/components/icons/index.tsx`
- Create: `dashboard/components/ui/Panel.tsx`
- Create: `dashboard/components/ui/Toast.tsx`
- Create: `dashboard/components/ui/Modal.tsx`
- Create: `dashboard/components/ui/SourcePill.tsx`
- Create: `dashboard/components/ui/LegendBadge.tsx`
- Create: `dashboard/components/ui/LegendDot.tsx`
- Modify: `dashboard/app/layout.tsx`

**Interfaces:**
- Consumes: `G` (Task 1).
- Produces: `IconMap`/`IconChart`/`IconClipboard`/`IconUsers`/`IconGear`/`IconHouse`/`IconStar`/`IconAlert`/`IconReport` (all `() => JSX.Element`); `Panel({title, subtitle?, action?, children, padding?})`; `useToast(): {showToast: (message: string) => void}` + `ToastProvider`; `Modal({open, onClose, children})`; `SourcePill({label})`; `LegendBadge({color, label, sw?})`; `LegendDot({color, label})`. Consumed by every page task.

- [ ] **Step 1: Create the icons**

Create `dashboard/components/icons/index.tsx` (ported verbatim from `design_handoff_momspace/dashboard.jsx`):

```tsx
export function IconMap() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 19V5M20 19H4M8 19V13M12 19V9M16 19V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconClipboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="9" y="2" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 11h6M9 15h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 18c.5-2.5 2.5-3.8 4.8-3.8 1 0 1.9.2 2.7.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconGear() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconHouse() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l3 6.5 7 1-5 5 1.2 7L12 19l-6.2 3.5L7 15.5 2 10.5l7-1L12 3z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"
      />
    </svg>
  );
}

export function IconAlert() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l10 18H2L12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10v5M12 17.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconReport() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10h8M8 13h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
```

- [ ] **Step 2: Create Panel**

Create `dashboard/components/ui/Panel.tsx`:

```tsx
import type { ReactNode } from 'react';
import { G } from '@/lib/colors';

export function Panel({
  title,
  subtitle,
  action,
  children,
  padding = 22,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  padding?: number;
}) {
  return (
    <div style={{
      background: G.surface, borderRadius: 16, padding,
      border: `1px solid ${G.line}`,
      display: 'flex', flexDirection: 'column', minWidth: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 14, gap: 12,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 15, color: G.ink,
            letterSpacing: -0.2,
          }}>{title}</div>
          {subtitle && (
            <div style={{
              fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11.5, color: G.body,
              marginTop: 3, lineHeight: 1.4,
            }}>{subtitle}</div>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create the Toast system**

Create `dashboard/components/ui/Toast.tsx`:

```tsx
'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { G } from '@/lib/colors';

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: G.ink, color: '#fff', padding: '12px 20px', borderRadius: 12,
          fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 13,
          boxShadow: '0 12px 28px rgba(60,40,30,0.28)', zIndex: 1000,
        }}>
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
```

- [ ] **Step 4: Wire ToastProvider into the root layout**

In `dashboard/app/layout.tsx`, add the import and wrap `{children}`:

```tsx
import { ToastProvider } from '@/components/ui/Toast';
```

Change:
```tsx
      <body>{children}</body>
```
to:
```tsx
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
```

- [ ] **Step 5: Create Modal**

Create `dashboard/components/ui/Modal.tsx`:

```tsx
'use client';

import type { ReactNode } from 'react';
import { G } from '@/lib/colors';

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(51,55,39,0.32)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: G.surface, borderRadius: 18, padding: 24, width: 420,
          maxWidth: '90vw', boxShadow: '0 24px 48px rgba(60,40,30,0.28)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create SourcePill, LegendBadge, LegendDot**

Create `dashboard/components/ui/SourcePill.tsx`:

```tsx
import { G } from '@/lib/colors';

export function SourcePill({ label }: { label: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 99,
      background: '#fff', border: `1px solid ${G.line}`,
      fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 10.5, color: G.body,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: G.sage }} />
      {label}
    </div>
  );
}
```

Create `dashboard/components/ui/LegendBadge.tsx`:

```tsx
import { G } from '@/lib/colors';

export function LegendBadge({ color, label, sw = 14 }: { color: string; label: string; sw?: number }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11, color: G.body,
    }}>
      <div style={{ width: 18, height: sw, background: color, borderRadius: 4 }} />
      {label}
    </div>
  );
}
```

Create `dashboard/components/ui/LegendDot.tsx`:

```tsx
import { G } from '@/lib/colors';

export function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11, color: G.body,
    }}>
      <div style={{ width: 10, height: 10, borderRadius: 99, background: color }} />
      {label}
    </div>
  );
}
```

- [ ] **Step 7: Verify it builds**

Run: `cd dashboard && npm run build`
Expected: builds successfully.

- [ ] **Step 8: Commit**

```bash
git add dashboard/components/icons dashboard/components/ui dashboard/app/layout.tsx
git commit -m "feat: add dashboard icons and shared UI primitives (Panel, Toast, Modal, legends)"
```

---

### Task 4: Sidebar, TopBar, DateRangePicker, real routing shell

**Files:**
- Create: `dashboard/components/layout/Sidebar.tsx`
- Create: `dashboard/components/layout/DateRangePicker.tsx`
- Create: `dashboard/components/layout/TopBar.tsx`
- Create: `dashboard/app/(dashboard)/layout.tsx`
- Create: `dashboard/app/page.tsx`

**Interfaces:**
- Consumes: `G` (Task 1), icons (Task 3).
- Produces: `Sidebar()` (no props — active state derived from `usePathname()`); `DateRangePicker()`; `TopBar({title, subtitle, onDownload})`. Consumed by every page task.

This is the fix for the source prototype's biggest structural gap: `Sidebar`/`TopBar` were duplicated per-page with a hardcoded `active` prop and no real page switching. Here there is exactly one `Sidebar`, driven by the actual route.

- [ ] **Step 1: Create Sidebar**

Create `dashboard/components/layout/Sidebar.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { G } from '@/lib/colors';
import { IconMap, IconChart, IconClipboard, IconUsers, IconGear } from '@/components/icons';

const NAV_ITEMS = [
  { id: 'map', href: '/peta-distribusi', label: 'Peta Distribusi', icon: <IconMap /> },
  { id: 'gap', href: '/gap-score', label: 'Gap Score', icon: <IconChart /> },
  { id: 'reports', href: '/laporan-fasilitas', label: 'Laporan Fasilitas', icon: <IconClipboard /> },
  { id: 'users', href: '/aktivitas-pengguna', label: 'Aktivitas Pengguna', icon: <IconUsers /> },
  { id: 'settings', href: '/pengaturan', label: 'Pengaturan', icon: <IconGear /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div style={{
      width: 232, background: G.surface,
      borderRight: `1px solid ${G.line}`, display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ padding: '24px 22px 20px', borderBottom: `1px solid ${G.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
            color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(232,165,152,0.4)',
          }}>M</div>
          <div>
            <div style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 14, color: G.ink,
              letterSpacing: -0.2,
            }}>MomSpace</div>
            <div style={{
              fontSize: 10.5, color: G.body, fontWeight: 600,
              fontFamily: 'var(--font-quicksand)', letterSpacing: 0.2,
            }}>Dashboard Pemerintah</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="mono" style={{
          fontSize: 9.5, color: '#A89991', textTransform: 'uppercase',
          letterSpacing: 1.2, padding: '6px 12px 8px',
        }}>Navigasi</div>
        {NAV_ITEMS.map((it) => {
          const on = pathname.startsWith(it.href);
          return (
            <Link key={it.id} href={it.href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 12,
              background: on ? G.roseLt : 'transparent',
              color: on ? G.roseDk : G.body,
              cursor: 'pointer',
              fontFamily: 'var(--font-quicksand)', fontWeight: on ? 700 : 600, fontSize: 13,
              position: 'relative',
            }}>
              {on && (
                <div style={{
                  position: 'absolute', left: -12, top: 8, bottom: 8, width: 3,
                  borderRadius: 99, background: G.roseDk,
                }} />
              )}
              <span style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {it.icon}
              </span>
              {it.label}
            </Link>
          );
        })}
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${G.line}` }}>
        <div style={{
          padding: 12, borderRadius: 14, background: G.surface2,
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(140deg, ${G.sage}, ${G.sageDk})`,
            color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>DK</div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 11.5, color: G.ink,
              lineHeight: 1.2,
            }}>Dinas Kesehatan</div>
            <div style={{ fontSize: 10, color: G.body, marginTop: 1, fontWeight: 600 }}>
              DKI Jakarta · Admin
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 10, padding: '0 4px', fontSize: 10.5, color: '#A89991',
          fontFamily: 'var(--font-quicksand)', fontWeight: 600,
        }}>
          Dr. Sari Wibowo
          <div className="mono" style={{ fontSize: 9.5, color: '#B8A89F', marginTop: 2 }}>
            admin@dinkes.jakarta.go.id
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create DateRangePicker**

Create `dashboard/components/layout/DateRangePicker.tsx`. This replaces the source's non-interactive date-range button with a real (label-only — it does not refilter any data, intentionally, since there is no backend to refilter against) popover:

```tsx
'use client';

import { useState } from 'react';
import { G } from '@/lib/colors';

const PRESETS = [
  '1–17 Mei 2026',
  '1–30 April 2026',
  '1 Jan–17 Mei 2026 (YTD)',
  '3 bulan terakhir',
];

export function DateRangePicker() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(PRESETS[0]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: G.surface, border: `1px solid ${G.lineDk}`,
          borderRadius: 12, padding: '9px 14px',
          fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 12.5, color: G.ink,
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke={G.ink} strokeWidth="1.8" />
          <path d="M3 9h18M8 3v4M16 3v4" stroke={G.ink} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {selected}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke={G.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '110%', right: 0, zIndex: 50,
            background: '#fff', borderRadius: 12, border: `1px solid ${G.line}`,
            boxShadow: '0 16px 32px rgba(60,40,30,0.18)', minWidth: 220, overflow: 'hidden',
          }}>
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setSelected(preset);
                  setOpen(false);
                }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 14px', border: 0,
                  background: preset === selected ? G.roseLt : 'transparent',
                  color: preset === selected ? G.roseDk : G.ink,
                  fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12.5,
                  cursor: 'pointer',
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create TopBar**

Create `dashboard/components/layout/TopBar.tsx`. This attaches `onClick` directly to a DOM button, so it must be a Client Component (a Server Component cannot itself hold a raw DOM event handler, even one passed down as a prop):

```tsx
'use client';

import type { ReactNode } from 'react';
import { G } from '@/lib/colors';
import { DateRangePicker } from './DateRangePicker';

export function TopBar({
  title,
  subtitle,
  onDownload,
  showDateRange = true,
}: {
  title: string;
  subtitle: ReactNode;
  /** Omit on pages with nothing report-shaped to export (Pengaturan, Aktivitas Pengguna) — the download button only renders when this is provided. */
  onDownload?: () => void;
  showDateRange?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 28px', borderBottom: `1px solid ${G.line}`,
      background: G.surface,
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 22, color: G.ink,
          letterSpacing: -0.3,
        }}>{title}</div>
        <div style={{
          fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12.5, color: G.body,
          marginTop: 3, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {subtitle}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showDateRange && <DateRangePicker />}
        {onDownload && (
          <button onClick={onDownload} style={{
            background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
            color: '#fff', border: 0, borderRadius: 12, padding: '10px 16px',
            fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 12.5,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            boxShadow: '0 8px 18px rgba(232,165,152,0.4)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12M6 11l6 6 6-6M4 21h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Unduh Laporan
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create the dashboard route group layout**

Create `dashboard/app/(dashboard)/layout.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { G } from '@/lib/colors';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{
      display: 'flex', height: '100vh', background: G.surface2,
      fontFamily: 'var(--font-quicksand)', color: G.ink,
    }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create the root redirect page**

Create `dashboard/app/page.tsx`:

```tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/peta-distribusi');
}
```

- [ ] **Step 6: Verify it builds**

Run: `cd dashboard && npm run build`
Expected: builds successfully (no pages consume `TopBar`/`Sidebar` yet — this checks the components compile standalone).

- [ ] **Step 7: Commit**

```bash
git add dashboard/components/layout dashboard/app/\(dashboard\) dashboard/app/page.tsx
git commit -m "feat: add real routing shell (Sidebar, TopBar, DateRangePicker)"
```

---

### Task 5: Peta Distribusi page

**Files:**
- Create: `dashboard/components/dashboard/SummaryRow.tsx`
- Create: `dashboard/components/dashboard/FlagMarker.tsx`
- Create: `dashboard/components/dashboard/Tooltip.tsx`
- Create: `dashboard/components/dashboard/ChoroplethMap.tsx`
- Create: `dashboard/components/dashboard/GapTable.tsx`
- Create: `dashboard/components/dashboard/ProblemReportRow.tsx`
- Create: `dashboard/components/dashboard/ReportDetailModal.tsx`
- Create: `dashboard/components/dashboard/ProblemReports.tsx`
- Create: `dashboard/components/dashboard/TrendChart.tsx`
- Create: `dashboard/app/(dashboard)/peta-distribusi/page.tsx`

**Interfaces:**
- Consumes: `G`/`gapColor` (Task 1), `KECAMATAN`/`TOP5`/`TREND`/`PROBLEM_REPORTS` (Task 1), `avgX`/`avgY` (Task 1), `downloadCSV` (Task 1), `Panel`/`LegendBadge`/`LegendDot`/`Modal`/`useToast` (Task 3), `TopBar` (Task 4).
- Produces: `ProblemReportRow` and `ReportDetailModal` are reused verbatim by Task 7's Laporan Fasilitas page.

This task fixes two of the source prototype's five dead elements: the "Lihat semua kecamatan" link (now toggles the table between Top 5 and all 14) and the "Tindak lanjut" buttons (now open a real detail modal with a working "Tandai selesai" action).

- [ ] **Step 1: Create SummaryRow**

Create `dashboard/components/dashboard/SummaryRow.tsx`:

```tsx
import type { ReactNode } from 'react';
import { G } from '@/lib/colors';
import { IconHouse, IconStar, IconAlert, IconReport } from '@/components/icons';

function SummaryCard({
  icon,
  value,
  label,
  trend,
  trendTone = 'up',
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  trend: string;
  trendTone?: 'up' | 'down';
}) {
  const trendUp = trendTone === 'up';
  return (
    <div style={{
      background: G.surface, borderRadius: 16, padding: 20,
      border: `1px solid ${G.line}`,
      display: 'flex', flexDirection: 'column', gap: 8,
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: G.roseLt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: G.roseDk,
        }}>{icon}</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 99,
          background: trendUp ? G.sageLt : 'rgba(201,122,110,0.12)',
          color: trendUp ? G.sageDk : G.roseDp,
          fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 11,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d={trendUp ? 'M6 14l6-6 6 6' : 'M6 10l6 6 6-6'} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {trend}
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 28, color: G.ink,
        letterSpacing: -0.6, lineHeight: 1.1, marginTop: 4,
      }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12, color: G.body, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

export function SummaryRow() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <SummaryCard icon={<IconHouse />} value="284" label="Total ruang laktasi terdaftar" trend="+12 bulan ini" trendTone="up" />
      <SummaryCard
        icon={<IconStar />}
        value={<>4.3<span style={{ fontSize: 16, color: G.body, fontWeight: 700 }}> / 5</span></>}
        label="Rata-rata rating fasilitas"
        trend="+0.2" trendTone="up"
      />
      <SummaryCard icon={<IconAlert />} value="12" label="Kecamatan underserved (Gap >70)" trend="−3 vs. April" trendTone="up" />
      <SummaryCard icon={<IconReport />} value="1.247" label="Laporan masuk bulan ini" trend="+18%" trendTone="up" />
    </div>
  );
}
```

(Card 3's trend reads as a decrease — "−3 vs. April" — but keeps `trendTone="up"` intentionally: fewer underserved kecamatan is the *good* direction, and `trendTone` here means "positive outcome," not "the number went up." This matches the source exactly.)

- [ ] **Step 2: Create FlagMarker and Tooltip**

Create `dashboard/components/dashboard/FlagMarker.tsx`:

```tsx
import { G } from '@/lib/colors';

export function FlagMarker({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - 32} stroke={G.sageDk} strokeWidth="1.5" />
      <path d={`M${x} ${y - 32} L${x + 22} ${y - 28} L${x + 18} ${y - 22} L${x + 22} ${y - 16} L${x} ${y - 18} Z`} fill={G.sageDk} />
    </g>
  );
}
```

Create `dashboard/components/dashboard/Tooltip.tsx`:

```tsx
import { G, gapColor } from '@/lib/colors';
import type { Kecamatan } from '@/types/dashboard';

function TipRow({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '3px 0', fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11.5,
    }}>
      <span style={{ color: G.body }}>{label}</span>
      <span className="mono" style={{ fontWeight: 700, color: accent ? G.roseDp : G.ink }}>{value}</span>
    </div>
  );
}

export function Tooltip({ k, pinned }: { k: Kecamatan | undefined; pinned?: boolean }) {
  if (!k) return null;
  return (
    <div style={{
      position: 'absolute', top: 12, left: 12,
      padding: '10px 14px', background: '#fff', borderRadius: 12,
      boxShadow: '0 12px 28px rgba(60,40,30,0.18), 0 1px 3px rgba(60,40,30,0.06)',
      border: `1px solid ${G.line}`,
      minWidth: 180, pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: 99, background: gapColor(k.gap) }} />
        <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: G.ink }}>{k.name}</div>
        {pinned && (
          <div style={{
            marginLeft: 'auto', fontSize: 9, fontWeight: 800, color: G.roseDp,
            background: 'rgba(201,122,110,0.12)', padding: '2px 6px', borderRadius: 99,
            letterSpacing: 0.4,
          }}>PRIORITAS</div>
        )}
      </div>
      <TipRow label="Gap Score" value={k.gap} accent />
      <TipRow label="Ruang laktasi" value={k.rooms} />
      <TipRow label="Ibu potensial" value={k.ibu.toLocaleString('id')} />
    </div>
  );
}
```

- [ ] **Step 3: Create ChoroplethMap**

Create `dashboard/components/dashboard/ChoroplethMap.tsx` (client — hover state is the only genuinely interactive piece in the original prototype):

```tsx
'use client';

import { useState } from 'react';
import { G, gapColor } from '@/lib/colors';
import { KECAMATAN } from '@/lib/data';
import { avgX, avgY } from '@/lib/svg-utils';
import { Panel } from '@/components/ui/Panel';
import { LegendBadge } from '@/components/ui/LegendBadge';
import { FlagMarker } from './FlagMarker';
import { Tooltip } from './Tooltip';

export function ChoroplethMap() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <Panel title="Peta sebaran ruang laktasi · Jakarta" subtitle="Warna menunjukkan Gap Score per kecamatan (semakin gelap, semakin kurang terlayani)">
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <svg viewBox="0 0 640 460" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <rect x="0" y="0" width="640" height="60" fill="rgba(91,141,239,0.06)" />
            <text x="540" y="36" fontFamily="var(--font-nunito)" fontWeight="700" fontSize="10" fill="#9EAEC4">TELUK JAKARTA</text>

            {KECAMATAN.map((k) => {
              const isHover = hover === k.name;
              const isGambir = k.name === 'Gambir';
              return (
                <g
                  key={k.name}
                  onMouseEnter={() => setHover(k.name)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <polygon
                    points={k.points}
                    fill={gapColor(k.gap)}
                    stroke={isHover || isGambir ? G.sageDk : G.sage}
                    strokeWidth={isHover || isGambir ? 2.5 : 1.5}
                    style={{ transition: 'all 150ms' }}
                  />
                </g>
              );
            })}

            {KECAMATAN.map((k) => {
              const cx = avgX(k.points);
              const cy = avgY(k.points);
              return (
                <text
                  key={`l-${k.name}`}
                  x={cx} y={cy}
                  textAnchor="middle"
                  fontFamily="var(--font-nunito)" fontWeight="700" fontSize="9.5"
                  fill={k.gap >= 65 ? '#fff' : G.ink}
                  opacity="0.95"
                  style={{ pointerEvents: 'none' }}
                >{k.name}</text>
              );
            })}

            <FlagMarker x={385} y={195} />
          </svg>

          {hover && <Tooltip k={KECAMATAN.find((x) => x.name === hover)} />}
          {!hover && <Tooltip k={KECAMATAN.find((x) => x.name === 'Gambir')} pinned />}
        </div>

        <div style={{ width: 150, flexShrink: 0 }}>
          <div className="mono" style={{ fontSize: 10, color: '#A89991', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>
            Legenda · Gap Score
          </div>
          <div style={{
            height: 12, borderRadius: 6, marginBottom: 6,
            background: `linear-gradient(90deg, ${G.roseLt} 0%, ${G.rose05} 20%, ${G.rose03} 40%, ${G.rose} 60%, ${G.roseDk} 80%, ${G.roseDp} 100%)`,
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 10, color: G.body }}>
            <span>0 — Terlayani</span>
            <span>100 — Krisis</span>
          </div>

          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <LegendBadge color={G.sage} label="Batas kecamatan" sw={3} />
            <LegendBadge color={G.sageDk} label="Highlight intervensi" sw={3} />
          </div>

          <div style={{
            marginTop: 22, padding: 12, borderRadius: 12, background: G.surface2,
            fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11, color: G.body,
            lineHeight: 1.5,
          }}>
            <b style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, color: G.ink }}>Hover kecamatan</b><br />
            untuk melihat detail Gap Score, jumlah ruang laktasi, dan populasi ibu potensial.
          </div>
        </div>
      </div>
    </Panel>
  );
}
```

- [ ] **Step 4: Create GapTable (fixes the dead "Lihat semua kecamatan" link)**

Create `dashboard/components/dashboard/GapTable.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { G, gapColor } from '@/lib/colors';
import { TOP5, KECAMATAN } from '@/lib/data';
import { Panel } from '@/components/ui/Panel';
import type { Kecamatan } from '@/types/dashboard';
import type { ReactNode } from 'react';

function Th({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <th style={{
      fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 10, color: '#9E948A',
      textTransform: 'uppercase', letterSpacing: 1.2,
      padding: '8px 0 10px', textAlign: right ? 'right' : 'left',
    }}>{children}</th>
  );
}

function Td({ children, right }: { children: ReactNode; right?: boolean }) {
  return <td style={{ padding: '11px 0', textAlign: right ? 'right' : 'left' }}>{children}</td>;
}

export function GapTable() {
  const [expanded, setExpanded] = useState(false);
  const rows: Kecamatan[] = expanded ? [...KECAMATAN].sort((a, b) => b.gap - a.gap) : TOP5;

  return (
    <Panel
      title="Kecamatan prioritas intervensi"
      subtitle={expanded ? 'Seluruh 14 kecamatan, diurutkan berdasarkan Gap Score' : 'Top 5 kecamatan dengan Gap Score tertinggi'}
      action={
        <span style={{
          fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 11,
          color: G.roseDk, background: G.roseLt,
          padding: '4px 10px', borderRadius: 99, whiteSpace: 'nowrap',
        }}>{expanded ? '14 / 14' : '5 / 14'}</span>
      }
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-quicksand)' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <Th>#</Th><Th>Kecamatan</Th><Th right>Gap</Th><Th right>Ruang</Th><Th right>Ibu</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((k, i) => (
            <tr key={k.name} style={{ borderTop: `1px solid ${G.line}` }}>
              <Td>
                <span className="mono" style={{ fontSize: 11, color: i === 0 ? G.roseDp : G.body, fontWeight: 700 }}>{i + 1}</span>
              </Td>
              <Td>
                <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 12.5, color: G.ink }}>{k.name}</div>
              </Td>
              <Td right>
                <span style={{
                  display: 'inline-block', padding: '3px 9px', borderRadius: 99,
                  background: gapColor(k.gap),
                  color: k.gap >= 65 ? '#fff' : G.ink,
                  fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 11,
                  fontVariantNumeric: 'tabular-nums',
                }}>{k.gap}</span>
              </Td>
              <Td right>
                <span className="mono" style={{ fontSize: 11, color: G.ink, fontWeight: 700 }}>{k.rooms}</span>
              </Td>
              <Td right>
                <span className="mono" style={{ fontSize: 11, color: G.ink, fontWeight: 700 }}>{k.ibu.toLocaleString('id')}</span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{
        marginTop: 14, paddingTop: 12, borderTop: `1px solid ${G.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11, color: G.body }}>
          {expanded ? 'Seluruh kecamatan ditampilkan' : '9 kecamatan lain dengan Gap ≥ 50'}
        </span>
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
            fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 11.5, color: G.roseDk,
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          {expanded ? 'Sembunyikan' : 'Lihat semua kecamatan'}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ transform: expanded ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 150ms' }}>
            <path d="M9 6l6 6-6 6" stroke={G.roseDk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </Panel>
  );
}
```

- [ ] **Step 5: Create ProblemReportRow and ReportDetailModal (fixes the dead "Tindak lanjut" buttons)**

Create `dashboard/components/dashboard/ProblemReportRow.tsx`:

```tsx
import { G } from '@/lib/colors';
import type { ProblemReport } from '@/types/dashboard';

export function ProblemReportRow({ report, onTindakLanjut }: { report: ProblemReport; onTindakLanjut: () => void }) {
  const resolved = report.status === 'resolved';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 12, borderRadius: 12,
      background: G.surface2, border: `1px solid ${G.line}`,
      opacity: resolved ? 0.55 : 1,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
        color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 15,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{report.initial}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: G.ink,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          textDecoration: resolved ? 'line-through' : 'none',
        }}>{report.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{
            fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 10.5,
            color: G.roseDp, background: 'rgba(201,122,110,0.12)',
            padding: '2px 8px', borderRadius: 99,
          }}>{report.issue}</span>
          <span style={{ fontSize: 10.5, color: '#9E948A', fontWeight: 600, fontFamily: 'var(--font-quicksand)' }}>· {report.time}</span>
        </div>
      </div>
      {resolved ? (
        <span style={{
          background: G.sageLt, color: G.sageDk, borderRadius: 99, padding: '7px 14px',
          fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 11.5, flexShrink: 0,
        }}>Selesai ✓</span>
      ) : (
        <button onClick={onTindakLanjut} style={{
          background: '#fff', border: `1.5px solid ${G.rose}`,
          color: G.roseDk, borderRadius: 99, padding: '7px 14px',
          fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 11.5,
          cursor: 'pointer', flexShrink: 0,
        }}>Tindak lanjut</button>
      )}
    </div>
  );
}
```

Create `dashboard/components/dashboard/ReportDetailModal.tsx`:

```tsx
'use client';

import { G } from '@/lib/colors';
import { Modal } from '@/components/ui/Modal';
import type { ProblemReport } from '@/types/dashboard';

export function ReportDetailModal({
  report,
  onClose,
  onResolve,
}: {
  report: ProblemReport | null;
  onClose: () => void;
  onResolve: () => void;
}) {
  return (
    <Modal open={report !== null} onClose={onClose}>
      {report && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
              color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{report.initial}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 15, color: G.ink }}>{report.name}</div>
              <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11, color: '#9E948A' }}>{report.time}</div>
            </div>
          </div>
          <span style={{
            display: 'inline-block', marginBottom: 12,
            fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 11,
            color: G.roseDp, background: 'rgba(201,122,110,0.12)', padding: '4px 10px', borderRadius: 99,
          }}>{report.issue}</span>
          <p style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 13, color: G.body, lineHeight: 1.6, marginBottom: 20 }}>
            {report.detail}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, background: '#fff', border: `1.5px solid ${G.lineDk}`, borderRadius: 12,
              padding: '10px 0', fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: G.body, cursor: 'pointer',
            }}>Tutup</button>
            {report.status === 'open' ? (
              <button onClick={onResolve} style={{
                flex: 1, background: G.sage, border: 0, borderRadius: 12,
                padding: '10px 0', fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: '#fff', cursor: 'pointer',
              }}>Tandai selesai</button>
            ) : (
              <div style={{
                flex: 1, textAlign: 'center', background: G.sageLt, borderRadius: 12,
                padding: '10px 0', fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: G.sageDk,
              }}>Selesai ✓</div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
```

Create `dashboard/components/dashboard/ProblemReports.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { PROBLEM_REPORTS } from '@/lib/data';
import { Panel } from '@/components/ui/Panel';
import { useToast } from '@/components/ui/Toast';
import type { ProblemReport } from '@/types/dashboard';
import { ProblemReportRow } from './ProblemReportRow';
import { ReportDetailModal } from './ReportDetailModal';

export function ProblemReports() {
  const [reports, setReports] = useState<ProblemReport[]>(PROBLEM_REPORTS);
  const [selected, setSelected] = useState<ProblemReport | null>(null);
  const { showToast } = useToast();

  const handleResolve = () => {
    if (!selected) return;
    setReports((prev) => prev.map((r) => (r.name === selected.name ? { ...r, status: 'resolved' } : r)));
    setSelected(null);
    showToast('Laporan ditandai selesai');
  };

  return (
    <Panel title="Laporan fasilitas bermasalah" subtitle="Butuh tindak lanjut · 14 laporan aktif minggu ini">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reports.map((report) => (
          <ProblemReportRow key={report.name} report={report} onTindakLanjut={() => setSelected(report)} />
        ))}
      </div>
      <ReportDetailModal report={selected} onClose={() => setSelected(null)} onResolve={handleResolve} />
    </Panel>
  );
}
```

- [ ] **Step 6: Create TrendChart**

Create `dashboard/components/dashboard/TrendChart.tsx`:

```tsx
import { G } from '@/lib/colors';
import { TREND } from '@/lib/data';
import { Panel } from '@/components/ui/Panel';
import { LegendDot } from '@/components/ui/LegendDot';

export function TrendChart() {
  const W = 480, H = 200, P = { l: 36, r: 16, t: 16, b: 30 };
  const maxY = 1100;
  const x = (i: number) => P.l + (i / (TREND.length - 1)) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - v / maxY) * (H - P.t - P.b);
  const path = (k: 'pos' | 'neg') => TREND.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d[k])}`).join(' ');
  const area = (k: 'pos' | 'neg') => `${path(k)} L ${x(TREND.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  return (
    <Panel title="Tren laporan kondisi" subtitle="6 bulan terakhir · positif vs negatif">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 250, 500, 750, 1000].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={G.line} strokeDasharray="2 4" />
            <text x={P.l - 6} y={y(v) + 3} textAnchor="end" fontFamily="var(--font-jetbrains-mono)" fontSize="9" fill="#A89991">{v}</text>
          </g>
        ))}
        {TREND.map((d, i) => (
          <text key={d.m} x={x(i)} y={H - 10} textAnchor="middle" fontFamily="var(--font-nunito)" fontWeight="700" fontSize="10" fill={G.body}>{d.m}</text>
        ))}
        <path d={area('pos')} fill={G.sageLt} />
        <path d={area('neg')} fill="rgba(232,153,138,0.16)" />
        <path d={path('pos')} fill="none" stroke={G.sage} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={path('neg')} fill="none" stroke={G.roseDk} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {TREND.map((d, i) => (
          <g key={d.m}>
            <circle cx={x(i)} cy={y(d.pos)} r="3.5" fill="#fff" stroke={G.sage} strokeWidth="2" />
            <circle cx={x(i)} cy={y(d.neg)} r="3.5" fill="#fff" stroke={G.roseDk} strokeWidth="2" />
          </g>
        ))}
        <text x={x(5) + 8} y={y(1020)} fontFamily="var(--font-nunito)" fontWeight="800" fontSize="11" fill={G.sageDk}>1.020</text>
        <text x={x(5) + 8} y={y(227)} fontFamily="var(--font-nunito)" fontWeight="800" fontSize="11" fill={G.roseDp}>227</text>
      </svg>
      <div style={{ display: 'flex', gap: 16, marginTop: 6, paddingLeft: 36 }}>
        <LegendDot color={G.sage} label="Laporan positif" />
        <LegendDot color={G.roseDk} label="Laporan negatif" />
      </div>
    </Panel>
  );
}
```

- [ ] **Step 7: Assemble the page**

Create `dashboard/app/(dashboard)/peta-distribusi/page.tsx`. This is a Client Component because `downloadCSV` uses browser-only APIs (`Blob`, `document`, `URL.createObjectURL`):

```tsx
'use client';

import { SummaryRow } from '@/components/dashboard/SummaryRow';
import { ChoroplethMap } from '@/components/dashboard/ChoroplethMap';
import { GapTable } from '@/components/dashboard/GapTable';
import { ProblemReports } from '@/components/dashboard/ProblemReports';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { TopBar } from '@/components/layout/TopBar';
import { G } from '@/lib/colors';
import { KECAMATAN } from '@/lib/data';
import { downloadCSV } from '@/lib/export';

export default function PetaDistribusiPage() {
  const handleDownload = () => {
    downloadCSV(
      `momspace-peta-distribusi-${new Date().toISOString().slice(0, 10)}.csv`,
      KECAMATAN.map((k) => ({ kecamatan: k.name, gap_score: k.gap, ruang_laktasi: k.rooms, ibu_potensial: k.ibu })),
    );
  };

  return (
    <>
      <TopBar
        title="Peta Distribusi Ruang Laktasi"
        subtitle={
          <>
            <span>Jakarta · Diperbarui 17 Mei 2026</span>
            <span style={{
              padding: '3px 8px', borderRadius: 99, background: G.sageLt,
              color: G.sageDk, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
            }}>LIVE</span>
          </>
        }
        onDownload={handleDownload}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SummaryRow />
        <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 16 }}>
          <ChoroplethMap />
          <GapTable />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ProblemReports />
          <TrendChart />
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 8: Verify it builds and run it**

Run: `cd dashboard && npm run build`
Expected: builds successfully.

Run: `npm run dev`, visit `http://localhost:3000/peta-distribusi`. Confirm: the choropleth renders and hovers show tooltips; "Lihat semua kecamatan" expands the table to 14 rows and back; clicking "Tindak lanjut" on any of the 3 reports opens the modal, and "Tandai selesai" marks it resolved with a toast; "Unduh Laporan" downloads a CSV.

- [ ] **Step 9: Commit**

```bash
git add dashboard/components/dashboard dashboard/app/\(dashboard\)/peta-distribusi
git commit -m "feat: build the Peta Distribusi page with working table/modal/export interactions"
```

---

### Task 6: Gap Score page

**Files:**
- Create: `dashboard/components/dashboard/BarChartTop10.tsx`
- Create: `dashboard/components/dashboard/ScatterPlot.tsx`
- Create: `dashboard/components/dashboard/FormulaCard.tsx`
- Create: `dashboard/app/(dashboard)/gap-score/page.tsx`

**Interfaces:**
- Consumes: `G`/`gapColor` (Task 1), `TOP10_BAR`/`KECAMATAN` (Task 1), `downloadCSV` (Task 1), `Panel`/`SourcePill` (Task 3), `TopBar`/`SummaryRow` (Tasks 4/5).

No dead elements on this page in the source — both charts are already pure/non-interactive SVG. Only the shared "Unduh Laporan" button needed wiring (done here, exporting `TOP10_BAR`).

- [ ] **Step 1: Create BarChartTop10**

Create `dashboard/components/dashboard/BarChartTop10.tsx`:

```tsx
import { G, gapColor } from '@/lib/colors';
import { TOP10_BAR } from '@/lib/data';
import { Panel } from '@/components/ui/Panel';

export function BarChartTop10() {
  const W = 640, H = 320, P = { l: 36, r: 24, t: 18, b: 70 };
  const max = 100;
  const bw = (W - P.l - P.r) / TOP10_BAR.length - 8;
  const x = (i: number) => P.l + i * ((W - P.l - P.r) / TOP10_BAR.length);
  const y = (v: number) => P.t + (1 - v / max) * (H - P.t - P.b);

  return (
    <Panel title="Top 10 kecamatan berdasarkan Gap Score" subtitle="Bilah lebih panjang & gelap = prioritas intervensi tertinggi">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={G.line} strokeDasharray="2 4" />
            <text x={P.l - 6} y={y(v) + 3} textAnchor="end" fontFamily="var(--font-jetbrains-mono)" fontSize="9" fill="#A89991">{v}</text>
          </g>
        ))}
        <line x1={P.l} x2={W - P.r} y1={y(70)} y2={y(70)} stroke={G.roseDp} strokeWidth="1" strokeDasharray="4 3" />
        <text x={W - P.r - 4} y={y(70) - 4} textAnchor="end" fontFamily="var(--font-nunito)" fontWeight="800" fontSize="9.5" fill={G.roseDp}>
          AMBANG INTERVENSI · 70
        </text>
        {TOP10_BAR.map((k, i) => {
          const bx = x(i) + 4;
          const by = y(k.gap);
          const bh = y(0) - by;
          return (
            <g key={k.name}>
              <rect x={bx} y={by} width={bw} height={bh} rx="4" fill={gapColor(k.gap)} />
              <text x={bx + bw / 2} y={by - 6} textAnchor="middle" fontFamily="var(--font-nunito)" fontWeight="800" fontSize="10" fill={G.ink}>
                {k.gap}
              </text>
              <text
                x={bx + bw / 2} y={H - P.b + 14} textAnchor="end"
                fontFamily="var(--font-quicksand)" fontWeight="700" fontSize="10" fill={G.body}
                transform={`rotate(-32 ${bx + bw / 2} ${H - P.b + 14})`}
              >
                {k.name}
              </text>
            </g>
          );
        })}
        <line x1={P.l} x2={W - P.r} y1={y(0)} y2={y(0)} stroke={G.lineDk} />
      </svg>
    </Panel>
  );
}
```

- [ ] **Step 2: Create ScatterPlot**

Create `dashboard/components/dashboard/ScatterPlot.tsx`:

```tsx
import { G, gapColor } from '@/lib/colors';
import { KECAMATAN } from '@/lib/data';
import { Panel } from '@/components/ui/Panel';

export function ScatterPlot() {
  const W = 480, H = 320, P = { l: 44, r: 16, t: 18, b: 40 };
  const maxX = 7000, maxY = 12;
  const x = (v: number) => P.l + (v / maxX) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - v / maxY) * (H - P.t - P.b);

  return (
    <Panel title="Distribusi: ruang laktasi vs populasi ibu potensial" subtitle="Setiap titik = satu kecamatan · warna mengikuti Gap Score">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 2000, 4000, 6000].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={P.t} y2={y(0)} stroke={G.line} strokeDasharray="2 4" />
            <text x={x(v)} y={H - P.b + 16} textAnchor="middle" fontFamily="var(--font-jetbrains-mono)" fontSize="9" fill="#A89991">
              {(v / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        {[0, 3, 6, 9, 12].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={G.line} strokeDasharray="2 4" />
            <text x={P.l - 6} y={y(v) + 3} textAnchor="end" fontFamily="var(--font-jetbrains-mono)" fontSize="9" fill="#A89991">{v}</text>
          </g>
        ))}
        <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="var(--font-quicksand)" fontWeight="700" fontSize="10" fill={G.body}>
          Populasi ibu potensial (jiwa)
        </text>
        <text x={12} y={H / 2} textAnchor="middle" transform={`rotate(-90 12 ${H / 2})`} fontFamily="var(--font-quicksand)" fontWeight="700" fontSize="10" fill={G.body}>
          Jumlah ruang laktasi
        </text>

        <path d={`M ${x(0)} ${y(0)} L ${x(6000)} ${y(10)}`} stroke={G.sage} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <text x={x(6000) - 4} y={y(10) - 6} textAnchor="end" fontFamily="var(--font-nunito)" fontWeight="800" fontSize="9" fill={G.sageDk}>
          GARIS IDEAL (Supply ≈ Demand)
        </text>

        {KECAMATAN.map((k) => (
          <g key={k.name}>
            <circle cx={x(k.ibu)} cy={y(k.rooms)} r="8" fill={gapColor(k.gap)} fillOpacity="0.85" stroke="#fff" strokeWidth="2" />
            {k.gap >= 71 && (
              <text x={x(k.ibu)} y={y(k.rooms) - 11} textAnchor="middle" fontFamily="var(--font-nunito)" fontWeight="800" fontSize="9" fill={G.roseDp}>
                {k.name}
              </text>
            )}
          </g>
        ))}
      </svg>
    </Panel>
  );
}
```

- [ ] **Step 3: Create FormulaCard**

Create `dashboard/components/dashboard/FormulaCard.tsx`:

```tsx
import { G } from '@/lib/colors';
import { Panel } from '@/components/ui/Panel';
import { SourcePill } from '@/components/ui/SourcePill';

export function FormulaCard() {
  return (
    <Panel title="Metodologi Gap Score" subtitle="Formula perhitungan & sumber data">
      <div style={{
        padding: 18, borderRadius: 14, background: G.surface2,
        fontFamily: 'var(--font-jetbrains-mono)', fontSize: 13, color: G.ink,
        lineHeight: 1.6, textAlign: 'center', marginBottom: 14,
      }}>
        Gap Score = <span style={{ color: G.roseDp }}>(Demand − Supply)</span>
        <span style={{ color: G.body }}> / </span>
        <span style={{ color: G.sageDk }}>Demand</span>
        <span style={{ color: G.body }}> × 100</span>
      </div>
      <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12, color: G.body, lineHeight: 1.55, marginBottom: 14 }}>
        <b style={{ color: G.ink, fontFamily: 'var(--font-nunito)', fontWeight: 800 }}>Demand Index</b>{' '}
        dihitung dari populasi ibu menyusui per kecamatan (BPS 2023) dan kepadatan ruang publik.{' '}
        <b style={{ color: G.ink, fontFamily: 'var(--font-nunito)', fontWeight: 800 }}>Supply Index</b>{' '}
        merupakan jumlah ruang laktasi aktif tertimbang oleh rating fasilitas dari laporan crowdsourcing MomSpace.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 12, borderTop: `1px solid ${G.line}` }}>
        <SourcePill label="BPS DKI Jakarta 2023" />
        <SourcePill label="Crowdsourcing MomSpace 2026" />
        <SourcePill label="Dinas Kesehatan DKI" />
      </div>
      <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: G.roseLt, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, marginTop: 1, color: G.roseDp }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v5M12 16.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11.5, color: G.ink, lineHeight: 1.45 }}>
          <b style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800 }}>Catatan:</b> Gap Score di atas 70 menandakan kebutuhan intervensi
          prioritas oleh Dinas Kesehatan. Data diperbarui setiap awal bulan.
        </div>
      </div>
    </Panel>
  );
}
```

- [ ] **Step 4: Assemble the page**

Create `dashboard/app/(dashboard)/gap-score/page.tsx`:

```tsx
'use client';

import { SummaryRow } from '@/components/dashboard/SummaryRow';
import { BarChartTop10 } from '@/components/dashboard/BarChartTop10';
import { ScatterPlot } from '@/components/dashboard/ScatterPlot';
import { FormulaCard } from '@/components/dashboard/FormulaCard';
import { TopBar } from '@/components/layout/TopBar';
import { G } from '@/lib/colors';
import { TOP10_BAR } from '@/lib/data';
import { downloadCSV } from '@/lib/export';

export default function GapScorePage() {
  const handleDownload = () => {
    downloadCSV(
      `momspace-gap-score-${new Date().toISOString().slice(0, 10)}.csv`,
      TOP10_BAR.map((k) => ({ kecamatan: k.name, gap_score: k.gap, ruang_laktasi: k.rooms, ibu_potensial: k.ibu })),
    );
  };

  return (
    <>
      <TopBar
        title="Analisis Gap Score"
        subtitle={
          <>
            <span>Jakarta · Diperbarui 17 Mei 2026</span>
            <span style={{
              padding: '3px 8px', borderRadius: 99, background: G.roseLt,
              color: G.roseDk, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
            }}>METODOLOGI v2.1</span>
          </>
        }
        onDownload={handleDownload}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SummaryRow />
        <BarChartTop10 />
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 16 }}>
          <ScatterPlot />
          <FormulaCard />
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Verify it builds and run it**

Run: `cd dashboard && npm run build`
Expected: builds successfully.

Run: `npm run dev`, visit `http://localhost:3000/gap-score` via clicking "Gap Score" in the sidebar (confirms real routing). Confirm the bar chart, scatter plot, and formula card render, and "Unduh Laporan" downloads a CSV of the Top 10.

- [ ] **Step 6: Commit**

```bash
git add dashboard/components/dashboard/BarChartTop10.tsx dashboard/components/dashboard/ScatterPlot.tsx dashboard/components/dashboard/FormulaCard.tsx dashboard/app/\(dashboard\)/gap-score
git commit -m "feat: build the Gap Score analytics page"
```

---

### Task 7: Laporan Fasilitas page (extended reports list + status filters)

**Files:**
- Modify: `dashboard/lib/data.ts`
- Create: `dashboard/app/(dashboard)/laporan-fasilitas/page.tsx`

**Interfaces:**
- Consumes: `ProblemReportRow`/`ReportDetailModal` (Task 5, reused verbatim), `Panel`/`useToast` (Task 3), `downloadCSV` (Task 1), `TopBar` (Task 4).
- Produces: `ALL_PROBLEM_REPORTS: ProblemReport[]` (14 entries total, exported from `lib/data.ts`).

The compact `ProblemReports` panel on Peta Distribusi says "14 laporan aktif minggu ini" but only ever showed 3 — this page is where the other 11 actually live, reusing the exact row/modal/resolve pattern from Task 5 rather than inventing a new one.

- [ ] **Step 1: Extend the problem-reports dataset**

In `dashboard/lib/data.ts`, add after the existing `PROBLEM_REPORTS` array:

```typescript
export const ALL_PROBLEM_REPORTS: ProblemReport[] = [
  ...PROBLEM_REPORTS,
  {
    name: 'Mall Kelapa Gading 3',
    issue: 'Wastafel rusak',
    time: '1 hari lalu',
    initial: 'M',
    detail: 'Wastafel di ruang laktasi Lt. 2 tidak mengeluarkan air sejak kemarin sore. Pengelola mall sudah diberi tahu.',
    status: 'open',
  },
  {
    name: 'Stasiun Manggarai',
    issue: 'Privasi kurang',
    time: '1 hari lalu',
    initial: 'S',
    detail: 'Tirai privasi ruang laktasi robek sehingga area menyusui terlihat dari koridor.',
    status: 'open',
  },
  {
    name: 'Senayan City',
    issue: 'AC mati',
    time: '2 hari lalu',
    initial: 'S',
    detail: 'AC ruang laktasi Lt. 4 dilaporkan mati, ruangan terasa panas dan pengap.',
    status: 'resolved',
  },
  {
    name: 'RS Fatmawati',
    issue: 'Kursi rusak',
    time: '2 hari lalu',
    initial: 'R',
    detail: 'Salah satu kursi menyusui di ruang laktasi lantai dasar patah pada bagian sandaran.',
    status: 'open',
  },
  {
    name: 'Terminal Kampung Rambutan',
    issue: 'Ruangan kotor',
    time: '3 hari lalu',
    initial: 'T',
    detail: 'Lantai dan permukaan meja ruang laktasi dilaporkan kotor dan berdebu.',
    status: 'resolved',
  },
  {
    name: 'Plaza Senayan',
    issue: 'Stopkontak mati',
    time: '3 hari lalu',
    initial: 'P',
    detail: 'Stopkontak di dekat kursi menyusui tidak berfungsi, menyulitkan penggunaan pompa ASI elektrik.',
    status: 'open',
  },
  {
    name: 'Stasiun Tanah Abang',
    issue: 'Ruangan terkunci',
    time: '4 hari lalu',
    initial: 'S',
    detail: 'Ruang laktasi terkunci di luar jam operasional yang tertera, tidak ada petugas yang bisa dihubungi.',
    status: 'resolved',
  },
  {
    name: 'Kota Kasablanka',
    issue: 'Kulkas mati',
    time: '4 hari lalu',
    initial: 'K',
    detail: 'Kulkas penyimpanan ASI perah di ruang laktasi Lt. 1 tidak dingin.',
    status: 'open',
  },
  {
    name: 'RSUD Tarakan',
    issue: 'Wastafel rusak',
    time: '5 hari lalu',
    initial: 'R',
    detail: 'Keran wastafel ruang laktasi bocor terus-menerus.',
    status: 'resolved',
  },
  {
    name: 'Central Park Mall',
    issue: 'Fasilitas rusak',
    time: '6 hari lalu',
    initial: 'C',
    detail: 'Cermin ruang laktasi pecah dan belum diganti.',
    status: 'resolved',
  },
  {
    name: 'Stasiun Juanda',
    issue: 'Privasi kurang',
    time: '6 hari lalu',
    initial: 'S',
    detail: 'Pintu ruang laktasi tidak bisa dikunci dari dalam.',
    status: 'resolved',
  },
];
```

(14 entries total, matching the "14 laporan aktif minggu ini" copy already shown on Peta Distribusi.)

- [ ] **Step 2: Create the page**

Create `dashboard/app/(dashboard)/laporan-fasilitas/page.tsx`:

```tsx
'use client';

import { useMemo, useState } from 'react';
import { G } from '@/lib/colors';
import { ALL_PROBLEM_REPORTS } from '@/lib/data';
import { downloadCSV } from '@/lib/export';
import { TopBar } from '@/components/layout/TopBar';
import { Panel } from '@/components/ui/Panel';
import { useToast } from '@/components/ui/Toast';
import { ProblemReportRow } from '@/components/dashboard/ProblemReportRow';
import { ReportDetailModal } from '@/components/dashboard/ReportDetailModal';
import type { ProblemReport } from '@/types/dashboard';

type FilterTab = 'all' | 'open' | 'resolved';

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'open', label: 'Belum ditangani' },
  { id: 'resolved', label: 'Selesai' },
];

export default function LaporanFasilitasPage() {
  const [reports, setReports] = useState<ProblemReport[]>(ALL_PROBLEM_REPORTS);
  const [tab, setTab] = useState<FilterTab>('all');
  const [selected, setSelected] = useState<ProblemReport | null>(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    if (tab === 'all') return reports;
    return reports.filter((r) => r.status === tab);
  }, [reports, tab]);

  const handleResolve = () => {
    if (!selected) return;
    setReports((prev) => prev.map((r) => (r.name === selected.name ? { ...r, status: 'resolved' } : r)));
    setSelected(null);
    showToast('Laporan ditandai selesai');
  };

  const handleDownload = () => {
    downloadCSV(
      `momspace-laporan-fasilitas-${new Date().toISOString().slice(0, 10)}.csv`,
      reports.map((r) => ({ lokasi: r.name, masalah: r.issue, waktu: r.time, status: r.status })),
    );
  };

  return (
    <>
      <TopBar
        title="Laporan Fasilitas"
        subtitle={<span>Jakarta · {reports.filter((r) => r.status === 'open').length} laporan belum ditangani</span>}
        onDownload={handleDownload}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Panel title="Semua laporan fasilitas bermasalah" subtitle="Filter berdasarkan status penanganan">
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '7px 14px', borderRadius: 99, cursor: 'pointer',
                  border: tab === t.id ? 'none' : `1px solid ${G.lineDk}`,
                  background: tab === t.id ? G.roseDk : '#fff',
                  color: tab === t.id ? '#fff' : G.body,
                  fontFamily: 'var(--font-quicksand)', fontWeight: 700, fontSize: 12,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.length === 0 ? (
              <div style={{
                padding: 20, textAlign: 'center',
                fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12.5, color: G.body,
              }}>Tidak ada laporan pada kategori ini.</div>
            ) : (
              filtered.map((report) => (
                <ProblemReportRow key={report.name} report={report} onTindakLanjut={() => setSelected(report)} />
              ))
            )}
          </div>
        </Panel>
      </div>
      <ReportDetailModal report={selected} onClose={() => setSelected(null)} onResolve={handleResolve} />
    </>
  );
}
```

- [ ] **Step 3: Verify it builds and run it**

Run: `cd dashboard && npm run build`
Expected: builds successfully.

Run: `npm run dev`, click "Laporan Fasilitas" in the sidebar. Confirm all 14 reports show under "Semua", the "Belum ditangani"/"Selesai" tabs filter correctly, clicking "Tindak lanjut" + "Tandai selesai" moves a report between those two filtered views live, and "Unduh Laporan" exports all 14 rows with their current status.

- [ ] **Step 4: Commit**

```bash
git add dashboard/lib/data.ts dashboard/app/\(dashboard\)/laporan-fasilitas
git commit -m "feat: build the full Laporan Fasilitas page with status filters"
```

---

### Task 8: Aktivitas Pengguna (honest coming-soon) + Pengaturan (real toggles)

**Files:**
- Create: `dashboard/app/(dashboard)/aktivitas-pengguna/page.tsx`
- Create: `dashboard/app/(dashboard)/pengaturan/page.tsx`

**Interfaces:**
- Consumes: `Panel` (Task 3), `IconUsers` (Task 3), `TopBar` (Task 4, using the `showDateRange={false}` and omitted-`onDownload` flexibility added there), `useToast` (Task 3).

Neither page has a design mockup or a data spec in the source. Aktivitas Pengguna is deliberately left as an honest empty state rather than fabricated metrics (there is zero hint anywhere in the source of what user-activity data would even look like). Pengaturan is made fully real — local `useState` toggles are cheap and genuinely functional, so a static page would be strictly worse for the same effort.

- [ ] **Step 1: Create the Aktivitas Pengguna page**

Create `dashboard/app/(dashboard)/aktivitas-pengguna/page.tsx`:

```tsx
import { G } from '@/lib/colors';
import { TopBar } from '@/components/layout/TopBar';
import { Panel } from '@/components/ui/Panel';
import { IconUsers } from '@/components/icons';

const PLACEHOLDER_METRICS = ['Pengguna aktif harian', 'Sesi rata-rata', 'Tingkat retensi'];

export default function AktivitasPenggunaPage() {
  return (
    <>
      <TopBar title="Aktivitas Pengguna" subtitle={<span>Jakarta · Modul dalam pengembangan</span>} showDateRange={false} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Panel title="Modul aktivitas pengguna sedang dikembangkan" subtitle="Belum ada sumber data untuk metrik ini pada versi ini">
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            padding: '32px 20px', textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: G.surface2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B8A89F',
            }}>
              <IconUsers />
            </div>
            <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 14, color: G.ink, maxWidth: 360 }}>
              Data aktivitas pengguna (sesi, retensi, pola penggunaan) belum tersedia di build ini
            </div>
            <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12.5, color: G.body, maxWidth: 360, lineHeight: 1.5 }}>
              Modul ini akan menampilkan data nyata setelah tersambung ke backend analitik. Untuk saat ini kami memilih untuk tidak
              menampilkan data contoh agar tidak menyesatkan.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 8 }}>
            {PLACEHOLDER_METRICS.map((label) => (
              <div key={label} style={{
                border: `1.5px dashed ${G.lineDk}`, borderRadius: 14, padding: 16,
                textAlign: 'center', color: '#B8A89F',
              }}>
                <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 20, marginBottom: 4 }}>—</div>
                <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11 }}>{label}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
```

This page has no hooks or handlers of its own, so it stays a plain Server Component (it can still render `TopBar`, a Client Component, without issue — Server Components rendering Client Components is the normal composition direction in the App Router; only the reverse is restricted).

- [ ] **Step 2: Create the Pengaturan page**

Create `dashboard/app/(dashboard)/pengaturan/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { G } from '@/lib/colors';
import { TopBar } from '@/components/layout/TopBar';
import { Panel } from '@/components/ui/Panel';
import { useToast } from '@/components/ui/Toast';

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      padding: '14px 0', borderTop: `1px solid ${G.line}`,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, color: disabled ? '#B8A89F' : G.ink }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 11.5, color: '#9E948A', marginTop: 2 }}>{description}</div>
      </div>
      <button
        onClick={disabled ? undefined : onChange}
        disabled={disabled}
        style={{
          width: 44, height: 26, borderRadius: 99, border: 0, flexShrink: 0,
          background: disabled ? '#E6DCD4' : (checked ? G.sage : G.lineDk),
          position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background 150ms',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked && !disabled ? 21 : 3,
          width: 20, height: 20, borderRadius: 99, background: '#fff',
          boxShadow: '0 1px 3px rgba(60,40,30,0.24)', transition: 'left 150ms',
        }} />
      </button>
    </div>
  );
}

export default function PengaturanPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { showToast } = useToast();

  return (
    <>
      <TopBar title="Pengaturan" subtitle={<span>Jakarta · Preferensi akun &amp; dashboard</span>} showDateRange={false} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Panel title="Akun" subtitle="Informasi administrator yang sedang masuk">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: `linear-gradient(140deg, ${G.sage}, ${G.sageDk})`,
              color: '#fff', fontFamily: 'var(--font-nunito)', fontWeight: 900, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>DK</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 14, color: G.ink }}>Dr. Sari Wibowo</div>
              <div style={{ fontFamily: 'var(--font-quicksand)', fontWeight: 600, fontSize: 12, color: G.body }}>Dinas Kesehatan DKI Jakarta · Admin</div>
              <div className="mono" style={{ fontSize: 10.5, color: '#B8A89F', marginTop: 2 }}>admin@dinkes.jakarta.go.id</div>
            </div>
          </div>
        </Panel>

        <Panel title="Preferensi" subtitle="Pengaturan lokal untuk tampilan dan notifikasi dashboard ini">
          <ToggleRow
            label="Notifikasi email"
            description="Kirim ringkasan laporan baru ke email terdaftar"
            checked={emailNotif}
            onChange={() => setEmailNotif((v) => !v)}
          />
          <ToggleRow
            label="Laporan PDF mingguan"
            description="Kirim ringkasan Gap Score mingguan setiap Senin pagi"
            checked={weeklyReport}
            onChange={() => setWeeklyReport((v) => !v)}
          />
          <ToggleRow
            label="Refresh otomatis"
            description="Perbarui data peta dan tabel setiap 5 menit"
            checked={autoRefresh}
            onChange={() => setAutoRefresh((v) => !v)}
          />
          <ToggleRow label="Mode gelap" description="Segera hadir" checked={false} disabled onChange={() => {}} />
        </Panel>

        <div>
          <button
            onClick={() => showToast('Perubahan preferensi disimpan')}
            style={{
              background: `linear-gradient(140deg, ${G.rose}, ${G.roseDk})`,
              color: '#fff', border: 0, borderRadius: 12, padding: '10px 20px',
              fontFamily: 'var(--font-nunito)', fontWeight: 800, fontSize: 13, cursor: 'pointer',
              boxShadow: '0 8px 18px rgba(232,165,152,0.4)',
            }}
          >
            Simpan perubahan
          </button>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Verify it builds and run it**

Run: `cd dashboard && npm run build`
Expected: builds successfully.

Run: `npm run dev`. Visit "Aktivitas Pengguna" via the sidebar — confirm the honest empty state renders, no download button appears (only title/subtitle). Visit "Pengaturan" — confirm all three enabled toggles flip on click, the "Mode gelap" toggle is visibly disabled and does not respond to clicks, and "Simpan perubahan" fires a toast.

- [ ] **Step 4: Commit**

```bash
git add dashboard/app/\(dashboard\)/aktivitas-pengguna dashboard/app/\(dashboard\)/pengaturan
git commit -m "feat: add Aktivitas Pengguna (honest empty state) and Pengaturan (real toggles) pages"
```

---

### Task 9: Manual QA pass (whole dashboard)

**Files:** none (verification only)

- [ ] **Step 1: Full build check**

Run: `cd dashboard && npm run build`
Expected: builds cleanly, no TypeScript errors.

- [ ] **Step 2: Launch and walk every route**

Run: `npm run dev`, open `http://localhost:3000`.

- Confirm it redirects to `/peta-distribusi`.
- Click every Sidebar item in turn (not URL bar navigation) — confirm the active highlight (rose background + left accent bar) follows the current route on all 5 pages, and the page content actually changes each time (this is the fix for the source prototype's core gap, where pages never really switched).
- **Peta Distribusi:** hover several kecamatan polygons — confirm the tooltip updates and Gambir's tooltip is pinned/shown when nothing is hovered. Click "Lihat semua kecamatan" — table grows to 14 rows, badge flips to "14 / 14", link becomes "Sembunyikan"; click again to collapse. Click "Tindak lanjut" on any of the 3 reports — modal opens with the right name/issue/detail; click "Tandai selesai" — row dims, button becomes "Selesai ✓", a toast appears. Click "Unduh Laporan" — a CSV downloads with 14 kecamatan rows.
- **Gap Score:** confirm the bar chart, scatter plot, and formula card render correctly; "Unduh Laporan" downloads a CSV of the Top 10.
- **Laporan Fasilitas:** confirm 14 total reports under "Semua"; switch to "Belum ditangani" and "Selesai" — counts match; resolve one from this page and confirm it moves between filtered views live; "Unduh Laporan" exports all 14 with current status.
- **Aktivitas Pengguna:** confirm the honest coming-soon state, no download button, no fabricated numbers.
- **Pengaturan:** toggle the three enabled switches, confirm "Mode gelap" is inert, click "Simpan perubahan" and confirm the toast appears.
- Open the date-range popover (top-right, on the 3 data pages) — confirm it lists 4 presets and clicking one updates the button label; confirm no page's underlying data changes as a result (this was documented as intentionally label-only).

- [ ] **Step 3: Browser console check**

With devtools open, repeat the walk from Step 2 and confirm no hydration warnings or console errors appear — in particular around `.toLocaleString('id')` calls in the choropleth tooltip and Gap Score table (a common source of server/client mismatch in Next.js if ICU data differs, though this was pre-verified to format identically in this environment).

- [ ] **Step 4: Record any visual deltas**

This plan targets structural/functional fidelity to `design_handoff_momspace/dashboard.jsx`, not pixel-for-pixel measurement matching. Minor spacing/shadow deltas from the inline-style port are expected and fine to fix ad hoc — they are not blocking.
