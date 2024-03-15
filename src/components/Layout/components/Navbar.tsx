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
	active: 'text-slate-50 font-semibold',
	navbar: 'w-full sticky top-0 z-nav shadow-tremor-card dark:shadow-dark-tremor-card',
	switch: 'text-tremor-brand-inverted cursor-pointer active:scale-125',
	upperNav: 'bg-tremor-brand p-3 px-6 flex items-center justify-between w-full',
	lowerNav: 'bg-dark-tremor-background-muted p-2',
	navList: 'flex gap-3 flex-wrap text-slate-300 text-sm'
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
				<Logo />
				{/* <DomainSelect /> */}
				<div className='flex gap-4 items-center'>
					<SwitchIcon toggle={toggle} checked={isDarkmode} />
					<AccountDropdown />
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
