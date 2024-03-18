import { DashboardContext } from '@pages/dashboard/context'
import { TopWinnersModel } from '@pages/dashboard/interface'
import { errorMessage } from '@utils/api'
import { fetcherGetApiWithParams } from '@utils/newMiddleware'
import { useContext } from 'react'
import useSWRImmutable from 'swr/immutable'

const getTopWinners = (data: TopWinnersModel[] | undefined) => {
  if (data == null) return { data: [] as TopWinnersModel[], topNetWin: 0 }
  return {
    data,
    topNetWin: data.reduce((acc: number, curr) => Number(curr.totalNetWin) > acc ? Number(curr.totalNetWin) : acc, 0)
  }
}

export const useDasboardTopWinners = () => {
  const { filters: [filters], dateInPeriod } = useContext(DashboardContext)

  const { data, isValidating } = useSWRImmutable({
    url: '/dashboard/topwinners',
    params: {
      ...dateInPeriod,
      dataFormatted: true,
      operatorId: filters.Operator && filters.Operator !== 'All' ? filters.Operator : null,
      gameId: null,
      currencyId: null,
      memberName: null,
      top: 100,
      Limit: 5,
      Ordering: 'TotalNetWin DESC'
    },
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<TopWinnersModel[]>)

  return { data: getTopWinners(data), isValidating }
}
