import { type IScaffold2Action } from 'react-declarative'

import LanguageIcon from '@mui/icons-material/Language'
export const scaffoldactions: IScaffold2Action[] = [
	{
		action: 'chooseLanguage',
		icon: LanguageIcon,
		label: 'chooseLanguage',
	},
	// {
	// 	action: 'uzb',
	// 	label: 'oʻzbek tili',
	// },
	// {
	// 	action: 'rus',
	// 	label: 'русский язык',
	// },
	// {
	// 	action: 'eng',
	// 	label: 'english language',
	// },
]

export default scaffoldactions
