import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import useSnackbar from '@hooks/useSnackbar'
import { Button, Card, Dialog, DialogPanel, Switch } from '@tremor/react'
import { useState } from 'react'
import GameConfigure from './GameConfigure'

export interface GameListModel {
  gameName: string
  lineBet: number
  rtp: number
  isEnabled: boolean
}

const data: GameListModel[] = [
  {
    gameName: 'Game1',
    lineBet: 14,
    rtp: 0.9,
    isEnabled: true
  },
  {
    gameName: 'Game2',
    lineBet: 14,
    rtp: 0.9,
    isEnabled: true
  },
  {
    gameName: 'Game3',
    lineBet: 14,
    rtp: 0.9,
    isEnabled: false
  }
]
const GameList = () => {
  const { showSnackbar } = useSnackbar()
  const [currentRow, setCurrentRow] = useState<GameListModel>()

  const handleConfigure = (row: GameListModel) => { setCurrentRow(row) }
  const handleEnableDisable = (row: GameListModel) => {
    showSnackbar({
      message: `${row.gameName} is ${row.isEnabled ? 'Disabled' : 'Enabled'}`,
      color: 'green'
    })
  }

  const handleCancelConfigure = () => {
    setCurrentRow(undefined)
  }
  const handleSubmitConfigure = (row: GameListModel) => {
    showSnackbar({
      message: `Configure ${row.gameName} Successfully!`,
      color: 'green'
    })
    handleCancelConfigure()
  }
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
          <Button onClick={() => handleConfigure(row)}>Configure</Button>
        )
      }
    }
  ]
  return (
    <>
      <Card>
        <DataTable
          data={data}
          columns={columns}
        />
      </Card>
      <Dialog open={currentRow != null} onClose={() => setCurrentRow(undefined)} static={true}>
        <DialogPanel>
          <GameConfigure row={currentRow} onSubmit={handleSubmitConfigure} onCancel={handleCancelConfigure} />
        </DialogPanel>
      </Dialog>
    </>
  )
}

export default GameList
