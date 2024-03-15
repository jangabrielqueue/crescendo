import { Button, Flex, Grid } from '@tremor/react'
import { ComplexPaged } from '@utils/interface'

type ComplexPaginationProps = {
	onPageChange: (newCursor: number) => void
} & ComplexPaged

const styles = {
	button: 'rounded-full border-color text-tremor-content dark:text-dark-tremor-content'
}

const ComplexPagination = ({ cursor, noMoreData, onPageChange }: ComplexPaginationProps): JSX.Element | null => {
	if (cursor === 1 && noMoreData) return null
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

		<Grid className='gap-2 my-2' numItems={2}>
			<Button
				className={styles.button}
				variant='secondary'
				disabled={cursor === 1}
				onClick={() => handlePageChange(1)}
			>
				First
			</Button>
			<Flex justifyContent='center'>
				<Button
					className={`${styles.button} rounded-r-none`}
					variant='secondary'
					disabled={cursor === 1}
					onClick={() => handlePageChange('prev')}
				>
					prev
				</Button>
				<Button
					className={`${styles.button} rounded-l-none`}
					variant='secondary'
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
