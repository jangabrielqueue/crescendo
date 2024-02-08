import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import TopWinnersTab from './TopWinners'
import GamePerformanceTab from './GamePerformance'
import OperatorTab from './Operator'
import PlatformTab from './Platform'
import WinLoseTab from './WinLose'

const WinLose = () => {
  return (
    <div className='m-2'>
      <Card>
        <TabGroup>
          <TabList className='justify-center flex'>
            <Tab>Top Winners</Tab>
            <Tab>Game Performance</Tab>
            <Tab>Win/Lose</Tab>
            <Tab>Operator</Tab>
            <Tab>Platform</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><TopWinnersTab /></TabPanel>
            <TabPanel><GamePerformanceTab /></TabPanel>
            <TabPanel><WinLoseTab /></TabPanel>
            <TabPanel><OperatorTab /></TabPanel>
            <TabPanel><PlatformTab /></TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  )
}

export default WinLose
