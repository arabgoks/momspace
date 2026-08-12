export function avgX(points: string): number {
  const pts = points.split(' ').map((p) => p.split(',').map(Number));
  return pts.reduce((s, [x]) => s + x, 0) / pts.length;
}

export function avgY(points: string): number {
  const pts = points.split(' ').map((p) => p.split(',').map(Number));
  return pts.reduce((s, [, y]) => s + y, 0) / pts.length;
}
