import { DashboardContext } from '@pages/dashboard/context'
import { ChartDataValue, GamePerformanceModel } from '@pages/dashboard/interface'
import { errorMessage } from '@utils/api'
import { Period } from '@utils/interface'
import { fetcherGetApiWithParams } from '@utils/newMiddleware'
import dayjs from 'dayjs'
import { useContext } from 'react'
import useSWRImmutable from 'swr/immutable'

type WinLoseModel = {
  date: string
  noOfPlayer: number
  week: number
  month: number
  year: number
  gameIncomeRmb: number
}

const formatDateByPeriod = (timestamp: string | number, period: Period) => {
  switch (period) {
    case '1h':
    case '1d': {
      timestamp = dayjs(timestamp).format('hh:mm A')
      break
    }
    case '7d':
    case '30d': {
      timestamp = dayjs(timestamp).format('MM-DD-YYYY')
    }
  }

  return timestamp
}

const getDailyUniqueUsers = (data: ChartDataValue | undefined, period: Period) => {
  if (data == null) return { data: [], total: 0 }
  const value = data.tables[0].rows
  return {
    data: value.map((item) => ({
      date: formatDateByPeriod(item[0], period),
      'User Count': item[1]
    })),
    total: value.reduce((acc, curr) => acc += curr[1] as number, 0)
  }
}

const getWinLose = (data: WinLoseModel[] | undefined, period: Period) => {
  if (data == null) return { data: [] as WinLoseModel[], total: 0 }
  return {
    data: data.map((item) => ({
      date: formatDateByPeriod(item.date, period),
      Income: item.gameIncomeRmb
    })),
    total: data.reduce((acc, curr) => acc += curr.gameIncomeRmb, 0)
  }
}

const getSpins = (data: GamePerformanceModel[] | undefined, period: Period) => {
  if (data == null) return { data: [] as GamePerformanceModel[], total: 0 }
  return {
    data: data.map((item) => ({
      date: formatDateByPeriod(item.date, period),
      'Spin Count': item.noOfSpin
    })),
    total: data.reduce((acc, curr) => acc += curr.noOfSpin, 0)
  }
}

export const useDasboardDailyUniqueUsers = () => {
  const { filters: [filters] } = useContext(DashboardContext)

  const { data, isValidating } = useSWRImmutable({
    url: '/dashboard/dailyuniqueusers',
    params: filters,
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<ChartDataValue>)

  return { data: getDailyUniqueUsers(data, filters.Period), isValidating }
}

export const useDasboardWinLose = () => {
  const { filters: [filters], dateInPeriod } = useContext(DashboardContext)

  const { data, isValidating } = useSWRImmutable({
    url: '/dashboard/winlose',
    params: {
      ...dateInPeriod,
      formatFilterType: 'Daily',
      gameId: 0,
      operatorId: filters.Operator && filters.Operator !== 'All' ? filters.Operator : null,
      platformType: null,
      currencyId: null,
      isDemo: null,
      isFreeRounds: null,
    },
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<WinLoseModel[]>)

  return { data: getWinLose(data, filters.Period), isValidating }
}

export const useDasboardSpin = () => {
  const { filters: [filters], dateInPeriod } = useContext(DashboardContext)

  const { data } = useSWRImmutable({
    url: '/dashboard/gameperformance',
    params: {
      ...dateInPeriod,
      ...filters,
      dataFormatted: true,
      OperatorId: null,
      GameId: null,
      IsDemoAccount: null,
      FilterDateType: 'Daily',
      Ordering: 'NoOfSpin DESC'
    },
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<GamePerformanceModel[]>)
  return { data: getSpins(data, filters.Period) }
}

