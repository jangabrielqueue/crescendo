import useSnackbar from '@hooks/useSnackbar'
import { errorMessage } from '@utils/api'
import { GetObjectAsCsv } from '@utils/index'
import { PagedData } from '@utils/interface'
import { mutateGetFetcherWithParams } from '@utils/newMiddleware'
import useSWRMutation from 'swr/mutation'

export interface GameHistoryModel {
  roundId: number
  gameTransactionId: number
  userName: string
  gameName: string
  typeString: string
  bet: number
  win: number
  createdOnUtc: string
  platformTypeString: string
  isIframeEmbed: boolean
  // operatorTag
  // gameHistoryResult

}

export interface GameHistoryResult {
  /*
  gameResultType
  gameId
  historyType
  history
  game
  gameResultTypeString
  dateTime
  totalWin
  additionalFreeSpin
  spinXml
  winTable [[[5]]]
  originalWinPosition
  expandingWinPosition
  wheel {
    reels [ {symbol}]
  }
  postWheel: {
    reels [{ symbol }]
  }
  */
}

export interface SpinXml {
  /*
  wheel: {
    width
    height
    reelSets
    rows
  }
  winPositions {
    line
    multiplier
    win
  }
  spinBet {
    lineBet
  }
  diceInfo: {
    dices: [{ side: number }]
  }
  */
}

export interface History {
  /*
  selected
  bet
  value
  dcard
  pcard
  result
  mul
  */
}

export interface GameSymbols {
  gameId: number
  symbols: { name: number, data: string }[]
}
type GameHistoryData = PagedData<GameHistoryModel[]>

const useGameHistoryApi = () => {
  const { showError } = useSnackbar()
  const { data, isMutating, trigger } = useSWRMutation({
    url: '/members/membergamehistory',
    errorMessage: errorMessage.DefaultRequestErrorMessage
  }, mutateGetFetcherWithParams<GameHistoryData>)

  const getCsv = (fileName: string) => {
    if (data != null) {
      GetObjectAsCsv({
        object: data.items,
        fields: [
          { value: 'gameTransactionId', label: 'TXN ID' },
          { value: 'userName', label: 'Member Name' },
          { value: 'gameName', label: 'Game' },
          { value: 'typeString', label: 'Spin Type' },
          { value: 'bet', label: 'Bet' },
          { value: 'win', label: 'Win' },
          { value: 'createdOn', label: 'TXN Time' },
          { value: 'platformTypeString', label: 'Platform' },
        ],
        fileName
      })
    } else {
      showError(new Error('No Data Found'))
    }
  }
  return { data, isLoading: isMutating, trigger, getCsv }
}

export default useGameHistoryApi
