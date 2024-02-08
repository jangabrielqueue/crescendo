import PieChart from '@components/PieChart'
import { GlobeAltIcon } from '@heroicons/react/16/solid'
import { Icon, Text } from '@tremor/react'
import { useDasboardUsersByBrowsers } from './api'

const UsersByBrowsers = () => {
  const { data = [], total } = useDasboardUsersByBrowsers()
  return (
    <PieChart
      data={data as [string, string | number][]}
      title={
        <Text className='text-2xl font-semibold flex items-center gap-2 mb-3'>
          <Icon icon={GlobeAltIcon} className=' dark:text-dark-tremor-content text-tremor-content' size='lg' />
          Browsers
        </Text>
      }
      customValue={({ value }) => `${value} (${(Number(value) / total * 100).toFixed(2)}%)`}
      cardClassName='col-span-3'
    />
  )
}

export default UsersByBrowsers
