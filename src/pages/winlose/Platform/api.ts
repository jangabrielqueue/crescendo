import { errorMessage } from '@utils/api'
import { mutateGetFetcherWithParams } from '@utils/newMiddleware'
import useSWRMutation from 'swr/mutation'

export interface PlatformListModel {
  platform: string
  noOfPlayer: number
  noOfTransaction: number
  noOfSpin: number
  avgBet: number
  totalBet: number
  totalWin: number
  gameIncome: number
  avgBetRmb: number
  totalBetRmb: number
  totalWinRmb: number
  gameIncomeRmb: number
  gamePayoutPer: number
  // gamesDetails
  // memberDetails
  // currencyDetails
}

const usePlatformApi = () => {
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/winlose/byplatform',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<PlatformListModel[]>)

  return { data: data || [], isLoading: isMutating, mutate: trigger }
}

export default usePlatformApi
