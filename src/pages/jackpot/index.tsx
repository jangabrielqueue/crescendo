import useOnMountEffect from '@hooks/useOnMountEffect'
import { useJackpotListApi, JackpotDataModel, PutDisableJackpot, PutEnableJackpot } from './api'
import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import PoolTable from './PoolTable'
import dayjs from 'dayjs'
import { Button, Divider, Text } from '@tremor/react'
import { twMerge } from 'tailwind-merge'
import { GetObjectAsCsv, twExclude } from '@utils/index'
import { useNavigate } from 'react-router-dom'
import ComplexPagination from '@components/ComplexPagination'
import { ArrowPathIcon, DocumentIcon } from '@heroicons/react/16/solid'
import useSnackbar from '@hooks/useSnackbar'
import AddEditComponent from './AddEditComponent'
import useModal from '@hooks/useModal'
import ResetComponent from './ResetComponent'

const styles = {
  buttonGroup: 'flex justify-center border border-color rounded-2xl overflow-hidden col-span-full',
  buttonSibblings: 'border-r border-color py-2 px-4 hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-subtle text-tremor-content dark:text-dark-tremor-content  bg-background',
  buttonDisable: 'bg-red-500 text-white dark:text-white hover:bg-red-700 dark:hover:bg-red-700 hover:text-white dark:hover:text-white',
  actionContainer: 'flex flex-col justify-center items-center gap-1',
  csvButton: 'py-2 px-4 bg-dark-tremor-background dark:bg-black text-white dark:text-white hover:text-white dark:hover:text-white',
  addButton: 'py-2 px-4 bg-dark-tremor-brand text-white dark:text-white border-color hover:bg-tremor-brand-emphasis hover:text-white dark:hover:text-white',
  refreshButton: 'py-2 px-4 bg-background hover:bg-tremor-background-subtle dark:hover:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content'
}

const defaultRequest = {
  pageSize: 50,
  pageIndex: 1
}

