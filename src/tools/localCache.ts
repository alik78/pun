interface CacheEntry<T> {
	value: T;
	expiry: number;
}

const cache: Record<string, CacheEntry<any>> = {};

export function getFromCache<T>(key: string) {
	const now = Date.now();
	const existingEntry = cache[key];

	if (existingEntry && existingEntry.expiry > now) {
		return existingEntry.value as T;
	}
	return null;
}

export function setCache(key: string, value: any, expirationMinutes : number) {
	const now = Date.now();
	cache[key] = {
		value: value,
		expiry: now + expirationMinutes * 60 * 1000, // Convert minutes to milliseconds
	};
}
