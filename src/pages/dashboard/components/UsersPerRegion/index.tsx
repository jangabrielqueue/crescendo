import RegionMap from './RegionMap'
import { worldMill } from '@react-jvectormap/world'
import { Card, Flex, Icon, Legend, Text } from '@tremor/react'
import { GlobeAsiaAustraliaIcon } from '@heroicons/react/16/solid'
import { useDasboardUsersByCountry } from './api'

const { paths } = worldMill.content
const pathKeys = Object.keys(paths) as (keyof typeof paths)[]

type RegionData = {
  name: string | number
  value: string | number
}
interface RegionMapData {
  regionValue: { [key: string]: number }
  regionData: RegionData[]
}

const UsersPerRegion = () => {
  const { data = [] } = useDasboardUsersByCountry()

  const newData: RegionMapData = data.reduce((prev, curr) => {
    const regionKey = pathKeys.find((val) => paths[val].name === curr[0])
    if (regionKey != null) return {
      regionValue: {
        ...prev.regionValue,
        [regionKey]: Number(curr[1])
      },
      regionData: [
        ...prev.regionData,
        {
          name: curr[0],
          value: curr[1]
        }
      ]
    }
    return prev
  }, { regionValue: {}, regionData: [] as RegionData[] })

  const legendCategories = newData.regionData.map(val => String(val.name))
  return (
    <Card className='p-0 col-span-6'>
      <Flex className='p-2'>
        <Text className='flex items-center text-2xl font-semibold'>
          <Icon icon={GlobeAsiaAustraliaIcon} className=' dark:text-dark-tremor-content text-tremor-content' size='lg' />
          Region Maps
        </Text>
        <Legend
          categories={legendCategories}
        />
      </Flex>
      <Card className='p-0 py-1 rounded-b-md bg-dark-tremor-background-subtle dark:bg-black'>
        <RegionMap
          values={newData.regionValue}
        />
      </Card>
    </Card>
  )
}

export default UsersPerRegion
