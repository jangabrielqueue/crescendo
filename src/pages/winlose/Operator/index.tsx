import useOnMountEffect from '@hooks/useOnMountEffect'
import useOperatorApi from './api'

const OperatorTab = () => {
  const { data, mutate } = useOperatorApi()
  useOnMountEffect(() => {
    mutate()
  })
  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  )
}

export default OperatorTab
