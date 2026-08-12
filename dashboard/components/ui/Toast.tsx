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
