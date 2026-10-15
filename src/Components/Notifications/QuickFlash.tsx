'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IoCheckmarkDone, IoFlash } from 'react-icons/io5';
import type { QuickItem } from './types';
import { removeQuick } from './store';

// ─── Single Quick Flash ───────────────────────────────────────────────────────
function QuickFlash({ item, index }: { item: QuickItem; index: number }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stagger enter by index
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10 + index * 60);
    return () => clearTimeout(t);
  }, [index]);

  // Trigger exit just before removal
  useEffect(() => {
    const exitAt = item.duration - 350;
    const t = setTimeout(() => setLeaving(true), exitAt > 0 ? exitAt : 0);
    return () => clearTimeout(t);
  }, [item.duration]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        inline-flex items-center gap-2 px-4 py-2.5
        bg-primary text-white
        rounded-full shadow-lg shadow-primary/30
        font-sans text-sm font-semibold
        pointer-events-auto select-none
        transition-all duration-300 ease-out
        ${visible && !leaving
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-3 opacity-0 scale-95'
        }
      `}
    >
      <span className="shrink-0 text-white/90">
        {item.icon ?? <IoCheckmarkDone className="w-4 h-4" />}
      </span>
      <span dir="rtl" className="whitespace-nowrap">{item.message}</span>
    </div>
  );
}

// ─── Quick Flash Container ────────────────────────────────────────────────────
export default function QuickFlashContainer({ items }: { items: QuickItem[] }) {
  if (!items.length) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none"
      aria-label="رسائل سريعة"
    >
      {items.map((item, i) => (
        <QuickFlash key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}
