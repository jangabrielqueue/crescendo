import { createContext } from 'react'
import { useLocalStorage } from '@hooks/useLocalStorage'
import config from '@utils/env'

export const AuthContext = createContext<[string | null | undefined, (val: string | null) => void]>([null, () => { }])

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const authToken = useLocalStorage<string | null>(config.authKey, null)
	return <AuthContext.Provider value={authToken}>{children}</AuthContext.Provider>
}
