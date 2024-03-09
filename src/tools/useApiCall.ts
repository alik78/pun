import { useState, useEffect } from 'react';
import { getFromCache, setCache } from './localCache';

function getApiBaseUrl() {
	return "http://staging-api.protectukrainenow.org/v1";
	console.warn(JSON.stringify(import.meta.env, null, 2));
	return '/api';
}


export const useApi = <T>(url: string, options?: RequestInit) => {
	return useApiInternal<T>(url, options, undefined);
}

export const useApiCached = <T>(url: string, expirationMinutes: number, options?: RequestInit) => {
	return useApiInternal<T>(
		url,
		options,
		{
			key: url,
			expirationMinutes: expirationMinutes
		});
}

const useApiInternal = <T>(url: string, options?: RequestInit, cacheOptions?: { key: string, expirationMinutes: number }) => {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null as unknown as string);

	const fetchData = () => {
		const cachedData: T | null = cacheOptions ? getFromCache<T>(url) : null;
		if (cachedData) {
			setData(cachedData);
			return;
		}

		setIsLoading(true);
		const baseUrl = getApiBaseUrl();
		const requestUrl = baseUrl + url;
		fetch(requestUrl, options)
			.then(response => {
				response.json().then(data => {
					if (cacheOptions) {
						setCache(cacheOptions.key, data, cacheOptions.expirationMinutes);
					}
					setData(data as T);
				});
			})
			.catch(error => {
				setError('Error');
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	useEffect(() => {
		fetchData();
	}, [url]);

	return { data, isLoading, error };
}
