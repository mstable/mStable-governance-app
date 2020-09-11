/* eslint-disable no-empty */

import { Connectors } from 'use-wallet';

const STORAGE_PREFIX = '__mStable-governance-app__';
const STORAGE_VERSION = 0;

type VersionedStorage<V extends number, T> = {
  version: V;
} & Omit<T, 'version'>;

export interface StorageV0 extends VersionedStorage<0, {}> {
  connector?: { id: keyof Connectors; subType?: string };
  viewedEarnOnboarding?: boolean;
}

export type AllStorage = StorageV0;

export type Storage = Extract<AllStorage, { version: typeof STORAGE_VERSION }>;

const getStorageKey = (key: string): string => `${STORAGE_PREFIX}.${key}`;

export const LocalStorage = {
  // It might not be possible to write to localStorage, e.g. in Incognito mode;
  // ignore any get/set/clear errors.
  set<S extends Storage, T extends keyof S>(key: T, value: S[T]): void {
    const storageKey = getStorageKey(key as string);
    const json = JSON.stringify(value);
    try {
      window.localStorage.setItem(storageKey, json);
    } finally {
    }
  },
  setVersion(version: number): void {
    const storageKey = getStorageKey('version');
    const json = JSON.stringify(version);
    try {
      window.localStorage.setItem(storageKey, json);
    } finally {
    }
  },
  get<K extends keyof AllStorage>(key: K): AllStorage[K] {
    const storageKey = getStorageKey(key);
    let value;
    try {
      value = window.localStorage.getItem(storageKey);
    } finally {
    }
    return value && value.length > 0 ? JSON.parse(value) : undefined;
  },
  removeItem<K extends keyof AllStorage>(key: K): void {
    const storageKey = getStorageKey(key as string);
    try {
      window.localStorage.removeItem(storageKey);
    } finally {
    }
  },
  clearAll(): void {
    try {
      window.localStorage.clear();
    } finally {
    }
  },
};

const migrateLocalStorage = (): void => {
  // const version = LocalStorage.get('version');

  LocalStorage.setVersion(STORAGE_VERSION);
};

(() => migrateLocalStorage())();
