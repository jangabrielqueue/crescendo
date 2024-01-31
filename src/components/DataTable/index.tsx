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
} from '@tremor/react'
import { DataTableProps, RenderCellParams } from './interface'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid'

// styles
const styles = {
	stickyAction: 'sticky right-0 divide-tremor-border bg-tremor-background dark:bg-dark-tremor-background',
	celOnHover: 'hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted',
	header: 'dark:bg-dark-tremor-background-subtle bg-tremor-background-subtle',
	progressbar: 'animate-progress p-0.5 bg-tremor-brand-subtle dark:bg-dark-tremor-brand-subtle absolute z-20',
	backdrop: 'w-full h-full top-0 absolute z-10 border-none bg-gradient-to-b dark:from-black/40 dark:to-black/100  from-white/40 to-white/100 bg-opacity-0 dark:bg-opacity-0'
}
const DataTable = <T,>({
	data = [],
	columns = [],
	loading = false,
	expandable
}: DataTableProps<T>): JSX.Element => {
	const [expandedRow, setExpandedRow] = useState<number[]>([])

	const handleRowExpand = (idx: number, isExpanded: boolean) => {
		if (isExpanded) {
			setExpandedRow(prev => prev.filter(val => val !== idx))
		} else {
			setExpandedRow(prev => ([...prev, idx]))
		}
	}
	return (
		<Card className='p-0'>
			<Table className='rounded-lg'>
				<TableHead className={styles.header}>
					<TableRow>
						{
							columns.map((column, idx) => {
								if (column === 'EXPANDER') return <TableHeaderCell key={idx} />
								return (
									<TableHeaderCell
										key={idx}
										className={column.field === 'action' ? `${styles.stickyAction} ${styles.header}` : ''}
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
											value: column.field !== 'action' ? item[column.field] : undefined
										}
										return (
											<TableCell key={key}
												className={column.field === 'action' ? styles.stickyAction : ''}
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
				</TableBody>
			</Table>
		</Card>
	)
}

export default DataTable
