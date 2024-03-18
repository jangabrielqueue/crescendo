import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import useSWRImmutable from 'swr/immutable'
import { QueryList } from '..'
import { TournamentModel } from '../api'
import { Icon, Text } from '@tremor/react'
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { GetObjectAsCsv } from '@utils/index'
import dayjs from 'dayjs'
import useSnackbar from '@hooks/useSnackbar'
import { fetcherGetApiWithParams } from '@utils/newMiddleware'

interface LeaderboardModel {
  no: number
  operator: string
  userId: number
  currencyId: number
  currency: string
  rank: number
  points: number
  memberName: string
  bet: number
  win: number
  betL: number
  winLoseL: number
  firstBet: string
  lastBet: string
}

const columns: Array<TableColumns<LeaderboardModel>> = [
  { headerName: '#', field: 'rank', renderCell: ({ index }) => index + 1 },
  { headerName: 'Rank', field: 'rank' },
  { headerName: 'Member Name', field: 'memberName' },
  { headerName: 'Operator', field: 'operator' },
  { headerName: 'Points', field: 'points' },
  { headerName: 'Total Bet [RMB]', field: 'betL' },
  { headerName: 'Total Payout [RMB]', field: 'winLoseL' },
  { headerName: 'Total Bet [F]', field: 'bet' },
  { headerName: 'Total Payout [F]', field: 'win' },
  { headerName: 'First Bet', field: 'firstBet' },
  { headerName: 'Last Bet', field: 'lastBet' },

]

interface LeaderboardsProps {
  tournament: TournamentModel
  query: QueryList

  onCancel: () => void
}
const Leaderboards = ({ tournament, query, onCancel }: LeaderboardsProps) => {
  const { showError } = useSnackbar()
  const { data, isValidating } = useSWRImmutable({
    url: '/tournament/getLeaderboards',
    params: { dataFormmatted: true, tournamentId: tournament.id, ...query }
  }, fetcherGetApiWithParams<LeaderboardModel[]>)

  const getCsv = () => {
    if (data != null) {
      GetObjectAsCsv({
        object: data,
        fields: [
          { label: 'Rank', value: 'rank' },
          { label: 'Member Name', value: 'memberName' },
          { label: 'Operator', value: 'operator' },
          { label: 'Points', value: 'points' },
          { label: 'Total Bet [RMB]', value: 'betL' },
          { label: 'Total Payout [RMB]', value: 'winLoseL' },
          { label: 'Total Bet [F]', value: 'bet' },
          { label: 'Total Payout [F]', value: 'win' },
          { label: 'First Bet', value: 'firstBet' },
          { label: 'Last Bet', value: 'lastBet' },
        ],
        fileName: `Leaderboards-${tournament.name} (${dayjs(query.startDate).format('MMMM/DD/YYYY')}-${dayjs(query.endDate).format('MMMM/DD/YYYY')})`
      })
    } else {
      showError(new Error('No Data Found'))
    }
  }
  return (
    <div className='flex flex-col'>
      <div className='mx-2 mb-6 self-start justify-between pr-2 flex gap-2 items-center w-full'>
        <div>
          <Text className='text-xl'>{tournament.name} - Leaderboards</Text>
          <Text className='font-light text-lg'>{dayjs(query.startDate).format('MM/DD/YYYY')}-{dayjs(query.endDate).format('MM/DD/YYYY')}</Text>
        </div>
        <div className='flex gap-2'>
          <Icon onClick={getCsv} icon={ArrowDownTrayIcon} variant="shadow" tooltip="Download CSV" size="sm" className='cursor-pointer' />
          <Icon onClick={onCancel} icon={XMarkIcon} variant="shadow" tooltip="close" size="sm" className='cursor-pointer' />
        </div>
      </div>
      <DataTable
        data={data || []}
        columns={columns}
        loading={isValidating}
      />
    </div>
  )
}

export default Leaderboards
