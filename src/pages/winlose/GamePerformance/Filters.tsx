import { useContext } from 'react'
import { WinLoseContext } from '../context'
import InputSelect from '@components/Form/InputSelect'
import { DateRangePicker } from '@tremor/react'
import SearchWithCsv from '@components/SearchWithCsv'
import useFilters from '@hooks/useFilters'


const Filters = ({ disableCsv }: { disableCsv: boolean }) => {
  const [filter] = useContext(WinLoseContext)
  const { gamePerformance } = filter
  const { operators, games, accountTypes } = useFilters()
  const handleDateChange = () => { }
  const handleSearch = () => { }
  const handleCsv = () => { }
  return (
    <>
      <div className='grid grid-cols-2 max-sm:grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-none gap-4 m-3'>
        <InputSelect
          value={gamePerformance.operatorId}
          options={operators}
          onChange={() => { }}
          placeholder='Operator'
        />
        <InputSelect
          value={gamePerformance.gameId}
          options={games}
          onChange={() => { }}
          placeholder='Game'
        />
        <InputSelect
          value={gamePerformance.isDemoAccount}
          options={accountTypes}
          onChange={() => { }}
          placeholder='Account Type'
        />
        <DateRangePicker
          className='col-span-1'
          defaultValue={{
            to: gamePerformance.EndDate ? new Date(gamePerformance.EndDate) : undefined,
            from: gamePerformance.StartDate ? new Date(gamePerformance.StartDate) : undefined
          }}
          onValueChange={handleDateChange}
        />
      </div>
      <div className='flex justify-center'>
        <SearchWithCsv onCsv={handleCsv} onSearch={handleSearch} disableCsv={disableCsv} />

      </div>

    </>

  )
}
export default Filters
