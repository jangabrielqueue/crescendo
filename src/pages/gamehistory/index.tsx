import DataTable from '@components/DataTable'
import useGameHistoryApi, { GameHistoryModel } from './api'
import Filters from './components/Filters'
import { TableColumns } from '@components/DataTable/interface'
import { convertToGmt, getPagedItemNumber } from '@utils/index'
import { Button, Divider } from '@tremor/react'
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { useRef } from 'react'
import config from '@utils/env'
import { useAuth } from '@hooks/useAuth'
import useModal from '@hooks/useModal'

const iframeurl = `${config.betHistoryUrl}/bethistory/?lang=en-us&tid=`

const GameHistory = () => {
  const { data, isLoading, trigger, getCsv } = useGameHistoryApi()
  const { authToken } = useAuth()
  const { setModal } = useModal()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleViewResult = (row: GameHistoryModel) => {
    setModal({
      body: () => (
        <iframe
          src={`${iframeurl}${row.gameTransactionId}`}
          ref={iframeRef}
          allowFullScreen
          width='100%'
          style={{
            backgroundColor: 'white',
            border: 'none',
            minHeight: '40em'
          }}
          onLoad={handleLoadIframe}
        />
      ),
      panelClassName: 'max-w-4xl'
    })
  }

  const handleLoadIframe = () => {
    const contentWindow = iframeRef.current?.contentWindow
    contentWindow?.postMessage(authToken, config.betHistoryUrl)
  }
  const columns: Array<TableColumns<GameHistoryModel>> = [
    {
      field: 'roundId',
      headerName: 'Row Number',
      renderCell: ({ index }) => getPagedItemNumber(data, index)
    },
    { field: 'roundId', headerName: 'Round Id' },
    { field: 'gameTransactionId', headerName: 'TXN ID' },
    { field: 'userName', headerName: 'Member Name' },
    { field: 'gameName', headerName: 'Game' },
    { field: 'typeString', headerName: 'Spin Type' },
    { field: 'bet', headerName: 'Bet' },
    { field: 'win', headerName: 'Win' },
    {
      field: 'createdOnUtc',
      headerName: 'Date',
      renderCell: ({ row }) => convertToGmt(row.createdOnUtc)
    },
    { field: 'platformTypeString', headerName: 'Platform' },
    {
      field: 'action',
      headerName: 'Details',
      renderCell: ({ row }) => (
        <div className='flex justify-center'>
          <Button size='xs' icon={MagnifyingGlassIcon} onClick={() => handleViewResult(row)} />
        </div>
      )
    },
  ]


  return (
    <>
      <Filters
        trigger={trigger}
        getCsv={getCsv}
        disableCsv={!(data?.items && data?.items.length > 0)}
        searchLoading={isLoading}
      />
      <Divider />
      <DataTable
        data={data?.items ?? []}
        columns={columns}
        loading={isLoading}
      />
    </>
  )
}

export default GameHistory
