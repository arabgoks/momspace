# Handoff: MomSpace — Smart City Lactation Room Finder (Jakarta)

## Overview

MomSpace is a crowdsourced lactation-room finder for Jakarta, plus a government analytics dashboard for Dinas Kesehatan DKI Jakarta. This bundle covers seven design deliverables:

| # | File | What it covers |
|---|---|---|
| 1 | `MomSpace Navbar.html` | 5 bottom-navbar treatments (Classic Pill selected) |
| 2 | `MomSpace Home Map.html` | Home/Map screen — 3 bottom-sheet states |
| 3 | `MomSpace Detail.html` | Room detail — open + closed states |
| 4 | `MomSpace Laporan.html` | Condition report form — empty/filled/success |
| 5 | `MomSpace Submit Lokasi.html` | New-location submission + admin verification queue |
| 6 | `MomSpace Report Hub.html` | Contribution chooser bottom sheet |
| 7 | `MomSpace Dashboard.html` | Government web dashboard — 2 pages |

Mobile target: **Flutter (iOS + Android)**. Dashboard target: **web (desktop/tablet)**.

---

## About the Design Files

The files in this bundle are **design references authored in HTML/React** — prototypes that show intended look, spacing, copy, and behavior. **They are not production code to copy directly.**

The task is to **recreate these designs in the target codebase's own environment** using its established patterns and libraries:

- The mobile app is specified as **Flutter** — rebuild the screens as Flutter widgets (`Scaffold`, `BottomNavigationBar` or a custom nav, `DraggableScrollableSheet` for bottom sheets, `CustomPainter`/`flutter_map` for the map).
- The dashboard is a **web** surface — rebuild in whatever framework the team uses (React, Vue, etc.) with a real charting library.
- If no environment exists yet, pick the most appropriate framework and implement there.

Every HTML file opens standalone in a browser. Each is a pan/zoom canvas with multiple artboards; each artboard is one screen or component sheet.

## Fidelity

**High-fidelity (hifi).** All colors, typography, spacing, radii, shadows, and copy are final. Indonesian copy is production-ready and should be used verbatim. Recreate pixel-for-pixel using the codebase's own component library where equivalents exist.

