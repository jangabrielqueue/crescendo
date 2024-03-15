import { ObjectValues } from '@utils/interface'
export interface RenderCellParams<T> {
	row: T
	id?: string
	value?: T[keyof T]
	data?: T[]
	index: number
	expander: () => void
	isExpanded: boolean
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
	headerClassName?: string
	cellClassName?: string
}

export type TableColumns<T> = BasicTableColumns<T> | ObjectValues<typeof COLUMN>
export interface DataTableProps<T, K> {
	data: T[]
	columns: Array<TableColumns<T>>
	loading?: boolean
	expandable?: {
		render: ({ records, expander, isExpanded, index }: { records: T, expander: () => void, isExpanded: boolean, index: number }) => JSX.Element
		isExpandable?: (records: T) => boolean
		expandOnRowClick?: boolean
		expandIcon?: JSX.Element
	}
	tableClassName?: string
	headerCellsClassName?: string
	ExtraHeaders?: () => JSX.Element
	footer?: undefined | ((data?: T[]) => { [key in keyof T]?: K } | undefined)
}
