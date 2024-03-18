import useOperatorApi, { ByMerchantModel } from './api'
import Filters from './Filters'
import { Button, Dialog, DialogPanel, Divider, Icon, Text } from '@tremor/react'
import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import { GetObjectAsCsv } from '@utils/index'
import useSnackbar from '@hooks/useSnackbar'
import ExpandedDetail from '../components/ExpandedDetail'
import { DetailDialog, DetailModel, comonDetailColumn, detailCsv, detailFormats, endpointPerFormat } from '../components/common'
import { CurrencyDollarIcon, PuzzlePieceIcon, UsersIcon } from '@heroicons/react/16/solid'
import { useContext, useState } from 'react'
import dayjs from 'dayjs'
import { WinLoseContext } from '../context'

const OperatorTab = () => {
  const { data, mutate, isLoading } = useOperatorApi()
  const { showError } = useSnackbar()
  const [detailFormat, setDetailFormat] = useState<Record<number, (typeof detailFormats[number])[]>>({})
  const [detailDialog, setDetailDialog] = useState<DetailDialog>()
  const [filter] = useContext(WinLoseContext)
  const [prevFilter, setPrevFilter] = useState(filter)
  const hasNoData = data.length === 0

  const columns: Array<TableColumns<ByMerchantModel>> = [
    { headerName: 'Operator', field: 'operatorTag' },
    { headerName: 'Member Count', field: 'noOfPlayer' },
    { headerName: 'Total Txn', field: 'noOfTransaction' },
    { headerName: '# of Spin', field: 'noOfSpin' },
    { headerName: 'Ave Bet [F]', field: 'avgBet' },
    { headerName: 'Total Bet [F]', field: 'totalBet' },
    { headerName: 'Total Payout [F]', field: 'totalWin' },
    { headerName: 'Game Income [F]', field: 'gameIncome' },
    { headerName: 'Ave Bet [RMB]', field: 'avgBetRmb' },
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
    }
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
                onClick={() => setDetailDialog({
                  format: 'Members',
                  game: row.game,
                  gameId: row.gameId,
                  operatorId: row.operatorId || 0,
                  operatorTag: row.operatorTag
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
          const handleDialog = (format: typeof detailFormats[number]) => {
            setDetailDialog({
              format,
              currency: row.currency,
              currencyId: row.currencyId,
              operatorId: row.operatorId || 0,
              operatorTag: row.operatorTag
            })
          }
          return (
            <div className='flex gap-1 justify-center'>
              <Button variant='light' tooltip='View Games' size='xs'
                onClick={() => handleDialog('Games')}
              >
                <Icon variant={'light'} icon={PuzzlePieceIcon} />
              </Button>
              <Button variant='light' tooltip='View Members' size='xs'
                onClick={() => handleDialog('Members')}
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
          { label: 'Operator', value: 'operatorTag' },
          { label: 'Member Count', value: 'noOfPlayer' },
          { label: 'Total TXN', value: 'noOfTransaction' },
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
      <Filters disableCsv={hasNoData} search={handleSearch} getCsv={getCsv} />
      <Divider />
      <DataTable
        data={data}
        columns={columns}
        loading={isLoading}
        expandable={{
          render({ records, expander, index }) {
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
                      getFileName={(params) => `${records.operatorTag}-${format}(${dayjs(params.startDate).format('YYYYMMDD')}-${dayjs(params.endDate).format('YYYYMMDD')})`}
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
                        currencyId: prevFilter.currencyId || 0,
                        operatorId: records.operatorId || prevFilter.operatorId || 0
                      }}
                    />
                  )
                })}
              </>
            )
          },
        }}
      />
      <Dialog open={Boolean(detailDialog)} onClose={() => setDetailDialog(undefined)} unmount>
        <DialogPanel className='max-w-none w-fit'>
          {detailDialog && (
            <ExpandedDetail
              isDialog
              url={endpointPerFormat[detailDialog.format]}
              columns={detailColumns[detailDialog.format].filter((value) => typeof value === 'object' && value.field !== 'action')}
              getText={(params) => (
                <>
                  <Text className='text-xl'>{detailDialog.operatorTag} {detailDialog.format}  For {detailDialog.currency || detailDialog.game}</Text>
                  <Text className='font-light text-lg'>({dayjs(params.startDate).format('MMMM-DD-YYYY')} - {dayjs(params.endDate).format('MMMM-DD-YYYY')})</Text>
                </>
              )}
              csvFields={detailCsv(detailDialog.format)}
              getFileName={(params) => `${detailDialog.operatorTag}-${detailDialog.format}-For-${detailDialog.currency || detailDialog.game}(${dayjs(params.startDate).format('YYYYMMDD')}-${dayjs(params.endDate).format('YYYYMMDD')})`}
              expander={() => setDetailDialog(undefined)}
              params={{
                detailFormatted: true,
              }}
              filterParams={{
                ...prevFilter,
                formatFilterType: prevFilter.formatFilterType,
                gameId: detailDialog.gameId || prevFilter.gameId || 0,
                currencyId: detailDialog.currencyId || prevFilter.currencyId || 0,
                operatorId: detailDialog.operatorId || prevFilter.operatorId || 0
              }}
            />
          )}
        </DialogPanel>
      </Dialog>
    </>
  )
}

export default OperatorTab
