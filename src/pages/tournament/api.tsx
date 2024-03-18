import useSnackbar from '@hooks/useSnackbar'
import { errorMessage } from '@utils/api'
import { GetObjectAsCsv } from '@utils/index'
import { PagedData } from '@utils/interface'
import { mutatePostFetcher } from '@utils/newMiddleware'
import useSWRMutation from 'swr/mutation'

export interface TournamentModel {
  no: number
  id: number
  operators: string
  name: string
  description: string
  startTime: string
  endTime: string
  owner: string
  status: string
  platforms: string
  total: string
}
type TournamentData = PagedData<TournamentModel[]>

const useTournamentApi = () => {
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/tournament?dataFormatted=true',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutatePostFetcher<TournamentData>)
  const { showError } = useSnackbar()

  const getCsv = (fileName: string) => {
    if (data?.items != null) {
      GetObjectAsCsv({
        object: data.items,
        fields: [
          { value: 'operators', label: 'Operator' },
          { value: 'id', label: 'ID' },
          { value: 'name', label: 'Tournament Name' },
          { value: 'startTime', label: 'Start Date' },
          { value: 'endTime', label: 'End Date' },
          { value: 'status', label: 'Status' },
          { value: 'owner', label: 'Owner' },
          { value: 'platforms', label: 'Platform' },
          { value: 'description', label: 'Description' },
        ],
        fileName
      })
    } else {
      showError(new Error('No Data Found'))
    }
  }

  return { data, isLoading: isMutating, mutate: trigger, getCsv }
}

export default useTournamentApi
