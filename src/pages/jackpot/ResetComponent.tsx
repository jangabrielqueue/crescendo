import { useStateChangeEffect } from '@hooks/useStateChangeEffect'
import { Button, Divider, NumberInput, TextInput } from '@tremor/react'
import { fetcherGetApiWithParams } from '@utils/middleware'
import { useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { PutResetJackpot } from './api'
import useSnackbar from '@hooks/useSnackbar'
import useModal from '@hooks/useModal'

type JackpotAvailableCategories = {
  startupCredits: number
  contributionRate: number
  name: string
}

const ResetComponent = ({ id, gameId, onSearch }: { id: string, gameId: string, onSearch: () => void }) => {
  const [initialAmount, setInitialAmount] = useState<Record<string, number>>({})
  const [resetInput, setResetInput] = useState('')
  const { showError } = useSnackbar()
  const { closeModal } = useModal()

  const { data = [], isLoading } = useSWRImmutable({
    url: '/Jackpot/GetAvailableCategories',
    params: { gameId }
  }, fetcherGetApiWithParams<JackpotAvailableCategories[]>)

  useStateChangeEffect(() => {
    const newInitial = data.reduce((prev, curr) => ({ ...prev, [curr.name]: curr.startupCredits }), {} as Record<string, number>)
    setInitialAmount(newInitial)
  }, [data])

  const handleInitialAmmount = (name: string, val: number) => {
    setInitialAmount(prev => ({
      ...prev,
      [name]: val
    }))
  }

  const checkIfValid = () => {
    if (resetInput !== 'RESET') return false
    if (!Object.values(initialAmount).every(val => val != null && val >= 0)) return false
    return true
  }

  const handleSubmit = async () => {
    try {
      await PutResetJackpot({
        jackpotId: id,
        initialAmount
      })
      onSearch()
      closeModal()
    } catch (e) {
      showError(e)
    }
  }

  return (
    <div className='mt-6 flex flex-col gap-2'>
      {isLoading && Array(2).fill(<div className='h-6 w-full animate-pulse bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle' />)}
      {data.map((category, idx) => {
        return (
          <div key={idx} className='grid grid-cols-7'>
            <label className='col-span-2'>
              {category.name} (CNY)
            </label>
            <div className='col-span-5'>
              <NumberInput
                defaultValue={category.startupCredits}
                value={initialAmount[category.name]}
                onValueChange={(val) => handleInitialAmmount(category.name, val)}
              />
              <p className='text-tremor-label m-1 text-tremor-content-subtle dark:text-dark-tremor-content-subtle'>contribution rate: {category.contributionRate}%</p>
            </div>
          </div>
        )
      })}
      <div className='flex flex-col items-center gap-2 my-4'>
        <p>{'Please type "RESET" to confirm'}</p>
        <TextInput className='*:text-center' value={resetInput} onValueChange={setResetInput} placeholder='' />
      </div>
      <Divider />
      <div className='flex gap-2 justify-end'>
        <Button disabled={!checkIfValid()} onClick={handleSubmit}>Submit</Button>
        <Button variant='secondary'>Cancel</Button>
      </div>
    </div>
  )
}

export default ResetComponent
