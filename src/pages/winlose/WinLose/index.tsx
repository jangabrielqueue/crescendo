import useWinLoseApi, { WinLoseModel } from './api'
import Filters from './Filters'
import { Button, Divider, Icon, Text } from '@tremor/react'
import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import { CsvFields, GetObjectAsCsv, checkObjectKeys } from '@utils/index'
import useSnackbar from '@hooks/useSnackbar'
import ExpandedDetail from '../components/ExpandedDetail'
import { useContext, useState } from 'react'
import dayjs from 'dayjs'
import { FiltersModel, WinLoseContext } from '../context'
import { CurrencyDollarIcon, PuzzlePieceIcon, UsersIcon } from '@heroicons/react/16/solid'
import { DetailDialog, DetailModel, ExcludedCurrencyFormats, comonDetailColumn, detailCsv, detailFormats, endpointPerFormat } from '../components/common'
import useModal from '@hooks/useModal'

const CsvFirstColumn: Record<string, CsvFields<WinLoseModel>> = {
  ['Show All']: { label: 'Date', value: 'date' },
  ['Daily']: { label: 'Date', value: 'date' },
  ['Weekly']: { label: 'Date', value: (row) => `${row.week}-${row.year}` },
  ['Monthly']: { label: 'Date', value: (row) => `${row.month}-${row.year}` },
} as const

const WinLoseTab = () => {
  const { data, mutate, isLoading } = useWinLoseApi()
  const [filter] = useContext(WinLoseContext)
  const { formatFilterType = 'Show All' } = filter
  const [prevFilter, setPrevFilter] = useState(filter)
  const [detailFormat, setDetailFormat] = useState<Record<number, (typeof detailFormats[number])[]>>({})
  const { showError } = useSnackbar()
  const { setModal } = useModal()
  const hasNoData = data.length === 0

  const columns: Array<TableColumns<WinLoseModel>> = [
    { headerName: 'Date', field: 'date' },
    { headerName: 'Member Count', field: 'noOfPlayer' },
    { headerName: 'Total Txn', field: 'noOfTransaction' },
    { headerName: '# of Spin', field: 'noOfSpin' },
    { headerName: 'Avg Bet [F]', field: 'avgBet' },
    { headerName: 'Total Bet [F]', field: 'totalBet' },
    { headerName: 'Total Payout [F]', field: 'totalWin' },
    { headerName: 'Game Income [F]', field: 'gameIncome' },
    { headerName: 'Avg Bet [RMB]', field: 'avgBetRmb' },
    { headerName: 'Total Bet [RMB]', field: 'totalBetRmb' },
    { headerName: 'Total Payout [RMB]', field: 'totalWinRmb' },
    { headerName: 'Game Income [RMB]', field: 'gameIncomeRmb' },
    { headerName: 'Win Lose %', field: 'gamePayoutPer' },
    {
      headerName: 'View Details', field: 'action',
      renderCell({ index, isExpanded, expander }) {
        const handleExpand = (format: typeof detailFormats[number]) => {
          setDetailFormat(prev => {
            if (prev[index] && prev[index].includes(format)) {
              return prev
            }
            return {
              ...prev,
              [index]: [...prev[index] ? [...prev[index], format] : [format]]
            }
          })
          !isExpanded && expander()
        }
        return (
          <div className='flex gap-1'>
            <Button tooltip='Games' size='xs' onClick={() => handleExpand('Games')} variant='light'>
              <Icon variant={detailFormat[index]?.includes('Games') ? 'solid' : 'light'} icon={PuzzlePieceIcon} />
            </Button>
            <Button tooltip='Currency' size='xs' onClick={() => handleExpand('Currency')} variant='light'>
              <Icon variant={detailFormat[index]?.includes('Currency') ? 'solid' : 'light'} icon={CurrencyDollarIcon} />
            </Button>
            <Button tooltip='Members' size='xs' onClick={() => handleExpand('Members')} variant='light'>
              <Icon variant={detailFormat[index]?.includes('Members') ? 'solid' : 'light'} icon={UsersIcon} />
            </Button>
          </div>
        )
      },
    },
  ]

  const detailColumns: Record<typeof detailFormats[number], Array<TableColumns<DetailModel>>> = {
    Games: [
      { headerName: 'Game', field: 'game' },
      { headerName: 'Member Count', field: 'noOfPlayer' },
      ...comonDetailColumn,
      {
        headerName: 'View Details', field: 'action', headerClassName: 'text-center',
        renderCell({ row }) {
          return (
            <div className='flex gap-1 justify-center'>
              <Button variant='light' tooltip='Members' size='xs'
                onClick={() => setModal({
                  body: () => (
                    <DetailsDialog
                      detailDialog={{
                        format: 'Members',
                        game: row.game,
                        gameId: row.gameId
                      }}
                      prevFilter={prevFilter}
                    />
                  ),
                  panelClassName: 'max-w-none w-fit'
                })}
              >
                <Icon variant={'light'} icon={UsersIcon} />
              </Button>
            </div>
          )
        },
      },
    ],
    Members: [
      { headerName: 'Member Name', field: 'memberName' },
      ...comonDetailColumn
    ],
    Currency: [
      { headerName: 'Currency', field: 'currency' },
      ...comonDetailColumn,
      {
        headerName: 'View Details', field: 'action', headerClassName: 'text-center',
        renderCell({ row }) {
          return (
            <div className='flex gap-1 justify-center'>
              <Button variant='light' tooltip='View Games' size='xs'
                onClick={() => setModal({
                  body: () => (
                    <DetailsDialog
                      detailDialog={{
                        format: 'Games',
                        currency: row.currency,
                        currencyId: row.currencyId
                      }}
                      prevFilter={prevFilter}
                    />
                  ),
                  panelClassName: 'max-w-none w-fit'
                })}
              >
                <Icon variant={'light'} icon={PuzzlePieceIcon} />
              </Button>
              <Button variant='light' tooltip='View Members' size='xs'
                onClick={() => setModal({
                  body: () => (
                    <DetailsDialog
                      detailDialog={{
                        format: 'Members',
                        currency: row.currency,
                        currencyId: row.currencyId
                      }}
                      prevFilter={prevFilter}
                    />
                  ),
                  panelClassName: 'max-w-none w-fit'
                })}
              >
                <Icon variant={'light'} icon={UsersIcon} />
              </Button>
            </div>
          )
        },
      },
    ]
  }

  const getCsv = (fileName: string) => {
    if (!hasNoData) {
      GetObjectAsCsv({
        object: data,
        fields: [
          ...checkObjectKeys(CsvFirstColumn, formatFilterType) ? [CsvFirstColumn[formatFilterType]] : [],
          { label: 'Member Count', value: 'noOfPlayer' },
          { label: 'Total Txn', value: 'noOfTransaction' },
          { label: '# of Spin', value: 'noOfSpin' },
          { label: 'Avg Bet [F]', value: 'avgBet' },
          { label: 'Total Bet [F]', value: 'totalBet' },
          { label: 'Total Payout [F]', value: 'totalWin' },
          { label: 'Game Income [F]', value: 'gameIncome' },
          { label: 'Avg Bet [RMB]', value: 'avgBetRmb' },
          { label: 'Total Bet [RMB]', value: 'totalBetRmb' },
          { label: 'Total Payout [RMB]', value: 'totalWinRmb' },
          { label: 'Game Income [RMB]', value: 'gameIncomeRmb' },
          { label: 'Win Lose %', value: 'gamePayoutPer' },
        ],
        fileName
      })
    } else {
      showError(new Error('No Data Found'))
    }
  }

  const handleSearch = async (arg: object) => {
    mutate(arg).then(() => setDetailFormat({}))
    setPrevFilter(filter)
  }

  return (
    <>
      <Filters searchLoading={isLoading} disableCsv={hasNoData} search={handleSearch} getCsv={getCsv} />
      <Divider />
      <DataTable
        data={data}
        columns={columns}
        loading={isLoading}
        expandable={{
          render({ expander, index }) {
            const format = detailFormat[index]
            if (format.length === 0) return <></>
            return (
              <>
                {format.map((format, _, arr) => {
                  return (
                    <ExpandedDetail
                      key={format}
                      url={endpointPerFormat[format]}
                      columns={detailColumns[format]}
                      getText={(params) => `${format} For Period ${dayjs(params.startDate).format('MM/DD/YYYY')} - ${dayjs(params.endDate).format('MM/DD/YYYY')}`}
                      csvFields={detailCsv(format)}
                      getFileName={(params) => `Win Lose-${format}(${dayjs(params.startDate).format('YYYYMMDD')}-${dayjs(params.endDate).format('YYYYMMDD')})`}
                      expander={() => {
                        if (arr.length === 1) {
                          expander()
                        }
                        setDetailFormat(prev => ({ ...prev, [index]: prev[index].filter(val => val !== format) }))
                      }}
                      params={{
                        detailFormatted: true,
                      }}
                      filterParams={{
                        ...prevFilter,
                        formatFilterType: prevFilter.formatFilterType,
                        gameId: prevFilter.gameId || 0,
                        currencyId: prevFilter.currencyId || 0
                      }}
                    />
                  )
                })}
              </>
            )
          },
        }}
      />
    </>
  )
}

