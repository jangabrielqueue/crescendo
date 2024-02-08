import { useSWRConfig } from 'swr'

const useRevalidate = () => {
  const { mutate } = useSWRConfig()
  const revalidate = (urls: string[]) => {
    urls.forEach(url => {
      mutate((key: { url: string }) => key.url === url)
    })
  }

  return { revalidate }
}

export default useRevalidate
