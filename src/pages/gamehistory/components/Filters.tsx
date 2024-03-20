import InputSelect from '@components/Form/InputSelect'
import SearchWithCsv from '@components/SearchWithCsv'
import useOnMountEffect from '@hooks/useOnMountEffect'
import useQueryState from '@hooks/useQueryState'
import { DateRangePicker, NumberInput, TextInput } from '@tremor/react'
import { datetime, isNullOrWhiteSpace } from '@utils/index'
import { useState } from 'react'

type ErrorState<T extends string> = {
  [key in T]?: boolean
}

const Filters = ({ trigger, getCsv, disableCsv }: { trigger: (obj: object) => void, getCsv: (fileName: string) => void, disableCsv: boolean }) => {
  const [filters, setFilters] = useQueryState(['StartDate', 'EndDate', 'MemberName', 'TransactionId', 'OperatorId', 'GameId', 'GameTransactionType', 'PlatformType', 'pageIndex', 'pageSize'])
  const [error, setError] = useState<ErrorState<keyof typeof filters>>({})

  const handleDateChange = (val: { from?: Date, to?: Date }) => {
    setFilters('StartDate', datetime.getStartDate(val.from))
    setFilters('EndDate', datetime.getEndDate(val.to))
  }

  const checkValidations = () => {
    const isMemberNameValid = isNullOrWhiteSpace(filters.MemberName)
    const isOperatorIdValid = isNullOrWhiteSpace(filters.OperatorId)
    setError(prev => ({
      ...prev,
      MemberName: isMemberNameValid,
      OperatorId: isOperatorIdValid
    }))

    if (isMemberNameValid || isOperatorIdValid) {
      return false
    }
    return true
  }

  const handleSearch = () => {
    if (checkValidations()) {
      const payload = { ...filters }
      if (filters.pageIndex == null) {
        setFilters('pageIndex', '1')
        payload['pageIndex'] = '1'
      }
      if (filters.pageSize == null) {
        setFilters('pageSize', '50')
        payload['pageSize'] = '50'
      }

      trigger({
        ...payload,
        dataFormatted: true
      })
    }
  }

  useOnMountEffect(() => {
    if (Object.keys(filters).length !== 0) {
      handleSearch()
    }
  })

  const handleCsv = () => {
    getCsv(`Game History - ${filters.MemberName} (Page ${filters.pageIndex}) (${filters.StartDate}-${filters.EndDate})`)
  }
  return (
    <>
      <div className='grid grid-cols-2 max-sm:grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-6 grid-rows-none gap-4 my-6'>
        <TextInput

          value={filters.MemberName}
          onValueChange={(val) => setFilters('MemberName', val)}
          placeholder='Member Name'
          error={error.MemberName}
        />
        <NumberInput
          enableStepper={false}
          value={filters.TransactionId}
          onValueChange={(val) => setFilters('TransactionId', String(val))}
          placeholder='TXN ID'
        />
        <InputSelect
          option='operators'
          value={filters.OperatorId}
          onChange={(val) => setFilters('OperatorId', String(val))}
          placeholder='Operator'
          error={error.OperatorId}
        />
        <InputSelect
          option='games'
          value={filters.GameId}
          onChange={(val) => setFilters('GameId', String(val))}
          placeholder='Game'
        />
        <InputSelect
          option='spinTypes'
          value={filters.GameTransactionType ? JSON.parse(filters.GameTransactionType) : undefined}
          onChange={(val) => setFilters('GameTransactionType', String(val))}
          placeholder='Type'
        />
        <InputSelect
          option='platforms'
          value={filters.PlatformType ? JSON.parse(filters.PlatformType) : undefined}
          onChange={(val) => setFilters('PlatformType', String(val))}
          placeholder='Platform'
        />
      </div>
      <div className='flex gap-3 my-6'>
        <DateRangePicker
          className='col-span-2'
          defaultValue={{
            to: filters.EndDate ? new Date(filters.EndDate) : undefined,
            from: filters.StartDate ? new Date(filters.StartDate) : undefined
          }}
          onValueChange={handleDateChange}
        />
        <SearchWithCsv onSearch={handleSearch} onCsv={handleCsv} disableCsv={disableCsv} />
      </div>
    </>
  )
}

export default Filters
