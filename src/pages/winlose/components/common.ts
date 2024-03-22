import { TableColumns } from '@components/DataTable/interface'
import { CsvFields } from '@utils/index'

export interface DetailModel {
  gameId: number
  game: string
  noOfPlayer: number
  noOfTransaction: number
  noOfSpin: number
  avgBet: number
  totalBet: number
  totalWin: number
  gameIncome: number
  avgBetRmb: number
  totalBetRmb: number
  totalWinRmb: number
  gameIncomeRmb: number
  gamePayoutPer: number
  memberId: number
  memberName: string
  operatorTag: string
  operatorId: number
  currency: string
  currencyId: number
  platform: string
}

export const detailFormats = ['Games', 'Members', 'Currency'] as const
export type ExcludedCurrencyFormats = Exclude<typeof detailFormats[number], 'Currency'>
export const comonDetailColumn: Array<TableColumns<DetailModel>> = [
  { headerName: 'Total TXN', field: 'noOfTransaction' },
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
]

export const gameCsvFistColumn: Record<typeof detailFormats[number], CsvFields<DetailModel>[]> = {
  Games: [{ label: 'Game', value: 'game' }],
  Members: [{ label: 'Members', value: 'date' }],
  Currency: [{ label: 'Currency', value: 'currency' }],
}

export const detailCsv = (format: typeof detailFormats[number]): CsvFields<DetailModel>[] => {
  return [
    ...gameCsvFistColumn[format],
    { label: 'Total TXN', value: 'noOfTransaction' },
    { label: '# of Spin', value: 'noOfSpin' },
    { label: 'Avg Bet [F]', value: 'avgBet' },
    { label: 'Total Bet [F]', value: 'totalBet' },
    { label: 'Total Payout [F]', value: 'totalWin' },
    { label: 'Game Income [F]', value: 'gameIncome' },
    { label: 'Avg Bet [RMB]', value: 'avgBetRmb' },
    { label: 'Total Bet [RMB]', value: 'totalBetRmbt' },
    { label: 'Total Payout [RMB]', value: 'totalWinRmb' },
    { label: 'Game Income [RMB]', value: 'gameIncomeRmb' },
    { label: 'Win Lose %', value: 'gamePayoutPer' },
  ]
}

export const endpointPerFormat: Record<typeof detailFormats[number], string> = {
  Currency: '/winlose/bycurrency',
  Games: '/winlose/bygame',
  Members: '/winlose/bymember'
}

export interface DetailDialog {
  format: Exclude<typeof detailFormats[number], 'Currency'>
  gameId?: number
  game?: string
  currencyId?: number
  currency?: string
  operatorTag?: string
  operatorId?: number
  platform?: string
}
