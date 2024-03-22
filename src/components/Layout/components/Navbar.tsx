import { SunIcon, MoonIcon } from '@heroicons/react/16/solid'
import Logo from './Logo'
import AccountDropdown from './AccountDropdown'

interface NavbarProps {
	toggle: () => void
	isDarkmode: boolean
}

const styles = {
	navbar: 'flex flex-col items-center w-full sticky top-0 z-nav shadow-tremor-card backdrop-blur-lg dark:shadow-dark-tremor-dropdown',
	switch: 'text-tremor-content-strong dark:text-dark-tremor-content-strong cursor-pointer active:scale-125',
	upperNav: 'py-5 flex justify-center w-full border-b border-color bg-transparent',
	upperNavContent: 'flex items-center justify-between w-full px-10',
}

const SwitchIcon = ({ toggle, checked }: { toggle: () => void, checked: boolean }) => {
	const Icon = checked ? MoonIcon : SunIcon
	return (<Icon onClick={toggle} height={25} className={styles.switch} />)
}

const Navbar = ({ toggle, isDarkmode }: NavbarProps) => {
	return (
		<nav className={styles.navbar}>
			<div className={styles.upperNav}>
				<div className={styles.upperNavContent}>
					<Logo />
					{/* <DomainSelect /> */}
					<div className='flex gap-4 items-center'>
						<SwitchIcon toggle={toggle} checked={isDarkmode} />
						<AccountDropdown />
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
