import { errorMessage } from '@utils/api'
import { PagedData } from '@utils/interface'
import { mutateGetFetcherWithParams } from '@utils/middleware'
import useSWRMutation from 'swr/mutation'

export interface ByMerchantModel {
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

type ByMerchantData = PagedData<ByMerchantModel[]>

const useOperatorApi = () => {
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/winlose/byplatform',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<ByMerchantData>)

  return { data, isLoading: isMutating, mutate: trigger }
}

export default useOperatorApi
