import DataTable from '@components/DataTable'
import { TableColumns } from '@components/DataTable/interface'
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/16/solid'
import useSnackbar from '@hooks/useSnackbar'
import { Icon, Text } from '@tremor/react'
import { CsvFields, GetObjectAsCsv } from '@utils/index'
import { fetcherGetApiWithParams } from '@utils/middleware'
import { useState } from 'react'
import useSWRImmutable from 'swr/immutable'

interface ExpandedDetailProps<T, K, L extends object> {
  params: K
  filterParams: L
  url: string
  expander: () => void
  columns: Array<TableColumns<T>>
  getText: (params: K & L) => string | JSX.Element
  csvFields: CsvFields<T>[]
  getFileName: (params: K & L) => string
  isDialog?: boolean
}

const styles = {
  container: 'flex flex-col border-color border-b bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle',
  dialogContainer: 'flex flex-col border-color border-b',
  title: 'm-2 self-center flex gap-2 items-center',
  dialogTitle: 'm-2 self-start justify-between pl-4 pr-8 flex gap-2 items-center w-full',
  icons: 'flex gap-1',
  dialogIcons: 'flex gap-2'
}

const ExpandedDetail = <T extends object, K extends object = object, L extends object = object>({
  params,
  filterParams,
  url,
  expander,
  columns,
  getText,
  getFileName,
  csvFields,
  isDialog = false
}: ExpandedDetailProps<T, K, L>) => {
  const [immutableParams] = useState(filterParams)
  const newParams = { ...params, ...immutableParams }
  const { data, isValidating } = useSWRImmutable({
    url,
    params: newParams
  }, fetcherGetApiWithParams<T[]>)
  const { showError } = useSnackbar()

  const tableData = (data?.value || []).map((val) => ({ ...newParams, ...val }))

  const getCsv = () => {
    if (data?.value != null) {
      GetObjectAsCsv({
        object: data?.value,
        fields: csvFields,
        fileName: getFileName(newParams)
      })
    } else {
      showError(new Error('No Data Found'))
    }
  }

  return (
    <div className={isDialog ? styles.dialogContainer : styles.container}>
      <div className={isDialog ? styles.dialogTitle : styles.title}>
        <Text>{getText(newParams)}</Text>
        <div className={isDialog ? styles.dialogIcons : styles.icons}>
          <Icon onClick={getCsv} icon={ArrowDownTrayIcon} variant="shadow" tooltip="Download CSV" size="sm" className='cursor-pointer' />
          <Icon onClick={expander} icon={XMarkIcon} variant="shadow" tooltip="close" size="sm" className='cursor-pointer' />
        </div>
      </div>
      <div className='m-6 mt-2 bg-tremor-background dark:bg-dark-tremor-background'>
        <DataTable
          columns={columns}
          data={tableData}
          loading={isValidating}
        />
      </div>
    </div>
  )
}

export default ExpandedDetail
