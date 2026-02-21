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
