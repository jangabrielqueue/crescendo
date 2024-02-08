import { Card, Icon, Text } from '@tremor/react'
import { TrophyIcon } from '@heroicons/react/16/solid'
import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import Progressbar from '@components/Progressbar'
import CircleProgress from '@components/CircleProgress'
import { TruncateNumericValue } from '@utils/index'
import { useDasboardTopWinners } from './api'
import { TopWinnersModel } from '@pages/dashboard/interface'

const TopWinners = () => {
  const { data = { data: [], topNetWin: 0 }, isValidating } = useDasboardTopWinners()
  const columns: Array<TableColumns<TopWinnersModel>> = [
    {
      field: 'name',
      headerName: 'USER / WINS [RMB]',
      renderCell: ({ row }) => {
        const spinCountValue = row.totalNetWin
        const percentage = spinCountValue > 0 ? ((spinCountValue / data.topNetWin) * 100) : 0
        return (
          <Progressbar value={TruncateNumericValue(spinCountValue)} progressValue={percentage} label={row.name} />
        )
      }
    },
    {
      field: 'totalBet',
      headerName: 'BETS [RMB]',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      renderCell: ({ row }) => TruncateNumericValue(row.totalBet)
    },
    {
      field: 'companyWLPercentage',
      headerName: 'WIN LOSE %',
      renderCell: ({ row }) => <CircleProgress value={row.companyWLPercentage} size='sm' />,
      headerClassName: 'text-center'
    }
  ]
  return (
    <Card className='py-3'>
      <Text className='text-2xl font-semibold flex items-center gap-2 mb-3'>
        <Icon icon={TrophyIcon} className=' dark:text-dark-tremor-content text-tremor-content' size='lg' />
        Top 5 Winners
      </Text>
      <DataTable
        data={data.data || []}
        columns={columns}
        loading={isValidating}
      />
    </Card>
  )
}

export default TopWinners
