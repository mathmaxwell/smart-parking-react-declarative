import ReactDOM from 'react-dom'
import App from './App'
import { ThemeProvider } from '@mui/material'
import THEME_DARK from './config/theme'
import { LoaderProvider } from './hooks/useLoader'
import { LangProvider } from './language/LangProvider'

ReactDOM.render(
	<LangProvider>
		<LoaderProvider>
			<ThemeProvider theme={THEME_DARK}>
				<App />
			</ThemeProvider>
		</LoaderProvider>
	</LangProvider>,
	document.getElementById('root')
)
