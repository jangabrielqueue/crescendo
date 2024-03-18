import PeriodFilters from './PeriodFilters'
import { useContext } from 'react'
import { DashboardContext } from '@pages/dashboard/context'
import InputSelect from '@components/Form/InputSelect'
import { Value } from '@components/Form/interface'

type SelectType = 'Region' | 'Operator' | 'Currency'
const Filters = () => {
  const { filters: [filters, setFilters] } = useContext(DashboardContext)

  const handleSelectChange = (val: Value | undefined, type: SelectType) => {
    setFilters(prev => ({ ...prev, [type]: val }))
  }

  return (
    <div className='w-full flex justify-end items-center'>
      <div className='flex gap-2'>
        <InputSelect
          value={filters.Currency}
          option='dashCurrencyOptions'
          onChange={(val) => handleSelectChange(val, 'Currency')}
          placeholder='Currency'
        />
        <InputSelect
          value={filters.Region}
          option='dashRegionsOptions'
          onChange={(val) => handleSelectChange(val, 'Region')}
          placeholder='Region'
        />
        <InputSelect
          value={filters.Operator}
          option='dashOperatorOptions'
          onChange={(val) => handleSelectChange(val, 'Operator')}
          placeholder='Operator'
        />
      </div>
      <PeriodFilters />
    </div>
  )
}

export default Filters
