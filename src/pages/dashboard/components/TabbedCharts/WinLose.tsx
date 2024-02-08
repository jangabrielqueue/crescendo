import { BarChart } from '@tremor/react'
import { useDasboardWinLose } from './api'

const WinLoseChart = () => {
  const { data = { data: [] } } = useDasboardWinLose()
  return (
    <BarChart
      className="h-80"
      data={data.data}
      index="date"
      categories={['Income']}
    />
  )
}

export default WinLoseChart
