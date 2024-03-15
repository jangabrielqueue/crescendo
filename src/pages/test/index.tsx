import CircleProgress from '@components/CircleProgress'
import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import PieChart from '@components/PieChart'
import useSnackbar from '@hooks/useSnackbar'
import { BarChart, LineChart, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'

interface DataResponse {
	name: string
	Role: string
	department: string
	status: 'active' | 'inactive'
	percent: number
}
const data: DataResponse[] = [
	{
		name: 'Viola Amherd',
		Role: 'Federal Councillor',
		department: 'The Federal Department of Defence, Civil Protection and Sport (DDPS)',
		status: 'active',
		percent: 55
	},
	{
		name: 'Simonetta Sommaruga',
		Role: 'Federal Councillor',
		department:
			'The Federal Department of the Environment, Transport, Energy and Communications (DETEC)',
		status: 'active',
		percent: 25
	},
	{
		name: 'Alain Berset',
		Role: 'Federal Councillor',
		department: 'The Federal Department of Home Affairs (FDHA)',
		status: 'active',
		percent: 5
	},
	{
		name: 'Ignazio Cassis',
		Role: 'Federal Councillor',
		department: 'The Federal Department of Foreign Affairs (FDFA)',
		status: 'active',
		percent: 75
	},
	{
		name: 'Karin Keller-Sutter',
		Role: 'Federal Councillor',
		department: 'The Federal Department of Finance (FDF)',
		status: 'active',
		percent: 95
	},
	{
		name: 'Guy Parmelin',
		Role: 'Federal Councillor',
		department: 'The Federal Department of Economic Affairs, Education and Research (EAER)',
		status: 'active',
		percent: 100
	},
	{
		name: 'Elisabeth Baume-Schneider',
		Role: 'Federal Councillor',
		department: 'The Federal Department of Justice and Police (FDJP)',
		status: 'inactive',
		percent: 24
	},
]

const columns: Array<TableColumns<DataResponse>> = [
	'EXPANDER',
	{
		field: 'name',
		headerName: 'Name'
	},
	{
		field: 'Role',
		headerName: 'Role'
	},
	{
		field: 'percent',
		headerName: 'Percent',
		renderCell: ({ row }) => (
			<>{JSON.stringify(row)}</>
			// <Progressbar value={row.percent} label={row.name} />
		)
	},
	{
		field: 'status',
		headerName: 'Status',
		renderCell: ({ row }) => (
			<CircleProgress value={row.percent} />
		)
	}
]

const lineChartData = [['currencyName', 400], ['currencyName2', 300], ['currencyName4', 300], ['currencyName3', 200], ['currencyNam5', 278], ['currencyName6', 189]]
const getData = (data: (string | number)[][]) => data.map((lineChart) => ({
	'Currency Name': lineChart[0],
	'Value': lineChart[1]
}))

const Test = () => {
	const { showSnackbar } = useSnackbar()
	const handleClick = () => {
		showSnackbar({
			message: 'error Message',
		})
	}
	return (
		<div className='m-2'>
			<button onClick={handleClick}>TEST Snackbar</button>
			<PieChart
				data={[['currencyName', 400], ['currencyName2', 300], ['currencyName4', 300], ['currencyName3', 200], ['currencyNam5', 278], ['currencyName6', 189]]}
			/>
			<DataTable
				data={data}
				columns={columns}
				expandable={{
					render({ records }) {
						return <pre>{JSON.stringify(records, null, 2)}</pre>
					},
					expandOnRowClick: true
				}}
			/>
			{/* <RegionMaps /> */}
			<LineChart
				className='h-80'
				data={getData(lineChartData)}
				categories={['Value']}
				index='Currency Name'
			/>
			<BarChart
				className='h-80'
				data={getData(lineChartData)}
				categories={['Value']}
				index='Currency Name'
			/>
			<TabGroup>
				<TabList>
					<Tab>
						<div>
							<p>Test1</p>
							<p>Tab1</p>
						</div>
					</Tab>
					<Tab>tab1</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<LineChart
							className='h-80'
							data={getData(lineChartData)}
							categories={['Value']}
							index='Currency Name'
						/>
					</TabPanel>
					<TabPanel>
						<BarChart
							className='h-80'
							data={getData(lineChartData)}
							categories={['Value']}
							index='Currency Name'
						/>
					</TabPanel>
				</TabPanels>
			</TabGroup>
		</div>
	)
}

export default Test