import { Scaffold2, Switch } from 'react-declarative'
import './App.css'
import history, { useRouteItem } from './helpers/history'
import sidemenu from './config/siteMenu'
import routes, { sideMenuClickMap } from './config/Routes'
import { APP_NAME } from './config/params'
import scaffoldactions from './config/scaffoldmenu'
import useLoader from './hooks/useLoader'
import Loader from './pages/Loading/Loading'
import UserInfo from './common/UserInfo'
import { useLangStore } from './language/useTranslationStore'

function App() {
	const { t, setLang, lang } = useLangStore()
	console.log(t.April)

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

			// Loader={Loader}  говорит что не Loader не принимается в пропсах
		>
			<Switch
				Loader={Loader} //можно ли дать компонент загрузки, а не пустой компонент?
				items={routes}
				history={history}
				onLoadStart={() => setLoader(true)}
				onLoadEnd={() => setLoader(false)}
			/>
		</Scaffold2>
	)
}

export default App
