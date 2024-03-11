import { errorMessage } from '@utils/api'
import { mutateGetFetcherWithParams } from '@utils/cresmiddleware'
import useSWRMutation from 'swr/mutation'

export interface GameListModel {
    gameName: string
    rtp?: string | number
    isEnabled?: boolean
}

const getData = (data: string[] | undefined) => data?.map((name) => ({ gameName: name })) || []
const useGameListApi = () => {
    const { data, isMutating, trigger } = useSWRMutation({
        url: 's/games',
        errorMessage: errorMessage.DefaultRequestErrorMessage
    }, mutateGetFetcherWithParams<string[]>)

    return { data: getData(data as string[]), isLoading: isMutating, mutate: trigger }
}

export default useGameListApi
