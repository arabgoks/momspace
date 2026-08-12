import { G } from '@/lib/colors';

export function FlagMarker({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - 32} stroke={G.sageDk} strokeWidth="1.5" />
      <path d={`M${x} ${y - 32} L${x + 22} ${y - 28} L${x + 18} ${y - 22} L${x + 22} ${y - 16} L${x} ${y - 18} Z`} fill={G.sageDk} />
    </g>
  );
}
