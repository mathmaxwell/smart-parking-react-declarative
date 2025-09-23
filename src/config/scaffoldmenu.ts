import { type IScaffold2Action } from 'react-declarative'
import { servers } from '../../pb'

const serverActions: IScaffold2Action[] = Object.entries(servers).map(
	([name]) => ({
		action: name,
		label: name,
	})
)

export const scaffoldactions: IScaffold2Action[] = [
	{
		action: 'dark',
		label: 'dark',
	},
	{
		action: 'light',
		label: 'light',
	},
	{
		action: 'uzb',
		label: 'oʻzbek tili',
	},
	{
		action: 'rus',
		label: 'русский язык',
	},
	{
		action: 'eng',
		label: 'english language',
	},
	...serverActions,
]

export default scaffoldactions
