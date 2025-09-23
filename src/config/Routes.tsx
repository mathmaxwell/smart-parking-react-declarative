import type { ISwitchItem } from 'react-declarative'
import DashboardPage from '../pages/DashboardPage/DashboardPage'
import CarsSessions from '../pages/CarsSessions/CarsSessions'

import CameraSettings from '../pages/CameraSettings/CameraSettings'
import HistoryPage from '../pages/HistoryPage/HistoryPage'

import Subscriptions from '../pages/Subscriptions/Subscriptions'
import Tariff from '../pages/Tariffs/Tariff'

interface IRouteItem extends ISwitchItem {
	sideMenu: string
}

export const routes: IRouteItem[] = [
	{
		path: '/',
		sideMenu: 'root.example_pages.cars_sessions',
		redirect: '/cars_sessions',
	},
	{
		path: '/cars_sessions',
		sideMenu: 'root.example_pages.cars_sessions',
		element: CarsSessions,
	},
	{
		path: '/cars_sessions/:id',
		sideMenu: 'root.example_pages.cars_sessions',
		element: HistoryPage,
	},
	{
		path: '/dashboard',
		sideMenu: 'root.example_pages.dashboard',
		element: DashboardPage,
	},

	{
		path: '/tariffs',
		sideMenu: 'root.example_pages.tariffs',
		element: Tariff,
	},
	{
		path: '/subscriptions',
		sideMenu: 'root.example_pages.subscriptions',
		element: Subscriptions,
	},
	{
		path: '/camera_settings',
		sideMenu: 'root.example_pages.camera_settings',
		element: CameraSettings,
	},
]

export const sideMenuClickMap: Record<string, string> = {
	'root.example_pages.cars_sessions': '/cars_sessions',
	'root.example_pages.dashboard': '/dashboard',
	'root.example_pages.subscriptions': '/subscriptions',
	'root.example_pages.tariffs': '/tariffs',
	'root.example_pages.camera_settings': '/camera_settings',
}

export default routes
