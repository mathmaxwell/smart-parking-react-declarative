import type { IScaffold2Group } from 'react-declarative'
import TaxiAlertIcon from '@mui/icons-material/TaxiAlert'
import PublicIcon from '@mui/icons-material/Public'
import PaidIcon from '@mui/icons-material/Paid'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
export const sidemenu: IScaffold2Group[] = [
	{
		id: 'example_pages',
		icon: PublicIcon,
		noHeader: true,
		children: [
			{
				label: 'parking_visit',
				id: 'cars_sessions',
				icon: TaxiAlertIcon,
			},
			{
				label: 'dashboard',
				id: 'dashboard',
				icon: MonetizationOnIcon,
			},

			{
				label: 'subscriptions',
				id: 'subscriptions',
				icon: AccountBalanceWalletIcon,
			},
			{
				label: 'tariffs',
				id: 'tariffs',
				icon: PaidIcon,
			},
			{
				label: 'cameraSettings',
				id: 'camera_settings',
				icon: PhotoCameraIcon,
			},
		],
	},
]

export default sidemenu
