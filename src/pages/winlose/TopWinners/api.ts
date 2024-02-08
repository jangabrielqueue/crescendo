import { errorMessage } from '@utils/api'
import { PagedData } from '@utils/interface'
import { mutateGetFetcherWithParams } from '@utils/middleware'
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
type TopWinnerData = PagedData<TopWinnersModel[]>

const useTopWinnerApi = () => {
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/topwinners',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<TopWinnerData>)

  return { data, isLoading: isMutating, mutate: trigger }
}

export default useTopWinnerApi
