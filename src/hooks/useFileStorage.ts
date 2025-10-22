'use client';

import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';

/**
 * Init tauri modules
 * @returns tauri modules
 */
function useTauriModules() {
    const [tauriFS, setTauriFS] = useState<typeof import('@tauri-apps/plugin-fs') | null>(null);
    const [tauriPath, setTauriPath] = useState<typeof import('@tauri-apps/api/path') | null>(null);

    useEffect(() => {
        const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;
        if (isTauri) {
            Promise.all([
                import('@tauri-apps/plugin-fs').then(setTauriFS),
                import('@tauri-apps/api/path').then(setTauriPath),
            ]).catch(console.error);
        }
    }, []);

    return { isTauri: !!tauriFS && !!tauriPath, tauriFS, tauriPath };
}


/**
 * Create the storage path and return it
 * @param key storage key
 * @param tauriPath path module
 * @param tauriFS fs module
 * @returns file path
 */
async function getStorageFilePath(
    key: string,
    tauriPath: typeof import('@tauri-apps/api/path'),
    tauriFS: typeof import('@tauri-apps/plugin-fs')
): Promise<string> {
    const appDataDir = await tauriPath.appDataDir();
    const dirPath = await tauriPath.join(appDataDir, 'snippet-manager');
    await tauriFS.mkdir(dirPath, { recursive: true });
    return tauriPath.join(dirPath, `${key}.json`);
}

/**
 * Main hook
 * @param key 
 * @param initialValue 
 * @returns value and setter
 */
export function useFileStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const { isTauri, tauriFS, tauriPath } = useTauriModules();

    const save = useCallback(
        async (value: T) => {
            if (!isTauri) {
                localStorage.setItem(key, JSON.stringify(value));
                return;
            }

            if (!tauriFS || !tauriPath) return;

            try {
                const filePath = await getStorageFilePath(key, tauriPath, tauriFS);
                await tauriFS.writeTextFile(filePath, JSON.stringify(value, null, 2));
            } catch (err) {
                console.error(`Failed to save ${key}:`, err);
            }
        },
        [key, isTauri, tauriFS, tauriPath]
    );

    // Initial loading
    useEffect(() => {
        const load = async () => {
            if (!isTauri) {
                const item = localStorage.getItem(key);
                if (item) setStoredValue(JSON.parse(item));
                return;
            }

            if (!tauriFS || !tauriPath) return;

            try {
                const filePath = await getStorageFilePath(key, tauriPath, tauriFS);
                const content = await tauriFS.readTextFile(filePath);
                const parsed = JSON.parse(content);
                setStoredValue((prev) => (JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed));
            } catch {
                console.log(`No saved data for ${key}, using initial value`);
                await save(initialValue);
            }
        };

        load();
    }, [key, initialValue, isTauri, tauriFS, tauriPath, save]);

    // Public value setter
    const setValue = useCallback<Dispatch<SetStateAction<T>>>(
        async (updater) => {
            const newValue = updater instanceof Function ? updater(storedValue) : updater;
            setStoredValue(newValue);
            await save(newValue);
        },
        [storedValue, save]
    );

    return [storedValue, setValue];
}