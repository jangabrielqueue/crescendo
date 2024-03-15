import useGamePerformanceApi, { GamePerformanceModel } from './api'
import Filters from './Filters'
import { Button, Divider, Icon } from '@tremor/react'
import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import { CsvFields, GetObjectAsCsv } from '@utils/index'
import useSnackbar from '@hooks/useSnackbar'
import ExpandedDetail from '../components/ExpandedDetail'
import dayjs from 'dayjs'
import { useContext, useState } from 'react'
import { WinLoseContext } from '../context'
import { CurrencyDollarIcon, Square2StackIcon, Squares2X2Icon, StopIcon, UsersIcon } from '@heroicons/react/16/solid'

interface DetailModel {
  date: string
  week: number
  year: number
  month: number
  noOfPlayer: number
  noOfSpin: number
  avgBetRmb: number
  noOfTransaction: number
  totalBetRmb: number
  totalWinRmb: number
  gameIncomeRmb: number
  gamePayoutPer: number
  rowNumber: number
  memberName: string
  currencyId: number
  currency: string
  operatorId: number
  operator: string
  gameId: number
  game: string
  totalBet: number
  totalWin: number
  gameIncome: number
}

const PartialDetailColumns: Array<TableColumns<DetailModel>> = [
  { headerName: 'Member Count', field: 'noOfPlayer' },
  { headerName: 'Total TXN', field: 'noOfTransaction' },
  { headerName: '# of Spin ', field: 'noOfSpin' },
  { headerName: 'Avg Bet [RMB]', field: 'avgBetRmb' },
  { headerName: 'Total Bet [RMB]', field: 'totalBetRmb' },
  { headerName: 'Game Income [RMB]', field: 'gameIncomeRmb' },
  { headerName: 'Win Lose %', field: 'gamePayoutPer' },
]

const membersColumn: Array<TableColumns<DetailModel>> = [
  { headerName: '#', field: 'game', renderCell: ({ index }) => index },
  { headerName: 'Member Name', field: 'memberName' },
  { headerName: 'Operator', field: 'operator' },
  { headerName: 'CCY', field: 'currency' },
  { headerName: 'Total TXN', field: 'noOfTransaction' },
  { headerName: 'Total Bet [F]', field: 'totalBet' },
  { headerName: 'Total Payout [F]', field: 'totalWin' },
  { headerName: 'Game Income [F]', field: 'gameIncome' },
  { headerName: 'Total Bet [RMB]', field: 'totalBetRmb' },
  { headerName: 'Total Payout [RMB]', field: 'totalWinRmb' },
  { headerName: 'Game Income [RMB]', field: 'gameIncomeRmb' },
  { headerName: 'Win Lose %', field: 'gamePayoutPer' },
]

const detailFormats = ['Currency', 'Daily', 'Weekly', 'Monthly', 'Member'] as const

const detailColumns: Record<typeof detailFormats[number], Array<TableColumns<DetailModel>>> = {
  Currency: [{ headerName: 'CCY', field: 'currency' }, ...PartialDetailColumns],
  Daily: [{ headerName: 'Date', field: 'date' }, ...PartialDetailColumns],
  Weekly: [{ headerName: 'Weekly', field: 'week', renderCell: ({ row }) => `${row.week}-${row.year}` }, ...PartialDetailColumns],
  Monthly: [{ headerName: 'Monthly', field: 'month', renderCell: ({ row }) => `${dayjs(row.month, 'M')}-${row.year}` }, ...PartialDetailColumns],
  Member: membersColumn
}

const gameCsvFistColumn: Record<Exclude<typeof detailFormats[number], 'Member'>, CsvFields<DetailModel>[]> = {
  Currency: [{ label: 'Currency', value: 'currency' }],
  Daily: [{ label: 'Date', value: 'date' }],
  Weekly: [{ label: 'Date', value: (row) => `${row.week}-${row.year}` }],
  Monthly: [{ label: 'Date', value: (row) => `${dayjs(row.month, 'M').format('MMMM')}-${row.year}` }],
}

const detailCsv = (format: typeof detailFormats[number]): CsvFields<DetailModel>[] => {
  if (format === 'Member') {
    return [
      { label: 'Member', value: 'memberName' },
      { label: 'Merchant', value: 'operator' },
      { label: 'Currency', value: 'currency' },
      { label: '# of TXN', value: 'noOfTransaction' },
      { label: 'Total Bet', value: 'totalBet' },
      { label: 'Total Win', value: 'totalWin' },
      { label: 'Game Income', value: 'gameIncome' },
      { label: 'Total Bet (CNY)', value: 'totalBetRmb' },
      { label: 'Total Win (CNY)', value: 'totalWinRmb' },
      { label: 'Game Income (CNY)', value: 'gameIncomeRmb' },
      { label: 'RTP', value: 'gamePayoutPer' },
    ]
  }
  return [
    ...gameCsvFistColumn[format],
    { label: 'Total # of Members', value: 'noOfPlayer' },
    { label: 'Total TXN', value: 'noOfTransaction' },
    { label: '# of Spin', value: 'noOfSpin' },
    { label: 'Avg Bet (CNY)', value: 'avgBetRmb' },
    { label: 'Total Bet [CNY]', value: 'totalBetRmb' },
    { label: 'Total Win [CNY]', value: 'totalWinRmb' },
    { label: 'Game Income [CNY]', value: 'gameIncomeRmb' },
    { label: 'RTP', value: 'gamePayoutPer' },
  ]
}

