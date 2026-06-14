type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

type CacheStore = Map<string, CacheEntry<unknown>>;

declare global {
  // eslint-disable-next-line no-var
  var __leetcodeCache__: CacheStore | undefined;
}

const store: CacheStore = globalThis.__leetcodeCache__ ?? new Map<string, CacheEntry<unknown>>();

if (!globalThis.__leetcodeCache__) {
  globalThis.__leetcodeCache__ = store;
}

export async function getOrSetCache<T>(key: string, ttlMs: number, loader: () => Promise<T>) {
  const cached = store.get(key) as CacheEntry<T> | undefined;

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const value = await loader();
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
  return value;
}
