import { useState, useEffect } from 'react';

export const useApi = <T>(url: string, options?: RequestInit) => {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null as unknown as string);

	const fetchData = () => {
		setIsLoading(true);
		const requestUrl = `/api${url}`;
		fetch(requestUrl, options)
			.then(response => {
				response.json().then(data => {
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


//import { useState, useEffect } from 'react';

//type RequestType = {
//	method: string,
//	url: string,
//	postBody?: object
//};

//const noErrorMessage: string = null as unknown as string;

//export function useGetApiCall<TResponse>(url: string) {
//	return useApiCall<TResponse>({
//		method: 'get',
//		url: url
//	});
//}

//export function usePostApiCall<TResponse>(url: string, postBody?: object) {
//	return useApiCall<TResponse>({
//		method: 'post',
//		url: url,
//		postBody: postBody
//	});
//}

//function requestData<TResponse>(request: RequestType) {
//	const baseUrl = 'http://staging-api.protectukrainenow.org/v1';
//	const fullUrl = `${baseUrl}${request.url}`;
//	return fetch(fullUrl)
//		.then<TResponse>(response => {
//			return response.json();
//		});
//}

//function useApiCall<TResponse>(request: RequestType) {
//	let noResponse: TResponse = null as unknown as TResponse;

//	const [response, setResponse] = useState<TResponse>(noResponse);
//	const [loading, setLoading] = useState<boolean>(true);
//	const [error, setError] = useState<string>(noErrorMessage);

//	useEffect(() => {
//		const fetchData = async () => {
//			try {
//				setLoading(true);
//				const data = await requestData<TResponse>(request);
//				setResponse(data);
//				setError(noErrorMessage);
//			} catch (error) {
//				if (error instanceof Error) {
//					setError(error.message);
//				}
//				setResponse(noResponse);
//			} finally {
//				setLoading(false);
//			}
//		};

//		fetchData();
//	}, [request.method, request.url]); // Dependency array ensures this runs once or when `url` changes

//	return { response, loading, error };
//}
