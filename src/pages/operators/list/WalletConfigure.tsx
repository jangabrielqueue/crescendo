import { Text } from '@tremor/react'
import { OperatorListModel } from '.'
interface WalletConfigureProps {
  row?: OperatorListModel
  onSuccess: (row: OperatorListModel) => void
  onClose: () => void
}
const WalletConfigure = ({ row }: WalletConfigureProps) => {
  return (

    <>
      <Text>Configure {row?.operatorName} Wallet</Text>
    </>
  )
}

export default WalletConfigure
