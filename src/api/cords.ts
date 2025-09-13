import { pb } from '../../pb'
import type { ICordsOfBack } from '../pages/CameraSettings/RoiView/functions'

export async function getCords() {
	try {
		const result = await pb.collection('Settings').getList<ICordsOfBack>()
		return result
	} catch (err) {
		alert(`Error fetching ParkingSessions: ${err}`)
		return { items: [], totalItems: 0, page: 1, perPage: 0 }
	}
}
