import { isNullOrWhiteSpace } from '@utils/index'
import { useSearchParams } from 'react-router-dom'

type Data<T extends string> = {
  [Property in T]: string
}

const useQueryState = <T extends string,>(names: T[]): [Data<T>, (name: T, value: string | undefined) => void] => {
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

  const data = names.reduce((prev: Data<T>, curr): Data<T> => {
    const value = query.get(curr)

    if (!isNullOrWhiteSpace(value)) {
      return {
        ...prev,
        [curr]: value
      }
    }
    return prev
  }, {} as Data<T>)

  return [data, handleSetter]
}

export default useQueryState