const exapandedDataColumns: Array<TableColumns<JackpotDataModel>> = [
  {
    headerName: 'Operators', field: 'eligibleOperators',
    renderCell: ({ row }) => {
      return (
        <div className='flex justify-center'>
          <div className='flex justify-center flex-wrap gap-2 max-w-xs'>
            {row.eligibleOperators.map((operator, idx) => <span key={idx}>{operator}</span>)}
          </div>
        </div>
      )
    }
  },
  {
    headerName: 'Currencies', field: 'eligibleCurrencies',
    cellClassName: 'max-w-96',
    renderCell: ({ row }) => {
      return (
        <div className='flex justify-center'>
          <div className='flex justify-center flex-wrap gap-2 max-w-xs'>
            {row.eligibleCurrencies.map((currency, idx) => <span key={idx}>{currency}</span>)}
          </div>
        </div>
      )
    }
  },
  {
    headerName: 'Banned Players', field: 'bannedPlayers',
    cellClassName: 'justify-center',
    renderCell: ({ row }) => {
      return (
        <div className='flex justify-center'>
          <div className='flex justify-center flex-wrap gap-2 max-w-xs'>
            {row.bannedPlayers.map((players, idx) => <span key={idx}>{players}</span>)}
          </div>
        </div>
      )
    }
  }
]
const Jackpot = () => {
  // const [detail, setDetail] = useState<Partial<JackpotDataModel>>()
  const { data, trigger, isMutating } = useJackpotListApi()
  const { showError } = useSnackbar()
  const navigate = useNavigate()
  const { setModal, closeModal } = useModal()

  useOnMountEffect(() => {
    trigger(defaultRequest)
  })

  const columns: Array<TableColumns<JackpotDataModel>> = [
    'EXPANDER',
    { headerName: 'Name', field: 'name' },
    { headerName: 'Game Name', field: 'gameName' },
    {
      headerName: 'Pool', field: 'pool', headerClassName: 'text-center',
      renderCell: ({ row }) => <PoolTable data={row.pool} />
    },
    {
      headerName: 'Start Date/End Date', field: 'startedOnUtc',
      renderCell: ({ row }) => (
        <div className='flex flex-col'>
          {row.startedOnUtc && <Text><span className='font-semibold'>Start:</span> {dayjs(row.startedOnUtc).format('MM/DD/YYYY HH:mm')}</Text>}
          {row.endOnUtc && <Text><span className='font-semibold'>End:</span> {dayjs(row.endOnUtc).format('MM/DD/YYYY HH:mm')}</Text>}
        </div>
      )
    },
    {
      headerName: 'Status', field: 'status',
      renderCell: ({ row }) => row.status === 0 ? 'Enabled' : 'Disabled'
    },
    { headerName: 'Created By', field: 'createdBy' },
    { headerName: 'Updated By', field: 'updatedBy' },
    {
      headerName: 'Action', field: 'action',
      renderCell: ({ row }) => {
        const isEnabled = row.status === 0
        return (
          <div className={styles.actionContainer}>
            <div className={styles.buttonGroup}>
              <Button
                variant='light'
                className={styles.buttonSibblings}
                onClick={() => navigate(`/jackpot/contributions?id=${row.id}`)}
              >
                Contributions
              </Button>
              <Button
                variant='light'
                className={twExclude(styles.buttonSibblings, ['border-r'])}
                onClick={() => navigate(`/jackpot/winners?id=${row.id}`)}
              >
                Winers
              </Button>
            </div>
            <div className={styles.buttonGroup}>
              <Button variant='light' className={styles.buttonSibblings} onClick={() => handleEdit(row)}>Edit</Button>
              <Button variant='light' className={styles.buttonSibblings} onClick={() => handleResetButton(row.id, row.gameId)}>Reset</Button>
              <Button
                variant='light'
                className={twMerge(twExclude(styles.buttonSibblings, ['border-r']), isEnabled ? styles.buttonDisable : '')}
                onClick={() => handleDisableEnableButton(row.id, isEnabled)}
              >
                {isEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        )
      }
    },
  ]

  const handleEdit = (row: JackpotDataModel) => {
    setModal({
      title: 'Edit Jackpot',
      body: () => (
        <AddEditComponent
          onCancel={closeModal}
          detail={row}
          onSearch={() => trigger(defaultRequest)}
        />
      )
    })
  }

  const handleResetButton = (id: string, gameId: string) => {
    setModal({
      body: () => (
        <ResetComponent
          id={id}
          gameId={gameId}
          onSearch={() => trigger(defaultRequest)}
        />
      ),
      title: `Reset ${id}`
    })
  }

  const handleDisableEnableButton = async (id: string, isEnabled: boolean) => {
    try {
      isEnabled ? await PutDisableJackpot({ id }) : await PutEnableJackpot({ id })
      trigger(defaultRequest)
    } catch (e) {
      showError(e)
    }
  }

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
          { label: 'Status', value: (row) => row.status === 0 ? 'Enabled' : 'Disabled' },
          { label: 'Created By', value: 'createdBy' },
          { label: 'Updated By', value: 'updatedBy' },
        ],
        fileName: `JACKPOT_(${dayjs().format('YYYYMMDD hh:mm:ss')})`
      })
    } else {
      showError(new Error('No Data Found'))
    }
  }

  const handleAdd = () => {
    setModal({
      title: 'Add Jackpot',
      body: () => (
        <AddEditComponent
          detail={{}}
          onCancel={closeModal}
          onSearch={() => trigger({ pageIndex: 1, pageSize: 50 })}
        />
      )
    })
  }

  return (
    <>
      <div className='my-6'>
        <div className='flex justify-center'>
          <div className={styles.buttonGroup}>
            <Button
              variant='light'
              className={styles.csvButton}
              icon={DocumentIcon}
              onClick={handleCsv}
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
            <Button
              variant='light'
              className={styles.addButton}
              onClick={handleAdd}
            >
              Add
            </Button>
          </div>
        </div>
        <Divider />
        <div className='flex gap-2 justify-end my-4'>
          <ComplexPagination onPageChange={handlePageChange} {...data} />
        </div>
        <DataTable
          data={data?.items || []}
          columns={columns}
          loading={isMutating}
          headerCellsClassName='sticky top-0 z-10 border-color border-b bg-background'
          tableClassName='max-h-[80vh] overflow-auto'
          expandable={{
            render({ records }) {
              return (
                <div className='py-6 px-10 border-b border-color bg-tremor-background-muted dark:bg-dark-tremor-background-muted'>
                  <DataTable
                    tableClassName='bg-tremor-background dark:bg-dark-tremor-background'
                    headerCellsClassName='border-color border-b text-center'
                    data={[records]}
                    columns={exapandedDataColumns}
                  />
                </div>
              )
            },
            expandOnRowClick: true
          }}
        />
      </div>
    </>
  )
}

export default Jackpot
