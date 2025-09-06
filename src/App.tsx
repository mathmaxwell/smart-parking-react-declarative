import { Scaffold2, Switch } from 'react-declarative'
import './App.css'
import history, { useRouteItem } from './helpers/history'
import sidemenu from './config/siteMenu'
import routes, { sideMenuClickMap } from './config/Routes'
import { APP_NAME } from './config/params'
import useLoader from './hooks/useLoader'
import Loader from './pages/Loading/Loading'
import UserInfo from './common/UserInfo'
import { useLangStore } from './language/useTranslationStore'
import scaffoldactions from './config/scaffoldmenu'
function App() {
	const { setLang, lang } = useLangStore()
	const item = useRouteItem()
	const { loader, setLoader } = useLoader()
	return (
		<Scaffold2
			loading={loader}
			noSearch
			BeforeSearch={UserInfo}
			appName={APP_NAME}
			activeOptionPath={item?.sideMenu || ''}
			options={sidemenu}
			actions={scaffoldactions}
			onOptionClick={path => {
				history.push(sideMenuClickMap[path])
			}}
			onAction={path => {
				const clickedAction = scaffoldactions.find(a => a.action === path)
				if (clickedAction?.action === 'chooseLanguage') {
					setLang(lang === 'ru' ? 'uz' : 'ru')
				} else {
					console.log('Неизвестное действие:', path)
				}
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
