// import { Button, Card, TextInput } from '@tremor/react'
// import { GameListModel } from '..'
// import Label from '@components/Form/Label'
// import useSnackbar from '@hooks/useSnackbar'
// import { data } from '../data'
// import { useNavigate } from 'react-router-dom'

// const currencies = [
//   { code: 'VND', lineBet: '5' },
//   { code: 'THB', lineBet: '10' },
//   { code: 'CNY', lineBet: '41' },
//   { code: 'RMB', lineBet: '23' },
//   { code: 'IDR', lineBet: '15' },
//   { code: 'PHP', lineBet: '50' },

// ]
// const row = data[0]

const GameConfigure = () => {
  return (
    <></>
  )
  // const { showSnackbar } = useSnackbar()
  // const navigate = useNavigate()
  // const handleSubmitConfigure = (row: GameListModel) => {
  //   showSnackbar({
  //     message: `Configure ${row.gameName} Successfully!`,
  //     color: 'green'
  //   })
  //   handleBack()
  // }

  // const handleBack = () => {
  //   navigate('/gamelist')
  // }
  // return (
  //   <div className='m-4 flex justify-center'>
  //     <Card className='flex flex-col gap-4'>
  //       <Label>RTP Level</Label>
  //       <TextInput className='col-span-3' defaultValue={String(row?.rtp)} />

  //       <Label className=''>Line Bet (Per Currency)</Label>
  //       {currencies.map((curr, idx) => (
  //         <div key={idx} className='grid md:grid-cols-7 max-md:grid-cols-3  items-center'>
  //           <Label className=''>{curr.code}</Label>
  //           <TextInput className='col-span-2' defaultValue={curr.lineBet} />
  //         </div>
  //       ))}
  //       <div className='flex gap-2 self-end'>
  //         <Button variant='secondary' onClick={handleBack}>Back</Button>
  //         <Button variant='primary' onClick={() => handleSubmitConfigure(row!)}>Submit</Button>
  //       </div>
  //     </Card>
  //   </div>

  // )
}

export default GameConfigure
