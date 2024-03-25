import { Card, Col, CustomTooltipProps, DonutChart, Grid, Legend, Title, ValueFormatter } from '@tremor/react'
import { twMerge } from 'tailwind-merge'

interface PieChartProps {
	data: Array<[string, string | number]>
	title?: string | JSX.Element
	variant?: 'pie' | 'donut'
	valueFormatter?: ValueFormatter
	cardClassName?: string
	customValue?: ({ name, value }: { name?: string | number, value?: string | number | (string | number)[] }) => string
}
const PieChart = ({ variant, title, data: pData, valueFormatter, cardClassName, customValue }: PieChartProps) => {
	const data = pData.map(val => ({ name: val[0], value: val[1] }))
	const legendCategories = data.map(val => val.name)
	return (
		<Card className={twMerge('w-[100%]', cardClassName)}>
			<Title>{title}</Title>
			<Grid numItems={3} className='m-4 my-6 gap-12'>
				<Col numColSpan={2} className='aspect-square'>
					<DonutChart
						data={data}
						category='value'
						index='name'
						showAnimation
						animationDuration={500}
						variant={variant || 'pie'}
						customTooltip={(props: CustomTooltipProps) => {
							const { payload, active } = props
							if (!active || !payload) return null
							const categoryPayload = payload?.[0]
							if (!categoryPayload) return null
							return (
								<div className="w-56 rounded-tremor-default border border-color bg-tremor-background dark:bg-dark-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
									<div className="flex flex-1 space-x-2.5">
										<div
											className={`flex w-1.5 flex-col bg-${categoryPayload?.color}-500 rounded`}
										/>
										<div className="w-full">
											<div className="flex items-center justify-between space-x-8">
												<p className="whitespace-nowrap text-right text-tremor-content dark:text-dark-tremor-content">
													{categoryPayload.name}
												</p>
												<p className="whitespace-nowrap text-right font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
													{customValue ? customValue({ name: categoryPayload.name, value: categoryPayload.value }) : categoryPayload.value}
												</p>
											</div>
										</div>
									</div>
								</div>
							)
						}}
						valueFormatter={valueFormatter}
					/>
				</Col>
				<Legend
					className='*:flex-col'
					categories={legendCategories}
				/>
			</Grid>

		</Card>
	)
}

export default PieChart