The only intentionally non-final elements are **illustrations and photos** — the room photo, photo thumbnails, and map tiles are CSS/SVG placeholders standing in for real imagery and a real map SDK. See [Assets](#assets).

---

## Design Tokens

### Colors

| Token | Hex | Usage |
|---|---|---|
| `primary` / rose | `#E8A598` | Primary accent, active nav, CTA fill, available pins |
| `primaryPressed` / roseDk | `#D88B7C` | Pressed CTA, gradient end, selected pin, link text |
| `primaryDeep` / roseDp | `#C97A6E` | Critical gap score, negative chip text, reject action |
| `primaryTint` / roseLt | `#FBEEEA` | Active nav pill bg, info banner, icon chips |
| `rose03` | `#F2C6B8` | Gradient light end, ramp step |
| `rose05` | `#F8DED4` | Choropleth ramp step |
| `secondary` / sage | `#8FAF8F` | Open status, positive chips, approve action, map borders |
| `sageDk` | `#6B8A6B` | Sage text on tint, approve gradient end |
| `sageTint` | `rgba(143,175,143,0.18)` | Positive chip / facility tag bg |
| `muted` | `#AAB995` | Muted labels, sheet subtitle |
| `alert` | `#E8998A` | Soft alert (dashboard) |
| `amber` | `#D9982A` | Pending-verification status |
| `amberTint` | `rgba(217,152,42,0.14)` | Pending pill bg |
| `amberBorder` | `rgba(217,152,42,0.32)` | Pending pill border |
| `surface` | `#FEFEFE` | Cards, sheets, nav bar, app background |
| `surfaceSand` | `#FBF6F1` / `#FBF4ED` | Nested card fill, form field group |
| `ink` | `#333727` | Primary text |
| `body` | `#5C5347` | Secondary text |
| `textMuted` | `#7C7062` | Tertiary text |
| `textFaint` | `#9E948A` | Timestamps, counters, disabled label |
| `placeholder` | `#A89991` | Input placeholders, mono meta |
| `disabledFill` | `#E6DCD4` | Disabled button bg |
| `divider` | `rgba(60,40,30,0.06)` | Hairline borders |
| `dividerStrong` | `rgba(60,40,30,0.12)` | Input borders |
| `userLocation` | `#5B8DEF` | Blue user dot on map |
| **Map palette** | | |
| `mapLand` | `#F4E8DA` | Base land |
| `mapBlockA` | `#F0E0CC` | City blocks |
| `mapBlockB` | `#EFDBC4` | Secondary blocks |
| `mapPark` | `#C6D8C2` | Parks (sage-tinted) |
| `mapWater` | `#DCE7EB` | Water |
| `mapRoad` | `#FFFFFF` | Roads |
| `pinClosed` | `#BFB6AE` | Closed/unavailable pins |

### Typography

Fonts: **Nunito** (labels, headings, numerals) + **Quicksand** (body). Monospace meta uses **JetBrains Mono**.

| Role | Family | Weight | Size | Notes |
|---|---|---|---|---|
| Screen title (mobile) | Nunito | 800 | 16 px | Header center |
| Large heading | Nunito | 800–900 | 20–28 px | letter-spacing −0.3 to −0.6 |
| Section title | Nunito | 800 | 14–15 px | |
| Card title | Nunito | 800 | 13–15 px | line-height 1.25 |
| Nav label | Nunito | 700 | 11 px | letter-spacing 0.1 |
| Body | Quicksand | 500–600 | 12.5–13.5 px | line-height 1.45–1.55 |
| Chip / tag | Quicksand | 700 | 11–12 px | |
| Meta / caption | Quicksand | 600 | 10.5–11.5 px | |
| Mono label | JetBrains Mono | 500–600 | 9.5–11 px | uppercase, letter-spacing 1.2–1.4 |
| Dashboard stat | Nunito | 900 | 28 px | letter-spacing −0.6 |

### Spacing, radius, shadow

- Spacing scale: `4 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 22 · 24 · 28`
- Radii: chips/pills `999`; small tiles `10–12`; cards `14–18`; sheets/panels `22–28`; buttons `24–26`
- Shadows:
  - card rest — `0 1px 2px rgba(60,40,30,0.04)`
  - floating button — `0 6px 16px rgba(60,40,30,0.18)`
  - bottom sheet — `0 -16px 36px rgba(60,40,30,0.12)`
  - report hub sheet — `0 -22px 50px rgba(60,40,30,0.22)`
  - rose CTA glow — `0 10px 22px rgba(216,139,124,0.42)`
  - sage CTA glow — `0 6px 14px rgba(143,175,143,0.40)`
- Standard easing: `cubic-bezier(.2,.8,.2,1)`, 150–220 ms. Sheet entry: `cubic-bezier(.2,.9,.25,1)`, 360 ms.

---

## Screens / Views

### 1. Bottom Navigation — Classic Pill (`MomSpace Navbar.html`)

**Purpose:** Persistent 4-tab navigation across the app.

**Layout:** Fixed to bottom, full width. White `#FEFEFE`, top hairline `1px rgba(60,40,30,0.06)`. `padding-top: 10`, `padding-bottom: 28` (iOS safe area — on Android use system inset). Four equal flex children, `space-around`, `align-items: flex-end`.

**Tabs (order fixed):** Map · Search · Report · Profile.

**Per tab:**
- Icon container `44 × 32`, radius `16`. Active background `rgba(232,165,152,0.16)`; inactive transparent. Transition `background 180ms`.
- Icon `26 × 26`. **Active = filled glyph; inactive = outline, stroke width 1.9.**
- Label below, `margin-top: 4`, Nunito 700 / 11 px. Active `#E8A598`, inactive `#A89991`.
- Hit area ≥ `48 × 48`.

Four other variants exist in the file (Minimal Dot, Floating Pill, Center Action, Top Accent) — **Classic Pill is the selected direction**; the others are reference only.

---

### 2. Home / Map (`MomSpace Home Map.html`)

**Purpose:** Main screen. Find nearby lactation rooms on a map.

**Layout (top → bottom):** status bar → floating search pill → full-bleed map → stacked floating buttons (right) → bottom sheet → navbar.

**Search pill:** absolute, `top: 56`, `left/right: 14`, height `50`, radius `25`. Background `#FBEEEA`, border `1px rgba(232,165,152,0.25)`, shadow `0 10px 24px rgba(60,40,30,0.10)`. Search glyph left (`#D88B7C`), placeholder *"Cari ruang laktasi terdekat..."* (Quicksand 600 / 13.5, `#A68A82`), white filter button `38 × 38` circle at right.

**Map:** warm palette (see tokens). Roads are white strokes 6–22 px, parks sage. Faint street labels Nunito 700 / 9 px `#B9A38F` at 70 % opacity.

**Pins** (`28 × 36`, white stroke 2.5, white inner dot r 4.4):
| State | Fill | Scale | Shadow |
|---|---|---|---|
| Available | `#E8A598` | 1.0 | `0 3px 5px rgba(60,40,30,0.18)` |
| Selected | `#D88B7C` | 1.35 + ground ellipse | `0 8px 14px rgba(216,139,124,0.55)` |
| Closed | `#BFB6AE` | 1.0 | same as available |

**User dot:** `18` circle `#5B8DEF`, 3 px white border, plus a `48` pulse ring `rgba(91,141,239,0.18)` animating scale 0.6 → 1.6 / opacity 0.7 → 0 over 2 s, infinite.

**Floating buttons:** right `14`, stacked `gap: 10`, each `46` circle. Top = layers (white bg, ink icon). Bottom = locate-me (**rose fill, white icon**). Shadow `0 6px 16px rgba(60,40,30,0.18)`.

**Bottom sheet** — sits directly above navbar, radius `26` top corners, white, shadow `0 -16px 36px rgba(60,40,30,0.12)`, drag handle `40 × 4` `#E6DCD4` centered.

Three states:
- **Default (h 188):** 64 rose-gradient avatar tile "P" · title *"Plaza Indonesia · Level 4"* Nunito 800/16 · meta row `220 m · ● Buka sekarang` (sage dot + sage text) · 5-star row (4.5 filled) + `4.8` + `(124)` · rose-tint chevron button `36` · facility tags row (`✓ Bersih`, `Kulkas`, `AC`, `Stroller`) in sage tint.
- **Empty (h 210):** header *"Ruang laktasi terdekat"* + "Lihat semua" link · horizontal-scroll cards `min-width 156`, radius 16, sand fill: 36 avatar tile, name, `220 m · Lt. 4`, star + rating, sage `BUKA` badge.
- **Loading (h 188):** skeleton blocks, gradient `#EEE3D9 → #F6ECE3 → #EEE3D9`, `background-size: 400px`, shimmer 1.4 s infinite.

---

### 3. Detail Ruang Laktasi (`MomSpace Detail.html`)

**Purpose:** Full detail for one room. Reached from any map card.

**Header:** absolute `top: 60`, height `52`, `rgba(255,255,255,0.92)` + 12 px backdrop blur, bottom hairline. Back circle `38` left, title *"Detail Ruang Laktasi"* Nunito 800/16 center, share circle `38` right.

**Scroll body:** `top: 112` → `bottom: 160`.

1. **Photo** `height 220` — illustrated room (warm gradient, rose nursing chair, sage plant, wood table, framed picture). Bottom-left status badge: white pill, dot + label — open = sage `Buka sekarang`, closed = gray `Tutup`. Bottom-right photo counter `rgba(51,55,39,0.65)` blurred pill with camera glyph + `1 / 4`. **Closed state adds** `rgba(60,55,39,0.32)` overlay + desaturation.
2. **Info card** `padding 20 18 4` — name Nunito 800/22 (ls −0.3); address row, distance row, hours row, each with a rose 16 px icon and Quicksand 13. Open state renders hours in sage; **closed state renders hours in body color and appends a rose-tint pill "Buka pukul 08.00 besok"** right-aligned.
3. **Rating row** — sand card radius 16: 5 stars, `4.8` Nunito 800/15, `174 ulasan`, right "Lihat semua" + chevron in `#D88B7C`.
4. **Facility tags** — horizontal scroll, section title "Fasilitas". Seven tags: Bersih · Kulkas · AC · Stroller · Wastafel · Stopkontak · Privasi.
5. **Laporan kondisi terkini** — sand card: rose avatar 36, "Rina D." + "2 jam lalu · 3 laporan", sage `TERVERIFIKASI` badge, two condition tags, two 64×48 photo thumbs.
6. **Ulasan pengguna** — sand card: avatar, name, 5 stars + "· 1 minggu lalu", quoted review text Quicksand 500/13.
7. **Action bar** — fixed `bottom: 84`, white, top hairline, `padding 12 14`, two 50/50 buttons height `48` radius `24`, `gap 10`:
   - **Check-In** — white fill, `2px solid #E8A598` border, `#D88B7C` text, camera-check icon.
   - **Navigasi** — rose gradient `140deg #E8A598 → #D88B7C`, white text, paper-plane icon, glow shadow. **Closed state: `#E6DCD4` fill, `#9E948A` text, no shadow, `disabled`.**

**Facility tag component — three states:**
| State | Background | Text | Border | Glyph |
|---|---|---|---|---|
| Available | `rgba(143,175,143,0.18)` | `#6B8A6B` | `1px rgba(143,175,143,0.3)` | check |
| Unavailable | `rgba(60,40,30,0.05)` | `#A8A096` | `1px rgba(60,40,30,0.08)` | × + `line-through` |
| Unverified | `#fff` | `#8A7268` | `1.5px dashed rgba(60,40,30,0.18)` | ring |

Padding `6px 12px 6px 10px`, radius `999`, Quicksand 700/12, gap 6, `white-space: nowrap`.

Closed-state detail screen marks **Kulkas** and **Stopkontak** as unavailable.

---

### 4. Laporan Kondisi (`MomSpace Laporan.html`)

**Purpose:** Submit a crowdsourced condition report for an existing room. Earns +10 points; stored in Firestore with auto timestamp.

**Header** height `70`: back circle, centered title *"Laporan Kondisi"* Nunito 800/16 with rose subtitle *"Plaza Indonesia · Level 4"* Quicksand 600/11.5.

**Body** `top: 130` → `bottom: 174`, padding `16 18`.

**Condition quick-select** — label *"Kondisi ruang saat ini"*, 2-column grid `gap 8`. Eight chips, positive first:

Positive: Bersih · Kulkas menyala · Ruangan tersedia · Wastafel berfungsi
Negative: Kotor · Kulkas mati · Ruangan terkunci · Fasilitas rusak

Chip: `padding 10px 12px`, radius `14`, border `1.5px`, Quicksand 700/13, with a leading `22` circle badge.
| State | Bg | Text | Border | Badge |
|---|---|---|---|---|
| Unselected | `#fff` | `#7C7062` | `rgba(60,40,30,0.14)` | `#F4ECE3` bg, `#A89991` glyph |
| Selected positive | `rgba(143,175,143,0.18)` | `#5C7A5C` | `rgba(143,175,143,0.45)` | `#8FAF8F` bg, white check |
| Selected negative | `rgba(201,122,110,0.12)` | `#C97A6E` | `rgba(201,122,110,0.28)` | `#C97A6E` bg, white × |

Negative uses a **warm rose-warning**, never clinical red.

**Photo upload** — label *"Foto kondisi (opsional)"*. Empty: sand fill, `2px dashed #E8A598`, radius 16, rose circle with camera glyph + "Tambah foto". Filled: sand card with 70 px thumb, filename, size + timestamp, "Hapus" pill, and a `30` × dismiss button. Hint beneath: *"Foto membantu pengguna lain menilai fasilitas"*.

**Notes** — label *"Catatan tambahan (opsional)"*, sand box radius 14, min-height 56, placeholder *"Ceritakan kondisi ruangan secara singkat..."*, mono counter `n / 200` bottom-right.

**Reward banner** — `#FBEEEA` fill, `1px rgba(232,165,152,0.3)`, radius 16, 40 rose-gradient star tile, copy *"Laporan ini memberi Anda **+10 poin kontribusi**"* + *"Poin dapat dilihat di halaman Profil"*.

**Submit bar** — fixed `bottom: 84`, white, top hairline. Button full-width height `52` radius `26`, paper-plane icon + *"Kirim Laporan"*. Enabled = rose gradient + glow; **disabled = `#E6DCD4` / `#9E948A`, no shadow**. Caption below: *"Laporan dikirim dengan timestamp otomatis"*.

**Success screen** (replaces whole body): sage circle `84` with white check, `momPop` scale 0.4 → 1 over 600 ms `cubic-bezier(.2,1.4,.4,1)`; check stroke draws via `stroke-dashoffset 30 → 0`, 450 ms delayed 200 ms; dashed sage ring rotating 14 s; radial burst 1.6 s; three rose sparkles twinkling 1.6 s staggered 0/120/240 ms. Then *"Terima kasih kontribusinya 🌸"* Nunito 900/22, supporting copy, rose-tint pill *"+10 poin ditambahkan!"*, primary CTA *"Kembali ke Peta"*, text link *"Lihat laporan saya"*.

**Enable rule:** submit enables when ≥ 1 condition chip is selected. Photo and notes are optional.

---

### 5. Tambah Lokasi Baru (`MomSpace Submit Lokasi.html`)

**Purpose:** Any user proposes an unlisted room. Enters a `pending` queue for admin verification before publishing.

**Header:** back circle + centered *"Tambah Lokasi Baru"*. No right-side action.

**Info banner** (top of form): `#FBEEEA` fill, `1px rgba(232,165,152,0.32)`, radius 16, white ⓘ circle `32`. Copy: *"Lokasi yang kamu tambahkan akan diverifikasi oleh tim MomSpace sebelum ditampilkan kepada pengguna lain."* + clock line *"Proses verifikasi maksimal 2 × 24 jam"*.

**Field groups** — each is a mono uppercase label above a sand card (`#FBF6F1`, radius 18, `1px` hairline, padding 14). Fields inside separated by `1px rgba(60,40,30,0.06)` top borders. Required fields marked with a rose `*`.

1. **Informasi dasar**
   - Nama lokasi* — placeholder `cth. Plaza Indonesia · Level 4`
   - Alamat lengkap* — placeholder `Jl. M.H. Thamrin No.28–30, Jakarta Pusat`
   - Titik di peta* — idle: full-width button, white fill, `1.5px dashed #8FAF8F`, sage pin icon + *"Pilih di peta"*. Picked: 110 px map preview with a draggable rose pin, `SERET PIN` badge, and a footer row with mono coordinates `−6.1944° LS, 106.8229° BT` + "Ubah". Hint: *"Geser pin untuk titik yang lebih akurat"*.
   - Kategori lokasi* — 2-column grid of 6 cards (icon + label + check badge when selected). Options: Pusat Perbelanjaan · Stasiun / Terminal · Rumah Sakit / Klinik · Perkantoran · Taman Kota · Lainnya. Selected = `#FBEEEA` fill, `1.5px #E8A598`, `#D88B7C` text, filled rose check circle.
2. **Fasilitas yang tersedia** — pill multi-select, wrap, `gap 6`. Options: Kulkas · Wastafel · Stopkontak · AC · Stroller friendly · Privasi · Kursi menyusui · Cermin. Unselected = white + `+` glyph; selected = sage tint + check. Hint: *"Tim verifikasi akan memeriksa kembali di lapangan"*.
3. **Foto lokasi** — empty: dashed rose upload block, *"Tambah foto (maks. 3 foto)"*. Filled: 3-column grid — two photo tiles (square, `×` dismiss top-right) plus a dashed `+` tile. Hint: *"Foto membantu tim verifikasi memastikan keberadaan ruang laktasi"*.
4. **Informasi tambahan** — Jam operasional: two time boxes (`Buka` / `Tutup`, mono micro-label + Nunito 800/14 value, `--.--` when empty) with `→` between and `WIB` right. Catatan tambahan: 200-char box, placeholder *"Informasi lain yang perlu diketahui..."*.

**Submit bar:** full-width *"Kirim untuk Diverifikasi"*, same enabled/disabled treatment as the report form. Caption `* Wajib diisi`.

**Pending screen:** rose-gradient circle with an hourglass that flips 180° every ~2 s (`momHourglass` 4 s loop), dashed rose ring rotating 12 s, sparkles. Title *"Lokasi berhasil dikirim!"*, **amber pill "Menunggu verifikasi"**, body copy referencing 2 × 24 jam, rose CTA *"Kembali ke Peta"*, underlined text link *"Lihat status pengajuan di Profil"*.

**Status pill component:**
| Status | Bg | Border | Text/dot |
|---|---|---|---|
| Pending verifikasi | `rgba(217,152,42,0.14)` | `rgba(217,152,42,0.32)` | `#D9982A` |
| Disetujui & tayang | `rgba(143,175,143,0.18)` | `rgba(143,175,143,0.36)` | `#6B8A6B` |
| Ditolak | `rgba(201,122,110,0.12)` | `rgba(201,122,110,0.32)` | `#C97A6E` |

**Admin verification card (web):** white card radius 18, width 440. Mono header `PENDING SUBMISSION · #2046` + amber status pill. Body: 84 px photo thumb, category mono label with icon, location name Nunito 800/15, address row, dashed divider, submitter row (`@rina_d` + "2 jam lalu"). Facility preview chips + "+2 lainnya". Actions: **Setujui** (sage gradient, white, glow), **Tolak** (white, `1.5px #E8A598` border, `#C97A6E` text), **Detail** (sand neutral). A queue panel shows 4 stacked submissions with compact `✓` / `✗` icon buttons and a "14 menunggu verifikasi" amber counter.

---

### 6. Report Hub bottom sheet (`MomSpace Report Hub.html`)

**Purpose:** Tapping the Report tab opens this chooser over the current screen.

**Backdrop:** the live Home Map, `blur(6px) saturate(0.85)`, plus a gradient dim `rgba(51,55,39,0.18) → rgba(51,55,39,0.42)`. Navbar stays visible with Report active.

**Sheet:** anchored above navbar (`bottom: 84`), top radius `28`, `#FEFEFE`, shadow `0 -22px 50px rgba(60,40,30,0.22)`. Enters with `translateY(100%) → 0` + fade, 360 ms `cubic-bezier(.2,.9,.25,1)`. Dismissable by swipe-down or "Batal".

- Drag handle `44 × 5` radius 3, `#E2D5C9`, `margin: 0 auto 14px`
- Title *"Kontribusi Data"* Nunito 900/20 (ls −0.3); subtitle *"Pilih jenis kontribusi yang ingin kamu berikan"* Quicksand 600/12.5 in `#AAB995`
- Two option cards, `padding 0 18`, `gap 10`

**Option card:** `padding 16`, radius `18`, sand fill `#FBF6F1`, border `1.5px rgba(60,40,30,0.05)`. Left icon chip `52 × 52` radius `14`. Title Nunito 800/15, subtitle Quicksand 600/12 `#7C7062`. Right chevron in a `28` white circle.

| Card | Icon | Icon chip | Title | Subtitle | Routes to |
|---|---|---|---|---|---|
| 1 | Clipboard-check | rose tint / `#D88B7C` | Laporkan Kondisi Ruang | Bagikan kondisi terkini ruang laktasi yang baru kamu kunjungi | Laporan Kondisi |
| 2 | Pin + plus | sage tint / `#6B8A6B` | Tambah Lokasi Baru | Usulkan ruang laktasi yang belum terdaftar di MomSpace | Submit Lokasi Baru |

**Pressed state:** background → accent at 10 % alpha, border → accent at 45 %, `transform: scale(0.985)`, shadow `0 8px 20px` accent at 22 %, and the **chevron circle inverts** (accent fill, white arrow). Transition 180 ms.

**Below cards:** centered rose star + *"Setiap kontribusi memberi kamu **+10 poin reward**"*. Then a hairline divider (inset 24) and centered *"Batal"* Nunito 800/13 `#9E948A`.

---

### 7. Dashboard Pemerintah (`MomSpace Dashboard.html`)

**Purpose:** Dinas Kesehatan DKI Jakarta monitors distribution, spots underserved kecamatan by Gap Score, and follows up on problem reports. Canvas 1280 × 900.

**Sidebar** width `232`, white, right hairline:
- Logo block: 38 rose tile "M" + "MomSpace" / "Dashboard Pemerintah"
- Mono `NAVIGASI` label, then 5 items (`padding 10 12`, radius 12): Peta Distribusi · Gap Score · Laporan Fasilitas · Aktivitas Pengguna · Pengaturan. Active = `#FBEEEA` bg, `#D88B7C` text, plus a `3 × ~28` rose bar bleeding off the left edge.
- Footer: sand card with sage `DK` tile, "Dinas Kesehatan / DKI Jakarta · Admin", then "Dr. Sari Wibowo" + mono email.

**Topbar:** title Nunito 900/22, subtitle row with a status pill (`LIVE` sage on the map page; `METODOLOGI v2.1` rose on analytics). Right: date-range button (white, hairline border) + **Unduh Laporan** rose gradient button with download icon.

**Summary cards** (4-up grid, `gap 16`): white, radius 16, hairline. Rose 40 icon chip top-left, trend pill top-right (sage tint for good, rose tint for bad), value Nunito 900/28 (ls −0.6), label Quicksand 600/12.
1. `284` — Total ruang laktasi terdaftar — `+12 bulan ini`
2. `4.3 / 5` — Rata-rata rating fasilitas — `+0.2`
3. `12` — Kecamatan underserved (Gap >70) — `−3 vs. April`
4. `1.247` — Laporan masuk bulan ini — `+18%`

**Page A — Peta Distribusi**, two-column `1.55fr / 1fr`:
- **Choropleth**: 14 kecamatan polygons, fill by Gap Score ramp, sage `#8FAF8F` borders (1.5 px; 2.5 px + `#6B8A6B` on hover/highlight). Labels Nunito 700/9.5 — white when gap ≥ 65, else ink. Gambir carries a sage flag marker and a pinned `PRIORITAS` tooltip. Hover tooltip shows name, Gap Score, ruang laktasi, ibu potensial. Legend column: gradient bar `0 — Terlayani` → `100 — Krisis`, border key, hover hint card.
- **Gap Score table**: columns `# · Kecamatan · Gap · Ruang · Ibu`. Gap cell is a filled pill using the ramp color (white text ≥ 65). Numerals monospace. Footer: "9 kecamatan lain dengan Gap ≥ 50" + "Lihat semua kecamatan".

  | # | Kecamatan | Gap | Ruang | Ibu |
  |---|---|---|---|---|
  | 1 | Gambir | 87 | 2 | 4.200 |
  | 2 | Penjaringan | 81 | 3 | 5.100 |
  | 3 | Taman Sari | 76 | 2 | 3.800 |
  | 4 | Sawah Besar | 71 | 4 | 4.600 |
  | 5 | Tambora | 68 | 3 | 5.800 |

- **Laporan fasilitas bermasalah**: three rows (Grand Indonesia · Lt. 3 / Kulkas mati / 2 jam lalu; Stasiun Sudirman / Ruangan terkunci / 5 jam lalu; RS Cipto Mangunkusumo / Fasilitas rusak / 1 hari lalu). Each: rose initial tile 40, name, rose-warning issue pill, timestamp, outlined rose **Tindak lanjut** button.
- **Tren laporan kondisi**: 6-month dual line chart (Des–Mei). Sage = laporan positif, rose = laporan negatif, each with a translucent area fill, white-cored dots r 3.5, dashed gridlines, end-of-series value labels (`1.020` / `227`).

**Page B — Analisis Gap Score:**
- **Top 10 bar chart** — ramp-colored bars, value labels above, kecamatan names rotated −32°, dashed `#C97A6E` threshold line at 70 labeled `AMBANG INTERVENSI · 70`.
- **Scatter plot** — x = populasi ibu potensial (0–7k), y = jumlah ruang laktasi (0–12). Dots r 8, ramp fill, 2 px white stroke. Dashed sage reference line labeled `GARIS IDEAL (Supply ≈ Demand)`; every kecamatan with gap ≥ 71 is labeled.
- **Metodologi card** — formula block in mono on sand: `Gap Score = (Demand − Supply) / Demand × 100` with `(Demand − Supply)` in `#C97A6E` and `Demand` in `#6B8A6B`. Prose defining Demand Index (BPS 2023 population + public-space density) and Supply Index (active rooms weighted by crowdsourced rating). Source pills: `BPS DKI Jakarta 2023` · `Crowdsourcing MomSpace 2026` · `Dinas Kesehatan DKI`. Rose-tint note: Gap > 70 = priority intervention; data refreshed monthly.

**Gap Score color ramp:**
| Score | Color |
|---|---|
| ≥ 80 | `#C97A6E` |
| 65–79 | `#D88B7C` |
| 50–64 | `#E8A598` |
| 35–49 | `#F2C6B8` |
| 20–34 | `#F8DED4` |
| < 20 | `#FBEEEA` |

---

## Interactions & Behavior

**Navigation**
- Navbar tab tap switches root screen; Report tab opens the Report Hub sheet rather than pushing a screen.
- Report Hub card 1 → Laporan Kondisi. Card 2 → Tambah Lokasi Baru. "Batal" or swipe-down dismisses.
- Home Map sheet card / pin tap → Detail. Detail back → Home Map.
- Detail "Navigasi" → external maps intent. Disabled when the room is closed.

**Animations**
| Animation | Spec |
|---|---|
| Nav active pill | `background 180ms` |
| Option card press | `all 180ms cubic-bezier(.2,.8,.2,1)`, scale 0.985 |
| Report Hub sheet entry | `translateY(100%) → 0` + fade, 360 ms `cubic-bezier(.2,.9,.25,1)` |
| User-location pulse | 2 s linear infinite, scale 0.6 → 1.6, opacity 0.7 → 0 |
| Skeleton shimmer | 1.4 s ease-in-out infinite, 400 px gradient sweep |
| Success check pop | 600 ms `cubic-bezier(.2,1.4,.4,1)`, scale 0.4 → 1 |
| Success check draw | `stroke-dashoffset 30 → 0`, 450 ms ease-out, 200 ms delay |
| Dashed ring spin | 12–14 s linear infinite |
| Hourglass flip | 4 s loop — hold, rotate 180°, hold, rotate 360° |
| Sparkle twinkle | 1.6 s ease-in-out infinite, staggered 0 / 120–140 / 240–260 ms |

**Form validation**
- Laporan Kondisi: submit enabled when ≥ 1 condition chip is selected. Photo + notes optional. Notes max 200 chars with live counter.
- Tambah Lokasi: required = nama, alamat, titik peta, kategori. Facilities, photos (max 3), hours, notes optional. Notes max 200 chars.
- Disabled buttons use `#E6DCD4` / `#9E948A`, no shadow, `cursor: not-allowed`.

**Loading & empty**
- Home Map sheet has an explicit loading (skeleton) state and an empty state (nearby list) when no pin is selected.
- Dashboard has no loading state designed — reuse the skeleton treatment if you need one.

---

## State Management

**Home Map**
- `selectedRoomId: string | null` — null renders the empty sheet, set renders the default sheet
- `sheetState: 'default' | 'empty' | 'loading'`
- `userLocation: LatLng`, `nearbyRooms: Room[]`, `activeTab: 0..3`

**Detail**
- `room: Room` (name, address, distanceMeters, hours, rating, reviewCount, facilities[], photos[], isOpen)
- `isOpen` drives: status badge, photo overlay, hours color, "Buka pukul …" pill, Navigasi disabled

**Laporan Kondisi**
- `selectedConditions: string[]`, `photo: File | null`, `notes: string` (≤ 200)
- Derived `canSubmit = selectedConditions.length > 0`
- `submissionState: 'idle' | 'submitting' | 'success'`
- On submit: write to Firestore with `serverTimestamp()`, `userId`, `roomId`; award +10 points

**Tambah Lokasi**
- `name`, `address`, `coordinates: LatLng | null`, `category`, `facilities: string[]`, `photos: File[]` (≤ 3), `openTime`, `closeTime`, `notes`
- Derived `canSubmit` = all four required fields present
- Server writes `status: 'pending'` + `serverTimestamp()` + `submittedBy`

**Report Hub**
- `isOpen: boolean`, `pressedCard: 0 | 1 | null`

**Dashboard**
- `page: 'map' | 'gap'`, `dateRange`, `hoveredKecamatan: string | null`, `kecamatanData[]`, `pendingSubmissions[]`

---

## Assets

Everything in these prototypes is drawn with CSS/SVG — **no binary assets ship with this handoff**.

Needs replacing in production:
- **Map** — the choropleth and the mobile map are hand-drawn abstractions. Use a real map SDK (`google_maps_flutter` / `flutter_map`) with a custom warm style matching the map palette above, and real kecamatan GeoJSON boundaries for the dashboard choropleth. Kecamatan polygons in the prototype are **schematic, not geographic**.
- **Room photo & thumbnails** — CSS illustrations standing in for user-uploaded photos.
- **Avatars** — gradient initial tiles; keep as the fallback when a user has no photo.
- **Icons** — all inline SVG at 24 × 24 (`stroke-width` 1.8–2.2, round caps/joins). Replace with your icon library, keeping the outline/filled pairing for nav.
- **Fonts** — Nunito + Quicksand from Google Fonts (weights 500–900 / 400–700). JetBrains Mono for numeric/meta labels only.

---

## Screenshots

`screenshots/` holds one reference capture per prototype. They show the design canvas as authored — useful for a quick visual check, but the HTML files are the source of truth for measurements.

| File | Shows |
|---|---|
| `01-navbar.png` | Five navbar treatments + state studies + anatomy |
| `02-home-map.png` | Home/Map with all three bottom-sheet states |
| `03-detail.png` | Detail screen, open + closed |
| `04-laporan.png` | Condition report — empty / filled / success |
| `05-submit-lokasi.png` | Submission form + pending + admin queue |
| `06-report-hub.png` | Report hub sheet, default + pressed |
| `07-dashboard.png` | Gov dashboard — both pages |

---

## Files

**Prototypes** (open any in a browser):
- `MomSpace Navbar.html`
- `MomSpace Home Map.html`
- `MomSpace Detail.html`
- `MomSpace Laporan.html`
- `MomSpace Submit Lokasi.html`
- `MomSpace Report Hub.html`
- `MomSpace Dashboard.html`

**Component sources** (JSX, loaded by the prototypes):
- `nav-icons.jsx` — outline/filled icon pairs + tab definitions
- `navbars.jsx` — all five navbar variants (Classic Pill = `NavbarClassic`)
- `home-map.jsx` — map background, pins, search bar, floating buttons, all three bottom sheets
- `detail-screen.jsx` — detail screen + `FacilityTag` component
- `laporan-screen.jsx` — condition form, chips, success screen
- `submit-screen.jsx` — submission form, category/facility selects, admin cards
- `report-hub.jsx` — hub sheet + option cards
- `dashboard.jsx` — sidebar, topbar, choropleth, table, charts, both pages
- `map-screen.jsx` — early map mock used by the navbar study only

**Support files** (tooling, not design):
- `design-canvas.jsx`, `ios-frame.jsx`, `tweaks-panel.jsx`
