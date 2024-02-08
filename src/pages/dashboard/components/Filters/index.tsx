import PeriodFilters from './PeriodFilters'
import useDashboardFilters from '@pages/dashboard/api'
import { useContext } from 'react'
import { DashboardContext } from '@pages/dashboard/context'
import InputSelect from '@components/Form/InputSelect'

type SelectType = 'Region' | 'Operator' | 'Currency'
const Filters = () => {
  const { currencies = [], regions = [], operators = [] } = useDashboardFilters()
  const { filters: [filters, setFilters] } = useContext(DashboardContext)

  const currenciesSelectList = currencies.map((val) => ({ text: val, value: val }))
  const regionsSelectList = regions.map((val) => ({ text: val, value: val }))
  const operatorsSelectList = operators.map((val) => ({ text: val, value: val }))

  const handleSelectChange = (val: string | undefined, type: SelectType) => {
    setFilters(prev => ({ ...prev, [type]: val }))
  }

  return (
    <div className='w-full flex justify-end items-center'>
      <div className='flex gap-2'>
        <InputSelect
          value={filters.Currency}
          options={currenciesSelectList}
          onChange={(val) => handleSelectChange(val, 'Currency')}
          placeholder='Currency'
        />
        <InputSelect
          value={filters.Region}
          options={regionsSelectList}
          onChange={(val) => handleSelectChange(val, 'Region')}
          placeholder='Region'
        />
        <InputSelect
          value={filters.Operator}
          options={operatorsSelectList}
          onChange={(val) => handleSelectChange(val, 'Operator')}
          placeholder='Operator'
        />
      </div>
      <PeriodFilters />
    </div>
  )
}

export default Filters
