import InputSelect from '@components/Form/InputSelect'
import useQueryState from '@hooks/useQueryState'
import { Button, TextInput } from '@tremor/react'
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import useOnMountEffect from '@hooks/useOnMountEffect'

const Filters = ({ mutate, loading }: { mutate: (object: object) => void, loading: boolean }) => {
  const [filters, setFilters] = useQueryState(['OperatorId', 'CurrencyId', 'DemoAccount', 'MemberId', 'MemberName', 'pageIndex', 'pageSize'])
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
    <div className='grid grid-cols-12 max-sm:grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-6 grid-rows-none gap-4 my-6'>
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
        option='operators'
        value={filters.OperatorId}
        onChange={(val) => setFilters('OperatorId', String(val))}
        placeholder='Operator'
      />
      <InputSelect
        option='currencies'
        value={filters.CurrencyId}
        onChange={(val) => setFilters('CurrencyId', String(val))}
        placeholder='Currency'
      />
      <InputSelect
        option='accountTypes'
        value={filters.DemoAccount ? JSON.parse(filters.DemoAccount) : undefined}
        onChange={(val) => setFilters('DemoAccount', String(val))}
        placeholder='Account Type'
      />
      <Button
        className='w-24'
        loading={loading}
        icon={MagnifyingGlassIcon}
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  )
}

export default Filters
