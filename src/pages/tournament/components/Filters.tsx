import InputMultiSelect from '@components/Form/InputMultiSelect'
import { DateRangePicker, TextInput } from '@tremor/react'
import { QueryList, QueryListSetter } from '..'
import SearchWithCsv from '@components/SearchWithCsv'
import { datetime, getArrayQuery } from '@utils/index'
import { useState } from 'react'
import dayjs from 'dayjs'

interface FilterProps {
  query: QueryList
  setQuery: QueryListSetter
  onSearch: () => void
  disableCsv: boolean
  getCsv: (str: string) => void
}

const Filters = ({
  query: filters,
  setQuery: setFilters,
  onSearch,
  disableCsv,
  getCsv
}: FilterProps) => {
  const [prevQuery, setPrevQuery] = useState(filters)

  const handleSearch = () => {
    onSearch()
    setPrevQuery(filters)
  }
  const handleCsv = () => {
    getCsv(`Tournament-(${dayjs(prevQuery.startDate).format('MM/DD/YYYY')}-${dayjs(prevQuery.endDate).format('MM/DD/YYYY')})`)
  }

  const handleDateChange = (val: { from?: Date, to?: Date }) => {
    setFilters('startDate', datetime.getStartDate(val.from))
    setFilters('endDate', datetime.getEndDate(val.to))
  }

  return (
    <div className='grid grid-cols-12 max-md:grid-cols-1 md:grid-cols-3 lg:grid-cols-6 grid-rows-none gap-4 my-6'>
      <InputMultiSelect
        option='operators'
        value={getArrayQuery(filters.operatorIds)}
        onChange={(val) => setFilters('operatorIds', JSON.stringify(val))}
        placeholder='Operators'
      />
      <TextInput
        value={filters.tournamentName}
        onValueChange={(val) => setFilters('tournamentName', val)}
        placeholder='Global Tournament Name'
      />
      <InputMultiSelect
        option='platforms'
        value={getArrayQuery(filters.platforms)}
        onChange={(val) => setFilters('platforms', JSON.stringify(val))}
        placeholder='Platforms'
      />
      <DateRangePicker
        className='col-span-2 max-md:col-span-1'
        defaultValue={{
          to: filters.endDate ? new Date(filters.endDate) : undefined,
          from: filters.startDate ? new Date(filters.startDate) : undefined
        }}
        onValueChange={handleDateChange}
      />
      <div className='lg:col-span-12 md:col-span-3 max-md:col-span-1 flex justify-center'>
        <SearchWithCsv
          onSearch={handleSearch}
          onCsv={handleCsv}
          disableCsv={disableCsv}
        />
      </div>
    </div>
  )
}

export default Filters
