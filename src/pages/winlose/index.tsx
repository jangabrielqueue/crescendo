import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import TopWinnersTab from './TopWinners'
import GamePerformanceTab from './GamePerformance'
import OperatorTab from './Operator'
import PlatformTab from './Platform'
import WinLoseTab from './WinLose'
import useQueryState from '@hooks/useQueryState'
import ContextProvider from './context'
import useOnMountEffect from '@hooks/useOnMountEffect'
import dayjs from 'dayjs'

const WinLoseComponent = () => {
  const [query, setQuery] = useQueryState(['uiFormat', 'startDate', 'endDate'])
  const { uiFormat } = query

  useOnMountEffect(() => {
    if (query.startDate == null || query.endDate == null) {
      setQuery('startDate', dayjs().toISOString())
      setQuery('endDate', dayjs().toISOString())
    }
  })

  const handleTabChange = (idx: number) => {
    setQuery('uiFormat', String(idx))
  }

  return (
    <div className='m-2'>
      <Card>
        <TabGroup index={Number(uiFormat) || 0} onIndexChange={handleTabChange}>
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
const WinLose = () => <ContextProvider><WinLoseComponent /></ContextProvider>
export default WinLose
