import { Button, Flex, Grid } from '@tremor/react'
import { ComplexPaged } from '@utils/interface'

type ComplexPaginationProps = {
	onPageChange: (newCursor: number) => void
} & Partial<ComplexPaged>

const styles = {
	button: 'border-color text-tremor-content dark:text-dark-tremor-content bg-background hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted py-2 px-4'
}

const ComplexPagination = ({ cursor, noMoreData, onPageChange }: ComplexPaginationProps): JSX.Element | null => {
	if (cursor === 1 && noMoreData || cursor == null) return null
	const handlePageChange = (type: 1 | 'prev' | 'next') => {
		let newCursor = cursor
		if (type === 1) {
			newCursor = 1
		} else if (type === 'prev') {
			newCursor--
		} else {
			newCursor++
		}
		onPageChange(newCursor)
	}
	return (
		<Grid className='gap-2' numItems={2}>
			<Button
				className={styles.button + ' rounded-2xl border'}
				variant='light'
				disabled={cursor === 1}
				onClick={() => handlePageChange(1)}
			>
				First
			</Button>
			<Flex justifyContent='center' className='rounded-2xl border border-color overflow-hidden'>
				<Button
					className={styles.button + ' border-r'}
					variant='light'
					disabled={cursor === 1}
					onClick={() => handlePageChange('prev')}
				>
					prev
				</Button>
				<Button
					className={styles.button + ' border-l'}
					variant='light'
					disabled={noMoreData}
					onClick={() => handlePageChange('next')}
				>
					next
				</Button>
			</Flex>
		</Grid>
	)
}

export default ComplexPagination
