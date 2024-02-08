import InputSelect from '@components/Form/InputSelect'
import useFilters from '@hooks/useFilters'
import useQueryState from '@hooks/useQueryState'
import { Button, TextInput } from '@tremor/react'
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import useOnMountEffect from '@hooks/useOnMountEffect'

const Filters = ({ mutate }: { mutate: (object: object) => void }) => {
  const [filters, setFilters] = useQueryState(['OperatorId', 'CurrencyId', 'DemoAccount', 'MemberId', 'MemberName', 'pageIndex', 'pageSize'])
  const { operators, currencies, accountTypes: memberAccountTypes } = useFilters()
  const handleSearch = () => {
    const payload = { ...filters }
    if (filters.pageIndex == null) {
      setFilters('pageIndex', '1')
      payload['pageIndex'] = '1'
    }
    if (filters.pageSize == null) {
      setFilters('pageSize', '50')
      payload['pageSize'] = '50'
    }

    mutate({ ...payload, dataFormatted: true })
  }

  useOnMountEffect(() => {
    if (Object.keys(filters).length !== 0) {
      handleSearch()
    }
  })
  return (
    <div className='grid grid-cols-12 max-sm:grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-6 grid-rows-none gap-4 m-3'>
      <TextInput
        value={filters.MemberId}
        onValueChange={(val) => setFilters('MemberId', val)}
        placeholder='Member ID'
      />
      <TextInput
        value={filters.MemberName}
        onValueChange={(val) => setFilters('MemberName', val)}
        placeholder='Member Name'
      />
      <InputSelect
        options={operators}
        value={filters.OperatorId}
        onChange={(val) => setFilters('OperatorId', val)}
        placeholder='Operator'
      />
      <InputSelect
        options={currencies}
        value={filters.CurrencyId}
        onChange={(val) => setFilters('CurrencyId', val)}
        placeholder='Currency'
      />
      <InputSelect
        options={memberAccountTypes}
        value={filters.DemoAccount ? JSON.parse(filters.DemoAccount) : undefined}
        onChange={(val) => setFilters('DemoAccount', val)}
        placeholder='Account Type'
      />
      <Button className='w-24' icon={MagnifyingGlassIcon} onClick={handleSearch}>Search</Button>
    </div>
  )
}

export default Filters
