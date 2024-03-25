import { errorMessage } from '@utils/api'
import { authorizedFetch, fetcherGetApiWithParams } from '@utils/middleware'
import useSWRImmutable from 'swr/immutable'

interface ResourcesModel {
  name: string
  url: string
}
type Host = {
  faultZone: number
  hostName: string
  iAmAliveTime: string
  proxyPort: number
  siloAddress: string
  siloName: string
  startTime: string
  status: string
  updateZone: number
  siloStatus: number
}
type SimpleGrainStats = {
  activationCount: number
  grainType: string
  siloAddress: string
  totalAwaitTime: number
  totalCalls: number
  callsPerSecond: number
  totalSeconds: number
  totalExceptions: number
}
interface DashboardCountersModel {
  totalActiveHostCount: number
  totalActiveHostCountHistory: number[]
  hosts: Host[]
  simpleGrainStats: SimpleGrainStats[]
  totalActivationCount: number
  totalActivationCountHistory: number[]
}
type Calls = {
  grain: string
  method: string
  count: number
  exceptionCount: number
  elapsedTime: number
  numberOfSamples: number
}
type Latency = {
  grain: string
  method: string
  count: number
  exceptionCount: number
  elapsedTime: number
  numberOfSamples: number
}
interface TopGrainMethods {
  calls: Calls[]
  latency: Latency[]
  errors: Calls[]
}
export const useResources = () => {
  const { data, isLoading, mutate } = useSWRImmutable({
    url: '/gameservices/getresources',
    params: {},
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<ResourcesModel[]>)

  return { data, isLoading, mutate }
}

export const useDashboardCounters = () => {
  const { data, isLoading, mutate } = useSWRImmutable({
    url: '/Monitoring/DashboardCounters',
    params: {},
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<DashboardCountersModel>)

  return { data, isLoading, mutate }
}

export const useTopGrainMethods = () => {
  const { data, isLoading, mutate } = useSWRImmutable({
    url: '/Monitoring/TopGrainMethods',
    params: {},
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<TopGrainMethods>)

  return { data, isLoading, mutate }
}

export const clearCache = async (name: string) => {
  return await authorizedFetch(`/gameservices/clearcache?name=${name}`, {
    method: 'POST'
  })
}