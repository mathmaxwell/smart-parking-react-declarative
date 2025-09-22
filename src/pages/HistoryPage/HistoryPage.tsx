import { FetchView, One } from 'react-declarative'
import { header } from './view/Fields'
import { getAllParkingSessions, getCars } from '../../api/carsSessions'

const HistoryPage = ({ plateNumber }: { plateNumber: string }) => {
	return (
		<>
			<One fields={header} />
			<FetchView
				state={async () => {
					const sessions = await getAllParkingSessions(
						undefined,
						undefined,
						plateNumber
					)
					const type = await getCars(1, 200, plateNumber)
					return { sessions, type }
				}}
			>
				{async dashboard => {
					return <>{dashboard.sessions[0].enterMomentStamp}</>
				}}
			</FetchView>
		</>
	)
}

export default HistoryPage
