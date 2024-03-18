import DateTimePicker from '@components/DateTimePicker'
import InputMultiSelect from '@components/Form/InputMultiSelect'
import InputSelect from '@components/Form/InputSelect'
import { XCircleIcon } from '@heroicons/react/16/solid'
import { Button, Divider, Icon, TextInput } from '@tremor/react'
import { datetime, isNullOrWhiteSpace } from '@utils/index'
import { useState } from 'react'
import { JackpotDataModel, postAddJackpot, postEditJackpot } from './api'
import useSnackbar from '@hooks/useSnackbar'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Option, Value } from '@components/Form/interface'
import useFilters from '@hooks/useFilters'
import { useStateChangeEffect } from '@hooks/useStateChangeEffect'
dayjs.extend(utc)

type PostData = {
  jackpotId: string
  jackpotName: string
  gameId: Value
  eligibleOperators: Value[]
  eligibleCurrencies: Value[]
  bannedPlayers: string[]
  startedOn: Date | undefined
  endOn: Date | undefined
}

interface AddEditProps {
  detail?: Partial<JackpotDataModel>
  onCancel: () => void
  onSearch: () => void
}

const defaultPostData = {
  jackpotName: '',
  gameId: '',
  bannedPlayers: [],
  startedOn: undefined,
  endOn: undefined,
  eligibleCurrencies: [],
  eligibleOperators: []
}

const getValueFromText = (filters: Option<Value>[], values: Value[] | undefined) => {
  return values?.reduce((prev, value) => {
    const item = filters.find((filter) => filter.text === value)
    if (item != null) {
      return [...prev, item.value]
    }
    return prev
  }, [] as Value[])
}

