import { BanknotesIcon, ChartBarIcon, ChartPieIcon, ChevronLeftIcon, ChevronRightIcon, ClipboardDocumentListIcon, PuzzlePieceIcon, ServerStackIcon, TrophyIcon, UsersIcon } from '@heroicons/react/16/solid'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { Divider, Icon } from '@tremor/react'
import { NavLink as RouterNavLink } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

interface NavLinkProps {
  to: string
  label: string
  isOpen?: boolean
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>>
}

const styles = {
  sidebar: 'relative border border-color w-60 shadow-tremor-card pt-[77px] px-4 flex flex-col justify-start items-center transition-all',
  navList: ' flex gap-2 flex-col w-full overflow-hidden text-nowrap',
  nav: 'flex items-center gap-1 p-2 rounded-lg w-full transition-all hover:bg-tremor-background-subtle dark:hover:bg-dark-tremor-background-subtle dark:text-dark-tremor-content',
  active: 'text-tremor-brand-inverted dark:text-dark-tremor-content-strong font-semibold bg-tremor-brand  hover:bg-tremor-brand-emphasis dark:hover:bg-tremor-brand-emphasis',
  toggle: 'cursor-pointer hover:text-tremor-brand-emphasis w-fit'
}

const navs: NavLinkProps[] = [
  { to: '/gamelist', label: 'Game List', icon: PuzzlePieceIcon },
  { to: '/dashboard', label: 'Dashboard', icon: ChartPieIcon },
  { to: '/memberlist', label: 'Member List', icon: UsersIcon },
  { to: '/gamehistory', label: 'Game History', icon: ClipboardDocumentListIcon },
  { to: '/winlose?uiFormat=2', label: 'Reports', icon: ChartBarIcon },
  { to: '/tournament', label: 'Tournament', icon: TrophyIcon },
  { to: '/jackpot', label: 'Jackpot', icon: BanknotesIcon },
  { to: '/gameservices', label: 'System', icon: ServerStackIcon }
]

const NavLink = ({ to, label, isOpen, icon: Icon }: NavLinkProps) => (
  <RouterNavLink
    to={to}
    {...!isOpen ? { title: label } : {}}
    // className={({ isActive }) => `${isActive ? styles.active : ''} ${styles.nav}`}
    className={({ isActive }) => twMerge(styles.nav, isActive ? styles.active : '')}
  >
    <Icon height={22} /> {isOpen && label}
  </RouterNavLink>
)

const Sidebar = () => {
  const [isOpen, setIsOpen] = useLocalStorage('sidebaropen', true)
  return (
    <>
      <div className={twMerge(styles.sidebar, !isOpen && ' w-20')}>
        <Divider className='mt-0' />
        <ul className={styles.navList}>
          {navs.map((nav) => <NavLink isOpen={isOpen} key={nav.to} {...nav} />)}
        </ul>
        <Icon icon={isOpen ? ChevronLeftIcon : ChevronRightIcon} className={styles.toggle} onClick={() => setIsOpen(!isOpen)} />
      </div>
    </>
  )
}

export default Sidebar
