import { errorMessage } from '@utils/api'
import { mutateGetFetcherWithParams } from '@utils/newMiddleware'
import useSWRMutation from 'swr/mutation'

export interface ByMerchantModel {
  operatorTag: string
  operatorId: number
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
  // gamesDetail
  // memberDetails
  // currencyDetails
}

const useOperatorApi = () => {
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/winlose/bymerchant',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<ByMerchantModel[]>)

  return { data: data || [], isLoading: isMutating, mutate: trigger }
}

export default useOperatorApi
