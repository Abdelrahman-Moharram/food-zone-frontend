import type {
  NotificationSnapshot,
  ToastItem,
  ToastOptions,
  QuickItem,
  QuickOptions,
  BannerItem,
  BannerOptions,
  NotificationType,
  NotificationVariant,
} from './types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── State ────────────────────────────────────────────────────────────────────
let state: NotificationSnapshot = {
  toasts:  [],
  quicks:  [],
  banners: [],
};

// ─── Pub/Sub ──────────────────────────────────────────────────────────────────
type Listener = () => void;
const listeners = new Set<Listener>();

function setState(next: Partial<NotificationSnapshot>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): NotificationSnapshot {
  return state;
}

// ─── Toast Actions ────────────────────────────────────────────────────────────
export function addToast(
  type: NotificationType,
  message: React.ReactNode,
  options?: ToastOptions
): string {
  const id = uid();
  const item: ToastItem = {
    id,
    type,
    message,
    duration: options?.duration ?? 4000,
    closable: options?.closable ?? true,
    createdAt: Date.now(),
  };
  setState({ toasts: [...state.toasts, item] });

  if (item.duration > 0) {
    setTimeout(() => removeToast(id), item.duration);
  }

  return id;
}

export function removeToast(id: string) {
  setState({ toasts: state.toasts.filter((t) => t.id !== id) });
}

// ─── Quick Flash Actions ──────────────────────────────────────────────────────
export function addQuick(
  message: React.ReactNode,
  options?: QuickOptions
): string {
  const id = uid();
  const item: QuickItem = {
    id,
    message,
    duration: options?.duration ?? 2000,
    icon: options?.icon,
    createdAt: Date.now(),
  };
  setState({ quicks: [...state.quicks, item] });

  setTimeout(() => removeQuick(id), item.duration);

  return id;
}

export function removeQuick(id: string) {
  setState({ quicks: state.quicks.filter((q) => q.id !== id) });
}

// ─── Banner Actions ───────────────────────────────────────────────────────────
export function addBanner(
  message: React.ReactNode,
  options?: BannerOptions
): string {
  const id = uid();
  const item: BannerItem = {
    id,
    message,
    variant:  options?.variant  ?? 'info',
    duration: options?.duration ?? 5000,
    closable: options?.closable ?? true,
    position: options?.position ?? 'top',
    action:   options?.action,
    createdAt: Date.now(),
  };

  // Replace existing banner in the same position
  setState({ banners: [...state.banners.filter(b => b.position !== item.position), item] });

  if (item.duration > 0) {
    setTimeout(() => removeBanner(id), item.duration);
  }

  return id;
}

export function removeBanner(id: string) {
  setState({ banners: state.banners.filter((b) => b.id !== id) });
}
