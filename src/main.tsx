import ReactDOM from 'react-dom'
import App from './App'
import { ThemeProvider } from '@mui/material'
import THEME_DARK from './config/theme'
import { LoaderProvider } from './hooks/useLoader'
import { LangProvider } from './language/LangProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModalProvider } from 'react-declarative'
const queryClient = new QueryClient()
ReactDOM.render(
	<ModalProvider>
		<LangProvider>
			<LoaderProvider>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={THEME_DARK}>
						<App />
					</ThemeProvider>
				</QueryClientProvider>
			</LoaderProvider>
		</LangProvider>
	</ModalProvider>,
	document.getElementById('root')
)
