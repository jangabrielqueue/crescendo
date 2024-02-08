import Layout from '@components/Layout/Layout'
import useOnMountEffect from '@hooks/useOnMountEffect'
import { useSecurityCheck } from './api'

const Authentication = () => {
	const securityCheck = useSecurityCheck()
	useOnMountEffect(() => {
		securityCheck()
	})
	return (
		<Layout>
      Authenticating...
		</Layout>
	)
}

export default Authentication
