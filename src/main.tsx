import ReactDOM from 'react-dom'
import App from './App'
import { ThemeProvider } from '@mui/material'
import THEME_DARK from './config/theme'

ReactDOM.render(
	<ThemeProvider theme={THEME_DARK}>
		<App />
	</ThemeProvider>,
	document.getElementById('root')
)
