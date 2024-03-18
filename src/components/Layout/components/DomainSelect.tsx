import InputSelect from '@components/Form/InputSelect'
import { Value } from '@components/Form/interface'
import { Domain, DomainContext } from '@context/DomainContext'
import { useContext } from 'react'

const DomainSelect = () => {
  const [domainkey, setDomainkey] = useContext(DomainContext)
  const handleChange = (val: Value | undefined) => {
    setDomainkey(val as Domain)
  }
  return (
    <InputSelect
      value={domainkey ?? 'crescendo'}
      option='domainOptions'
      onChange={handleChange}
    />
  )
}
export default DomainSelect
