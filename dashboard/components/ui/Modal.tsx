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
