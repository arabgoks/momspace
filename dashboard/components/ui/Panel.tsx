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
