import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import UniqueUserChart from './UniqueUserChart'
import WinLoseChart from './WinLose'
import SpinGame from './SpinGame'
import { useDasboardDailyUniqueUsers, useDasboardSpin, useDasboardWinLose } from './api'
import { useState } from 'react'

const TabLabel = ({ value, label }: { value: string | number | undefined, label: string }) => (
  <div className='flex flex-col justify-center items-center'>
    <p className=' text-2xl font-semibold'>{value}</p> <p>{label}</p>
  </div>
)
const TabbedCharts = () => {
  const { data: dailyuniqueusers } = useDasboardDailyUniqueUsers()
  const { data: winlose } = useDasboardWinLose()
  const { data: spin } = useDasboardSpin()
  const [tabIndex, setTabIndex] = useState(0)
  return (
    <Card className='py-2'>
      <TabGroup index={tabIndex} onIndexChange={(idx) => setTabIndex(idx)}>
        <TabList className="justify-around">
          <Tab>
            <TabLabel value={dailyuniqueusers?.total} label='Unique Users' />
          </Tab>
          <Tab>
            <TabLabel value={winlose?.total} label='Win / Lose (RMB)' />
          </Tab>
          <Tab>
            <TabLabel value={spin?.total} label='Spins' />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel >
            {tabIndex === 0 && <UniqueUserChart />}
          </TabPanel>
          <TabPanel>
            {tabIndex === 1 && <WinLoseChart />}
          </TabPanel>
          <TabPanel>
            {tabIndex === 2 && <SpinGame />}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  )
}

export default TabbedCharts
