import type { IScaffold2Group } from 'react-declarative'
import TaxiAlertIcon from '@mui/icons-material/TaxiAlert'
import PublicIcon from '@mui/icons-material/Public'
import HomeIcon from '@mui/icons-material/Home'
import PaidIcon from '@mui/icons-material/Paid'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'

export const sidemenu: IScaffold2Group[] = [
	{
		id: 'example_pages',
		icon: PublicIcon,
		noHeader: true,
		children: [
			{
				label: 'dashboard',
				id: 'dashboard',
				icon: HomeIcon,
			},
			{
				label: 'carsInParking',
				id: 'cars_sessions',
				icon: TaxiAlertIcon,
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
