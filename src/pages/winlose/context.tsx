import { createContext, useState } from 'react'

type WinLose = 'topWinners' | 'gamePerformance' | 'winLose' | 'operator' | 'platform'
interface Filter {
  operatorId?: number | string
  gameId?: number | string
  currencyId?: number | string
  memberName?: string
  startDate?: string
  endDate?: string
  top?: number | string
  StartDate?: string
  EndDate?: string
  OperatorId?: number | string
  GameId?: number
  isDemoAccount?: boolean
  isFreeRounds?: boolean
  isDemo?: boolean
  formatFilterType?: string
}
export type Filters = Record<WinLose, Filter>
type ContextValue = [Filters, React.Dispatch<React.SetStateAction<Filters>>]

const defaultForm: Filters = {
  topWinners: {},
  gamePerformance: {},
  winLose: {},
  operator: {},
  platform: {}
}

export const WinLoseContext = createContext<ContextValue>([defaultForm, () => { }])

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const filters = useState(defaultForm)

  return (
    <WinLoseContext.Provider value={filters}>
      {children}
    </WinLoseContext.Provider>
  )
}

export default ContextProvider
