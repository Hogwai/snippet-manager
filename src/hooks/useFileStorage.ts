'use client';

import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';

// Gestion des imports dynamiques dans un hook
function useTauri() {
    const [tauriFS, setTauriFS] = useState<typeof import('@tauri-apps/plugin-fs') | null>(null);
    const [tauriPath, setTauriPath] = useState<typeof import('@tauri-apps/api/path') | null>(null);

    useEffect(() => {
        const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;
        if (isTauri) {
            Promise.all([
                import('@tauri-apps/plugin-fs').then(module => setTauriFS(module)),
                import('@tauri-apps/api/path').then(module => setTauriPath(module)),
            ]).catch(error => console.error('Error loading Tauri modules:', error));
        }
    }, []);

    return { isTauri: !!tauriFS && !!tauriPath, tauriFS, tauriPath };
}

export function useFileStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const { isTauri, tauriFS, tauriPath } = useTauri();

    const saveToFile = useCallback(
        async (value: T) => {
            if (!isTauri) {
                window.localStorage.setItem(key, JSON.stringify(value));
                return;
            }
            if (tauriFS && tauriPath) {
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
        },
        [key, isTauri, tauriFS, tauriPath]
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadData = async () => {
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
        };

        loadData();
    }, [key, initialValue, isTauri, tauriFS, tauriPath, saveToFile]);

    const setValue: Dispatch<SetStateAction<T>> = useCallback(
        async (value) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                await saveToFile(valueToStore);
            } catch (error) {
                console.error(`Error saving ${key}:`, error);
            }
        },
        [key, storedValue, saveToFile]
    );

    return [storedValue, setValue];
}