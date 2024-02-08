import useOnMountEffect from '@hooks/useOnMountEffect'
import { i18n } from '@lingui/core'

async function dynamicActivate(locale: string) {
	const { messages } = await import(`./locales/${locale}.po`)

	i18n.load(locale, messages)
	i18n.activate(locale)
}

const useLocale = (locale: string) => {
	useOnMountEffect(() => {
		void dynamicActivate(locale)
	})
}

export default useLocale
