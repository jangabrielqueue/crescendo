import { errorMessage } from '@utils/api'
import { ComplexPagedData } from '@utils/interface'
import { authorizedFetch, mutateGetFetcherWithParams } from '@utils/newMiddleware'
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

const useJackpotListApi = () => {
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/Jackpot/List',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<JackpotListData>)

  return { data, isMutating, trigger }
}

export default useJackpotListApi

export const postAddJackpot = async (payload: object) => {
  return await authorizedFetch('/Jackpot/Create', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const postEditJackpot = async (payload: object) => {
  return await authorizedFetch('/Jackpot/Update', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}