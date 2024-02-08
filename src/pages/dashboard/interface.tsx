
export type CardFilterValue = {
  tables: [{ rows: string[][] }]
}

export type ChartDataValue = {
  tables: [{ rows: (string | number)[][] }]
}


export type TopWinnersModel = {
  name: string
  totalNetWin: number
  totalBet: number
  companyWLPercentage: number
}

export type GamePerformanceModel = {
  date: string
  noOfSpin: number
  game: string
  gameIncomeRmb: number
  gamePayoutPer: number
}
