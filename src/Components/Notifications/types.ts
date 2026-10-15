export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationVariant = NotificationType;

// ─── Toast ────────────────────────────────────────────────────────────────────
export interface ToastOptions {
  duration?: number;   // ms, default 4000
  closable?: boolean;  // default true
}

export interface ToastItem {
  id: string;
  type: NotificationType;
  message: React.ReactNode;
  duration: number;
  closable: boolean;
  createdAt: number;
}

// ─── Quick Flash ──────────────────────────────────────────────────────────────
export interface QuickOptions {
  duration?: number;   // ms, default 2000
  icon?: React.ReactNode;
}

export interface QuickItem {
  id: string;
  message: React.ReactNode;
  duration: number;
  icon?: React.ReactNode;
  createdAt: number;
}

// ─── Banner ───────────────────────────────────────────────────────────────────
export interface BannerOptions {
  variant?: NotificationVariant; // default 'info'
  duration?: number;             // ms, 0 = persistent
  closable?: boolean;            // default true
  position?: 'top' | 'bottom';   // 'top' = under navbar, 'bottom' = bottom announcement
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface BannerItem {
  id: string;
  message: React.ReactNode;
  variant: NotificationVariant;
  duration: number;
  closable: boolean;
  position: 'top' | 'bottom';
  action?: BannerOptions['action'];
  createdAt: number;
}

// ─── Store Snapshot ───────────────────────────────────────────────────────────
export interface NotificationSnapshot {
  toasts: ToastItem[];
  quicks: QuickItem[];
  banners: BannerItem[];
}
