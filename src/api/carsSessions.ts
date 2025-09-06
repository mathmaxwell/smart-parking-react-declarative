import { pb } from '../../pb'
import { getMomentStamp, getTimeStamp } from 'get-moment-stamp'
import type { ICars } from '../types/CarsInParking'
export async function getParkingSessions(
	page = 1,
	perPage = 50,
	plate?: string,
	startOfDay?: Date,
	endOfDay?: Date
) {
	try {
		let filter = ''
		if (plate) {
			// Поиск только по номеру
			filter = `plateNumber ~ "${plate}"`
		} else if (startOfDay && endOfDay) {
			// Поиск только по датам
			const safeEntryTime = new Date(startOfDay)
			safeEntryTime.setHours(0, 0, 0, 0)
			const safeExitTime = new Date(endOfDay)
			safeExitTime.setHours(0, 0, 0, 0)
			const startDay = getMomentStamp(safeEntryTime)
			const endDay = getMomentStamp(safeExitTime)
			const startMinute = getTimeStamp(startOfDay)
			const endMinute = getTimeStamp(endOfDay)
			filter = `
(
  (
    enterMomentStampDay < ${endDay}
    || (enterMomentStampDay = ${endDay} && enterMomentStamp <= ${endMinute})
  )
  &&
  (
    exitMomentStampDay > ${startDay}
    || (exitMomentStampDay = ${startDay} && exitMomentStamp >= ${startMinute})
  )
)
`
		}
		const result = await pb
			.collection('ParkingSessions')
			.getList(page, perPage, {
				filter: filter || undefined,
				expand: 'car.type',
				sort: '-enterMomentStampDay,-enterMomentStamp',
			})

		return result
	} catch (err) {
		console.error(`Error fetching ParkingSessions: ${err}`)
		return { items: [], totalItems: 0 }
	}
}
export async function getCarsByType(
	typeId: string,
	owner?: string,
	plate?: string
) {
	try {
		let filters: string[] = []
		if (typeId) filters.push(`type = "${typeId}"`)

		if (owner) {
			filters.push(`ownerName ~ "${owner}"`)
		}
		if (plate) {
			filters.push(`plateNumber ~ "${plate}"`)
		}
		const filterQuery = filters.join(' && ')
		const result = await pb.collection('Cars').getList<ICars>(1, 200, {
			filter: filterQuery,
			expand: 'type',
		})

		return result.items
	} catch (err) {
		alert(`Ошибка при получении машин по типу: ${err}`)
		return []
	}
}
