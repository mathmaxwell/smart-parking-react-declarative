import { Scaffold2, Switch, useSearchState } from 'react-declarative'
import './App.css'
import history, { useRouteItem } from './helpers/history'
import sidemenu from './config/siteMenu'
import routes, { sideMenuClickMap } from './config/Routes'
import useLoader from './hooks/useLoader'
import Loader from './pages/Loading/Loading'
import UserInfo from './common/UserInfo'
import scaffoldactions from './config/scaffoldmenu'
import { currentServerName, servers, switchServer } from '../pb'
import { switchTheme, themes } from './config/theme'

function App() {
	const [_, setSearchState] = useSearchState<{ locale: string }>({
		locale: 'uz',
	})
	const item = useRouteItem()
	const { loader, setLoader } = useLoader()
	return (
		<Scaffold2
			loading={loader}
			noSearch
			BeforeSearch={UserInfo}
			appName={currentServerName}
			activeOptionPath={item?.sideMenu || ''}
			options={sidemenu}
			actions={scaffoldactions}
			onOptionClick={path => {
				history.push(sideMenuClickMap[path])
			}}
			onAction={path => {
				if (path === 'uzb') {
					localStorage.setItem('lang', 'uz')
					setSearchState(prevState => ({
						...prevState,
						locale: 'uz',
					}))
				} else if (path === 'rus') {
					localStorage.setItem('lang', 'ru')
					setSearchState(prevState => ({
						...prevState,
						locale: 'ru',
					}))
				} else if (path === 'eng') {
					localStorage.setItem('lang', 'eng')
					setSearchState(prevState => ({
						...prevState,
						locale: 'eng',
					}))
				} else {
					if (servers[path as keyof typeof servers]) {
						switchServer(path as keyof typeof servers)
					} else if (themes[path as keyof typeof themes]) {
						switchTheme(path as keyof typeof themes)
					} else {
						console.log('не найдено', path)
					}
				}
				setTimeout(() => {
					window.location.reload()
				}, 1000)
			}}
		>
			<Switch
				Loader={Loader}
				items={routes}
				history={history}
				onLoadStart={() => setLoader(true)}
				onLoadEnd={() => setLoader(false)}
			/>
		</Scaffold2>
	)
}

export default App