const DetailsDialog = ({ detailDialog, prevFilter }: { detailDialog: DetailDialog, prevFilter: FiltersModel }) => {
  const { closeModal } = useModal()

  const detailColumns: Record<ExcludedCurrencyFormats, Array<TableColumns<DetailModel>>> = {
    Games: [
      { headerName: 'Game', field: 'game' },
      { headerName: 'Member Count', field: 'noOfPlayer' },
      ...comonDetailColumn
    ],
    Members: [
      { headerName: 'Member Name', field: 'memberName' },
      ...comonDetailColumn
    ]
  }

  return (
    <ExpandedDetail
      isDialog
      url={endpointPerFormat[detailDialog.format]}
      columns={detailColumns[detailDialog.format]}
      getText={(params) => (
        <>
          <Text className='text-xl'>{detailDialog.format} For {detailDialog.currency || detailDialog.game}</Text>
          <Text className='font-light text-lg'>({dayjs(params.startDate).format('MMMM-DD-YYYY')} - {dayjs(params.endDate).format('MMMM-DD-YYYY')})</Text>
        </>
      )}
      csvFields={detailCsv(detailDialog.format)}
      getFileName={(params) => `Win Lose-${detailDialog.format}-For-${detailDialog.currency || detailDialog.game}(${dayjs(params.startDate).format('YYYYMMDD')}-${dayjs(params.endDate).format('YYYYMMDD')})`}
      expander={closeModal}
      params={{
        detailFormatted: true,
      }}
      filterParams={{
        ...prevFilter,
        formatFilterType: prevFilter.formatFilterType,
        gameId: detailDialog.gameId || prevFilter.gameId || 0,
        currencyId: detailDialog.currencyId || prevFilter.currencyId || 0
      }}
    />
  )
}

export default WinLoseTab
