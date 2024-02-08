import { useStateChangeEffect } from '@hooks/useStateChangeEffect'
import { VectorMap } from '@react-jvectormap/core'
import { worldMill } from '@react-jvectormap/world'
import { useCallback, useState } from 'react'

const RegionMap = ({ values }: { values: { [key: string]: number }, customTooltip?: (code: string) => string }) => {
	const [valueRef, setValueRef] = useState<typeof values | null>(values)

	useStateChangeEffect(() => {
		setValueRef(values)
	}, [values])

	const renderMap = useCallback(() => {
		return (
			<VectorMap
				map={worldMill}
				className='h-72'
				backgroundColor="transparent"

				// markers={missingCountries[0]}
				// onRegionTipShow={(ev, el, code) => {
				// 	el.innerHTML = (`
				//     <div>Tooltip<div>
				//   `)
				// }}
				// series={{
				// 	regions: [
				// 		{
				// 			scale: colorScale,
				// 			values: countries,
				// 			min: 0,
				// 			max: 100,
				// 		},
				// 	],
				// }}
				series={{
					regions: [
						{
							values,
							// scale: ['#636363', '#464646', '#3a3a3a', '#2c2c2c', '#1a1a1a', '#141414'],
							scale: ['#3b82f6', '#06b6d4', '#0ea5e9', '#6366f1', '#8b5cf6', '#a855f7'],
							attribute: 'fill',
							normalizeFunction: 'polynomial'
						}
					]
				}}
				onRegionTipShow={(_, label, code) => {
					// @ts-expect-error ts(2339)
					return label.html(`
				          <div class="tooltip rounded-sm bg-tremor-content-emphasis absolute -top-4 -left-20 text-tremor-content-faint p-1 w-32 text-center">
				            <p>
                      ${`${code} (UserCount: ${values[code] || 0})`}
				            </p>
				            </div>`)
				}}
				// selectedRegions={['US']}
				regionStyle={{
					initial: {
						fill: '#22c55e'
					},
				}}
			// onMarkerClick={function (event, code) {
			// 	setName(missingCountries[0][code].name)
			// }}
			// onMarkerTipShow={function markerTip(event, label, code) {
			// 	return label.html(`
			//     <div class="label">
			//       <p>
			//       <b>
			//       <h2 class="label-name">${label.html()}, ${
			// 	missingCountries[0][code].year
			// 		? missingCountries[0][code].year.match(/^\d{4}/)[0]
			// 		: 'unknown'
			// }</h2>
			//           <p class="label-composition">Composition:</p> <h4 class="composition-value">${
			// missingCountries[0][code].composition
			// 	? missingCountries[0][code].composition
			// 	: 'unknown'
			// }</h4> 
			//           <p class="label-mass">Mass: </p><h4 class="mass-value">${
			// missingCountries[0][code].mass
			// 	? missingCountries[0][code].mass
			// 		.toString()
			// 		.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			// 	: 'unknown'
			// }</h4>
			//           <p class="label-status">Status:</p><h4 class="status-value"> ${
			// missingCountries[0][code].status
			// 	? missingCountries[0][code].status
			// 	: 'unknown'
			// } </h4>
			//           </b>
			//           </p>
			//           </div>`)
			// 		}}
			/>
		)
	}, [values])

	return (
		<div className='bg-transparent h-72'>
			{valueRef === values && renderMap()}
		</div>

	)
}

export default RegionMap