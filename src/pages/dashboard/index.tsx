import { mutate } from 'swr'
import Filters from './components/Filters'
import SpinByGame from './components/SpinByGame'
import TabbedCharts from './components/TabbedCharts'
import TopWinners from './components/TopWinners'
import UsersByBrowsers from './components/UsersByBrowsers'
import UsersByCurrency from './components/UsersByCurrency'
import UsersPerRegion from './components/UsersPerRegion'
import ContextProvider from './context'

const DashboardComponent = () => {
	const refresh = () => {
		mutate((key: { url: string }) => key.url.startsWith('/dashboard'))
	}
	return (
		<div className='w-full'>
			<Filters />
			<button onClick={refresh}>REFRESH</button>
			<div className='flex gap-4 p-4 '>
				<TabbedCharts />
				<SpinByGame />
				<TopWinners />
			</div>
			<div className='grid grid-flow-col grid-row-1 grid-cols-12 gap-4 p-4'>
				<UsersPerRegion />
				<UsersByCurrency />
				<UsersByBrowsers />
			</div>
		</div>
	)
}

const Dashboard = () => <ContextProvider><DashboardComponent /></ContextProvider>
export default Dashboard
