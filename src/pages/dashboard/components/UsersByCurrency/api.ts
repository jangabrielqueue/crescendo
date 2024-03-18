import { DashboardContext } from '@pages/dashboard/context'
import { ChartDataValue } from '@pages/dashboard/interface'
import { errorMessage } from '@utils/api'
import { fetcherGetApiWithParams } from '@utils/newMiddleware'
import { useContext } from 'react'
import useSWRImmutable from 'swr/immutable'

const getUsersByCurrencies = (data: ChartDataValue | undefined) => {
  if (data == null) return { data: [], total: 0 }
  const value = data.tables[0].rows
  return {
    data: value,
    total: value.reduce((acc, curr) => acc + Number(curr[1]), 0)
  }
}

export const useDasboardUsersByCurrency = () => {
  const { filters: [filters] } = useContext(DashboardContext)

  const { data, isValidating } = useSWRImmutable({
    url: '/dashboard/usersbycurrency',
    params: filters,
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<ChartDataValue>)

  return { ...getUsersByCurrencies(data), isValidating }
}
