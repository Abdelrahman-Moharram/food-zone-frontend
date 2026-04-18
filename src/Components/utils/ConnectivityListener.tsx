import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../redux/hooks';
import { setOnline, setOffline } from '../../redux/features/connectionSlice';

const ConnectivityListener = () => {
    // Track if we have already shown the offline toast to avoid duplicates
    // although react-toastify's toastId handles this, local state/ref can double check
    const isOfflineRef = useRef(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleOnline = () => {
            dispatch(setOnline());
            // Only show "Back Online" if we were previously offline
            if (isOfflineRef.current) {
                toast.dismiss('offline-toast');
                toast.success("Back Online", {
                    position: "bottom-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                isOfflineRef.current = false;
            }
        };

        const handleOffline = () => {
            dispatch(setOffline());
            if (!isOfflineRef.current) {
                toast.error("No Internet Connection", {
                    position: "bottom-left",
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: 'offline-toast'
                });
                isOfflineRef.current = true;
            }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Ping backend periodically to check for "real" connection
        const pingInterval = setInterval(async () => {
            if (navigator.onLine) {
                try {
                    // Start with a simpler ping - fetching favicon or base url
                    // Using no-cache to avoid false positives
                    await fetch(`${import.meta.env.VITE_BASE_URL}/api/ping/`, { 
                        method: 'HEAD',
                        mode: 'no-cors', // We just want to see if it fails network-wise
                        cache: 'no-store'
                    });
                    
                    // If we reach here, we likely have connection. 
                    // If we were marked offline, trigger online handler
                    if (isOfflineRef.current) {
                         handleOnline();
                    }
                } catch (error) {
                    // If fetch fails (and not just because of CORS if we used cors mode, but we used no-cors)
                    // Actually, with no-cors, we can't easily detect errors unless it's a network error.
                    // If we get a network error, it throws.
                    console.error("Ping failed:", error);
                    handleOffline();
                }
            } else {
                 handleOffline();
            }
        }, 10000); // Check every 10 seconds

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(pingInterval);
        };
    }, []);

    return null; // This component doesn't render anything visual itself
};

export default ConnectivityListener;
