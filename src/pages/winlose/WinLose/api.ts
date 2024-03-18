import { errorMessage } from '@utils/api'
import { mutateGetFetcherWithParams } from '@utils/newMiddleware'
import useSWRMutation from 'swr/mutation'

export interface WinLoseModel {
  date: Date | string
  week: string
  year: string
  month: string
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
}

const useWinLoseApi = () => {
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/winlose',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<WinLoseModel[]>)

  return { data: data || [], isLoading: isMutating, mutate: trigger }
}

export default useWinLoseApi
