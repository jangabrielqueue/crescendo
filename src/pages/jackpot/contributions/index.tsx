import useOnMountEffect from '@hooks/useOnMountEffect'
import { JackpotContributionsModel, useJackpotContributionListApi } from '../api'
import { Button, Divider } from '@tremor/react'
import ComplexPagination from '@components/ComplexPagination'
import { ArrowPathIcon, DocumentIcon } from '@heroicons/react/16/solid'
import { GetObjectAsCsv } from '@utils/index'
import dayjs from 'dayjs'
import useSnackbar from '@hooks/useSnackbar'
import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import { Link } from 'react-router-dom'
import { createParams } from '@utils/newMiddleware'

const defaultRequest = {
  pageIndex: 1,
  pageSize: 50
}

const ContributionKinds: Record<number, string> = {
  0: 'Init',
  1: 'Spin',
  2: 'Revert'
} as const

const styles = {
  buttonGroup: 'flex justify-center border border-color rounded-2xl overflow-hidden col-span-full',
  buttonSibblings: 'border-r border-color py-2 px-4 hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-subtle text-tremor-content dark:text-dark-tremor-content  bg-background',
  buttonDisable: 'bg-red-500 text-white dark:text-white hover:bg-red-700 dark:hover:bg-red-700 hover:text-white dark:hover:text-white',
  actionContainer: 'flex flex-col justify-center items-center gap-1',
  csvButton: 'py-2 px-4 bg-dark-tremor-background dark:bg-black text-white dark:text-white hover:text-white dark:hover:text-white',
  addButton: 'py-2 px-4 bg-dark-tremor-brand text-white dark:text-white border-color hover:bg-tremor-brand-emphasis hover:text-white dark:hover:text-white',
  refreshButton: 'py-2 px-4 bg-background hover:bg-tremor-background-subtle dark:hover:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content'
}

const JackpotContributions = () => {
  const { data, isMutating, trigger } = useJackpotContributionListApi()
  const { showError } = useSnackbar()
  const hasNoData = data?.items.length === 0

  useOnMountEffect(() => {
    trigger(defaultRequest)
  })

  const handlePageChange = (newCursor: number) => {
    trigger({
      pageIndex: newCursor,
      pageSize: 50
    })
  }

  const handleRefresh = () => {
    trigger(defaultRequest)
  }

  const handleCsv = () => {
    if (data != null) {
      GetObjectAsCsv({
        object: data.items,
        fields: [
          { label: 'Name', value: 'name' },
          { label: 'Game Name', value: 'gameName' },
          { label: 'Operators', value: 'operators' },
          { label: 'Currency', value: 'currencies' },
          { label: 'Pool', value: 'pool' },
          { label: 'Start Date', value: 'startedOnUtc' },
          { label: 'End Date', value: 'endOnUtc' },
          { label: 'Updated Date', value: 'updatedOnUtc' },
          // { label: 'Status', value: (row) => row.status === 0 ? 'Enabled' : 'Disabled' },
          { label: 'Created By', value: 'createdBy' },
          { label: 'Updated By', value: 'updatedBy' },
        ],
        fileName: `JACKPOT_(${dayjs().format('YYYYMMDD hh:mm:ss')})`
      })
    } else {
      showError(new Error('No Data Found'))
    }
  }

  const columns: Array<TableColumns<JackpotContributionsModel>> = [
    {
      headerName: 'Game Name', field: 'gameName',
      renderCell: ({ row }) => {
        const params = {
          OperatorId: row.operatorId,
          MemberName: row.operatorUserId,
          TransactionId: row.gameTransactionId
        }
        return <Link className='text-tremor-brand' to={`/gamehistory${createParams(params)}`}>{row.gameName}</Link>
      }
    },
    {
      headerName: 'Kind', field: 'kind',
      renderCell: ({ row }) => ContributionKinds[row.kind]
    },
    { headerName: 'Currency', field: 'currency' },
    { headerName: 'Exchange Rate', field: 'exchangeRate' },
    { headerName: 'Amount', field: 'amount' },
    { headerName: 'Pooled Amount(CNY)', field: 'pooledAmount' },
    { headerName: 'Jackpot Category', field: 'jackpotCategory' },
    { headerName: 'Operator Code', field: 'operatorTag' },
    {
      headerName: 'User', field: 'operatorUserId',
      renderCell: ({ row }) => {
        if (row.operatorTag === '__SYSTEM__') return row.operatorUserId
        const params = { MemberName: row.operatorUserId, pageIndex: 1, pageSize: 50 }
        return <Link className='text-tremor-brand' to={`/memberlist${createParams(params)}`}>{row.operatorUserId}</Link>
      }
    },
    { headerName: 'Created Date', field: 'createdOnUtc' },
  ]

  return (
    <div className='my-6'>
      <div className='flex justify-center'>
        <div className={styles.buttonGroup}>
          <Button
            variant='light'
            className={styles.csvButton}
            icon={DocumentIcon}
            onClick={handleCsv}
            disabled={hasNoData}
          >
            Download as CSV
          </Button>
          <Button
            variant='light'
            className={styles.refreshButton}
            onClick={handleRefresh}
            icon={ArrowPathIcon}
            loading={isMutating}
          >
            Refresh
          </Button>
        </div>
      </div>
      <Divider />
      <div className='flex gap-2 justify-end my-4'>
        <ComplexPagination onPageChange={handlePageChange} {...data} />
      </div>
      <DataTable
        loading={isMutating}
        columns={columns}
        data={data?.items || []}
      />
    </div>
  )
}

export default JackpotContributions
