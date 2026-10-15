'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoWarning,
  IoInformationCircle,
  IoClose,
} from 'react-icons/io5';
import type { ToastItem, NotificationType } from './types';
import { removeToast } from './store';

// ─── Icon & Colour map ────────────────────────────────────────────────────────
const CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; accent: string; bg: string; progress: string }
> = {
  success: {
    icon:     <IoCheckmarkCircle className="w-5 h-5" />,
    accent:   'bg-primary',
    bg:       'bg-primary/8',
    progress: 'bg-primary',
  },
  error: {
    icon:     <IoCloseCircle className="w-5 h-5" />,
    accent:   'bg-red-500',
    bg:       'bg-red-500/8',
    progress: 'bg-red-500',
  },
  warning: {
    icon:     <IoWarning className="w-5 h-5" />,
    accent:   'bg-amber-500',
    bg:       'bg-amber-500/8',
    progress: 'bg-amber-500',
  },
  info: {
    icon:     <IoInformationCircle className="w-5 h-5" />,
    accent:   'bg-blue-500',
    bg:       'bg-blue-500/8',
    progress: 'bg-blue-500',
  },
};

const ICON_COLOR: Record<NotificationType, string> = {
  success: 'text-primary',
  error:   'text-red-500',
  warning: 'text-amber-500',
  info:    'text-blue-500',
};

// ─── Single Toast ─────────────────────────────────────────────────────────────
function Toast({ item }: { item: ToastItem }) {
  const cfg = CONFIG[item.type];
  const iconColor = ICON_COLOR[item.type];
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger enter animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setLeaving(true);
    timerRef.current = setTimeout(() => removeToast(item.id), 350);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        relative overflow-hidden flex items-start gap-3
        w-80 sm:w-96 max-w-[calc(100vw-2rem)]
        bg-card/95 backdrop-blur-2xl
        border border-border/70
        rounded-2xl shadow-xl
        p-4 pr-3
        transition-all duration-350 ease-out
        ${visible && !leaving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-8 opacity-0 scale-95'
        }
      `}
    >
      {/* Left accent bar */}
      <span className={`absolute right-0 top-0 bottom-0 w-1 rounded-r-2xl ${cfg.accent}`} />

      {/* Background tint */}
      <span className={`absolute inset-0 rounded-2xl ${cfg.bg} opacity-40`} />

      {/* Icon */}
      <span className={`relative shrink-0 mt-0.5 ${iconColor}`}>
        {cfg.icon}
      </span>

      {/* Content */}
      <div className="relative flex-1 min-w-0 font-sans text-right" dir="rtl">
        <p className="text-sm font-medium text-copy-primary leading-snug break-words">
          {item.message}
        </p>
      </div>

      {/* Dismiss */}
      {item.closable && (
        <button
          onClick={dismiss}
          className="relative shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-lg text-copy-secondary hover:text-copy-primary hover:bg-border/40 transition-colors"
          aria-label="إغلاق"
        >
          <IoClose className="w-4 h-4" />
        </button>
      )}

      {/* Progress bar */}
      {item.duration > 0 && (
        <span
          className={`absolute bottom-0 left-0 h-0.5 rounded-full ${cfg.progress} opacity-60`}
          style={{
            animation: `toast-progress ${item.duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────
export default function ToastContainer({ items }: { items: ToastItem[] }) {
  return (
    <>
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div
        aria-label="إشعارات"
        className="fixed top-[72px] left-4 z-[9999] flex flex-col gap-2.5 pointer-events-none"
      >
        {items.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <Toast item={item} />
          </div>
        ))}
      </div>
    </>
  );
}
