/* eslint-disable no-empty */

const STORAGE_PREFIX = '__mStable-governance-app__';
const STORAGE_VERSION = 1;

type VersionedStorage<V extends number, T> = {
  version: V;
} & Omit<T, 'version'>;

export interface StorageV0 extends VersionedStorage<0, {}> {
  connector?: { id: string; subType?: string };
  viewedEarnOnboarding?: boolean;
}

export interface StorageV1 extends VersionedStorage<1, StorageV0> {
  walletName?: string;
}

export type AllStorage = StorageV0 & StorageV1;

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
    const storageKey = getStorageKey(key as string);
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
  const version = LocalStorage.get('version');
  if (version === 0) {
    const connector = LocalStorage.get<'connector'>('connector');
    if (connector) {
      const { id, subType } = connector;
      let walletName;
      switch (id) {
        case 'injected':
          if (subType === 'metamask') {
            walletName = 'MetaMask';
          } else if (subType === 'brave') {
            walletName = 'Brave';
          } else if (subType === 'meetOne') {
            walletName = 'MeetOne';
          }
          break;
        case 'fortmatic':
          walletName = 'Fortmatic';
          break;
        case 'portis':
          walletName = 'Portis';
          break;
        case 'authereum':
          walletName = 'Authereum';
          break;
        case 'squarelink':
          walletName = 'SquareLink';
          break;
        case 'torus':
          walletName = 'Torus';
          break;
        case 'walletconnect':
          walletName = 'WalletConnect';
          break;
        case 'walletlink':
          walletName = 'WalletLink';
          break;
        default:
          break;
      }
      LocalStorage.set('walletName', walletName);
    }
  }
  LocalStorage.setVersion(STORAGE_VERSION);
};

(() => migrateLocalStorage())();
