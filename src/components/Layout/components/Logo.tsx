import { useNavigate } from 'react-router-dom'
import LogoIcon from '../../../assets/logo.png'

const Logo = () => {
	const navigate = useNavigate()
	return (
		<div
			className='flex items-center gap-2 cursor-pointer'
			onClick={() => navigate('/')}
		>
			<img className='h-8' src={LogoIcon} alt='Logo' />
			<p className='text-tremor-brand-inverted font-semibold text-lg'>Slots Back Office</p>
		</div>
	)
}
export default Logo
