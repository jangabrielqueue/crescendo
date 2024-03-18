import { errorMessage } from '@utils/api'
import { mutateGetFetcherWithParams } from '@utils/newMiddleware'
import useSWRMutation from 'swr/mutation'

export type ItemFormat = 'Game' | 'Daily' | 'Weekly' | 'Monthly';

export type TopWinnerDetail = {
  userId: number,
  operator: string,
  currency: string,
  noOfTransaction: number,
  noOfSpin: number,
  avgBet: number | string,
  totalBet: number | string,
  totalNetWin: number | string,
  companyWLPercentage: number | string,
  date: string,
  week: number,
  month: number,
  year: number,
  game: string
}

export interface TopWinnersModel {
  currency: string
  name: string
  operator: string
  noOfTransaction: number | string
  userId: number
  noOfSpin: number
  avgBet: number| string
  totalBet: number | string
  totalNetWin: number | string
  companyWLPercentage: number | string
  allTimeNoOfTransaction: number | string
  allTimeNoOfSpin: number
  allTimeAvgBet: number | string
  allTimeTotalBet: number | string
  allTimeTotalNetWin: number | string
  allTimeCompanyWLPercentage: number | string
  joinDate: Date | string
  format: ItemFormat
  details: TopWinnerDetail[]
}

const useTopWinnerApi = () => {
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/topwinners',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<TopWinnersModel[]>)

  return { data: data || [], isLoading: isMutating, mutate: trigger }
}

export default useTopWinnerApi
