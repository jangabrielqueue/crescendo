import InputSelect, { Option } from '@components/Form/InputSelect'
import { Domain, DomainContext } from '@context/DomainContext'
import { useContext } from 'react'

const domainOption: Option<Domain>[] = [
  {
    text: 'GPI',
    value: 'gpi'
  },
  {
    text: 'Crescendo',
    value: 'crescendo'
  }
] as const

const DomainSelect = () => {
  const [domainkey, setDomainkey] = useContext(DomainContext)
  const handleChange = (val: Domain | undefined) => {
    setDomainkey(val || null)
  }
  return (
    <InputSelect
      value={domainkey ?? 'crescendo'}
      options={domainOption}
      onChange={handleChange}
    />
  )
}
export default DomainSelect
