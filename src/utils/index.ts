import { CardFiltersPayload, PagedData } from './interface'
import { Parser } from '@json2csv/plainjs'
import dayjs, { ManipulateType } from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const datetime = {
  getStartDate: (date?: Date | dayjs.Dayjs | string) => {
    if (date == null) return undefined
    return dayjs(date).startOf('day').utc().toISOString()
  },
  getEndDate: (date?: Date | dayjs.Dayjs | string) => {
    if (date == null) return undefined
    return dayjs(date).endOf('day').utc().toISOString()
  },
  getDate: (date?: Date | dayjs.Dayjs | string) => {
    if (date == null) return undefined
    return dayjs(date).utc().toISOString()
  }
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

export const checkObjectKeys = (object: object, key: string): key is keyof typeof object => Object.hasOwn(object, key)

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

interface ObjectAsCsvOptions {
  object: object,
  fields?: ({ label: string, value: string })[],
  fileName: string
}

export function GetObjectAsCsv({ object, fileName, ...rest }: ObjectAsCsvOptions) {
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