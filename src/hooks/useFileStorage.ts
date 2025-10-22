'use client';

import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';

// Desktop or Web
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

let tauriFS: typeof import('@tauri-apps/plugin-fs') | null = null;
let tauriPath: typeof import('@tauri-apps/api/path') | null = null;

if (isTauri) {
    import('@tauri-apps/plugin-fs').then(module => {
        tauriFS = module;
    });
    import('@tauri-apps/api/path').then(module => {
        tauriPath = module;
    });
}

export function useFileStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isClient, setIsClient] = useState<boolean>(false);

    const saveToFile = useCallback(async (value: T) => {
        if (isTauri && tauriFS && tauriPath) {
            try {
                const appDataDir = await tauriPath.appDataDir();
                const dirPath = `${appDataDir}snippet-manager`;
                const filePath = `${dirPath}/${key}.json`;

                try {
                    await tauriFS.mkdir(dirPath);
                } catch {
                    console.debug(`${dirPath} already exists`);
                }

                await tauriFS.writeTextFile(filePath, JSON.stringify(value, null, 2));
            } catch (error) {
                console.error(`Error saving ${key} to file:`, error);
            }
        }
    }, [key]);

    const loadData = useCallback(async () => {
        if (!isClient) return;

        try {
            if (isTauri && tauriFS && tauriPath) {
                const appDataDir = await tauriPath.appDataDir();
                const filePath = `${appDataDir}snippet-manager/${key}.json`;

                try {
                    const contents = await tauriFS.readTextFile(filePath);
                    const parsed = JSON.parse(contents);
                    setStoredValue((prev) => (JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed));
                } catch {
                    console.log(`File ${key}.json not found, using initial value`);
                    await saveToFile(initialValue);
                }
            } else {
                const item = window.localStorage.getItem(key);
                if (item) {
                    const parsed = JSON.parse(item);
                    setStoredValue((prev) => (JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed));
                }
            }
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
        }
    }, [isClient, key, initialValue, saveToFile]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            loadData();
        }
    }, [isClient, loadData]);

    const setValue: Dispatch<SetStateAction<T>> = async (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            if (isClient) {
                if (isTauri) {
                    await saveToFile(valueToStore);
                } else {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            }
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
        }
    };

    return [storedValue, setValue];
}