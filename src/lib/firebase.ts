import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBvg60yAx8ojtmRtw8cQbGUwhYtONY8RyQ",
    authDomain: "tiens-sudan.firebaseapp.com",
    databaseURL: "https://tiens-sudan-default-rtdb.firebaseio.com",
    projectId: "tiens-sudan",
    storageBucket: "tiens-sudan.firebasestorage.app",
    messagingSenderId: "778870562236",
    appId: "1:778870562236:web:aa6553c3cb9c9b7f489fb9"
};

// Initialize Firebase only if config is somewhat valid to avoid crash loops during dev
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const database = app ? getDatabase(app) : null;

/**
 * Helper hook or function to fetch stock status
 * Returns a map of Product Name -> inStock boolean
 */
export const subscribeToStockStatus = (callback: (stockMap: Record<string, boolean>) => void) => {
    if (!database) {
        // If Firebase isn't set up yet, return an empty map so it falls back to local tiensData.ts
        callback({});
        return () => { };
    }

    const stockRef = ref(database, 'inventory');

    const unsubscribe = onValue(stockRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            callback(data);
        } else {
            callback({});
        }
    }, (error) => {
        console.error("Firebase fetch error:", error);
        callback({});
    });

    return unsubscribe;
};

/**
 * Helper hook or function to fetch product prices
 * Returns a map of Product Name -> price (number)
 */
export const subscribeToPrices = (callback: (priceMap: Record<string, number>) => void) => {
    if (!database) {
        callback({});
        return () => { };
    }

    const priceRef = ref(database, 'prices');

    const unsubscribe = onValue(priceRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            callback(data);
        } else {
            callback({});
        }
    }, (error) => {
        console.error("Firebase fetch error:", error);
        callback({});
    });

    return unsubscribe;
};

// Current app version — must match package.json
export const APP_VERSION = "1.0.0";

export interface AppUpdateInfo {
    latest_version: string;
    apk_url: string;
    apk_size_mb: string;
    force_update: boolean;
    changelog_ar?: string;
    changelog_en?: string;
}

/**
 * Check Firebase for a newer app version.
 * Returns AppUpdateInfo if an update is available, or null if up-to-date / offline.
 */
export const checkForUpdate = async (): Promise<AppUpdateInfo | null> => {
    if (!database) return null;

    try {
        const configRef = ref(database, 'app_config');
        const snapshot = await get(configRef);
        const data = snapshot.val() as AppUpdateInfo | null;

        if (!data || !data.latest_version) return null;

        // Compare versions: split by "." and compare each segment
        const current = APP_VERSION.split('.').map(Number);
        const latest = data.latest_version.split('.').map(Number);

        let needsUpdate = false;
        for (let i = 0; i < Math.max(current.length, latest.length); i++) {
            const c = current[i] || 0;
            const l = latest[i] || 0;
            if (l > c) { needsUpdate = true; break; }
            if (l < c) break;
        }

        return needsUpdate ? data : null;
    } catch (error) {
        console.error("Update check failed:", error);
        return null;
    }
};
