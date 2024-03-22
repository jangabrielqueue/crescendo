import { useState } from 'react'

export const useLocalStorage = <T,>(keyName: string, defaultValue?: T): [T, (val: T) => void] => {
	const [storedValue, setStoredValue] = useState<T>(() => {
		const value = window.localStorage.getItem(keyName)
		try {
			if (value) {
				return JSON.parse(value)
			} else {
				window.localStorage.setItem(keyName, JSON.stringify(defaultValue))
				return defaultValue
			}
		} catch (err) {
			return value || defaultValue
		}
	})
	const setValue = (newValue: T) => {
		window.localStorage.setItem(keyName, typeof newValue === 'string' ? newValue : JSON.stringify(newValue))
		setStoredValue(newValue)
	}
	return [storedValue, setValue]
}
