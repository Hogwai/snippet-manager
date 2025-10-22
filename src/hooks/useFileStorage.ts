'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// Détecte si on est dans Tauri ou dans le navigateur
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

let tauriFS: any = null;
let tauriPath: any = null;

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
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, [key]);

  const loadData = async () => {
    if (!isClient) return;

    try {
      if (isTauri && tauriFS && tauriPath) {
        const appDataDir = await tauriPath.appDataDir();
        const filePath = `${appDataDir}snippet-manager/${key}.json`;
        
        try {
          const contents = await tauriFS.readTextFile(filePath);
          setStoredValue(JSON.parse(contents));
        } catch (error) {
          console.log(`File ${key}.json not found, using initial value`);
          await saveToFile(initialValue);
        }
      } else {
        // Mode navigateur - Utiliser localStorage
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
      setIsReady(true);
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      setIsReady(true);
    }
  };

  const saveToFile = async (value: T) => {
    if (isTauri && tauriFS && tauriPath) {
      try {
        const appDataDir = await tauriPath.appDataDir();
        const dirPath = `${appDataDir}snippet-manager`;
        const filePath = `${dirPath}/${key}.json`;

        try {
          await tauriFS.createDir(dirPath, { recursive: true });
        } catch (e) {
          console.debug(`${dirPath} already exists`)
        }

        await tauriFS.writeTextFile(filePath, JSON.stringify(value, null, 2));
      } catch (error) {
        console.error(`Error saving ${key} to file:`, error);
      }
    }
  };

  const setValue: Dispatch<SetStateAction<T>> = async (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (isClient) {
        if (isTauri) {
          // Sauvegarder dans le système de fichiers
          await saveToFile(valueToStore);
        } else {
          // Sauvegarder dans localStorage
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  return [storedValue, setValue];
}