import { Domain, DomainContext } from '@context/DomainContext'
import { useAuth } from '@hooks/useAuth'
import config from '@utils/env'
import { isNullOrWhiteSpace } from '@utils/index'
import { BaseResponse } from '@utils/interface'
import { validateFetch } from '@utils/middleware'
import { useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

async function getAuthentication(ticket: string, domainKey: Domain | null | undefined): Promise<BaseResponse<string>> {
	const domain = domainKey === 'crescendo' ? config.cresBackOfficeApi : config.gpiBackOfficeApi
	const url = `${domain}api/authentication/?ticket=${ticket}`

	const requestOptions: RequestInit = {
		method: 'GET'
	}

	return fetch(url, requestOptions).then(async data => await validateFetch<string>(data))
}

export const useSecurityCheck = () => {
	const { decodedAuth, setAuthToken, CasLogout } = useAuth()
	const [domainkey] = useContext(DomainContext)
	const [searchParams] = useSearchParams()

	const navigate = useNavigate()

	const securityCheck = async () => {
		if (!decodedAuth?.isAuthenticated) {
			const params = searchParams.get('ticket') || ''

			const res = await getAuthentication(params, domainkey)
			if (!isNullOrWhiteSpace(res?.value)) {
				setAuthToken(res.value)
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
