import { One } from 'react-declarative'
import { fields } from './view/Fileds'
import { getCords } from '../../api/cords'
import { getParkingSessions } from '../../api/carsSessions'

const CameraSettings = () => {
	return (
		<>
			<One
				fields={fields}
				handler={async () => ({
					photo: {
						photo: await getParkingSessions(1, 1),
						cords: await getCords(),
					},
				})}
			/>
		</>
	)
}

export default CameraSettings
