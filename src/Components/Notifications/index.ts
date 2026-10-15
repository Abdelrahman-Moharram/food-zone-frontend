import React from 'react';
import {
  addToast,
  addQuick,
  addBanner,
  removeToast,
  removeQuick,
  removeBanner,
} from './store';
import type {
  NotificationType,
  NotificationVariant,
  ToastOptions,
  QuickOptions,
  BannerOptions,
} from './types';

export * from './types';
export * from './store';
export { default as NotificationContainer } from './NotificationContainer';
export { default as ToastContainer } from './Toast';
export { default as QuickFlashContainer } from './QuickFlash';
export { default as BannerContainer } from './Banner';

export type NotificationDisplayType =
  | 'toast'
  | 'quick'
  | 'banner'
  | 'announcement'
  | NotificationType;

export interface GeneralMessageOptions
  extends ToastOptions,
    QuickOptions,
    BannerOptions {
  variant?: NotificationVariant;
}

/**
 * General unified caller:
 * showMessage('quick', 'تم النسخ')
 * showMessage('toast', 'تم الحفظ بنجاح')
 * showMessage('success', 'تم الحفظ')
 * showMessage('banner', 'رسالة أسفل النافبار', { variant: 'warning' })
 * showMessage('announcement', 'رسالة أسفل الصفحة')
 */
export function showMessage(
  type: NotificationDisplayType,
  message: React.ReactNode,
  options?: GeneralMessageOptions
): string {
  switch (type) {
    case 'quick':
      return addQuick(message, options);

    case 'banner':
      return addBanner(message, { ...options, position: options?.position ?? 'top' });

    case 'announcement':
      return addBanner(message, { ...options, position: 'bottom' });

    case 'success':
    case 'error':
    case 'warning':
    case 'info':
      return addToast(type, message, options);

    case 'toast':
    default:
      return addToast(options?.variant ?? 'info', message, options);
  }
}

// Fluent notification object with helper methods
export const notification = {
  // Direct function call
  show: showMessage,

  // Toast variants
  success: (message: React.ReactNode, options?: ToastOptions) =>
    addToast('success', message, options),
  error: (message: React.ReactNode, options?: ToastOptions) =>
    addToast('error', message, options),
  warning: (message: React.ReactNode, options?: ToastOptions) =>
    addToast('warning', message, options),
  info: (message: React.ReactNode, options?: ToastOptions) =>
    addToast('info', message, options),

  // Quick flash message (bottom center pill)
  quick: (message: React.ReactNode, options?: QuickOptions) =>
    addQuick(message, options),

  // Under-navbar banner
  banner: (message: React.ReactNode, options?: BannerOptions) =>
    addBanner(message, { ...options, position: 'top' }),

  // Bottom-of-page announcement
  announcement: (message: React.ReactNode, options?: BannerOptions) =>
    addBanner(message, { ...options, position: 'bottom' }),

  // Manual dismiss helpers
  dismissToast: removeToast,
  dismissQuick: removeQuick,
  dismissBanner: removeBanner,
};

// Callable Notification function with attached methods for convenience
type NotificationCallable = typeof showMessage & typeof notification;

export const Notification: NotificationCallable = Object.assign(
  (type: NotificationDisplayType, message: React.ReactNode, options?: GeneralMessageOptions) =>
    showMessage(type, message, options),
  notification
);

export default notification;
