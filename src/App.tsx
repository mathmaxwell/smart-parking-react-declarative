import { Scaffold2, sleep, Switch, useSearchState } from 'react-declarative'
import './App.css'
import history, { useRouteItem } from './helpers/history'
import sidemenu from './config/siteMenu'
import routes, { sideMenuClickMap } from './config/Routes'
import useLoader from './hooks/useLoader'
import Loader from './pages/Loading/Loading'
import UserInfo from './common/UserInfo'
import scaffoldactions from './config/scaffoldmenu'
function App() {
	const [searchState, setSearchState] = useSearchState<{ locale: string }>({
		locale: 'uz',
	})
	const item = useRouteItem()
	const { loader, setLoader } = useLoader()
	return (
		<Scaffold2
			loading={loader}
			noSearch
			BeforeSearch={UserInfo}
			appName={'ADMIN'}
			activeOptionPath={item?.sideMenu || ''}
			options={sidemenu}
			actions={scaffoldactions}
			onOptionClick={path => {
				history.push(sideMenuClickMap[path])
			}}
			onAction={path => {
				const clickedAction = scaffoldactions.find(a => a.action === path)
				if (clickedAction?.action === 'chooseLanguage') {
					const currentLocale = searchState.locale || 'eng'
					const nextLocale =
						currentLocale === 'eng'
							? 'ru'
							: currentLocale === 'ru'
							? 'uz'
							: 'eng'
					localStorage.setItem('lang', nextLocale)
					setSearchState(prevState => ({
						...prevState,
						locale: nextLocale,
					}))

					setTimeout(() => {
						window.location.reload()
					}, 1000)
				} else {
					console.log('Неизвестное действие:', path)
				}
			}}
			// onAction={path => {
			// 	const clickedAction = scaffoldactions.find(a => a.action === path)
			// 	if (clickedAction?.action === 'uzb') {
			// 		localStorage.setItem('lang', 'uzb')
			// 		setSearchState(prevState => ({
			// 			...prevState,
			// 			locale: 'uzb',
			// 		}))

			// 		setTimeout(() => {
			// 			window.location.reload()
			// 		}, 1000)
			// 	} else if (clickedAction?.action === 'rus') {
			// 		localStorage.setItem('lang', 'rus')
			// 		setSearchState(prevState => ({
			// 			...prevState,
			// 			locale: 'rus',
			// 		}))

			// 		setTimeout(() => {
			// 			window.location.reload()
			// 		}, 1000)
			// 	} else if (clickedAction?.action === 'eng') {
			// 		localStorage.setItem('lang', 'eng')
			// 		setSearchState(prevState => ({
			// 			...prevState,
			// 			locale: 'eng',
			// 		}))
			// 		setTimeout(() => {
			// 			window.location.reload()
			// 		}, 1000)
			// 	} else {
			// 		console.log('Неизвестное действие:', path)
			// 	}
			// }}
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
