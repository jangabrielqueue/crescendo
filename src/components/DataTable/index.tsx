import React, { useState } from 'react'
import {
	Card,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableFoot,
	TableFooterCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Text,
} from '@tremor/react'
import { DataTableProps, RenderCellParams } from './interface'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid'
import { twMerge } from 'tailwind-merge'
import { checkObjectKeys } from '@utils/index'
import { useStateChangeEffect } from '@hooks/useStateChangeEffect'

// styles
const styles = {
	table: 'border rounded-md relative *:border-separate *:border-spacing-0 border-color', /*  */
	stickyAction: 'sticky right-0 bg-tremor-background dark:bg-dark-tremor-background border-l text-center border-color',
	stickyActionCell: 'sticky right-0 bg-tremor-background dark:bg-dark-tremor-background border-l pl-4 border-color flex justify-center items-center',
	cell: 'group-hover:bg-tremor-background-subtle dark:group-hover:bg-dark-tremor-background-subtle border-b border-color',
	row: 'group',
	header: 'rounded-t-lg',
	progressbar: 'animate-progress p-0.5 bg-tremor-brand-subtle dark:bg-dark-tremor-brand-subtle absolute z-20',
	backdrop: 'w-full h-full top-0 absolute z-10 border-none bg-gradient-to-b dark:from-black/40 dark:to-black/100  from-white/40 to-white/100 bg-opacity-0 dark:bg-opacity-0',
	footerCell: 'p-2 border-t border-color'
}
const DataTable = <T, K>({
	data = [],
	columns = [],
	loading = false,
	expandable,
	tableClassName,
	ExtraHeaders,
	headerCellsClassName = '',
	footer
}: DataTableProps<T, K>): JSX.Element => {
	const [expandedRow, setExpandedRow] = useState<number[]>([])
	const noData = data.length === 0
	const footerData = footer && footer(data)

	const handleRowExpand = (idx: number, isExpanded: boolean) => {
		if (isExpanded) {
			setExpandedRow(prev => prev.filter(val => val !== idx))
		} else {
			setExpandedRow(prev => ([...prev, idx]))
		}
	}

	useStateChangeEffect(() => {
		setExpandedRow([])
	}, [loading])

	return (
		<Table className={twMerge(styles.table, tableClassName)}>
			<TableHead className={styles.header}>
				{ExtraHeaders != null && <ExtraHeaders />}
				<TableRow>
					{
						columns.map((column, idx) => {
							if (column === 'EXPANDER') return <TableHeaderCell key={idx} />
							return (
								<TableHeaderCell
									key={idx}
									className={twMerge('px-3 py-2', column.field === 'action' ? `${styles.stickyAction}` : '', headerCellsClassName, column.headerClassName)}
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
					const isExpanded = expandedRow.includes(dataIdx)
					const expander = () => handleRowExpand(dataIdx, isExpanded)
					return (
						<React.Fragment key={dataIdx}>
							<TableRow
								className={styles.row}
								{...expandable?.expandOnRowClick ? { onClick: expander } : {}}
							>
								{columns.map((column, columnIdx) => {
									const key = `${dataIdx}${columnIdx}`
									// Expander
									if (column === 'EXPANDER') {
										return (
											<TableCell key={key}>
												<Icon
													className='hover:cursor-pointer'
													icon={expandable?.expandIcon || isExpanded ? ChevronUpIcon : ChevronDownIcon}
													onClick={expander}
												/>
											</TableCell>
										)
									}
									const params: RenderCellParams<T> = {
										row: item,
										id: key,
										value: column.field !== 'action' ? item[column.field] : undefined,
										data,
										index: dataIdx,
										expander,
										isExpanded
									}
									return (
										<TableCell key={key}
											className={twMerge('p-2', (column.field === 'action' ? styles.stickyActionCell : ''), styles.cell, column.cellClassName)}
										>
											{column.renderCell ? column.renderCell(params) : column.field !== 'action' ? item[column.field] as React.ReactNode : <></>}
										</TableCell>
									)
								})}
							</TableRow>
							{isExpanded && (
								<TableRow>
									<TableCell colSpan={columns.length} className='p-0'>
										{expandable?.render && expandable.render({ records: item, expander, isExpanded, index: dataIdx })}
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
			{footerData && (
				<TableFoot>
					<TableRow>
						{columns.map((column, idx) => {
							if (typeof column === 'string') return null
							return (
								<TableFooterCell className={styles.footerCell} key={idx}>
									{checkObjectKeys(footerData, column.field) ? footerData[column.field] : ''}
								</TableFooterCell>
							)
						})}
					</TableRow>
				</TableFoot>)}
		</Table>
	)
}

export default DataTable
