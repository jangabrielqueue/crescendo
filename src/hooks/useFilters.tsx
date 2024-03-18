import { Option } from '@components/Form/interface'
import useDashboardFilters from '@pages/dashboard/api'
import { errorMessage } from '@utils/api'
import { fetcherGetApiWithParams } from '@utils/newMiddleware'
import useSWRImmutable from 'swr/immutable'

type SelectList = Option<string>[]

const useFilters = () => {
  const { data: operators } = useSWRImmutable({
    url: '/filters/operators',
    params: {},
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<SelectList>)

  const { data: games } = useSWRImmutable({
    url: '/filters/games',
    params: {},
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<SelectList>)

  const { data: currencies } = useSWRImmutable({
    url: '/filters/currencies',
    params: {},
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, fetcherGetApiWithParams<SelectList>)
  const { currencies: dashCurrencies, regions: dashRegions, operators: dashOperators } = useDashboardFilters()


  const dashCurrencyOptions = dashCurrencies.map((val) => ({ text: val, value: val }))
  const dashRegionsOptions = dashRegions.map((val) => ({ text: val, value: val }))
  const dashOperatorOptions = dashOperators.map((val) => ({ text: val, value: val }))

  const PlatformIds = [0, 1, 2, 3, 4, 11, 100]
  const ALL_PLATFORM_IDS = PlatformIds.join(',')
  const platformOptions: SelectList = [
    { text: 'All', value: ALL_PLATFORM_IDS },
    { text: 'Web - All', value: '1' },
    { text: 'Web - LD', value: '11' },
    { text: 'Web - SD', value: '2' },
    { text: 'Mobile', value: '3' },
    { text: 'Mini', value: '4' },
  ]

  const accountTypeOptions = [
    { text: 'All', value: null },
    { text: 'Demo', value: true },
    { text: 'Real', value: false }
  ]

  const transactionTypesOptions = [
    { text: 'All Transactions', value: null },
    { text: 'Exclude Free Rounds', value: false },
    { text: 'Free Rounds Only', value: true },
  ]
  const domainOptions = [
    { text: 'GPI', value: 'gpi' },
    { text: 'Crescendo', value: 'crescendo' }
  ]
  const DateFilter = ['Show All', 'Daily', 'Weekly', 'Monthly']
  const dateFilterOptions = DateFilter.map(date => ({ text: date, value: date }))
  const spinTypes = ['All', 'Spin', 'Bonus']
  const spinTypesOptions = spinTypes.map((v, i) => ({ text: v, value: i }))
  const topItems = ['10', '25', '50', '100']
  const topItemsOptions = topItems.map(top => ({ text: top, value: top }))

  return {
    operators: operators || [], games: games || [], currencies: currencies || [],
    platforms: platformOptions,
    accountTypes: accountTypeOptions,
    spinTypes: spinTypesOptions,
    dateFilters: dateFilterOptions,
    topItems: topItemsOptions,
    transactionTypes: transactionTypesOptions,
    domainOptions,
    dashCurrencyOptions,
    dashOperatorOptions,
    dashRegionsOptions
  }
}
export type FilterKeys = keyof ReturnType<typeof useFilters>
export default useFilters
