import useOnMountEffect from '@hooks/useOnMountEffect'
import useGamePerformanceApi from './api'
import Filters from './Filters'
import { Divider } from '@tremor/react'

const GamePerformanceTab = () => {
  const { data, mutate } = useGamePerformanceApi()
  const filters = {}
  useOnMountEffect(() => {
    mutate({ ...filters, dataFormatted: true })
  })
  return (
    <>
      <Filters disableCsv />
      <Divider />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default GamePerformanceTab
