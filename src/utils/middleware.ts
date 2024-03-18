import useSnackbar from '@hooks/useSnackbar'
import config from './env'
import { BaseResponse } from './interface'
import { Middleware } from 'swr'
import { useCallback } from 'react'
import { checkObjectKeys } from '.'
import { Domain } from '@context/DomainContext'

interface FetcherParams extends FetcherMutateParams {
	params: object
}

interface FetcherMutateParams {
	url: string
	errorMessage?: string
}

export const mutatePostFetcher = <ResponseValue>(
	{ url, errorMessage }: FetcherMutateParams,
	{ arg: params = {} }: { arg?: object }
) => {
	return fetchAuthenticated<ResponseValue>(url, {
		method: 'POST',
		body: JSON.stringify(params)
	}, errorMessage)
}

export const mutateGetFetcherWithParams = <ResponseValue>(
	{ url, errorMessage }: FetcherMutateParams,
	{ arg: params = {} }: { arg?: object }
) => {
	return fetchAuthenticated<ResponseValue>(`${url}${createParams(params)}`, {
		method: 'GET'
	}, errorMessage)
}

export const fetcherGetApiWithParams = <ResponseValue>({ url, params, errorMessage }: FetcherParams) => {
	return fetchAuthenticated<ResponseValue>(`${url}${createParams(params)}`, {
		method: 'GET'
	}, errorMessage)
}

export const throwOnError = <T,>(response: BaseResponse<T> | undefined, message?: string) => {
	if (typeof response === 'object' && response.isError) {
		throw new Error(message || response.error)
	} else {
		return response
	}
}

export const createParams = (query: object) => (
	Object.keys(query).reduce((prev: string, curr, idx, arr) => {
		if (checkObjectKeys(query, curr)) {
			const val = query[curr]
			return `${prev}${curr}=${val}${arr.length - 1 !== idx ? '&' : ''}`
		}
		return prev
	}, '?')
)

export async function fetchAuthenticated<T>(url: string, requestConfig: RequestInit, message?: string) {
	const authKey = window.localStorage.getItem(config.authKey)
	const domainKey = window.localStorage.getItem('domainkey')
	const key: Domain | null = domainKey ? JSON.parse(domainKey) : null
	const domain = key === 'gpi' ? config.gpiBackOfficeApi : config.cresBackOfficeApi
	const newUrl = `${domain}api${url}`

	const authConfig: RequestInit = {
		...requestConfig,
		headers: {
			...requestConfig.headers,
			authorization: `Bearer ${authKey}`
		}
	}

	const res = await fetch(newUrl, authConfig)
	const data = await validateFetch<T>(res)

	return throwOnError(data, message)
}

export async function validateFetch<T>(response: Response) {
	switch (response.status) {
		case 200:
		case 400:
		case 500: {
			try {
				return await response.json() as BaseResponse<T>
			} catch (e) {
				return { isError: true, error: 'Network Error', value: undefined }
			}
		}
		case 401:
		case 403: {
			window.location.href = `${config.casURL}login?next=${window.location.protocol}//${window.location.host + config.relativeRoot}auth&client=${config.casClientId}&op=${config.casOperator}`
		}
	}
}

const checkHasOnError = (onError: unknown) => onError?.toString() === `() => {
}`
export const useMiddleware = () => {
	const { showError } = useSnackbar()

	const middleware: Middleware = useCallback((swrConfig) => (key, fetcher, config) => {
		const swr = swrConfig(key, fetcher, {
			keepPreviousData: true,
			...config,
			...checkHasOnError(config.onError) ? {
				onError: (e: unknown) => showError(e),
			} : {
				onError: config.onError
			}
		})

		return swr
	}, [showError])

	return middleware
}
