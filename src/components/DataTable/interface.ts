import { ObjectValues } from '@utils/interface'
export interface RenderCellParams<T> {
	row: T
	id?: string
	value?: T[keyof T]
}

export const COLUMN = {
	EXPANDER: 'EXPANDER'
} as const
interface BasicTableColumns<T> {
	field: keyof T | 'action'
	headerName: string
	headerAlign?: 'left' | 'right' | 'center' | 'inherit' | 'justify' | undefined
	width?: string | number | undefined
	sortable?: boolean
	renderCell?: (args: RenderCellParams<T>) => React.ReactNode
}

export type TableColumns<T> = BasicTableColumns<T> | ObjectValues<typeof COLUMN>
export interface DataTableProps<T> {
	data: T[]
	columns: Array<TableColumns<T>>
	loading?: boolean
	expandable?: {
		render: (records: T) => JSX.Element
		isExpandable?: (records: T) => boolean
		expandOnRowClick?: boolean
		expandIcon?: JSX.Element
	}
}