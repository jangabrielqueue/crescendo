import { DashboardContext } from '@pages/dashboard/context'
import { Tab, TabGroup, TabList } from '@tremor/react'
import { Period } from '@utils/interface'
import { useContext } from 'react'

const TabValue: Period[] = ['1h', '1d', '7d', '30d']
const PeriodFilters = () => {
  const { filters: [filters, setFilters] } = useContext(DashboardContext)
  const handlePeriodChange = (idx: number) => {
    setFilters((prev) => ({ ...prev, Period: TabValue[idx]}))
  }
  return (
    <div className='flex items-center justify-end gap-2 p-2'>
      <p className='dark:text-dark-tremor-content text-sm text-tremor-content-subtle'>Show data for last:</p>
      <TabGroup className='w-auto' index={TabValue.indexOf(filters.Period)} onIndexChange={handlePeriodChange} >
        <TabList variant='solid'>
          <Tab>Last Hour</Tab>
          <Tab>Today</Tab>
          <Tab>Last 7 Days</Tab>
          <Tab>Last 30 Days</Tab>
        </TabList>
      </TabGroup>
    </div>
  )
}

export default PeriodFilters
