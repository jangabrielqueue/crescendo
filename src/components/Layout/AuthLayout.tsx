import { useAuth } from '@hooks/useAuth'
import Layout from './Layout'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	const { CasLogout, authToken, decodedAuth } = useAuth()

	if (!authToken || !decodedAuth?.isAuthenticated) {
		CasLogout()
	}
	return <Layout>{children}</Layout>
}

export default AuthLayout
