export type ObjectValues<T> = T[keyof T]

export type ComplexPaged = {
	cursor: number,
	size: number,
	noMoreData: boolean
}

export type ComplexPagedData<T> = {
	items: T[]
} & ComplexPaged

export type BaseResponse<T> = {
	isError: boolean,
	error: string,
	value: T | undefined
}

export interface Selectlist<Value> {
	label: string,
	value: Value
}

export type Period = '30m' | '1h' | '6h' | '12h' | '24h' | '1d' | '2d' | '3d' | '7d' | '15d' | '30d'

export type CardFiltersPayload = {
	Period?: Period
	Operator?: string | number
	Region?: string | number
}

export type BaseRequest = {
	Limit?: number,
	Ordering?: string,
	HasError?: boolean
}

export interface PagedData<T> {
	items: T
	pageIndex: number
	pageSize: number
	totalPages: number
	totalResults: number
	hasPreviousPage: boolean
	hasNextPage: boolean
	getItemNumber: (index: number) => number
}
