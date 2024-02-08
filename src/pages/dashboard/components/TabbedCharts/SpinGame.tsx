import { LineChart } from '@tremor/react'
import { useDasboardSpin } from './api'

const SpinGame = () => {
  const { data = { data: [] } } = useDasboardSpin()
  return (
    <LineChart
      className='h-80'
      data={data.data}
      index='date'
      categories={['Spin Count']}
      colors={['indigo']}
    />
  )
}

export default SpinGame
