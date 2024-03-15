import useTopWinnerApi, { TopWinnersModel } from './api'
import Filters from './Filters'
import { Button, Divider, Icon, TableCell, TableRow } from '@tremor/react'
import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import { CsvFields, GetObjectAsCsv } from '@utils/index'
import useSnackbar from '@hooks/useSnackbar'
import ExpandedDetail from '../components/ExpandedDetail'
import { useContext, useState } from 'react'
import { WinLoseContext } from '../context'
import dayjs from 'dayjs'
import { PuzzlePieceIcon, Square2StackIcon, Squares2X2Icon, StopIcon } from '@heroicons/react/16/solid'

interface DetailModel {
  game: string
  userId: number
  operator: string
  currency: string
  noOfTransaction: number
  noOfSpin: number
  avgBet: number
  totalBet: number
  totalNetWin: number
  companyWLPercentage: number
  date: string
  week: string
  year: string
  month: string
}

const styles = {
  headerCell: 'text-center border-b text-tremor-content-strong dark:text-dark-tremor-content-strong font-bold border-color',
  cellRightDivider: 'border-r border-color'
}

const PartialDetailColumns: Array<TableColumns<DetailModel>> = [
  { headerName: 'Operator', field: 'operator' },
  { headerName: 'CCY', field: 'currency' },
  { headerName: 'Total TXN', field: 'noOfTransaction' },
  { headerName: '# of Spin ', field: 'noOfSpin' },
  { headerName: 'Avg Bet [RMB]', field: 'avgBet' },
  { headerName: 'Total Bet [RMB]', field: 'totalBet' },
  { headerName: 'Win/Lose Amount [RMB]', field: 'totalNetWin' },
  { headerName: 'Win Lose %', field: 'companyWLPercentage' },
]

const detailFormats = ['Game', 'Daily', 'Weekly', 'Monthly'] as const

const detailColumns: Record<typeof detailFormats[number], Array<TableColumns<DetailModel>>> = {
  Game: [{ headerName: 'Game', field: 'game' }, ...PartialDetailColumns],
  Daily: [{ headerName: 'Date', field: 'date' }, ...PartialDetailColumns],
  Weekly: [{ headerName: 'Date', field: 'week', renderCell: ({ row }) => `${row.week}-${row.year}` }, ...PartialDetailColumns],
  Monthly: [{ headerName: 'Date', field: 'week', renderCell: ({ row }) => `${row.month ? dayjs(row.month, 'M').format('MMMM') : ''}-${row.year}` }, ...PartialDetailColumns]
}
const gameCsvFistColumn: Record<typeof detailFormats[number], CsvFields<DetailModel>[]> = {
  Game: [{ label: 'Game', value: 'game' }],
  Daily: [{ label: 'Date', value: 'date' }],
  Weekly: [{ label: 'Date', value: (row) => `${row.week}-${row.year}` }],
  Monthly: [{ label: 'Date', value: (row) => `${dayjs(row.month, 'M').format('MMMM')}-${row.year}` }],
}
const detailCsv = (format: typeof detailFormats[number]): CsvFields<DetailModel>[] => {
  return [
    ...gameCsvFistColumn[format],
    { label: 'Operator', value: 'operator' },
    { label: 'CCY', value: 'currency' },
    { label: 'Total TXN', value: 'noOfTransaction' },
    { label: '# of Spin', value: 'noOfSpin' },
    { label: 'Avg Bet [RMB]', value: 'avgBet' },
    { label: 'Total Bet [RMB]', value: 'totalBet' },
    { label: 'Win/Lose Amount [RMB]', value: 'totalNetWin' },
    { label: 'Win Lose %', value: 'companyWLPercentage' },
  ]
}

const ExtraHeaders = () => (
  <TableRow>
    <TableCell className={styles.headerCell + ' border-r'} colSpan={3}></TableCell>
    <TableCell className={styles.headerCell + ' border-r'} colSpan={6}>Period</TableCell>
    <TableCell className={styles.headerCell + ' border-r'} colSpan={6}>All Time</TableCell>
    <TableCell className={styles.headerCell} colSpan={2}></TableCell>
  </TableRow>
)

