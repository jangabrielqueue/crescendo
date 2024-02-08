import useOnMountEffect from '@hooks/useOnMountEffect'
import useTopWinnerApi from './api'
import Filters from './Filters'
import { Divider } from '@tremor/react'

const TopWinnersTab = () => {
  const { data, mutate } = useTopWinnerApi()
  const filter = {}
  useOnMountEffect(() => {
    mutate({ ...filter, dataFormatted: true })
  })
  return (
    <>
      <Filters disableCsv />
      <Divider />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default TopWinnersTab
