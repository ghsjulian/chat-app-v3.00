// libs/indexDB.js

const DB_NAME = "ChatDB";
const STORE_NAME = "messages";
const DB_VERSION = 1;

// 🔹 Open database
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject("Failed to open IndexedDB");
        request.onsuccess = e => resolve(e.target.result);
        request.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "receiver_id" });
            }
        };
    });
};

// 🔹 Save messages (only keep last 15)
export const saveMessages = async (receiver_id, newMessages) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const existing = await new Promise(resolve => {
        const req = store.get(receiver_id);
        req.onsuccess = () => resolve(req.result?.messages || []);
        req.onerror = () => resolve([]);
    });

    const merged = Array.isArray(newMessages)
        ? [...existing, ...newMessages]
        : [...existing, newMessages];

    // Keep only last 15
    const trimmed = merged.slice(-15);
    store.put({ receiver_id, messages: trimmed });
    return tx.complete;
};

// 🔹 Get messages
export const getMessages = async receiver_id => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise(resolve => {
        const req = store.get(receiver_id);
        req.onsuccess = () => resolve(req.result?.messages || []);
        req.onerror = () => resolve([]);
    });
};

// 🔹 Merge messages (for sync)
export const mergeMessages = async (receiver_id, serverMessages) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const existing = await new Promise(resolve => {
        const req = store.get(receiver_id);
        req.onsuccess = () => resolve(req.result?.messages || []);
        req.onerror = () => resolve([]);
    });

    // Avoid duplicates by filtering unique IDs (if your messages have `_id`)
    const all = [...existing, ...serverMessages].reduce((acc, msg) => {
        if (!acc.find(m => m._id === msg._id)) acc.push(msg);
        return acc;
    }, []);

    const trimmed = all.slice(-15);
    store.put({ receiver_id, messages: trimmed });

    return tx.complete;
};
export const updateMessagesById = async (receiver_id, newMessagesArray) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    // Just overwrite with new array
    store.put({ receiver_id, messages: newMessagesArray });

    return tx.complete;
};

export const deleteDB = () => {
    return new Promise((resolve, reject) => {
        const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
        deleteRequest.onsuccess = () => {
            resolve(true);
        };
        deleteRequest.onerror = event => {
            reject(event);
        };
        deleteRequest.onblocked = () => {
            console.warn(
                `⚠️ Deletion blocked for "${DB_NAME}". Please close all open tabs.`
            );
        };
    });
};
