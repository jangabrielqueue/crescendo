const replaceKey = '{domain}'


const host = window.location.host.split('.')
let domain = ''
if (host.length > 2) {
	host.splice(0, 1)
	domain = host.join('.')
}

const config = {
	oldBackOffice: String(import.meta.env.VITE_APP_OLD_BACK_OFFICE).replace(replaceKey, domain),
	gpiBackOfficeApi: String(import.meta.env.VITE_APP_GPI_BACK_OFFICE_API).replace(replaceKey, domain),
	cresBackOfficeApi: String(import.meta.env.VITE_APP_CRESCENDO_BACK_OFFICE_API).replace(replaceKey, domain),
	betHistoryUrl: String(import.meta.env.VITE_APP_BET_HISTORY_URL).replace(replaceKey, domain),
	relativeRoot: import.meta.env.VITE_APP_RELATIVE_ROOT,
	isProduction: import.meta.env.VITE_APP_IS_PRODUCTION,
	casURL: String(import.meta.env.VITE_APP_CAS_URL).replace(replaceKey, domain),
	casClientId: import.meta.env.VITE_APP_CAS_CLIENT_ID,
	casOperator: import.meta.env.VITE_APP_CAS_OPERATOR,
	casUseNextAction: import.meta.env.VITE_APP_CAS_USE_NEXTACTION,
	authKey: import.meta.env.VITE_APP_AUTH_KEY,
	cresAuthKey: import.meta.env.VITE_APP_CRES_AUTH_KEY
}

export default config
