import { useStateChangeEffect } from '@hooks/useStateChangeEffect'
import { getDateFromPeriod } from '@utils/index'
import { Period } from '@utils/interface'
import { createContext, useRef, useState } from 'react'

export interface Filters {
	Period: Period
	Operator?: string
	Currency?: string
	Region?: string
}
type ContextValue = { filters: [Filters, React.Dispatch<React.SetStateAction<Filters>>], dateInPeriod: ReturnType<typeof getDateFromPeriod> | null }

const defaultForm: Filters = {
	Period: '1d'
}

export const DashboardContext = createContext<ContextValue>({ filters: [defaultForm, () => { }], dateInPeriod: null })

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
	const filters = useState(defaultForm)
	const dateRef = useRef<ReturnType<typeof getDateFromPeriod> | null>(getDateFromPeriod(filters[0]))

	useStateChangeEffect(() => {
		dateRef.current = getDateFromPeriod(filters[0])
	}, [filters[0]])

	return (
		<DashboardContext.Provider value={{ filters, dateInPeriod: dateRef.current }}>
			{children}
		</DashboardContext.Provider>
	)
}

export default ContextProvider
