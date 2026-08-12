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
