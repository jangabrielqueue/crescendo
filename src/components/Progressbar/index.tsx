import { Flex, ProgressBar, Text } from '@tremor/react'

const Progressbar = ({ label, value, progressValue }: { label: string, value: number | string, progressValue: number }) => {
	return (
		<div>
			<Flex className='px-1'>
				<Text>{label}</Text>
				<Text>{value}</Text>
			</Flex>
			<ProgressBar value={progressValue} className="mt-1" />
		</div>
	)
}

export default Progressbar
