import { DatePicker } from '@tremor/react'
import dayjs from 'dayjs'
import { useRef } from 'react'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

interface DateTimePickerProps {
  value: Date | undefined
  onChange: (val: Date | undefined) => void
  minDate?: Date | undefined
}
const DateTimePicker = ({ onChange, value, minDate }: DateTimePickerProps) => {
  const refInput = useRef<HTMLInputElement>(null)
  const timeValue = dayjs(value).format('HH:mm:ss')

  const handleDateChange = (val: Date | undefined) => {
    refInput.current?.showPicker()
    const currentValue = dayjs(value)
    const newValue = dayjs(val).set('h', currentValue.get('h')).set('m', currentValue.get('m')).set('s', currentValue.get('s')).toDate()

    onChange(newValue)
  }

  const handleTime: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const currentDate = dayjs(value)
    const dayjsValue = dayjs(e.target.value, 'HH:mm:ss')
    const newValue = currentDate.set('h', dayjsValue.get('h')).set('m', dayjsValue.get('m')).set('s', dayjsValue.get('s')).toDate()
    onChange(newValue)
  }

  return (
    <div className='relative'>
      <DatePicker
        displayFormat='MMMM dd, yyyy hh:mm:ss'
        enableClear={false}
        onValueChange={handleDateChange}
        value={value}
        minDate={minDate}
      />
      <input
        type='time'
        ref={refInput}
        step='2'
        className='invisible h-0 p-0 m-0 absolute'
        onChange={handleTime}
        value={timeValue}
      />
    </div>
  )
}

export default DateTimePicker
