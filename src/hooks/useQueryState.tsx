import { isNullOrWhiteSpace } from '@utils/index'
import { useSearchParams } from 'react-router-dom'

export type QueryData<T extends string> = {
  [Property in T]: string
}

const useQueryState = <T extends string,>(names: readonly T[]): [QueryData<T>, (name: T, value: string | undefined) => void] => {
  const [query, setQuery] = useSearchParams()

  const handleSetter = (name: T, value: string | undefined) => {
    setQuery(prev => {
      prev.delete(name)
      if (value != null) {
        prev.append(name, value)
      }
      return prev
    })
  }

  const data = names.reduce((prev, curr) => {
    const value = query.get(curr)

    if (!isNullOrWhiteSpace(value)) {
      return {
        ...prev,
        [curr]: value
      }
    }
    return prev
  }, {} as QueryData<T>)

  return [data, handleSetter]
}

export default useQueryState