const AddEditComponent = ({ onCancel, onSearch, detail: pDetail }: AddEditProps) => {
  const [detail] = useState(pDetail)
  const isEdit = detail != null && Object.keys(detail).length !== 0
  const { operators, currencies } = useFilters()
  const [postData, setPostData] = useState<Partial<PostData>>({
    ...pDetail != null && Object.keys(pDetail).length !== 0 ? {
      jackpotId: pDetail.id,
      jackpotName: pDetail.name,
      bannedPlayers: pDetail.bannedPlayers,
      endOn: datetime.convertLocalDate(pDetail.endOnUtc),
      eligibleCurrencies: getValueFromText(currencies, pDetail.eligibleCurrencies),
      eligibleOperators: getValueFromText(operators, pDetail.eligibleOperators)
    } : defaultPostData
  })

  useStateChangeEffect(() => {
    setPostData(prev => ({
      ...prev,
      eligibleCurrencies: getValueFromText(currencies, pDetail?.eligibleCurrencies),
      eligibleOperators: getValueFromText(operators, pDetail?.eligibleOperators)
    }))
  }, [currencies, operators])

  const [bannedPlayerInput, setBannedPlayerInput] = useState('')
  const { showError } = useSnackbar()

  const handleDateChange = (id: 'startedOn' | 'endOn', val: Date | undefined) => {
    setPostData(prev => ({ ...prev, [id]: val }))
  }

  const handleInputChange = (id: keyof PostData, value: Value | Value[] | undefined) => {
    setPostData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleAddPlayers: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setPostData(prev => ({
      ...prev,
      ...!isNullOrWhiteSpace(bannedPlayerInput) && !(prev.bannedPlayers || []).includes(bannedPlayerInput)
        ? { bannedPlayers: [...(prev.bannedPlayers || []), bannedPlayerInput] } : {}
    }))
    setBannedPlayerInput('')
  }

  const handlePasteBannedPlayers: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const bannedPlayers = [...(postData.bannedPlayers || [])]
    pastedText.replace(/\n/g, ' ').split(' ').forEach((value) => {
      if (!bannedPlayers.includes(value) && !isNullOrWhiteSpace(value)) {
        bannedPlayers.push(value)
      }
    })

    setPostData(prev => ({ ...prev, bannedPlayers }))
  }

  const handleKeyDownBannedPlayers: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === ' ') {
      e.preventDefault()
      setPostData(prev => ({
        ...prev,
        ...!isNullOrWhiteSpace(bannedPlayerInput) && !(prev.bannedPlayers || []).includes(bannedPlayerInput)
          ? { bannedPlayers: [...(prev.bannedPlayers || []), bannedPlayerInput] } : {}
      }))
      setBannedPlayerInput('')
    }
  }

  const checkIfValid = () => {
    let bool = true
    Object.keys(postData).forEach((key) => {
      const value = postData[key as keyof PostData]
      if (isNullOrWhiteSpace(value)) return bool = false
      if ((Array.isArray(value) && key !== 'bannedPlayers') && value.length === 0) return bool = false
    })
    return bool
  }

  const handleSubmit = async () => {
    try {
      isEdit ? await postEditJackpot(postData) : await postAddJackpot(postData)
      onSearch()
      onCancel()
    } catch (e) {
      showError(e)
    }
  }

  return (
    <>
      <div className='flex flex-col gap-4'>
        <h1 className='text-tremor-title'>{isEdit ? 'Edit' : 'Create'} Jackpot</h1>
        {!isEdit &&
          <>
            <div>
              <label className='text-tremor-default'>Jackpot Name</label>
              <TextInput
                value={postData.jackpotName}
                onValueChange={(val) => handleInputChange('jackpotName', val)}
              />
            </div>
            <div>
              <label className='text-tremor-default'>Game</label>
              <InputSelect
                option='games'
                value={postData.gameId}
                onChange={(val) => handleInputChange('gameId', val)}
              />
            </div>
            <div>
              <label className='text-tremor-default'>Start On</label>
              <DateTimePicker
                value={postData.startedOn}
                onChange={(date) => handleDateChange('startedOn', date)}
              />
            </div>
          </>
        }
        <div>
          <label className='text-tremor-default'>End On</label>
          <DateTimePicker
            value={postData.endOn}
            onChange={(date) => handleDateChange('endOn', date)}
            minDate={postData.startedOn || datetime.convertLocalDate(pDetail?.startedOnUtc)}
          />
        </div>
        <div>
          <label className='text-tremor-default'>Eligible Operators</label>
          <InputMultiSelect
            option='operators'
            value={postData.eligibleOperators || []}
            onChange={(val) => handleInputChange('eligibleOperators', val)}
          />
        </div>
        <div>
          <label className='text-tremor-default'>Eligible Currencies</label>
          <InputMultiSelect
            option='currencies'
            value={postData.eligibleCurrencies || []}
            onChange={(val) => handleInputChange('eligibleCurrencies', val)}
          />
        </div>
        <form onSubmit={handleAddPlayers}>
          <label>Banned Players</label>
          <div className='flex'>
            <TextInput
              className='rounded-r-none'
              value={bannedPlayerInput}
              onValueChange={(val) => setBannedPlayerInput(val)}
              onPaste={handlePasteBannedPlayers}
              onKeyDown={handleKeyDownBannedPlayers}
            />
            <button type='submit' className='rounded-lg rounded-l-none border border-color px-4 shadow-tremor-input'>+</button>
          </div>
        </form>
        <div className='flex gap-1 flex-wrap'>
          {postData.bannedPlayers?.map((player, idx) => (
            <div
              key={idx}
              onClick={() => setPostData(prev => ({ ...prev, bannedPlayers: [...(prev.bannedPlayers || []).filter(val => player !== val)] }))}
              className='flex gap-2 justify-between items-center border border-color p-2 py-1.5 rounded-2xl shadow-tremor-card cursor-pointer'
            >
              {player} <Icon color='gray' icon={XCircleIcon} className='p-0 m-0' />
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <div className='flex gap-2 justify-end'>
        <Button
          disabled={!checkIfValid()}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          variant='secondary'
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </>
  )
}

export default AddEditComponent
