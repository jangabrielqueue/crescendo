export interface FilterProps {
  disableCsv: boolean
  search: (arg: { [key: string]: unknown }) => void
  getCsv: (fileName: string) => void
}
