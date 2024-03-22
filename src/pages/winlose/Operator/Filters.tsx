import { useContext } from 'react'
import { WinLoseContext } from '../context'
import InputSelect from '@components/Form/InputSelect'
import { DateRangePicker } from '@tremor/react'
import SearchWithCsv from '@components/SearchWithCsv'
import { datetime, getBooleanQuery } from '@utils/index'
import { FilterProps } from '../interface'

const Filters = ({ disableCsv, search, getCsv, searchLoading }: FilterProps) => {
  const [operator, setQuery] = useContext(WinLoseContext)

  const handleDateChange = ({ from, to }: { from?: Date, to?: Date }) => {
    setQuery('startDate', datetime.getStartDate(from))
    setQuery('endDate', datetime.getStartDate(to))
  }

  const handleSearch = () => {
    const { operatorId, gameId, startDate, endDate, isFreeRounds, isDemo } = operator
    search({
      dataFormatted: true,
      operatorId,
      gameId,
      startDate,
      endDate,
      isDemo,
      isFreeRounds
    })
  }

  const handleCsv = () => getCsv(`Operator (${operator.startDate}-${operator.endDate})`)

  return (
    <>
      <div className='grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-4 m-3'>
        <InputSelect
          value={operator.gameId}
          option='games'
          onChange={(val) => setQuery('gameId', String(val))}
          placeholder='Game'
        />
        <InputSelect
          value={operator.operatorId}
          option='operators'
          onChange={(val) => setQuery('operatorId', String(val))}
          placeholder='Operator'
        />
        <InputSelect
          value={operator.currencyId}
          option='currencies'
          onChange={(val) => setQuery('currencyId', String(val))}
          placeholder='Currency'
        />
        <InputSelect
          value={getBooleanQuery(operator.isFreeRounds)}
          option='transactionTypes'
          onChange={(val) => setQuery('isFreeRounds', String(val))}
          placeholder='Transaction Type'
        />
        <InputSelect
          value={getBooleanQuery(operator.isDemo)}
          option='accountTypes'
          onChange={(val) => setQuery('isDemo', String(val))}
          placeholder='Account Type'
        />
        <DateRangePicker
          className='col-span-1 md:col-span-2'
          value={{
            to: operator.endDate ? new Date(operator.endDate) : undefined,
            from: operator.startDate ? new Date(operator.startDate) : undefined
          }}
          onValueChange={handleDateChange}
        />
        <div className='col-span-full flex justify-center'>
          <SearchWithCsv onCsv={handleCsv} onSearch={handleSearch} searchLoading={searchLoading} disableCsv={disableCsv} />
        </div>
      </div>
    </>
  )
}

export default Filters
