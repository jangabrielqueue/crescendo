import { useContext } from 'react'
import { WinLoseContext } from '../context'
import InputSelect from '@components/Form/InputSelect'
import { DateRangePicker } from '@tremor/react'
import SearchWithCsv from '@components/SearchWithCsv'
import useFilters from '@hooks/useFilters'
import { datetime, getBooleanQuery } from '@utils/index'
import { FilterProps } from '../interface'

const Filters = ({ disableCsv, search, getCsv }: FilterProps) => {
  const [platform, setQuery] = useContext(WinLoseContext)
  const { operators, games, accountTypes, currencies, transactionTypes } = useFilters()

  const handleDateChange = ({ from, to }: { from?: Date, to?: Date }) => {
    setQuery('startDate', datetime.getStartDate(from))
    setQuery('endDate', datetime.getStartDate(to))
  }

  const handleSearch = () => {
    const { operatorId, gameId, startDate, endDate, isFreeRounds, isDemo, currencyId } = platform
    search({
      dataFormatted: true,
      operatorId,
      gameId,
      startDate,
      endDate,
      isFreeRounds,
      isDemo,
      currencyId
    })
  }

  const handleCsv = () => getCsv(`Platform (${platform.startDate}-${platform.endDate})`)
  return (
    <>
      <div className='grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-4 m-3'>
        <InputSelect
          value={platform.gameId}
          options={games}
          onChange={(val) => setQuery('gameId', val)}
          placeholder='Game'
        />
        <InputSelect
          value={platform.operatorId}
          options={operators}
          onChange={(val) => setQuery('operatorId', val)}
          placeholder='Operator'
        />
        <InputSelect
          value={platform.currencyId}
          options={currencies}
          onChange={(val) => setQuery('currencyId', val)}
          placeholder='Currency'
        />
        <InputSelect
          value={getBooleanQuery(platform.isFreeRounds)}
          options={transactionTypes}
          onChange={(val) => setQuery('isFreeRounds', String(val))}
          placeholder='Transaction Type'
        />
        <InputSelect
          value={getBooleanQuery(platform.isDemo)}
          options={accountTypes}
          onChange={(val) => setQuery('isDemo', String(val))}
          placeholder='Account Type'
        />
        <DateRangePicker
          className='col-span-1 md:col-span-2'
          value={{
            to: platform.endDate ? new Date(platform.endDate) : undefined,
            from: platform.startDate ? new Date(platform.startDate) : undefined
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
