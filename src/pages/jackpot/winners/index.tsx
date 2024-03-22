import useOnMountEffect from '@hooks/useOnMountEffect'
import { JackpotWinningRecordModel, PostJackpotApprove, PostJackpotPayout, PostJackpotReject, PostJackpotVerify, TimelineData, useJackpotWinningRecordsListApi } from '../api'
import { Button, Divider } from '@tremor/react'
import ComplexPagination from '@components/ComplexPagination'
import { ArrowPathIcon, DocumentIcon } from '@heroicons/react/16/solid'
import { GetObjectAsCsv, checkObjectKeys } from '@utils/index'
import dayjs from 'dayjs'
import useSnackbar from '@hooks/useSnackbar'
import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import { Link } from 'react-router-dom'
import { createParams } from '@utils/newMiddleware'
import useModal from '@hooks/useModal'
import RejectModal from './RejectModal'

const defaultRequest = {
  pageIndex: 1,
  pageSize: 50
}

const StatusEnum: Record<number, [string, string]> = {
  0: ['Pending', 'Pending on review'],
  1: ['Verified', 'Done the review and validation, waiting for approval'],
  2: ['Approved', 'Winning is approved and waiting for payment'],
  3: ['FailedOnPayment', 'The payment is failed'],
  4: ['Paid', 'The winning prize is paid to the user'],
  5: ['Rejected', 'Winning is rejected, the prize is returned to the pool'],
  6: ['Completed', 'Process is completed and should be consolidated to win/loss report'],
} as const

const actionStatusEnum: Record<number, [string, (id: string) => Promise<unknown>]> = {
  0: ['Verify', PostJackpotVerify],
  1: ['Approve', PostJackpotApprove],
  2: ['Payout', PostJackpotPayout],
  6: ['Reject', PostJackpotReject]
} as const

const styles = {
  buttonGroup: 'flex justify-center border border-color rounded-2xl overflow-hidden col-span-full',
  buttonSibblings: 'border-r border-color py-2 px-4 hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-subtle text-tremor-content dark:text-dark-tremor-content  bg-background',
  withSummary: 'text-tremor-default text-tremor-content dark:text-dark-tremor-content',
  summary: 'text-tremor-label text-tremor-content-subtle dark:text-dark-tremor-content-subtle',
  csvButton: 'py-2 px-4 bg-dark-tremor-background dark:bg-black text-white dark:text-white hover:text-white dark:hover:text-white',
  refreshButton: 'py-2 px-4 bg-background hover:bg-tremor-background-subtle dark:hover:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content'
}

const JackpotWinners = () => {
  const { data, isMutating, trigger } = useJackpotWinningRecordsListApi()
  const { showError } = useSnackbar()
  const { setModal } = useModal()
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
          { label: 'Game Name', value: 'gameName' },
          { label: 'Winning Amount', value: 'winningAmount' },
          { label: 'Jackpot Category', value: 'jackpotCategory' },
          { label: 'Operator Code', value: 'operatorTag' },
          { label: 'Status', value: (row) => StatusEnum[row.status][0] },
          { label: 'User', value: 'operatorUserId' },
          { label: 'Created Date', value: 'createdOnUtc' },
          { label: 'Verified By', value: 'reviewBy' },
          { label: 'Verified Date', value: 'reviewDate' },
          { label: 'Updated By', value: 'updatedBy' },
          { label: 'Updated Date', value: 'updatedOnUtc' },
        ],
        fileName: `JACKPOT_(${dayjs().format('YYYYMMDD hh:mm:ss')})`
      })
    } else {
      showError(new Error('No Data Found'))
    }
  }

  const handleActionButton = async (id: string, status: number) => {
    if (checkObjectKeys(actionStatusEnum, status)) {
      try {
        await actionStatusEnum[status][1](id)
        trigger(defaultRequest)
      } catch (e) {
        showError(e)
      }
    }
  }

  const handleReject = (id: string) => {
    setModal({
      body: () => (
        <RejectModal
          {...{ id, trigger }}
        />
      ),
      title: `Reject - ${id}`
    })
  }

  const columns: Array<TableColumns<JackpotWinningRecordModel>> = [
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
      headerName: 'Winning Amount', field: 'winningAmount',
      renderCell: ({ row }) => (
        <div className={styles.withSummary}>
          <p><b >{row.currency}</b> {(row.winningAmount / row.exchangeRate).toFixed(2)}</p>
          <p className={styles.summary}>CNY: {row.winningAmount}, rate: {row.exchangeRate}</p>
        </div>
      )
    },
    { headerName: 'Jackpot Category', field: 'jackpotCategory' },
    { headerName: 'Operator Code', field: 'operatorTag' },
    {
      headerName: 'Status', field: 'status', headerClassName: 'text-center',
      renderCell: ({ row }) => (
        <div className={styles.withSummary + ' text-center'}>
          <p>{StatusEnum[row.status][0]}</p>
          <p className={styles.summary}>{StatusEnum[row.status][1]}</p>
        </div>
      )
    },
    {
      headerName: 'User', field: 'operatorUserId',
      renderCell: ({ row }) => {
        const params = {
          MemberName: row.operatorUserId,
          pageIndex: 1,
          pageSize: 50
        }
        return <Link className='text-tremor-brand' to={`/memberlist${createParams(params)}`}>{row.operatorUserId}</Link>
      }
    },
    { headerName: 'Created Date', field: 'createdOnUtc' },
    {
      headerName: 'Verified By', field: 'reviewBy', headerClassName: 'text-center',
      renderCell: ({ row }) => (
        <div className={styles.withSummary + ' text-center'} hidden={!(row.reviewBy && row.reviewOnUtc)}>
          <p>{row.reviewBy}</p>
          <p className={styles.summary}>{row.reviewOnUtc}</p>
        </div>
      )
    },
    {
      headerName: 'Update By', field: 'updateBy', headerClassName: 'text-center',
      renderCell: ({ row }) => (
        <div className={styles.withSummary + ' text-center'} hidden={!(row.updateBy && row.updateOnUtc)}>
          <p>{row.updateBy}</p>
          <p className={styles.summary}>{row.updateOnUtc}</p>
        </div>
      )
    },
    {
      headerName: 'Actions', field: 'action',
      renderCell: ({ row, expander }) => {
        return (
          <div className='flex gap-1 justify-center'>
            {[0, 1, 2].includes(row.status) &&
              <Button
                size='xs'
                onClick={() => handleActionButton(row.id, row.status)}>
                {checkObjectKeys(actionStatusEnum, row.status) && actionStatusEnum[row.status][0]}
              </Button>
            }
            {row.status !== 6 &&
              <Button
                color='red'
                size='xs'
                onClick={() => handleReject(row.id)}
              >
                Reject
              </Button>
            }
            <Button variant='secondary' size='xs' onClick={expander}>Timeline</Button>
          </div>
        )
      }
    },
  ]

  const timelineColumns: Array<TableColumns<TimelineData>> = [
    { headerName: 'Event Type', field: 'eventType' },
    { headerName: 'Event By', field: 'eventBy' },
    { headerName: 'Event Date', field: 'eventOnUtc' },
    { headerName: 'Remarks', field: 'remarks' },
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
        columns={columns}
        loading={isMutating}
        data={data?.items || []}
        expandable={{
          render({ records }) {
            return (
              <div className='bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle p-6'>
                <DataTable
                  tableClassName='bg-background'
                  data={records.timelines}
                  columns={timelineColumns}
                />
              </div>
            )
          },
        }}
      />
    </div>
  )
}

export default JackpotWinners
