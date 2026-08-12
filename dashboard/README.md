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
