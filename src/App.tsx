import {
	Navigate,
	RouterProvider,
	createBrowserRouter
} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AuthLayout from '@components/Layout/AuthLayout'
import Authentication from '@pages/auth'

import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import useLocale from './trans'
import { DomainProvider } from '@context/DomainContext'
import SnackbarProvider from '@context/SnackbarContext'
import WelcomePage from './pages'
import { SWRConfig } from 'swr'
import GameList from '@pages/gamelist'
import GameConfigure from '@pages/gamelist/configure'
import Dashboard from '@pages/dashboard'
import MemberList from '@pages/memberlist'
import GameHistory from '@pages/gamehistory'
import WinLose from '@pages/winlose'
import Tournament from '@pages/tournament'
import Jackpot from '@pages/jackpot'
import JackpotContributions from '@pages/jackpot/contributions'
import JackpotWinners from '@pages/jackpot/winners'
import ModalProvider from '@context/ModalContext'
import GameServices from '@pages/gameservices'
import { useMiddleware } from '@utils/middleware'


const router = createBrowserRouter([
	{
		path: '/',
		element: <AuthLayout><WelcomePage /></AuthLayout>
	},
	{
		path: '/auth',
		element: <Authentication />
	},
	{
		path: '/gamelist',
		element: <AuthLayout><GameList /></AuthLayout>
	},
	{
		path: '/gamelist/configure/:id',
		element: <AuthLayout><GameConfigure /></AuthLayout>
	},
	{
		path: '/dashboard',
		element: <AuthLayout><Dashboard /></AuthLayout>
	},
	{
		path: '/memberlist',
		element: <AuthLayout><MemberList /></AuthLayout>
	},
	{
		path: '/gamehistory',
		element: <AuthLayout><GameHistory /></AuthLayout>
	},
	{
		path: '/winlose',
		element: <AuthLayout><WinLose /></AuthLayout>
	},
	{
		path: '/tournament',
		element: <AuthLayout><Tournament /></AuthLayout>
	},
	{
		path: '/jackpot',
		element: <AuthLayout><Jackpot /></AuthLayout>
	},
	{
		path: '/jackpot/contributions',
		element: <AuthLayout><JackpotContributions /></AuthLayout>
	},
	{
		path: '/jackpot/winners',
		element: <AuthLayout><JackpotWinners /></AuthLayout>
	},
	{
		path: '/gameservices',
		element: <AuthLayout><GameServices /></AuthLayout>
	},
	{
		path: '*',
		element: <Navigate to='/gamelist' />
	}
])

const SWRConfigProvider = ({ children }: { children: React.ReactNode }) => {
	const middleware = useMiddleware()
	return (
		<SWRConfig value={{ use: [middleware] }}>
			{children}
		</SWRConfig>
	)
}
const App = () => {
	useLocale('en')
	return (
		<I18nProvider i18n={i18n}>
			<DomainProvider>
				<AuthProvider>
					<SnackbarProvider>
						<SWRConfigProvider>
							<ModalProvider>
								<RouterProvider router={router} />
							</ModalProvider>
						</SWRConfigProvider>
					</SnackbarProvider>
				</AuthProvider>
			</DomainProvider>
		</I18nProvider>
	)
}

export default App
