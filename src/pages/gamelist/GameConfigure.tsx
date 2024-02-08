import { Button, TextInput } from '@tremor/react'
import { GameListModel } from '.'
import Label from '@components/Form/Label'
interface GameConfigureProps {
  row?: GameListModel
  onCancel: () => void
  onSubmit: (row: GameListModel) => void
}
const GameConfigure = ({ row, onCancel, onSubmit }: GameConfigureProps) => {
  return (
    <div className='flex flex-col gap-4'>
      <Label>RTP Level</Label>
      <TextInput defaultValue={String(row?.rtp)} />
      <Label>Line Bet (Per Currency)</Label>
      <TextInput defaultValue={String(row?.lineBet)} />
      <div className='flex gap-2 self-end'>
        <Button variant='secondary' onClick={onCancel}>Cancel</Button>
        <Button variant='primary' onClick={() => onSubmit(row!)}>Submit</Button>
      </div>

    </div>
  )
}

export default GameConfigure
