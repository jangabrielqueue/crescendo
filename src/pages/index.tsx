import { useAuth } from '@hooks/useAuth'
import { Trans } from '@lingui/macro'

const WelcomePage = () => {
	const { decodedAuth } = useAuth()
	return (
		<div className="h-[calc(100vh-180px)] flex items-center justify-center">
			<h1 className='text-6xl font-light text-tremor-content dark:text-dark-tremor-content'><Trans>Welcome to Slots Back Office,</Trans> <b>{decodedAuth?.username || decodedAuth?.operator}.</b></h1>
		</div>
	)
}

export default WelcomePage
