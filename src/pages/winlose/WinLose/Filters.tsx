import { useContext } from 'react'
import { WinLoseContext } from '../context'
import InputSelect from '@components/Form/InputSelect'
import { DateRangePicker } from '@tremor/react'
import SearchWithCsv from '@components/SearchWithCsv'
import useFilters from '@hooks/useFilters'
import { datetime, getBooleanQuery } from '@utils/index'
import { FilterProps } from '../interface'

const Filters = ({ disableCsv, search, getCsv }: FilterProps) => {
  const [winLose, setQuery] = useContext(WinLoseContext)
  const { operators, games, accountTypes, currencies, dateFilters, transactionTypes } = useFilters()

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
          options={games}
          onChange={(val) => setQuery('gameId', val)}
          placeholder='Game'
        />
        <InputSelect
          value={winLose.operatorId}
          options={operators}
          onChange={(val) => setQuery('operatorId', val)}
          placeholder='Operator'
        />
        <InputSelect
          value={winLose.formatFilterType}
          options={dateFilters}
          onChange={(val) => setQuery('formatFilterType', val)}
          placeholder='Date Format'
        />
        <InputSelect
          value={winLose.currencyId}
          options={currencies}
          onChange={(val) => setQuery('currencyId', val)}
          placeholder='Currency'
        />
        <InputSelect
          value={getBooleanQuery(winLose.isFreeRounds)}
          options={transactionTypes}
          onChange={(val) => setQuery('isFreeRounds', String(val))}
          placeholder='Transaction Type'
        />
        <InputSelect
          value={getBooleanQuery(winLose.isDemo)}
          options={accountTypes}
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
        <div className='lg:col-span-6 md:col-span-3 max-md:col-span-1 flex justify-center'>
          <SearchWithCsv onCsv={handleCsv} onSearch={handleSearch} disableCsv={disableCsv} />
        </div>
      </div>
    </>
  )
}

export default Filters
