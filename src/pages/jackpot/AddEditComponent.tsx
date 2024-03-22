import DateTimePicker from '@components/DateTimePicker'
import InputMultiSelect from '@components/Form/InputMultiSelect'
import InputSelect from '@components/Form/InputSelect'
import { XCircleIcon } from '@heroicons/react/16/solid'
import { Button, Divider, Icon, TextInput } from '@tremor/react'
import { datetime, isNullOrWhiteSpace } from '@utils/index'
import { useState } from 'react'
import { JackpotDataModel, PostAddJackpot, PostEditJackpot } from './api'
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

const styles = {
  label: 'text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'
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
  const [isLoading, setIsLoading] = useState(false)
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
    setIsLoading(true)
    try {
      isEdit ? await PostEditJackpot(postData) : await PostAddJackpot(postData)
      onSearch()
      onCancel()
    } catch (e) {
      showError(e)
    }
    setIsLoading(false)
  }

  return (
    <>
      <div className='flex flex-col gap-4'>
        {!isEdit &&
          <>
            <div>
              <label className={styles.label}>Jackpot Name</label>
              <TextInput
                className='mt-2'
                value={postData.jackpotName}
                onValueChange={(val) => handleInputChange('jackpotName', val)}
                placeholder='Jackpot Name'
              />
            </div>
            <div>
              <label className={styles.label}>Game</label>
              <InputSelect
                className='mt-2'
                option='games'
                placeholder='Select Game'
                value={postData.gameId}
                onChange={(val) => handleInputChange('gameId', val)}
              />
            </div>
            <div>
              <label className={styles.label}>Start On</label>
              <DateTimePicker
                className='mt-2'
                value={postData.startedOn}
                onChange={(date) => handleDateChange('startedOn', date)}
              />
            </div>
          </>
        }
        <div>
          <label className={styles.label}>End On</label>
          <DateTimePicker
            className='mt-2'
            value={postData.endOn}
            onChange={(date) => handleDateChange('endOn', date)}
            minDate={postData.startedOn || datetime.convertLocalDate(pDetail?.startedOnUtc)}
          />
        </div>
        <div>
          <label className={styles.label}>Eligible Operators</label>
          <InputMultiSelect
            className='mt-2'
            option='operators'
            placeholder='Select Operators...'
            value={postData.eligibleOperators || []}
            onChange={(val) => handleInputChange('eligibleOperators', val)}
          />
        </div>
        <div>
          <label className={styles.label}>Eligible Currencies</label>
          <InputMultiSelect
            className='mt-2'
            option='currencies'
            placeholder='Select Currencies...'
            value={postData.eligibleCurrencies || []}
            onChange={(val) => handleInputChange('eligibleCurrencies', val)}
          />
        </div>
        <form onSubmit={handleAddPlayers}>
          <label className={styles.label}>Banned Players</label>
          <div className='flex'>
            <TextInput
              className='rounded-r-none mt-2'
              value={bannedPlayerInput}
              onValueChange={(val) => setBannedPlayerInput(val)}
              onPaste={handlePasteBannedPlayers}
              onKeyDown={handleKeyDownBannedPlayers}
              placeholder='Player...'
            />
            <button type='submit' className='rounded-lg rounded-l-none border border-color px-4 shadow-tremor-input mt-2'>+</button>
          </div>
        </form>
        <div className='flex gap-1 flex-wrap'>
          {postData.bannedPlayers?.map((player, idx) => (
            <div
              key={idx}
              onClick={() => setPostData(prev => ({ ...prev, bannedPlayers: [...(prev.bannedPlayers || []).filter(val => player !== val)] }))}
              className='flex gap-2 justify-between items-center border border-color px-2.5 py-1 rounded-full shadow-tremor-card cursor-pointer'
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
          loading={isLoading}
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