const footer = (data: GamePerformanceModel[] | undefined): { [key in keyof GamePerformanceModel]?: number | undefined } | undefined => {
  if (data == null || data.length === 0) return undefined
  const total = data.reduce((acc, curr) => {
    const totalBetRmb = acc.totalBetRmb + Number(curr.totalBetRmb)
    const totalWinRmb = acc.totalWinRmb + Number(curr.totalWinRmb)
    return {
      noOfPlayer: acc.noOfPlayer + Number(curr.noOfPlayer),
      noOfTransaction: acc.noOfTransaction + Number(curr.noOfTransaction),
      noOfSpin: acc.noOfSpin + Number(curr.noOfSpin),
      avgBetRmb: acc.avgBetRmb + Number(curr.avgBetRmb),
      totalBetRmb,
      totalWinRmb,
      gameIncomeRmb: acc.gameIncomeRmb + Number(curr.gameIncomeRmb),
    }
  }, { noOfPlayer: 0, noOfTransaction: 0, noOfSpin: 0, avgBetRmb: 0, totalBetRmb: 0, totalWinRmb: 0, gameIncomeRmb: 0 })

  const gamePayoutPer = total.totalBetRmb != 0 ? ((Number(total.totalWinRmb) / Number(total.totalBetRmb)) * 100) : 1

  return {
    ...total,
    gamePayoutPer
  }
}

const GamePerformanceTab = () => {
  const [detailFormat, setDetailFormat] = useState<Record<number, typeof detailFormats[number] | null>>({})
  const [filters] = useContext(WinLoseContext)
  const { data, mutate, isLoading } = useGamePerformanceApi()
  const { showError } = useSnackbar()
  const hasNoData = data == null || data.value?.length === 0

  const columns: Array<TableColumns<GamePerformanceModel>> = [
    { headerName: 'Game', field: 'game' },
    { headerName: 'Member Count', field: 'noOfPlayer' },
    { headerName: 'Total Txn', field: 'noOfTransaction' },
    { headerName: '# of Spin', field: 'noOfSpin' },
    { headerName: 'Avg Bet [RMB]', field: 'avgBetRmb' },
    { headerName: 'Total Bet [RMB]', field: 'totalBetRmb' },
    { headerName: 'Total Payout [RMB]', field: 'totalWinRmb' },
    { headerName: 'Game Income [RMB]', field: 'gameIncomeRmb' },
    { headerName: 'Win Lose %', field: 'gamePayoutPer' },
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
            <Button tooltip='Daily' size='xs' onClick={() => handleExpand('Daily')} variant='light'>
              <Icon variant={detailFormat[index] === 'Daily' ? 'solid' : 'light'} icon={StopIcon} />
            </Button>
            <Button tooltip='Weekly' size='xs' onClick={() => handleExpand('Weekly')} variant='light'>
              <Icon variant={detailFormat[index] === 'Weekly' ? 'solid' : 'light'} icon={Square2StackIcon} />
            </Button>
            <Button tooltip='Monthly' size='xs' onClick={() => handleExpand('Monthly')} variant='light'>
              <Icon variant={detailFormat[index] === 'Monthly' ? 'solid' : 'light'} icon={Squares2X2Icon} />
            </Button>
            <Button tooltip='Currency' size='xs' onClick={() => handleExpand('Currency')} variant='light'>
              <Icon variant={detailFormat[index] === 'Currency' ? 'solid' : 'light'} icon={CurrencyDollarIcon} />
            </Button>
            <Button tooltip='Member' size='xs' onClick={() => handleExpand('Member')} variant='light'>
              <Icon variant={detailFormat[index] === 'Member' ? 'solid' : 'light'} icon={UsersIcon} />
            </Button>
          </div>
        )
      }
    },
  ]

  const getCsv = (fileName: string) => {
    if (data?.value != null) {
      GetObjectAsCsv({
        object: data.value,
        fields: [
          { value: 'game', label: 'Game' },
          { value: 'noOfPlayer', label: 'Total # of Members', },
          { value: 'noOfTransaction', label: '# of TXN', },
          { value: 'noOfSpin', label: '# of Spin', },
          { value: 'avgBetRmb', label: 'Avg Bet (CNY)', },
          { value: 'totalBetRmb', label: 'Total Bet (CNY)', },
          { value: 'totalWinRmb', label: 'Total Win (CNY)', },
          { value: 'gameIncomeRmb', label: 'Game Income (CNY)', },
          { value: 'gamePayoutPer', label: 'RTP', }
        ],
        fileName
      })
    } else {
      showError(new Error('No Data Found'))
    }
  }

  return (
    <>
      <Filters disableCsv={hasNoData} search={mutate} getCsv={getCsv} />
      <Divider />
      <DataTable
        data={data?.value || []}
        columns={columns}
        footer={footer}
        loading={isLoading}
        expandable={{
          render({ records, expander, index }) {
            const format = detailFormat[index]
            if (format == null) return <></>
            return (
              <ExpandedDetail
                url='/gameperformance'
                columns={detailColumns[format]}
                getText={(params) => `${records.game} - ${params.FilterDateType === 'None' ? 'Member' : params.FilterDateType}`}
                csvFields={detailCsv(format)}
                getFileName={(params) => `Game Performance-${records.game}(${params.FilterDateType === 'None' ? 'Member' : params.FilterDateType}-${dayjs(params.startDate).format('YYYYMMDD')}-${dayjs(params.endDate).format('YYYYMMDD')})`}
                expander={() => {
                  expander()
                  setDetailFormat(prev => ({ ...prev, [index]: null }))
                }}
                filterParams={{
                  startDate: filters.startDate,
                  endDate: filters.endDate,
                  OperatorId: filters.operatorId,
                }}
                params={{
                  detailFormatted: true,
                  GameId: records.gameId,
                  FilterDateType: format !== 'Member' ? format : 'None',
                  ...format === 'Member' ? { CustomSearchType: 'Member' } : {}
                }}
              />
            )
          },
        }}
      />
    </>
  )
}

export default GamePerformanceTab
