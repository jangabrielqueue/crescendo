import { useContext } from 'react'
import { WinLoseContext } from '../context'
import InputSelect from '@components/Form/InputSelect'
import { DateRangePicker, TextInput } from '@tremor/react'
import SearchWithCsv from '@components/SearchWithCsv'
import useFilters from '@hooks/useFilters'


const Filters = ({ disableCsv }: { disableCsv: boolean }) => {
  const [filter] = useContext(WinLoseContext)
  const { topWinners } = filter
  const { operators, games, currencies, topItems } = useFilters()

  const handleDateChange = () => { }
  const handleSearch = () => { }
  const handleCsv = () => { }
  return (
    <div className='grid grid-cols-2 max-sm:grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 grid-rows-none gap-4 m-3'>
      <InputSelect
        value={topWinners.operatorId}
        options={operators}
        onChange={() => { }}
        placeholder='Operator'
      />
      <InputSelect
        value={topWinners.gameId}
        options={games}
        onChange={() => { }}
        placeholder='Game'
      />
      <InputSelect
        value={topWinners.currencyId}
        options={currencies}
        onChange={() => { }}
        placeholder='Currency'
      />
      <InputSelect
        value={topWinners.top}
        options={topItems}
        onChange={() => { }}
        placeholder='Top'
      />
      <TextInput
        value={topWinners.memberName}
        onValueChange={() => { }}
        placeholder='Member Name'
      />
      <DateRangePicker
        className='col-span-2'
        defaultValue={{
          to: topWinners.EndDate ? new Date(topWinners.EndDate) : undefined,
          from: topWinners.StartDate ? new Date(topWinners.StartDate) : undefined
        }}
        onValueChange={handleDateChange}
      />

      <SearchWithCsv onCsv={handleCsv} onSearch={handleSearch} disableCsv={disableCsv} />
    </div>
  )
}
export default Filters
