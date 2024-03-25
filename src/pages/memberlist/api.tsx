import { errorMessage } from '@utils/api'
import { PagedData } from '@utils/interface'
import { mutateGetFetcherWithParams } from '@utils/middleware'
import useSWRMutation from 'swr/mutation'

export interface MemberListModel {
  operatorId: number
  operatorTag: string
  currencyId: number
  currency: string
  memberId: number
  memberName: string
  isDemoAccount: boolean
  lastLoginUtc: string
  createdOnUtc: string
}
type MemberListData = PagedData<MemberListModel[]>

const useMembersApi = () => {
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/members/memberlist',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<MemberListData>)

  return { data, isLoading: isMutating, mutate: trigger }
}

export default useMembersApi
