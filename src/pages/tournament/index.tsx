import DataTable from '@components/DataTable'
import useTournamentApi, { TournamentModel } from './api'
import { TableColumns } from '@components/DataTable/interface'
import { Button, Divider, Icon } from '@tremor/react'
import { UserGroupIcon } from '@heroicons/react/16/solid'
import Leaderboards from './components/Leaderboards'
import useOnMountEffect from '@hooks/useOnMountEffect'
import useQueryState, { QueryData } from '@hooks/useQueryState'
import { getArrayQuery } from '@utils/index'
import Filters from './components/Filters'
import useModal from '@hooks/useModal'

const queryList = ['operatorIds', 'startDate', 'endDate', 'platforms', 'tournamentName'] as const
export type QueryList = QueryData<typeof queryList[number]>
export type QueryListSetter = (name: typeof queryList[number], value: string | undefined) => void

const Tournament = () => {
  const { data, mutate, isLoading, getCsv } = useTournamentApi()
  const [query, setQuery] = useQueryState(queryList)
  const hasNoData = data == null || data.items?.length === 0
  const { setModal, closeModal } = useModal()

  const handleSearch = () => {
    mutate({
      ...query,
      ...query.operatorIds ? { operatorIds: getArrayQuery(query.operatorIds) } : {},
      ...query.platforms ? { platforms: getArrayQuery(query.platforms) } : {}
    })
  }

  useOnMountEffect(() => {
    handleSearch()
  })

  const columns: Array<TableColumns<TournamentModel>> = [
    { headerName: 'Operator', field: 'operators' },
    { headerName: 'ID', field: 'id' },
    { headerName: 'Tournament Name', field: 'name' },
    { headerName: 'Start Date', field: 'startTime' },
    { headerName: 'End Date', field: 'endTime' },
    { headerName: 'Status', field: 'status' },
    { headerName: 'Owner', field: 'owner' },
    { headerName: 'Platform', field: 'platforms' },
    { headerName: 'Description', field: 'description' },
    {
      headerName: 'Leaderboard', field: 'action',
      renderCell({ row }) {
        return (
          <div className='flex justify-center'>
            <Button variant='light' onClick={() => handleLeaderboards(row)}><Icon icon={UserGroupIcon} variant='light' /></Button>
          </div>
        )
      },
    },
  ]

  const handleLeaderboards = (row: TournamentModel) => {
    setModal({
      body: () => (
        <Leaderboards
          tournament={row}
          query={query}
          onCancel={closeModal}
        />
      ),
      panelClassName: 'max-w-none w-fit'
    })
  }

  return (
    <>
      <Filters searchLoading={isLoading} query={query} setQuery={setQuery} onSearch={handleSearch} disableCsv={hasNoData} getCsv={getCsv} />
      <Divider />
      <DataTable
        tableClassName='my-2'
        data={data?.items || []}
        columns={columns}
        loading={isLoading}
      />
    </>
  )
}

export default Tournament
