import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Divider } from '@tremor/react'
import GreyLogo from '../../assets/logo-gray.png'
import Sidebar from './components/Sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
	const [darkmode, setDarkmode] = useState(localStorage.getItem('darkMode') === 'true')

	useEffect(() => {
		document.documentElement.classList.toggle('dark', darkmode)
		document.getElementsByTagName('BODY')[0].classList.toggle('dark', darkmode)
		localStorage.setItem('darkMode', String(darkmode))
	}, [darkmode])

	const toggleDarkMode = () => {
		setDarkmode((prevMode) => !prevMode)
	}
	return (
		<div className={'relative flex'}>
			<Sidebar />
			<div className='w-full flex flex-col items-center h-screen overflow-auto'>
				<Navbar toggle={toggleDarkMode} isDarkmode={darkmode} />
				<div className='px-2 w-full'>
					{children}
				</div>
				<Divider><div className='flex items-center text-xs'><img className='h-6' src={GreyLogo} alt='Logo' /> ©2023 All rights reserved</div></Divider>
			</div>
		</div>
	)
}

export default Layout
