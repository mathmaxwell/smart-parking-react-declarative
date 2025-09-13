import ReactDOM from 'react-dom'
import App from './App'
import { ThemeProvider } from '@mui/material'
import THEME_DARK from './config/theme'
import { LoaderProvider } from './hooks/useLoader'
import { ModalProvider, sleep } from 'react-declarative'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import './i18n'

const wrappedApp = (
	<ModalProvider>
		<LoaderProvider>
			<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
				<ThemeProvider theme={THEME_DARK}>
					<App />
				</ThemeProvider>
			</LocalizationProvider>
		</LoaderProvider>
	</ModalProvider>
)

const init = async () => {
	// @ts-ignore
	while (!window.Translate) {
		await sleep(500)
	}
	ReactDOM.render(wrappedApp, document.getElementById('root'))
}

init()