const TopWinnersTab = () => {
  const [detailFormat, setDetailFormat] = useState<Record<number, typeof detailFormats[number] | null>>({})
  const { data, mutate, isLoading } = useTopWinnerApi()
  const { showError } = useSnackbar()
  const hasNoData = data == null || data.value?.length === 0
  const [filters] = useContext(WinLoseContext)

  const columns: Array<TableColumns<TopWinnersModel>> = [
    { headerName: 'CCY', field: 'currency' },
    { headerName: 'Member', field: 'name' },
    { headerName: 'Operator', field: 'operator', cellClassName: styles.cellRightDivider, headerClassName: styles.cellRightDivider },
    { headerName: 'Total TXN', field: 'noOfTransaction' },
    { headerName: '# of Spin', field: 'noOfSpin' },
    { headerName: 'Avg Bet [RMB]', field: 'avgBet' },
    { headerName: 'Total Bet [RMB]', field: 'totalBet' },
    { headerName: 'Win/Lose Amount [RMB]', field: 'totalNetWin' },
    { headerName: 'Win Lose %', field: 'companyWLPercentage', cellClassName: styles.cellRightDivider, headerClassName: styles.cellRightDivider },
    { headerName: 'Total TXN', field: 'allTimeNoOfTransaction' },
    { headerName: '# of Spin', field: 'allTimeNoOfSpin' },
    { headerName: 'Avg Bet [RMB]', field: 'allTimeAvgBet' },
    { headerName: 'Total Bet [RMB]', field: 'allTimeTotalBet' },
    { headerName: 'Win/Lose Amount [RMB]', field: 'allTimeTotalNetWin' },
    { headerName: 'Win Lose %', field: 'allTimeCompanyWLPercentage', cellClassName: styles.cellRightDivider, headerClassName: styles.cellRightDivider },
    { headerName: 'Join Date', field: 'joinDate' },
    {
      headerName: 'View Details',
      field: 'action',
      renderCell: ({ isExpanded, expander, index }) => {
        const handleExpand = (format: typeof detailFormats[number]) => {
          setDetailFormat(prev => ({ ...prev, [index]: format }))
          !isExpanded && expander()
        }
        return (
          <div className='flex gap-1'>
            <Button tooltip='Game' size='xs' onClick={() => handleExpand('Game')} variant='light'>
              <Icon variant={detailFormat[index] === 'Game' ? 'solid' : 'light'} icon={PuzzlePieceIcon} />
            </Button>
            <Button tooltip='Daily' size='xs' onClick={() => handleExpand('Daily')} variant='light'>
              <Icon variant={detailFormat[index] === 'Daily' ? 'solid' : 'light'} icon={StopIcon} />
            </Button>
            <Button tooltip='Weekly' size='xs' onClick={() => handleExpand('Weekly')} variant='light'>
              <Icon variant={detailFormat[index] === 'Weekly' ? 'solid' : 'light'} icon={Square2StackIcon} />
            </Button>
            <Button tooltip='Monthly' size='xs' onClick={() => handleExpand('Monthly')} variant='light'>
              <Icon variant={detailFormat[index] === 'Monthly' ? 'solid' : 'light'} icon={Squares2X2Icon} />
            </Button>
          </div>
        )
      }
    }
  ]

  const getCsv = (fileName: string) => {
    if (data?.value != null) {
      GetObjectAsCsv({
        object: data.value,
        fields: [
          { label: 'CCY', value: 'currency' },
          { label: 'Member', value: 'name' },
          { label: 'Operator', value: 'operator' },
          { label: 'Total TXN', value: 'noOfTransaction' },
          { label: '# of Spin', value: 'noOfSpin' },
          { label: 'Avg Bet [RMB]', value: 'avgBet' },
          { label: 'Total Bet [RMB]', value: 'totalBet' },
          { label: 'Win/Lose Amount [RMB]', value: 'totalNetWin' },
          { label: 'Win Lose %', value: 'companyWLPercentage' },
          { label: 'Total TXN', value: 'allTimeNoOfTransaction' },
          { label: '# of Spin', value: 'allTimeNoOfSpin' },
          { label: 'Avg Bet [RMB]', value: 'allTimeAvgBet' },
          { label: 'Total Bet [RMB]', value: 'allTimeTotalBet' },
          { label: 'Win/Lose Amount [RMB]', value: 'allTimeTotalNetWin' },
          { label: 'Win Lose %', value: 'allTimeCompanyWLPercentage' },
          { label: 'Join Date', value: 'joinDate' }
        ],
        fileName
      })
    } else {
      showError(new Error('No Data Found'))
    }
  }

  return (
    <>
      <Filters
        disableCsv={hasNoData}
        getCsv={getCsv}
        search={(arg) => {
          mutate(arg)
          setDetailFormat({})
        }}
      />
      <Divider />
      <DataTable
        loading={isLoading}
        data={data?.value || []}
        columns={columns}
        ExtraHeaders={ExtraHeaders}
        headerCellsClassName={`${styles.headerCell} font-semibold`}
        expandable={{
          render({ records, expander, index }) {
            const format = detailFormat[index]
            if (format == null) return <></>
            return (
              <ExpandedDetail
                url='/topwinners/details'
                columns={detailColumns[format]}
                getText={(params) => `${records.name} - ${params.format} Detail`}
                csvFields={detailCsv(format)}
                getFileName={(params) => `Top Winners Report-${records.name}(${params.format}-${dayjs(params.startDate).format('YYYYMMDD')}-${dayjs(params.endDate).format('YYYYMMDD')})`}
                expander={() => {
                  expander()
                  setDetailFormat(prev => ({ ...prev, [index]: null }))
                }}
                filterParams={{
                  startDate: filters.startDate,
                  endDate: filters.endDate,
                }}
                params={{
                  detailFormatted: true,
                  userId: records.userId,
                  format
                }}
              />
            )
          },
        }}
      />
    </>
  )
}

export default TopWinnersTab
