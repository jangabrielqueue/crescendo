import { Popover, Transition } from '@headlessui/react'
import { useAuth } from '@hooks/useAuth'
import { List, ListItem } from '@tremor/react'
import React, { useState } from 'react'
import { LockClosedIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/16/solid'
import config from '@utils/env'

const styles = {
	dropdownContainer: 'flex items-center gap-2 cursor-pointer',
	avatar: 'w-8 h-8 rounded-full bg-dark-tremor-background dark:bg-tremor-background text-center leading-8 font-semibold text-lg dark:text-tremor-content-strong text-dark-tremor-content-strong',
	userContainer: 'flex flex-col text-tremor-content-strong dark:text-dark-tremor-content-strong items-start',
	listItem: 'hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted p-2 rounded-md cursor-pointer justify-start gap-2 text-lg',
	dropdownPanel: 'absolute top-11 right-0',
	dropdownPanelContainer: 'rounded-md shadow-md w-40',
	dropdownPanelContent: 'relative rounded-sm grid gap-2 bg-tremor-background dark:bg-dark-tremor-background'
}

const AccountDropdown = () => {
	const [open, setOpen] = useState(false)
	const { decodedAuth, CasLogout } = useAuth()
	const handleToggle = () => {
		if (!open) {
			setOpen(true)
		}
	}

	const handleCas = () => {
		window.location.assign(config.casURL)
	}

	return (
		<Popover className='relative'>
			<Popover.Button className='outline-none'>
				<div
					onClick={handleToggle}
					className={styles.dropdownContainer}
				>
					<div className={styles.avatar}>
						{decodedAuth?.username && decodedAuth.username[0].toUpperCase()}
					</div>
					<div className={styles.userContainer}>
						<span className='text-sm'>{decodedAuth?.username}</span>
						<span className='text-xs'>{decodedAuth?.rolename}</span>
					</div>
				</div>
			</Popover.Button>
			<Transition
				as={React.Fragment}
				enter="transition ease-out duration-200"
				enterFrom="opacity-0 translate-y-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 translate-y-1"
			>
				<Popover.Panel className={styles.dropdownPanel}>
					<div className={styles.dropdownPanelContainer}>
						<div className={styles.dropdownPanelContent}>
							<List className='w-full'>
								<ListItem className={styles.listItem} onClick={handleCas}><LockClosedIcon height={18} />CAS</ListItem>
								<ListItem className={styles.listItem} onClick={CasLogout}><ArrowRightStartOnRectangleIcon height={18} />Logout</ListItem>
							</List>
						</div>
					</div>
				</Popover.Panel>
			</Transition>
		</Popover>
	)
}

export default AccountDropdown
