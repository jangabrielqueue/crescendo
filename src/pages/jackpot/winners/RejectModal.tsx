import useModal from '@hooks/useModal'
import { Button, Divider, TextInput } from '@tremor/react'
import { PostJackpotReject } from '../api'
import useSnackbar from '@hooks/useSnackbar'
import { useState } from 'react'

const RejectModal = ({ id, trigger }: { id: string, trigger: (params: object) => void }) => {
  const { closeModal } = useModal()
  const { showError } = useSnackbar()
  const [rejectInput, setRejectInput] = useState('')
  const handleReject = async () => {
    try {
      await PostJackpotReject(id)
      trigger({
        pageIndex: 1,
        pageSize: 50
      })
    } catch (e) {
      showError(e)
    }
  }
  return (
    <>
      <div className='flex flex-col items-center gap-2 my-4'>
        <p>Are you sure you want to Reject?</p>
        <p>{'Please type "REJECT" to confirm'}</p>
        <TextInput className='*:text-center' value={rejectInput} onValueChange={setRejectInput} placeholder='' />
      </div>
      <Divider />
      <div className='flex gap-1 justify-end'>
        <Button onClick={handleReject} disabled={rejectInput !== 'REJECT'}>Submit</Button>
        <Button variant='secondary' onClick={closeModal}>Cancel</Button>
      </div>

    </>
  )
}

export default RejectModal
