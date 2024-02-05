export type ObjectValues<T> = T[keyof T]

export type ComplexPaged = {
	cursor: number,
	size: number,
	noMoreData: boolean
}

export type ComplexPagedData<T> = {
	items: T[]
} & ComplexPaged
