import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import useSnackbar from '@hooks/useSnackbar'
import { Button, Card, Dialog, DialogPanel, Switch } from '@tremor/react'
import { useState } from 'react'

export interface OperatorListModel {
  operatorName: string
  operatorCode: string
  isEnabled: boolean
  wallet: string
  authentication: string
}

const data: OperatorListModel[] = [
  {
    operatorName: 'Operator 1',
    operatorCode: 'OP1',
    isEnabled: true,
    wallet: 'ey39i32or045525',
    authentication: 'ey30gfmtiho507'
  },
  {
    operatorName: 'Operator 2',
    operatorCode: 'OP2',
    isEnabled: true,
    wallet: 'ey7053e6yh045525',
    authentication: 'ey3kg0054it4692eq'
  },
  {
    operatorName: 'Operator 3',
    operatorCode: 'OP3',
    isEnabled: true,
    wallet: 'ey39i3555rr045525',
    authentication: 'eywWey24tih4r'
  },
]
const OperatorList = () => {
  const { showSnackbar } = useSnackbar()
  const [currentRow, setCurrentRow] = useState<OperatorListModel>()
  const [configureWallet, setConfigureWallet] = useState(false)

  const handleAuthConfigure = (row: OperatorListModel) => {
    setCurrentRow(row)
    setConfigureWallet(true)
  }
  const handleWalletConfigure = (row: OperatorListModel) => {
    setCurrentRow(row)
  }
  const handleEnableDisable = (row: OperatorListModel) => {
    showSnackbar({
      message: `${row.operatorName} is ${row.isEnabled ? 'Disabled' : 'Enabled'}`,
      color: 'green'
    })
  }

  const handleCancelConfigure = () => {
    setCurrentRow(undefined)
    setConfigureWallet(false)
  }

  const columns: Array<TableColumns<OperatorListModel>> = [
    {
      headerName: 'Operator Name',
      field: 'operatorName'
    },
    {
      headerName: 'Operator Code',
      field: 'operatorCode'
    },
    {
      headerName: 'Status',
      field: 'isEnabled',
      renderCell: ({ row }) => <Switch defaultChecked={row.isEnabled} onChange={() => handleEnableDisable(row)}></Switch>
    },
    {
      headerName: 'Wallet Config',
      field: 'wallet',
      renderCell: ({ row }) => (
        <Button onClick={() => handleWalletConfigure(row)}>Wallet Configure</Button>
      )
    },
    {
      headerName: 'Actions',
      field: 'action',
      renderCell: ({ row }) => {
        return (
          <Button onClick={() => handleAuthConfigure(row)}>Configure</Button>
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
      <Dialog open={currentRow != null && configureWallet} onClose={handleCancelConfigure} static={true}>
        <DialogPanel>
          {/* <GameConfigure row={currentRow} onSubmit={handleSubmitConfigure} onCancel={handleCancelConfigure} /> */}
        </DialogPanel>
      </Dialog>
    </>
  )
}

export default OperatorList
