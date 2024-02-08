interface LabelProps {
  children: React.ReactNode
}
const Label = ({ children }: LabelProps) => {
  return (
    <label className='text-tremor-content dark:text-dark-tremor-content ml-2'>
      {children}
    </label>
  )
}

export default Label
