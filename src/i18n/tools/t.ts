import { singleshot, Subject } from 'react-declarative-lite'

import { LOCALE as LOCALE_EN } from '../locale/locale.en'
import { LOCALE as LOCALE_RU } from '../locale/locale.ru'
import { LOCALE as LOCALE_UZ } from '../locale/locale.uz'

export type Locale = keyof typeof localeMap

export const getLocale = singleshot((): keyof typeof localeMap => {
	const url = new URL(location.href, window.location.origin)
	// @ts-ignore
	const localLang = localStorage.getItem('lang')

	if (localLang === 'uz') {
		return 'uz'
	} else if (localLang === 'ru') {
		return 'ru'
	} else if (localLang === 'en') {
		return 'en'
	} else if (!localLang) {
		return url.searchParams.get('locale') as 'ru' | 'uz' | 'en'
	} else {
		return 'en'
	}
})

export const localeChangedSubject = new Subject<void>()

export const setLocale = (locale: keyof typeof localeMap) => {
	const url = new URL(location.href, window.location.origin)
	url.searchParams.set('locale', locale)
	getLocale.clear()
	window.history.replaceState({}, '', url)
	window.Translate.clear()
	localeChangedSubject.next()
}

export const localeMap = {
	en: LOCALE_EN,
	ru: LOCALE_RU,
	uz: LOCALE_UZ,
}

export const localeTrMap = {
	en: 'English',
	ru: 'Русский',
	uz: "O'zbek",
}

export function t(str: string) {
	const lang = getLocale()
	const locale = localeMap[lang]
	// @ts-ignore
	return locale ? locale[str] || str : str
}

export default t
