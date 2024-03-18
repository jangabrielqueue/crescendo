import { useContext } from 'react'
import { WinLoseContext } from '../context'
import InputSelect from '@components/Form/InputSelect'
import { DateRangePicker, TextInput } from '@tremor/react'
import SearchWithCsv from '@components/SearchWithCsv'
import { datetime } from '@utils/index'
import { FilterProps } from '../interface'
import dayjs from 'dayjs'

const Filters = ({ disableCsv, search, getCsv }: FilterProps) => {
  const [topWinners, setQuery] = useContext(WinLoseContext)

  const handleDateChange = ({ from, to }: { from?: Date, to?: Date }) => {
    setQuery('startDate', datetime.getStartDate(from))
    setQuery('endDate', datetime.getStartDate(to))
  }

  const handleSearch = () => {
    const { operatorId, gameId, currencyId, memberName, startDate, endDate, top } = topWinners
    search({
      dataFormatted: true,
      operatorId,
      gameId,
      currencyId,
      memberName,
      startDate,
      endDate,
      top
    })
  }

  const handleCsv = () => {
    const startDate = dayjs(topWinners.startDate).format('YYYYMMDD')
    const endDate = dayjs(topWinners.endDate).format('YYYYMMDD')
    getCsv(`Report Name (${startDate}-${endDate})`)
  }
  return (
    <div className='grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-4 m-3'>
      <InputSelect
        value={topWinners.operatorId}
        option='operators'
        onChange={(val) => setQuery('operatorId', String(val))}
        placeholder='Operator'
      />
      <InputSelect
        value={topWinners.gameId}
        option='games'
        onChange={(val) => setQuery('gameId', String(val))}
        placeholder='Game'
      />
      <InputSelect
        value={topWinners.currencyId}
        option='currencies'
        onChange={(val) => setQuery('currencyId', String(val))}
        placeholder='Currency'
      />
      <InputSelect
        value={topWinners.top}
        option='topItems'
        onChange={(val) => setQuery('top', String(val))}
        placeholder='Top'
      />
      <TextInput
        value={topWinners.memberName}
        onValueChange={(val) => setQuery('memberName', val)}
        placeholder='Member Name'
      />
      <DateRangePicker
        className='col-span-1 md:col-span-2'
        value={{
          to: topWinners.endDate ? new Date(topWinners.endDate) : undefined,
          from: topWinners.startDate ? new Date(topWinners.startDate) : undefined
        }}
        onValueChange={handleDateChange}
      />
      <div className='col-span-full flex justify-center'>
        <SearchWithCsv onCsv={handleCsv} onSearch={handleSearch} disableCsv={disableCsv} />
      </div>
    </div>
  )
}

export default Filters
