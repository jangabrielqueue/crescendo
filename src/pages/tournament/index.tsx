import DataTable from '@components/DataTable'
import useTournamentApi, { TournamentModel } from './api'
import { TableColumns } from '@components/DataTable/interface'
import { Button, Dialog, DialogPanel, Divider, Icon } from '@tremor/react'
import { UserGroupIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'
import Leaderboards from './components/Leaderboards'
import useOnMountEffect from '@hooks/useOnMountEffect'
import useQueryState, { QueryData } from '@hooks/useQueryState'
import { getArrayQuery } from '@utils/index'
import Filters from './components/Filters'

const queryList = ['operatorIds', 'startDate', 'endDate', 'platforms', 'tournamentName'] as const
export type QueryList = QueryData<typeof queryList[number]>
export type QueryListSetter = (name: typeof queryList[number], value: string | undefined) => void

const Tournament = () => {
  const { data, mutate, isLoading, getCsv } = useTournamentApi()
  const [tournament, setTournament] = useState<TournamentModel>()
  const [query, setQuery] = useQueryState(queryList)
  const hasNoData = data == null || data.items?.length === 0

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
            <Button variant='light' onClick={() => setTournament(row)}><Icon icon={UserGroupIcon} variant='light' /></Button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <Filters query={query} setQuery={setQuery} onSearch={handleSearch} disableCsv={hasNoData} getCsv={getCsv} />
      <Divider />
      <DataTable
        tableClassName='my-2'
        data={data?.items || []}
        columns={columns}
        loading={isLoading}
      />
      <Dialog open={Boolean(tournament)} onClose={() => setTournament(undefined)}>
        <DialogPanel className='max-w-none w-fit'>
          {tournament &&
            <Leaderboards tournament={tournament} query={query} onCancel={() => setTournament(undefined)} />
          }
        </DialogPanel>
      </Dialog>
    </>
  )
}

export default Tournament
