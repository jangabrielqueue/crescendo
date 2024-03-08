import { twMerge } from 'tailwind-merge'

interface LabelProps {
  children: React.ReactNode
  className?: string
}
const Label = ({ children, className }: LabelProps) => {
  return (
    <label className={twMerge('text-tremor-content dark:text-dark-tremor-content ml-2', className)}>
      {children}
    </label>
  )
}

export default Label
