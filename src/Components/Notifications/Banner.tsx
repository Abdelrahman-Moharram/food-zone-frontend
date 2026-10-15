'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  IoCheckmarkCircle,
  IoWarning,
  IoCloseCircle,
  IoInformationCircle,
  IoClose,
  IoArrowBack,
} from 'react-icons/io5';
import type { BannerItem, NotificationVariant } from './types';
import { removeBanner } from './store';

const VARIANT_CONFIG: Record<
  NotificationVariant,
  {
    bg: string;
    border: string;
    icon: React.ReactNode;
    actionBtn: string;
  }
> = {
  success: {
    bg: 'bg-primary text-white shadow-primary/20',
    border: 'border-primary/40',
    icon: <IoCheckmarkCircle className="w-4 h-4 shrink-0" />,
    actionBtn: 'bg-white/20 hover:bg-white/30 text-white',
  },
  error: {
    bg: 'bg-red-600 text-white shadow-red-500/20',
    border: 'border-red-500/40',
    icon: <IoCloseCircle className="w-4 h-4 shrink-0" />,
    actionBtn: 'bg-white/20 hover:bg-white/30 text-white',
  },
  warning: {
    bg: 'bg-amber-600 text-white shadow-amber-500/20',
    border: 'border-amber-500/40',
    icon: <IoWarning className="w-4 h-4 shrink-0" />,
    actionBtn: 'bg-white/20 hover:bg-white/30 text-white',
  },
  info: {
    bg: 'bg-blue-600 text-white shadow-blue-500/20',
    border: 'border-blue-500/40',
    icon: <IoInformationCircle className="w-4 h-4 shrink-0" />,
    actionBtn: 'bg-white/20 hover:bg-white/30 text-white',
  },
};

function Banner({ item }: { item: BannerItem }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const config = VARIANT_CONFIG[item.variant] ?? VARIANT_CONFIG.info;
  const isTop = item.position !== 'bottom';

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setLeaving(true);
    timerRef.current = setTimeout(() => removeBanner(item.id), 300);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Calculate transform for entry/exit
  const getTransformClass = () => {
    if (visible && !leaving) {
      return 'translate-y-0 opacity-100';
    }
    return isTop ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0';
  };

  return (
    <div
      role="region"
      aria-label="إشعار شريطي"
      className={`
        w-full transition-all duration-300 ease-out pointer-events-auto
        ${getTransformClass()}
      `}
    >
      <div
        className={`
          w-full px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-sm
          ${config.bg}
        `}
        dir="rtl"
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-center sm:justify-start">
          <span className="shrink-0">{config.icon}</span>
          <div className="font-medium text-xs sm:text-sm truncate sm:whitespace-normal">
            {item.message}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.action && (
            <button
              onClick={() => {
                item.action?.onClick();
                dismiss();
              }}
              className={`
                px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1
                ${config.actionBtn}
              `}
            >
              <span>{item.action.label}</span>
              <IoArrowBack className="w-3 h-3" />
            </button>
          )}

          {item.closable && (
            <button
              onClick={dismiss}
              className="p-1 rounded-md hover:bg-white/20 transition-colors text-white/90 hover:text-white"
              aria-label="إغلاق الإشعار"
            >
              <IoClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BannerContainer({ items }: { items: BannerItem[] }) {
  if (!items.length) return null;

  const topBanners = items.filter((b) => b.position !== 'bottom');
  const bottomBanners = items.filter((b) => b.position === 'bottom');

  return (
    <>
      {topBanners.length > 0 && (
        <div
          className="fixed top-16 left-0 right-0 z-[9990] flex flex-col pointer-events-none"
          aria-label="إعلانات أعلى الصفحة"
        >
          {topBanners.map((item) => (
            <Banner key={item.id} item={item} />
          ))}
        </div>
      )}

      {bottomBanners.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[9990] flex flex-col pointer-events-none"
          aria-label="إعلانات أسفل الصفحة"
        >
          {bottomBanners.map((item) => (
            <Banner key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
