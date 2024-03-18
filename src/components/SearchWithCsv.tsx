import { DocumentIcon, MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { Button } from '@tremor/react'
import { twMerge } from 'tailwind-merge'

const styles = {
  buttonSearch: 'text-tremor-brand-inverted dark:text-tremor-brand-inverted bg-tremor-brand p-2 px-4 rounded-l-full hover:text-tremor-brand-faint active:scale-105',
}
interface SearchWithCsvProps {
  onSearch: () => void
  onCsv: () => void
  disableCsv: boolean,
  className?: string
}
const SearchWithCsv = ({ onSearch, onCsv, disableCsv, className }: SearchWithCsvProps) => {
  return (
    <div className={twMerge('inline-flex rounded-full', className)}>
      <Button
        className={styles.buttonSearch}
        variant='light'
        icon={MagnifyingGlassIcon}
        onClick={onSearch}
      >
        Search
      </Button>
      <Button
        className={twMerge(styles.buttonSearch, 'bg-dark-tremor-background dark:bg-black rounded-none rounded-r-full')}
        variant='light'
        icon={DocumentIcon}
        onClick={onCsv}
        disabled={disableCsv}
      >
        Download as CSV
      </Button>
    </div>
  )
}

export default SearchWithCsv
