import { singleshot, Subject } from 'react-declarative-lite'

import { LOCALE as LOCALE_EN } from '../i18n/locale/locale.en'
import { LOCALE as LOCALE_RU } from '../i18n/locale/locale.ru'
import { LOCALE as LOCALE_UZ } from '../i18n/locale/locale.uz'
export type Locale = keyof typeof localeMap

export const getLocale = singleshot((): keyof typeof localeMap => {
	const url = new URL(location.href, window.location.origin)
	// @ts-ignore
	return url.searchParams.get('locale') || 'ru'
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
	eng: 'eng',
	ru: 'ru',
	uz: 'uz',
}

export function t(str: string) {
	const lang = getLocale()
	const locale = localeMap[lang]
	return locale ? locale[str] || str : str
}

export default t
