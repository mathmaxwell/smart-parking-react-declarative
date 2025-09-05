import { create } from 'zustand'
import uz from './uz'
import ru from './ru'

type Language = 'uz' | 'ru'

interface LangState {
	lang: Language
	t: typeof uz
	setLang: (lang: Language) => void
}

export const useLangStore = create<LangState>(set => ({
	lang: 'uz',
	t: uz,
	setLang: lang =>
		set(() => ({
			lang,
			t: lang === 'uz' ? uz : ru,
		})),
}))
