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
