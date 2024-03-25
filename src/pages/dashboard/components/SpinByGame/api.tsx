import { DashboardContext } from '@pages/dashboard/context'
import { GamePerformanceModel } from '@pages/dashboard/interface'
import { errorMessage } from '@utils/api'
import { fetcherGetApiWithParams } from '@utils/middleware'
import { useContext } from 'react'
import useSWRImmutable from 'swr/immutable'

const getSpinByGames = (data: GamePerformanceModel[] | undefined) => {
  if (data == null) return { data: [] as GamePerformanceModel[], topSpinValue: 0 }
  return {
    data,
    topSpinValue: data.reduce((acc: number, curr) => Number(curr.noOfSpin) > acc ? Number(curr.noOfSpin) : acc, 0)
  }
}

export const useDasboardSpinByGame = () => {
  const { filters: [filters], dateInPeriod } = useContext(DashboardContext)

  const { data, isValidating } = useSWRImmutable({
    url: '/dashboard/gameperformance',
    params: {
      ...dateInPeriod,
      ...filters,
      dataFormatted: true,
      OperatorId: null,
      GameId: null,
      IsDemoAccount: null,
      FilterDateType: 'None',
      Limit: 5,
      Ordering: 'NoOfSpin DESC'
    },
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<GamePerformanceModel[]>)

  return { data: getSpinByGames(data), isValidating }
}
