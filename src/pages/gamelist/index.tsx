import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import useSnackbar from '@hooks/useSnackbar'
import { Button, Card, Switch } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import useGameListApi, { GameListModel } from './api'
import useOnMountEffect from '@hooks/useOnMountEffect'

const GameList = () => {
  const { showSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { data, mutate, isLoading } = useGameListApi()
  const handleConfigure = (id: string) => navigate(`/gamelist/configure/${id}`)
  const handleEnableDisable = (row: GameListModel) => {
    showSnackbar({
      message: `${row.gameName} is ${row.isEnabled ? 'Disabled' : 'Enabled'}`,
      color: 'green'
    })
  }

  useOnMountEffect(() => {
    mutate()
  })
  const columns: Array<TableColumns<GameListModel>> = [
    {
      headerName: 'Game Name',
      field: 'gameName'
    },
    // {
    //   headerName: 'Line Bet',
    //   field: 'lineBet'
    // },
    {
      headerName: 'RTP',
      field: 'rtp'
    },
    {
      headerName: 'Enabled/Disabled',
      field: 'isEnabled',
      renderCell: ({ row }) => <Switch defaultChecked={row.isEnabled} onChange={() => handleEnableDisable(row)}></Switch>
    },
    {
      headerName: 'Actions',
      field: 'action',
      renderCell: ({ row }) => {
        return (
          <Button onClick={() => handleConfigure(row.gameName)}>Configure</Button>
        )
      }
    }
  ]
  return (
    <>
      <Card>
        <DataTable
          data={data ?? []}
          loading={isLoading}
          columns={columns}
        />
      </Card>
    </>
  )
}

export default GameList
