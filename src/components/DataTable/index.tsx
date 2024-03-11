import React, { useState } from 'react'
import {
	Card,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Text,
} from '@tremor/react'
import { DataTableProps, RenderCellParams } from './interface'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid'
import { twMerge } from 'tailwind-merge'

// styles
const styles = {
	table: 'border rounded-md border-tremor-border dark:border-dark-tremor-border relative',
	stickyAction: 'sticky right-0',
	stickyActionCell: 'sticky right-0 bg-tremor-background dark:bg-dark-tremor-background',
	celOnHover: 'hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted',
	header: 'rounded-t-lg',
	progressbar: 'animate-progress p-0.5 bg-tremor-brand-subtle dark:bg-dark-tremor-brand-subtle absolute z-20',
	backdrop: 'w-full h-full top-0 absolute z-10 border-none bg-gradient-to-b dark:from-black/40 dark:to-black/100  from-white/40 to-white/100 bg-opacity-0 dark:bg-opacity-0'
}
const DataTable = <T,>({
	data = [],
	columns = [],
	loading = false,
	expandable,
	tableClassName
}: DataTableProps<T>): JSX.Element => {
	const [expandedRow, setExpandedRow] = useState<number[]>([])
	const noData = data.length === 0
	const handleRowExpand = (idx: number, isExpanded: boolean) => {
		if (isExpanded) {
			setExpandedRow(prev => prev.filter(val => val !== idx))
		} else {
			setExpandedRow(prev => ([...prev, idx]))
		}
	}
	return (
		<Table className={twMerge(styles.table, tableClassName)}>
			<TableHead className={styles.header}>
				<TableRow>
					{
						columns.map((column, idx) => {
							if (column === 'EXPANDER') return <TableHeaderCell key={idx} />
							return (
								<TableHeaderCell
									key={idx}
									className={twMerge('px-3 py-2', column.field === 'action' ? `${styles.stickyAction}` : '', column.headerClassName)}
								>
									{column.headerName}
								</TableHeaderCell>
							)
						})
					}
				</TableRow>
			</TableHead>
			<TableBody>
				{loading && (
					<TableRow className='p-0'>
						<TableCell colSpan={columns.length} className='p-0'>
							<Card className={styles.progressbar} />
							<Card className={styles.backdrop} />
							{/* <Card className='w-full h-full top-0 absolute z-10 dark:bg-opacity-0' /> */}
						</TableCell>
					</TableRow>
				)}
				{data.map((item, dataIdx) => {
					const hasExpandRow = expandable != null && (expandable.isExpandable == null || expandable.isExpandable(item))
					const isExpanded = expandedRow.includes(dataIdx)
					return (
						<React.Fragment key={dataIdx}>
							<TableRow
								className={styles.celOnHover}
								{...expandable?.expandOnRowClick ? { onClick: () => handleRowExpand(dataIdx, isExpanded) } : {}}
							>
								{columns.map((column, columnIdx) => {
									const key = `${dataIdx}${columnIdx}`
									// Expander
									if (column === 'EXPANDER') {
										return (
											<TableCell key={key}>
												{hasExpandRow &&
													<Icon
														className='hover:cursor-pointer'
														icon={expandable.expandIcon || isExpanded ? ChevronUpIcon : ChevronDownIcon}
														onClick={() => handleRowExpand(dataIdx, isExpanded)}
													/>
												}
											</TableCell>
										)
									}
									const params: RenderCellParams<T> = {
										row: item,
										id: key,
										value: column.field !== 'action' ? item[column.field] : undefined,
										data,
										index: dataIdx
									}
									return (
										<TableCell key={key}
											className={twMerge('p-2' + (column.field === 'action' ? styles.stickyActionCell : ''), styles.celOnHover, column.cellClassName)}
										>
											{column.renderCell ? column.renderCell(params) : column.field !== 'action' ? item[column.field] as React.ReactNode : <></>}
										</TableCell>
									)
								})}
							</TableRow>
							{hasExpandRow && isExpanded && (
								<TableRow>
									<TableCell colSpan={columns.length}>
										{expandable.render(item)}
									</TableCell>
								</TableRow>)}
						</React.Fragment>
					)
				})}
				{noData && (
					<TableRow>
						<TableCell colSpan={columns.length}>
							<Text className='text-center text-xl text-tremor-content-subtle dark:text-dark-tremor-content-muted leading-[6rem]'>No Data Available</Text>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}

export default DataTable
