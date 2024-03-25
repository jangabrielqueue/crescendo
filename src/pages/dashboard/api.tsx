import { useContext } from 'react'
import { DashboardContext } from './context'
import { errorMessage } from '@utils/api'
import useSWRImmutable from 'swr/immutable'
import { CardFilterValue } from './interface'
import { fetcherGetApiWithParams } from '@utils/middleware'

function localReceiveCardFilter(data: CardFilterValue | undefined): string[] {
	if (data == null) return []
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
		currencies: localReceiveCardFilter(currencies),
		regions: localReceiveCardFilter(regions),
		operators: localReceiveCardFilter(operators)
	}
}

export default useDashboardFilters
