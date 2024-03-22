import useQueryState from '@hooks/useQueryState'
import { createContext } from 'react'

const queries = ['operatorId', 'gameId', 'currencyId', 'memberName', 'startDate', 'endDate', 'top', 'IsDemoAccount', 'isDemo', 'isFreeRounds', 'formatFilterType'] as const

export type FiltersModel = { [key in typeof queries[number]]?: string }
type ContextValue = [FiltersModel, (name: typeof queries[number], val: string | undefined) => void]

export const WinLoseContext = createContext<ContextValue>([{}, () => { }])

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const filters = useQueryState(queries)

  return (
    <WinLoseContext.Provider value={filters}>
      {children}
    </WinLoseContext.Provider>
  )
}

export default ContextProvider
