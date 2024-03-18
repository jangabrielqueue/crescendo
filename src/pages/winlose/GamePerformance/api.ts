import { errorMessage } from '@utils/api'
import { mutateGetFetcherWithParams } from '@utils/newMiddleware'
import useSWRMutation from 'swr/mutation'

export type FilterDateTypeEntry = 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Currency' | 'Member';

export interface GamePerformanceModel {
  gameId: number
  game: string
  index: number
  memberName: string
  operator: string
  noOfPlayer: string | number
  currency: string
  noOfTransaction: string | number
  noOfSpin: string | number
  avgBetRmb: string | number
  totalBet: string
  totalWin: string
  gameIncome: string
  totalBetRmb: string | number
  totalWinRmb: string | number
  gameIncomeRmb: string | number
  gamePayoutPer: string | number
  format: FilterDateTypeEntry
  details: GamePerformanceModel[]
  memberDetails: GamePerformanceModel[]
  isFetchingMemberDetails: boolean
  startDate: string
  endDate: string
}

const useGamePerformanceApi = () => {
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/gameperformance',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<GamePerformanceModel[]>)
  return { data, isLoading: isMutating, mutate: trigger }
}

export default useGamePerformanceApi
