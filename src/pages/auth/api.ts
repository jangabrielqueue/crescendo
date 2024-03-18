import { useAuth } from '@hooks/useAuth'
import config from '@utils/env'
import { domainedFetch } from '@utils/newMiddleware'
import { useNavigate, useSearchParams } from 'react-router-dom'

async function getAuthentication(ticket: string) {
	const url = `cas/callback?ticket=${ticket}`
	const requestOptions: RequestInit = {
		method: 'GET'
	}

	return await domainedFetch<string>(url, requestOptions)
}

export const useSecurityCheck = () => {
	const { decodedAuth, setAuthToken, CasLogout } = useAuth()
	const [searchParams] = useSearchParams()

	const navigate = useNavigate()

	const securityCheck = async () => {
		if (!decodedAuth?.isAuthenticated) {
			const params = searchParams.get('ticket') || ''

			const res = await getAuthentication(params)
			if (typeof res === 'string') {
				setAuthToken(res)
				navigate('/dashboard')
			} else {
				CasLogout()
			}
		} else {
			navigate(config.relativeRoot)
		}
	}

	return securityCheck
}
