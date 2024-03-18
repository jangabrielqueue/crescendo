import { Select, SelectItem } from '@tremor/react'
import Label from '../Label'
import { Value } from '../interface'
import useFilters, { FilterKeys } from '@hooks/useFilters'

interface InputSelectProps {
  option: FilterKeys
  onChange: (val: Value | undefined) => void
  placeholder?: string
  value: Value
  enableClear?: boolean
  label?: string
  error?: boolean
}
const InputSelect = ({
  option,
  onChange,
  placeholder = 'Select...',
  value,
  enableClear = false,
  label,
  error
}: InputSelectProps) => {
  const filters = useFilters()
  const options = filters[option] || []
  const handleValueChange = (val: string) => {
    const option = options.find((item) => String(item.value) === val)
    onChange(option?.value)
  }
  return (
    <>
      {label && <Label>{label}</Label>}
      <Select
        className={error ? '*:border-red-500' : ''}
        value={String(value)}
        placeholder={placeholder}
        onValueChange={handleValueChange}
        enableClear={enableClear}
      >
        {options.map(({ text: label, value }, idx) => (
          <SelectItem key={idx} value={String(value)}>{label}</SelectItem>
        ))}
      </Select>
    </>

  )
}

export default InputSelect
