import { useAuth } from '@hooks/useAuth'
import Layout from './Layout'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	const { CasLogin, authToken, decodedAuth } = useAuth()

	if (!authToken || !decodedAuth?.isAuthenticated) {
		CasLogin()
	}
	return <Layout>{children}</Layout>
}

export default AuthLayout
