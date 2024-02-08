import { Card, Icon, Text } from '@tremor/react'
import { RocketLaunchIcon } from '@heroicons/react/16/solid'
import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import Progressbar from '@components/Progressbar'
import CircleProgress from '@components/CircleProgress'
import { useDasboardSpinByGame } from './api'
import { GamePerformanceModel } from '@pages/dashboard/interface'

const SpinByGame = () => {
  const { data = { data: [], topSpinValue: 1 }, isValidating } = useDasboardSpinByGame()

  const columns: Array<TableColumns<GamePerformanceModel>> = [
    {
      field: 'game',
      headerName: 'GAME / SPINS',
      renderCell: ({ row }) => {
        const spinCountValue = row.noOfSpin
        const percentage = spinCountValue > 0 ? ((spinCountValue / data?.topSpinValue) * 100) : 0
        return (
          <Progressbar value={spinCountValue} progressValue={percentage} label={row.game} />
        )
      }
    },
    {
      field: 'gameIncomeRmb',
      headerName: 'INCOME [RMB]',
      headerClassName: 'text-center',
      cellClassName: 'text-center'
    },
    {
      field: 'gamePayoutPer',
      headerName: 'WIN LOSE %',
      renderCell: ({ row }) => <CircleProgress value={row.gamePayoutPer} size='sm' />,
      headerClassName: 'text-center'
    }
  ]

  return (
    <Card className='py-3'>
      <Text className='text-2xl font-semibold flex items-center gap-2 mb-3'>
        <Icon icon={RocketLaunchIcon} className=' dark:text-dark-tremor-content text-tremor-content' size='lg' />
        Top 5 Games
      </Text>
      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isValidating}
      />
    </Card>
  )
}

export default SpinByGame
