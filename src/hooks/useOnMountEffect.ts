import { useEffect, useRef } from 'react'

const useOnMountEffect = (callback: () => void): void => {
	const renderRef = useRef(true)
	return useEffect(() => {
		if (renderRef.current) {
			callback()
			return () => {
				renderRef.current = false
			}
		}
	}, [callback])
}

export default useOnMountEffect
