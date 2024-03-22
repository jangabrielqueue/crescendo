import { useContext } from 'react'
import { WinLoseContext } from '../context'
import InputSelect from '@components/Form/InputSelect'
import { DateRangePicker } from '@tremor/react'
import SearchWithCsv from '@components/SearchWithCsv'
import { datetime, getBooleanQuery } from '@utils/index'
import { FilterProps } from '../interface'

const Filters = ({ disableCsv, search, getCsv, searchLoading }: FilterProps) => {
  const [winLose, setQuery] = useContext(WinLoseContext)

  const handleDateChange = ({ from, to }: { from?: Date, to?: Date }) => {
    setQuery('startDate', datetime.getStartDate(from))
    setQuery('endDate', datetime.getStartDate(to))
  }

  const handleSearch = () => {
    const { operatorId = 0, gameId = 0, startDate, endDate, isDemo, isFreeRounds, formatFilterType = 'All', currencyId = 0 } = winLose
    search({
      dataFormatted: true,
      operatorId,
      gameId,
      startDate,
      endDate,
      isDemo,
      ...isFreeRounds ? { isFreeRounds } : {},
      formatFilterType,
      currencyId
    })
  }

  const handleCsv = () => getCsv(`Win Lose (${winLose.startDate}-${winLose.endDate})`)

  return (
    <>
      <div className='grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-4 m-3'>
        <InputSelect
          value={winLose.gameId}
          option='games'
          onChange={(val) => setQuery('gameId', String(val))}
          placeholder='Game'
        />
        <InputSelect
          value={winLose.operatorId}
          option='operators'
          onChange={(val) => setQuery('operatorId', String(val))}
          placeholder='Operator'
        />
        <InputSelect
          value={winLose.formatFilterType}
          option='dateFilters'
          onChange={(val) => setQuery('formatFilterType', String(val))}
          placeholder='Date Format'
        />
        <InputSelect
          value={winLose.currencyId}
          option='currencies'
          onChange={(val) => setQuery('currencyId', String(val))}
          placeholder='Currency'
        />
        <InputSelect
          value={getBooleanQuery(winLose.isFreeRounds)}
          option='transactionTypes'
          onChange={(val) => setQuery('isFreeRounds', String(val))}
          placeholder='Transaction Type'
        />
        <InputSelect
          value={getBooleanQuery(winLose.isDemo)}
          option='accountTypes'
          onChange={(val) => setQuery('isDemo', String(val))}
          placeholder='Account Type'
        />
        <DateRangePicker
          className='col-span-1 md:col-span-2'
          value={{
            to: winLose.endDate ? new Date(winLose.endDate) : undefined,
            from: winLose.startDate ? new Date(winLose.startDate) : undefined
          }}
          onValueChange={handleDateChange}
        />
        <div className='col-span-full flex justify-center'>
          <SearchWithCsv onCsv={handleCsv} searchLoading={searchLoading} onSearch={handleSearch} disableCsv={disableCsv} />
        </div>
      </div>
    </>
  )
}

export default Filters
