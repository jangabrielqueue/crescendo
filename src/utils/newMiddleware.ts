import { Domain } from '@context/DomainContext'
import config from './env'
import { BaseResponse } from './interface'
import { checkObjectKeys } from '.'
import { errorMessage } from './api'
import useSnackbar from '@hooks/useSnackbar'
import { Middleware } from 'swr'
import { useCallback } from 'react'

type Res<T> = BaseResponse<T> | T

const boDomainApi: Record<Domain, string> = {
  gpi: config.gpiBackOfficeApi,
  crescendo: config.cresBackOfficeApi
}

const endpoint: Record<Domain, string> = {
  gpi: '{domain}api{url}',
  crescendo: '{domain}{url}',
}

const getValueOnBaseResponse = <T>(res: BaseResponse<T>, errorMessage?: string) => {
  if (res == null) return
  if (typeof res === 'object' && res.isError) {
    throw new Error(res.error || errorMessage)
  } else {
    return res.value
  }
}

const getValue = <T>(res: Res<T>, errorMessage?: string) => {
  if (typeof res !== 'object' || res == null) return res
  if ('isError' in res) {
    return getValueOnBaseResponse(res, errorMessage)
  }
  if ('value' in res) {
    return res.value as T
  }
  if ('error' in res) {
    throw new Error(res.error as string || errorMessage)
  }

  return res
}

const parseRes = async <T>(res: Response, pErrorMessage?: string) => {
  if (res.status === 401 || res.status === 403) {
    window.location.href = `${config.casURL}login?next=${window.location.protocol}//${window.location.host + config.relativeRoot}auth&client=${config.casClientId}&op=${config.casOperator}`
  } else if (res.status === 404) {
    throw new Error(errorMessage.notFoundMessage)
  }
  else {
    const resjson: Res<T> = await res.json()
    return getValue(resjson, pErrorMessage)
  }
}

export const authorizedFetch = async <T>(url: string, requestConfig: RequestInit, errorMessage?: string) => {
  const authKey = window.localStorage.getItem(config.authKey)

  const authConfig: RequestInit = {
    ...requestConfig,
    headers: {
      'Content-Type': 'application/json',
      ...requestConfig.headers,
      authorization: `Bearer ${authKey}`
    }
  }

  return await domainedFetch<T>(url, authConfig, errorMessage)
}

export const domainedFetch = async<T>(url: string, requestConfig: RequestInit, errorMessage?: string) => {
  const domainKey = window.localStorage.getItem('domainkey')
  const key: Domain = domainKey ? JSON.parse(domainKey) : null
  const domain = boDomainApi[key]
  const newUrl = endpoint[key].replace('{domain}', domain).replace('{url}', url)

  const res = (await fetch(newUrl, requestConfig))
  const parsedRes = await parseRes<T>(res, errorMessage)
  return parsedRes
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


interface FetcherMutateParams {
  url: string,
  errorMessage?: string
}

export const mutatePostFetcher = <ResponseValue>(
  { url, errorMessage }: FetcherMutateParams,
  { arg: params = {} }: { arg?: object }
) => {
  return authorizedFetch<ResponseValue>(url, {
    method: 'POST',
    body: JSON.stringify(params)
  }, errorMessage)
}

export const mutateGetFetcherWithParams = <ResponseValue>(
  { url, errorMessage }: FetcherMutateParams,
  { arg: params = {} }: { arg?: object }
) => {
  return authorizedFetch<ResponseValue>(`${url}${createParams(params)}`, {
    method: 'GET'
  }, errorMessage)
}

interface FetcherParams {
  url: string
  params: object
  errorMessage?: string
}

export const fetcherGetApiWithParams = <ResponseValue>({ url, params, errorMessage }: FetcherParams) => {
  return authorizedFetch<ResponseValue>(`${url}${createParams(params)}`, {
    method: 'GET'
  }, errorMessage)
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
