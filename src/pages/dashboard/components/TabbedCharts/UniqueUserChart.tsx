import { LineChart } from '@tremor/react'
import { useDasboardDailyUniqueUsers } from './api'

const UniqueUserChart = () => {
  const { data = { data: [] } } = useDasboardDailyUniqueUsers()
  return (
    <LineChart
      className='h-80'
      data={data.data}
      index='date'
      categories={['User Count']}
      colors={['indigo']}
    // yAxisWidth={60}
    />

  )
}

export default UniqueUserChart
