'use client';

import React, { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot } from './store';
import ToastContainer from './Toast';
import QuickFlashContainer from './QuickFlash';
import BannerContainer from './Banner';
import type { NotificationSnapshot } from './types';

const emptySnapshot: NotificationSnapshot = {
  toasts: [],
  quicks: [],
  banners: [],
};

function getServerSnapshot(): NotificationSnapshot {
  return emptySnapshot;
}

export default function NotificationContainer() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return (
    <>
      <BannerContainer items={snapshot.banners} />
      <ToastContainer items={snapshot.toasts} />
      <QuickFlashContainer items={snapshot.quicks} />
    </>
  );
}
