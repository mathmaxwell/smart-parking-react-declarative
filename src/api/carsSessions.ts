import { pb } from '../../pb'
import { getMomentStamp, getTimeStamp } from 'get-moment-stamp'
import type { ICarGroup, ICars, ICarsInParking } from '../types/CarsInParking'
import { iterateDocuments, resolveDocuments } from 'react-declarative'
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

export async function deleteParkingSessions(id: string) {
	try {
		const result = await pb.collection('ParkingSessions').delete(id)
		return result
	} catch (error) {
		console.log(error)
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

export async function getAllParkingSessions(
	startOfDay?: Date,
	endOfDay?: Date,
	plate?: string
) {
	try {
		const iterator = iterateDocuments({
			createRequest: async ({ limit, page }) => {
				const { items } = await getParkingSessions(
					page,
					limit,
					plate,
					startOfDay,
					endOfDay
				)
				return items.filter(({ entryTime, exitTime }) => {
					if (!entryTime || !exitTime) return false
					const entry = new Date(entryTime).getTime()
					const exit = new Date(exitTime).getTime()
					// 5 минут = 300_000 миллисекунд
					return exit - entry >= 300_000
				})
			},
		})

		const allItemsShort = await resolveDocuments(iterator)
		return allItemsShort as ICarsInParking[]
	} catch (err) {
		alert(`Ошибка при получении ParkingSessions: ${err}`)
		return []
	}
}

export async function getCarsByFilter(
	startOfDay?: Date,
	endOfDay?: Date,
	plate?: string
) {
	const safeEntryTime = new Date(startOfDay || '')
	safeEntryTime.setHours(0, 0, 0, 0)

	const safeExitTime = new Date(endOfDay || '')
	safeExitTime.setHours(0, 0, 0, 0)

	const startDay = getMomentStamp(safeEntryTime)
	const endDay = getMomentStamp(safeExitTime)
	const startMinute = getTimeStamp(startOfDay)
	const endMinute = getTimeStamp(endOfDay)

	try {
		let page = 1
		const perPage = 500
		let allItems: any[] = []
		let filters: string[] = []
		if (startOfDay && endOfDay) {
			filters.push(
				`(startMomentStampDay >= ${startDay} && startMomentStampDay <= ${endDay}) && ` +
					`(startMomentStamp >= ${startMinute} && startMomentStamp <= ${endMinute})`
			)
		}

		if (plate) {
			filters.push(`plateNumber ~ "${plate}"`)
		}

		const filter = filters.length > 0 ? filters.join(' ||') : ''

		while (true) {
			const result = await pb.collection('Cars').getList(page, perPage, {
				filter,
				expand: 'car.type',
			})

			allItems = [...allItems, ...result.items]

			if (result.items.length < perPage) break

			page++
		}

		return allItems as ICars[]
	} catch (err) {
		alert(`Ошибка при получении ParkingSessions: ${err}`)
		return []
	}
}
export async function deleteCars(id: string) {
	try {
		const result = await pb.collection('Cars').delete(id)
		return result
	} catch (error) {
		console.log(error)
	}
}
export async function getCars(
	page = 1,
	perPage = 50,
	plate?: string,
	startOfDay?: Date,
	endOfDay?: Date
) {
	try {
		let filter = ''
		if (plate) {
			filter = `plateNumber ~ "${plate}" || ownerName ~ "${plate}"`
		} else if (startOfDay && endOfDay) {
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
    startMomentStampDay < ${endDay}
    || (startMomentStampDay = ${endDay} && startMomentStamp <= ${endMinute})
  )
  &&
  (
    endMomentStampDay > ${startDay}
    || (endMomentStampDay = ${startDay} && endMomentStamp >= ${startMinute})
  )
)

`
		}
		const result = await pb.collection('Cars').getList(page, perPage, {
			filter: filter || undefined,
			expand: 'car.type',
			sort: '-startMomentStampDay,-startMomentStamp',
		})

		return result
	} catch (err) {
		console.error(`Error fetching ParkingSessions: ${err}`)
		return { items: [], totalItems: 0 }
	}
}
export async function getTypesCar() {
	try {
		const result = await pb.collection('car_groups').getFullList()
		return result
	} catch (error) {
		console.log('error', error)
		return []
	}
}
export async function getTypesCarById(id: string) {
	try {
		const result = await pb.collection('car_groups').getOne(id)
		return result
	} catch (error) {
		console.log('error', error)
		return null
	}
}

export async function createCars(
	plateNumber: string,
	ownerName: string,
	typeId: string,
	start_Date: Date,
	end_Date: Date
) {
	try {
		const safeEntryTime = new Date(start_Date)
		safeEntryTime.setHours(0, 0, 0, 0)
		const safeExitTime = new Date(end_Date)
		safeExitTime.setHours(0, 0, 0, 0)

		const startMomentStampDay = getMomentStamp(safeEntryTime)
		const endMomentStampDay = getMomentStamp(safeExitTime)
		const startMomentStamp = getTimeStamp(start_Date)
		const endMomentStamp = getTimeStamp(end_Date)

		const car = await pb.collection('Cars').create({
			plateNumber,
			ownerName,
			type: [typeId],
			start_Date,
			end_Date,
			startMomentStamp,
			startMomentStampDay,
			endMomentStamp,
			endMomentStampDay,
		})
		return car
	} catch (err) {
		alert(`Ошибка при создании машины: ${err}`)
	}
}
export async function updateCords() {
	try {
		const cordsOfLocal = localStorage.getItem('smartCameraCords')
		if (!cordsOfLocal) throw new Error('Нет сохранённых координат')
		const { transformed, id } = JSON.parse(cordsOfLocal)
		const result = await pb.collection('Settings').update(id, {
			cords: transformed,
		})
		console.log('result', result)
		return result
	} catch (err) {
		alert(`Error updating cords: ${err}`)
		return { items: [], totalItems: 0 }
	}
}
export async function getCarGroup() {
	try {
		const cars: ICarGroup[] = await pb.collection('car_groups').getFullList()
		return cars
	} catch (err) {
		alert(`Ошибка при получении car_groups:, ${err}`)
		return []
	}
}
export interface CarsPagination {
	items: ICars[]
	page: number
	perPage: number
	totalItems: number
	totalPages: number
}
