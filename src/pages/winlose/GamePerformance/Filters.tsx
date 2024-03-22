import { useContext } from 'react'
import { WinLoseContext } from '../context'
import InputSelect from '@components/Form/InputSelect'
import { DateRangePicker } from '@tremor/react'
import SearchWithCsv from '@components/SearchWithCsv'
import { datetime, getBooleanQuery } from '@utils/index'
import { FilterProps } from '../interface'

const Filters = ({ disableCsv, search, getCsv, searchLoading }: FilterProps) => {
  const [gamePerformance, setQuery] = useContext(WinLoseContext)

  const handleDateChange = ({ from, to }: { from?: Date, to?: Date }) => {
    setQuery('startDate', datetime.getStartDate(from))
    setQuery('endDate', datetime.getStartDate(to))
  }

  const handleSearch = () => {
    const { startDate, endDate, operatorId, gameId, IsDemoAccount } = gamePerformance
    search({
      dataFormatted: true,
      FilterDateType: 'None',
      StartDate: startDate,
      EndDate: endDate,
      OperatorId: operatorId,
      GameId: gameId,
      IsDemoAccount
    })
  }

  const handleCsv = () => getCsv(`Game Performance (${gamePerformance.startDate}-${gamePerformance.endDate})`)

  return (
    <>
      <div className='grid grid-cols-2 max-sm:grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-none gap-4 m-3'>
        <InputSelect
          value={gamePerformance.operatorId}
          option='operators'
          onChange={(val) => setQuery('operatorId', String(val))}
          placeholder='Operator'
        />
        <InputSelect
          value={gamePerformance.gameId}
          option='games'
          onChange={(val) => setQuery('gameId', String(val))}
          placeholder='Game'
        />
        <InputSelect
          value={getBooleanQuery(gamePerformance.IsDemoAccount)}
          option='accountTypes'
          onChange={(val) => setQuery('IsDemoAccount', String(val))}
          placeholder='Account Type'
        />
        <DateRangePicker
          className='col-span-1'
          value={{
            to: gamePerformance.endDate ? new Date(gamePerformance.endDate) : undefined,
            from: gamePerformance.startDate ? new Date(gamePerformance.startDate) : undefined
          }}
          onValueChange={handleDateChange}
        />
      </div>
      <div className='flex justify-center'>
        <SearchWithCsv onCsv={handleCsv} onSearch={handleSearch} searchLoading={searchLoading} disableCsv={disableCsv} />
      </div>
    </>
  )
}

export default Filters
