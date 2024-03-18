import { MultiSelect, MultiSelectItem } from '@tremor/react'
import Label from '../Label'
import useFilters, { FilterKeys } from '@hooks/useFilters'
import { Value } from '../interface'

interface InputMultiSelectProps {
  option: FilterKeys
  onChange: (val: Value[]) => void
  placeholder?: string
  value: Value[]
  label?: string
  error?: boolean
}

const InputMultiSelect = ({
  option,
  onChange,
  placeholder = 'Select...',
  value,
  label,
  error
}: InputMultiSelectProps) => {
  const newVal = value.map((val) => String(val))
  const filters = useFilters()
  const options = filters[option] || []
  const handleValueChange = (value: string[]) => {
    const newVal = value.map((val) => options.find(v => String(v.value) === val)!.value)
    onChange(newVal)
  }
  return (
    <>
      {label && <Label>{label}</Label>}
      <MultiSelect
        className={error ? '*:border-red-500' : ''}
        value={newVal}
        placeholder={placeholder}
        onValueChange={handleValueChange}
      >
        {options.map(({ text: label, value }, idx) => (
          <MultiSelectItem key={idx} value={String(value)}>{label}</MultiSelectItem>
        ))}
      </MultiSelect>
    </>

  )
}

export default InputMultiSelect
