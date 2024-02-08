import { DashboardContext } from '@pages/dashboard/context'
import { ChartDataValue } from '@pages/dashboard/interface'
import { errorMessage } from '@utils/api'
import { fetcherGetApiWithParams } from '@utils/middleware'
import { useContext } from 'react'
import useSWRImmutable from 'swr/immutable'

export const useDasboardUsersByCountry = () => {
  const { filters: [filters] } = useContext(DashboardContext)

  const { data, isValidating } = useSWRImmutable({
    url: '/dashboard/usersbycountry',
    params: filters,
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<ChartDataValue>)

  return { data: data?.value?.tables[0].rows, isValidating }
}
