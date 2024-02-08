import useOnMountEffect from '@hooks/useOnMountEffect'
import useWinLoseApi from './api'

const WinLoseTab = () => {
  const { data, mutate } = useWinLoseApi()

  useOnMountEffect(() => {
    mutate()
  })
  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  )
}

export default WinLoseTab
