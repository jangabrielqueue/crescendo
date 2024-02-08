import { Select, SelectItem } from '@tremor/react'
import Label from '../Label'
export type Option<T> = {
  text: string
  value: T
}
interface InputSelectProps<T> {
  options?: Option<T>[]
  onChange: (val: T | undefined) => void
  placeholder?: string
  value: T
  enableClear?: boolean
  label?: string
  error?: boolean
}
const InputSelect = <T,>({
  options = [],
  onChange,
  placeholder = 'Select...',
  value,
  enableClear = false,
  label,
  error
}: InputSelectProps<T>) => {
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
