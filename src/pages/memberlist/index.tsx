import DataTable from '@components/DataTable'
import Filters from './components/Filters'
import useMembersApi, { MemberListModel } from './api'
import { TableColumns } from '@components/DataTable/interface'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '@tremor/react'
import { ChartBarIcon, ClipboardDocumentListIcon } from '@heroicons/react/16/solid'
dayjs.extend(relativeTime)

const MemberList = () => {
  const { data, isLoading, mutate } = useMembersApi()
  const navigate = useNavigate()


  const columns: Array<TableColumns<MemberListModel>> = [
    { headerName: 'Member ID', field: 'memberId' },
    { headerName: 'Operator', field: 'operatorTag' },
    { headerName: 'Member Name', field: 'memberName' },
    { headerName: 'Currency', field: 'currency' },
    {
      headerName: 'Account Type', field: 'isDemoAccount',
      renderCell: ({ row }) => (
        row.isDemoAccount ? 'Demo' : 'Real'
      )
    },
    { headerName: 'Created Date', field: 'createdOnUtc' },
    {
      headerName: 'Last Login', field: 'lastLoginUtc',
      renderCell: ({ row }) => (
        row.lastLoginUtc ? dayjs(row.lastLoginUtc).fromNow() : 'Login Never'
      )
    },
    {
      headerName: 'Options',
      field: 'action',
      renderCell: ({ row }) => {
        const startDate = dayjs().subtract(1, 'day').toISOString()
        const endDate = dayjs()
        return (
          <div className='flex gap-2 justify-center'>
            <Button
              variant='light'
              icon={ClipboardDocumentListIcon}
              size='xs'
              onClick={() => navigate(`/gamehistory?OperatorId=${row.operatorId}&MemberName=${row.memberName}&StartDate=${startDate}&EndDate=${endDate}`)}
            >
              History
            </Button>
            <Button
              variant='light'
              icon={ChartBarIcon}
              size='xs'
              onClick={() => navigate(`/winlose?OperatorId=${row.operatorId}&MemberName=${row.memberName}&StartDate=${startDate}&EndDate=${endDate}&top=10`)}
            >
              Report
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <>
      <Filters mutate={mutate} />
      <div className='m-2'>
        <Card>
          <DataTable
            columns={columns}
            loading={isLoading}
            data={data?.items ?? []}
          />
        </Card>
      </div>

    </>
  )
}

export default MemberList
