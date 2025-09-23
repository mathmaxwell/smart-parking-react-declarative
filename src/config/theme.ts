import { createTheme } from '@mui/material'

export const themes = {
	light: createTheme({
		palette: {
			mode: 'light',
			primary: { main: '#1976d2' },
			secondary: { main: '#1976d2' },
			text: {
				primary: 'rgba(0, 0, 0, 0.87)',
				secondary: 'rgba(0, 0, 0, 0.54)',
				disabled: 'rgba(0, 0, 0, 0.38)',
			},
			background: {
				default: '#fff',
				paper: '#f5f5f5',
			},
		},
	}),
	dark: createTheme({
		palette: {
			mode: 'dark',
			primary: { main: '#90cbf9' },
			secondary: { main: '#90cbf9' },
			text: {
				primary: '#fff',
				secondary: 'rgba(255, 255, 255, 0.7)',
				disabled: 'rgba(255, 255, 255, 0.5)',
			},
			background: {
				paper: '#424242',
				default: '#212121',
			},
		},
	}),
}

let currentThemeName: keyof typeof themes =
	(localStorage.getItem('currentThemeName') as keyof typeof themes) || 'light'

export let currentTheme = themes[currentThemeName]

export const switchTheme = (themeName: keyof typeof themes) => {
	if (themes[themeName]) {
		currentThemeName = themeName
		currentTheme = themes[themeName]
		localStorage.setItem('currentThemeName', themeName)
		return true
	}
	return false
}

export const getCurrentTheme = () => currentThemeName

export const getAvailableThemes = () =>
	Object.keys(themes) as Array<keyof typeof themes>

export const THEME_LIGHT = themes.light
export const THEME_DARK = themes.dark

export default currentTheme
