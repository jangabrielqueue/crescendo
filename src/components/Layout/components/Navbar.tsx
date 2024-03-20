import { NavLink as RouterNavLink } from 'react-router-dom'
import { SunIcon, MoonIcon, PuzzlePieceIcon, ChartPieIcon, UsersIcon, ClipboardDocumentListIcon, ChartBarIcon, TrophyIcon, BanknotesIcon, ServerStackIcon } from '@heroicons/react/16/solid'
import Logo from './Logo'
import AccountDropdown from './AccountDropdown'

interface NavbarProps {
	toggle: () => void
	isDarkmode: boolean
}
interface NavLinkProps {
	to: string
	label: string
	icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
		title?: string | undefined;
		titleId?: string | undefined;
	} & React.RefAttributes<SVGSVGElement>>
}

const navs: NavLinkProps[] = [
	{
		to: '/gamelist',
		label: 'Game List',
		icon: PuzzlePieceIcon
	},
	{
		to: '/dashboard',
		label: 'Dashboard',
		icon: ChartPieIcon
	},
	{
		to: '/memberlist',
		label: 'Member List',
		icon: UsersIcon
	},
	{
		to: '/gamehistory',
		label: 'Game History',
		icon: ClipboardDocumentListIcon
	},
	{
		to: '/winlose?uiFormat=2',
		label: 'Reports',
		icon: ChartBarIcon
	},
	{
		to: '/tournament',
		label: 'Tournament',
		icon: TrophyIcon
	},
	{
		to: '/jackpot',
		label: 'Jackpot',
		icon: BanknotesIcon
	},
	{
		to: '/gameservices',
		label: 'System',
		icon: ServerStackIcon
	}
]

const styles = {
	active: 'text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold',
	navbar: 'flex flex-col items-center w-full sticky top-0 z-nav shadow-tremor-card backdrop-blur-lg dark:shadow-dark-tremor-dropdown',
	switch: 'text-tremor-content-strong dark:text-dark-tremor-content-strong cursor-pointer active:scale-125',
	upperNav: 'py-5 flex justify-center w-full border-b border-color bg-transparent',
	upperNavContent: 'flex items-center justify-between w-full max-w-7xl',
	lowerNav: 'py-3 w-full max-w-4xl bg-transparent',
	navList: 'flex gap-3 justify-between max-md:justify-start flex-wrap text-tremor-content text-sm'
}

const SwitchIcon = ({ toggle, checked }: { toggle: () => void, checked: boolean }) => {
	const Icon = checked ? MoonIcon : SunIcon
	return (<Icon onClick={toggle} height={25} className={styles.switch} />)

}
const NavLink = ({ to, label, icon: Icon }: NavLinkProps) => (
	<RouterNavLink
		to={to}
		className={({ isActive }) => `${isActive ? styles.active : ''} flex items-center gap-1`}
	>
		<Icon height={16} /> {label}
	</RouterNavLink>
)

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
			<div className={styles.lowerNav}>
				<ul className={styles.navList}>
					{navs.map((nav) => <NavLink key={nav.to} {...nav} />)}
				</ul>
			</div>
		</nav>
	)
}

export default Navbar
