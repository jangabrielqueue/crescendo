import { ProgressCircle } from '@tremor/react'

interface CircleProgressProps {
  value: number
  size?: 'md' | 'xs' | 'sm' | 'lg' | 'xl'
}
const CircleProgress = ({ value, size = 'md' }: CircleProgressProps) => {

	return (
		<ProgressCircle value={value} size={size}>
			<span className="text-[10px] text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis font-medium">{value}%</span>
		</ProgressCircle>
	)
}

export default CircleProgress