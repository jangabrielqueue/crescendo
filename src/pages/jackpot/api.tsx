import useOnMountEffect from '@hooks/useOnMountEffect'
import useQueryState from '@hooks/useQueryState'
import { errorMessage } from '@utils/api'
import { isNullOrWhiteSpace } from '@utils/index'
import { ComplexPagedData } from '@utils/interface'
import { authorizedFetch, createParams, mutateGetFetcherWithParams } from '@utils/newMiddleware'
import { useNavigate } from 'react-router-dom'
import useSWRMutation from 'swr/mutation'

export type JackpotCategoryData = {
  [key: string]: {
    [key: string]: number
  }
}

export type JackpotPoolData = {
  categories: JackpotCategoryData,
  count: number,
  categoryNames: string[]
}

export type JackpotDataModel = {
  id: string,
  name: string,
  gameName: string,
  gameId: string,
  eligibleOperators: string[],
  eligibleCurrencies: string[],
  status: number,
  pool: JackpotPoolData,
  bannedPlayers: string[],
  createdBy: string,
  updatedBy?: string,
  createdOnUtc: string,
  startedOnUtc: string,
  endOnUtc?: string,
  updatedOnUtc?: string
}

type JackpotListData = ComplexPagedData<JackpotDataModel>

export type JackpotContributionsModel = {
  amount: number
  createdOnUtc: string
  currency: string
  exchangeRate: number
  gameHistoryId: 0
  gameName: string
  id: string
  jackpotCategory: string
  jackpotId: string
  kind: number
  operatorTag: string
  operatorUserId: string
  operatorId: string
  pooledAmount: number
  gameTransactionId: number
}

export type JackpotContributionsData = ComplexPagedData<JackpotContributionsModel>
export type TimelineData = {
  eventType: number
  eventBy: string
  eventOnUtc: string
  remarks?: undefined
}
export type JackpotWinningRecordModel = {
  id: string
  jackpotId: string
  gameTransactionId: number
  gameName: string
  operatorId: number
  operatorTag: string
  operatorUserId: string
  jackpotCategory: string
  currency: string
  winningAmount: number
  exchangeRate: number
  status: number
  createdOnUtc: string
  reviewBy: string
  reviewOnUtc: string
  updateBy: string
  updateOnUtc: string
  timelines: TimelineData[]
}

export type JackpotWinningRecordsData = ComplexPagedData<JackpotWinningRecordModel>

export const useJackpotListApi = () => {
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/Jackpot/List',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<JackpotListData>)

  return { data, isMutating, trigger }
}

export const useJackpotContributionListApi = () => {
  const [query] = useQueryState(['id'])
  const navigate = useNavigate()

  const { data, isMutating, trigger } = useSWRMutation({
    url: '/Jackpot/ListContributions',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<JackpotContributionsData>)

  useOnMountEffect(() => {
    if (isNullOrWhiteSpace(query.id)) {
      navigate('/jackpot')
    }
  })
  return { data, isMutating, trigger: (params: object) => trigger({ ...params, id: query.id }) }
}

export const useJackpotWinningRecordsListApi = () => {
  const [query] = useQueryState(['id'])
  const navigate = useNavigate()

  const { data, isMutating, trigger } = useSWRMutation({
    url: '/Jackpot/ListWinningRecords',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<JackpotWinningRecordsData>)


  useOnMountEffect(() => {
    if (isNullOrWhiteSpace(query.id)) {
      navigate('/jackpot')
    }
  })

  return { data, isMutating, trigger: (params: object) => trigger({ ...params, id: query.id }) }
}

export const PostAddJackpot = async (payload: object) => {
  return await authorizedFetch('/Jackpot/Create', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const PostEditJackpot = async (payload: object) => {
  return await authorizedFetch('/Jackpot/Update', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const PutResetJackpot = async (payload: object) => {
  return await authorizedFetch('/Jackpot/ResetByAmount', {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export const PutDisableJackpot = async (payload: object) => {
  return await authorizedFetch(`/Jackpot/Disable${createParams(payload)}`, {
    method: 'PUT',
  })
}

export const PutEnableJackpot = async (payload: object) => {
  return await authorizedFetch(`/Jackpot/Enable${createParams(payload)}`, {
    method: 'PUT',
  })
}

export const GetAvailableCategories = async (payload: object) => {
  return await authorizedFetch(`/Jackpot/GetAvailableCategories${createParams(payload)}`, {
    method: 'GET',
  })
}

export const PostJackpotVerify = async (id: string) => {
  return await authorizedFetch(`/JackpotWinners/Review?id=${id}`, {
    method: 'POST'
  })
}

export const PostJackpotPayout = async (id: string) => {
  return await authorizedFetch(`/JackpotWinners/Payout?id=${id}`, {
    method: 'POST'
  })
}

export const PostJackpotApprove = async (id: string) => {
  return await authorizedFetch(`/JackpotWinners/Approve?id=${id}`, {
    method: 'POST'
  })
}

export const PostJackpotReject = async (id: string) => {
  return await authorizedFetch(`/JackpotWinners/Reject?id=${id}`, {
    method: 'POST'
  })
}
