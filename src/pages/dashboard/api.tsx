import { fetcherGetApiWithParams } from '@utils/middleware'
import { useContext } from 'react'
import { DashboardContext } from './context'
import { errorMessage } from '@utils/api'
import useSWRImmutable from 'swr/immutable'
import { CardFilterValue } from './interface'

function localReceiveCardFilter(data: CardFilterValue | undefined): string[] | undefined {
	if (data == null) return undefined
	const targetData = data.tables[0].rows
	const filterCollection = targetData.map((item): string => {
		return item[0]
	})

	filterCollection.unshift('All')

	return filterCollection
}

const useDashboardFilters = () => {
	const { filters: [filters] } = useContext(DashboardContext)

	const { data: currencies } = useSWRImmutable({
		url: '/dashboard/currencies',
		params: { Period: filters.Period },
		errorMessage: errorMessage.DefaultRequestErrorMessage
	}, fetcherGetApiWithParams<CardFilterValue>)

	const { data: regions } = useSWRImmutable({
		url: '/dashboard/regions',
		params: { Period: filters.Period },
		errorMessage: errorMessage.DefaultRequestErrorMessage
	}, fetcherGetApiWithParams<CardFilterValue>)

	const { data: operators } = useSWRImmutable({
		url: '/dashboard/operators',
		params: { Period: filters.Period },
		errorMessage: errorMessage.DefaultRequestErrorMessage
	}, fetcherGetApiWithParams<CardFilterValue>)

	return {
		currencies: localReceiveCardFilter(currencies?.value),
		regions: localReceiveCardFilter(regions?.value),
		operators: localReceiveCardFilter(operators?.value)
	}
}

export default useDashboardFilters
