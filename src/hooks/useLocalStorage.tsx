import { useState } from 'react'

export const useLocalStorage = <T,>(keyName: string, defaultValue?: T): [T | undefined, (val: T) => void] => {
	const [storedValue, setStoredValue] = useState<T | undefined>(() => {
		try {
			const value = window.localStorage.getItem(keyName)
			if (value) {
				return value[0] === '{' && value[value.length - 1] === '}' ? JSON.parse(value) : value
			} else {
				window.localStorage.setItem(keyName, JSON.stringify(defaultValue))
				return defaultValue
			}
		} catch (err) {
			return defaultValue
		}
	})
	const setValue = (newValue: T) => {
		window.localStorage.setItem(keyName, typeof newValue === 'string' ? newValue : JSON.stringify(newValue))
		setStoredValue(newValue)
	}
	return [storedValue, setValue]
}
