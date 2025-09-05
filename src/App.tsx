import { Scaffold2, Switch } from 'react-declarative'
import './App.css'
import history, { useRouteItem } from './helpers/history'
import sidemenu from './config/siteMenu'
import routes, { sideMenuClickMap } from './config/Routes'
import { APP_NAME } from './config/params'
import scaffoldactions from './config/scaffoldmenu'
function App() {
	const item = useRouteItem()
	return (
		<Scaffold2
			appName={APP_NAME}
			noSearch
			activeOptionPath={item?.sideMenu || ''}
			options={sidemenu}
			actions={scaffoldactions}
			onOptionClick={path => {
				history.push(sideMenuClickMap[path])
			}}
		>
			<Switch items={routes} history={history} />
		</Scaffold2>
	)
}

export default App
