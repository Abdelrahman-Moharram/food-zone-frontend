import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { setLogout } from '../features/authSlice';
import { setOnline, setOffline } from '../features/connectionSlice';
import { Mutex } from 'async-mutex';
import { toast } from 'react-toastify';
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
  credentials: 'include',
  headers: { 'Accept-Language': localStorage.getItem("lang") || 'en' }
});


// Helper to check actual backend connectivity
const pingBackend = async () => {
  try {
    await fetch(`${import.meta.env.VITE_BASE_URL}/api/ping/`, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store'
    });
    return true;
  } catch (error) {
    console.log(error);
    
    return false;
  }
};

// Helper to wait for online status via Redux state polling & active pinging
const waitForReset = async (api: any) => {
  while (true) {
    // If browser says we are online, try to ping backend
    if (navigator.onLine) {
      const isConnected = await pingBackend();
      if (isConnected) {
        api.dispatch(setOnline());
        break;
      }
    }

    const state = api.getState() as any;
    // If some other request already restored connection
    if (state.connection?.isOnline) {
      break;
    }

    // Wait before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  // Check connection state from Redux
  const state = api.getState() as any;

  // If Redux says we are offline, or browser says we are offline, we check/wait
  if (!state.connection?.isOnline || !navigator.onLine) {
    // First, try a quick ping if browser thinks we are online
    if (navigator.onLine) {
      const isConnected = await pingBackend();
      if (isConnected) {
        api.dispatch(setOnline());
      } else {
        api.dispatch(setOffline());
        await waitForReset(api);
      }
    } else {
      api.dispatch(setOffline());
      await waitForReset(api);
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  // ✅ في حالة انتهاء صلاحية الـ access token
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // ⚙️ أطلب refresh بدون body (الكوكي هي اللي فيها الـ refresh token)
        const refreshResult = await baseQuery(
          { url: '/users/jwt/refresh/', method: 'POST' },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          // ✅ أعد تنفيذ الطلب الأصلي بعد التجديد
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(setLogout());

        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  } else if (result.error && result.error.status === 403) {
    toast.error("You don't have permissions to proceed with this action");
    history.back();
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'users',
    'roles-permissions',
    'roles',

    'restaurants',
    'menus',
    'orders',
    'cart',
    'payments'
  ],
  endpoints: () => ({}),
});
