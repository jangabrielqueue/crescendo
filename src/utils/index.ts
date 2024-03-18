import { CardFiltersPayload, PagedData } from './interface'
import { Parser } from '@json2csv/plainjs'
import dayjs, { ManipulateType } from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const datetime = {
  getStartDate: (date?: Date | dayjs.Dayjs | string) => date != null ? dayjs(date).startOf('day').utc().toISOString() : undefined,
  getEndDate: (date?: Date | dayjs.Dayjs | string) => date != null ? dayjs(date).endOf('day').utc().toISOString() : undefined,
  getDate: (date?: Date | dayjs.Dayjs | string) => date != null ? dayjs(date).utc().toISOString() : undefined,
  convertLocalString: (date?: Date | dayjs.Dayjs | string) => date != null ? dayjs.utc(date).local().toLocaleString() : undefined,
  convertLocalDate: (date?: Date | dayjs.Dayjs | string) => date != null ? dayjs.utc(date).local().toDate() : undefined,
  convertUtcString: (date?: Date | dayjs.Dayjs | string) => date != null ? dayjs(date).utc().toLocaleString() : undefined,
  convertUtcDate: (date?: Date | dayjs.Dayjs | string) => date != null ? dayjs(date).utc().toDate() : undefined,
}

export const getDateFromPeriod = (filters: CardFiltersPayload) => {
  if (filters.Period == null) return {}
  const endDate = dayjs()
  const unit = filters.Period.charAt(-1) as ManipulateType
  const value = Number(filters.Period.slice(0, -1))
  const startDate = dayjs().subtract(value, unit)

  if (unit === 'h' || unit === 'm') {
    return { StartDate: datetime.getDate(startDate), EndDate: datetime.getDate(endDate) }
  }
  return { StartDate: datetime.getStartDate(startDate), EndDate: datetime.getEndDate(endDate) }
}

export const checkObjectKeys = (object: object, key: string | symbol | number): key is keyof typeof object => Object.hasOwn(object, key)

export const TruncateNumericValue = (value: number, decimalPlaces: number = 2): string => {
  const absValue = Math.abs(value)

  if (absValue >= 1000000000) {
    return (value / 1000000000).toFixed(decimalPlaces).replace(/\.0$/, '') + 'G'
  }
  if (absValue >= 1000000) {
    return (value / 1000000).toFixed(decimalPlaces).replace(/\.0$/, '') + 'M'
  }
  if (absValue >= 1000) {
    return (value / 1000).toFixed(decimalPlaces).replace(/\.0$/, '') + 'K'
  }

  return value.toString()
}

export const isNullOrWhiteSpace = (str: unknown): str is (undefined | null) => {
  if (str == null) return true
  if (typeof str === 'string' && str.replace(' ', '').length === 0) return true
  return false
}
export type CsvFields<T> = ({ label: string, value: string | ((row: T) => string) })

interface ObjectAsCsvOptions<T extends object> {
  object: T[],
  fields?: CsvFields<T>[],
  fileName: string
}

export function GetObjectAsCsv<T extends object>({ object, fileName, ...rest }: ObjectAsCsvOptions<T>) {
  const parser = new Parser(rest)
  try {
    const csv = parser.parse(object)

    /*
    * Make CSV downloadable
    */
    const downloadLink = document.createElement('a')
    const blob = new Blob(['\ufeff', csv])
    const url = URL.createObjectURL(blob)
    downloadLink.href = url
    downloadLink.download = `${fileName}.csv`

    /*
     * Actually download CSV
     */
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  } catch (e) {
    console.log(e)
  }

}

export function getPagedItemNumber<T,>(referenceItem: PagedData<T> | undefined, localIndex: number) {
  if (referenceItem == null) return 0
  return (referenceItem.pageIndex - 1) * referenceItem.pageSize + localIndex + 1
}

export function convertToGmt(createdOnUtc: string) {
  const utcDate = new Date(createdOnUtc)
  const gmtPlus8Date = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000)
  return gmtPlus8Date.toLocaleString()
}

export const getBooleanQuery = (query: string | null | undefined) => {
  if (query === 'null' || query == null) {
    return null
  }
  return query === 'true'
}

export const getArrayQuery = (query: string | null | undefined) => {
  if (query == null) return []
  try {
    const parsed = JSON.parse(query)
    if (Array.isArray(parsed)) {
      return parsed
    } else {
      return []
    }
  } catch (e) {
    return []
  }
}

export const convertLocalToUtc = (date: string | undefined) => {
  return date ? dayjs.utc(date).local().toLocaleString() : undefined
}

export const twExclude = (twClass: string, excludedClass: string[]) => excludedClass.reduce((prev, curr) => prev.replace(curr, ''), twClass)
