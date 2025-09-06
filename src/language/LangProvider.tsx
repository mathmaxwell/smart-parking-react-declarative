import React, { createContext, useContext } from 'react'
import { useLangStore } from './useTranslationStore'

const LangContext = createContext<ReturnType<typeof useLangStore> | null>(null)

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const store = useLangStore()
	return <LangContext.Provider value={store}>{children}</LangContext.Provider>
}

export const useLang = () => {
	const ctx = useContext(LangContext)
	if (!ctx) throw new Error('useLang must be used inside LangProvider')
	return ctx
}
