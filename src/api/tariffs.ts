import { getMomentStamp } from 'get-moment-stamp'
import { formatDate, parseDate } from '../pages/CarsSessions/view/function'
import { pb } from '../../pb'
import type { ICarGroup } from '../types/CarsInParking'

export async function createTariffs(startOfDay: Date, endOfDay: Date) {

	
	try {
		const startDate = new Date(startOfDay)
		const endDate = new Date(endOfDay)
		startDate.setHours(0, 0, 0, 0)
		endDate.setHours(0, 0, 0, 0)

		const startDateISO = formatDate(startDate)
		const endDateISO = formatDate(endDate)

		const start = getMomentStamp(startDate)
		const end = getMomentStamp(endDate)

		const displayNames: (
			| 'others'
			| 'bus'
			| 'worker'
			| 'tenant'
			| 'whiteList'
		)[] = ['others', 'bus', 'worker', 'tenant', 'whiteList']

		const promises = displayNames.map(name =>
			pb.collection('car_groups').create({
				startDate: parseDate(startDateISO),
				endDate: parseDate(endDateISO),
				display_name: name,
				hour: 0,
				month: 0,
				day: 0,
				first2hours: 0,
				start,
				end,
				first10Minutes: 0,
			})
		)

		const tariffs = await Promise.all(promises)

		return tariffs
	} catch (err) {
		alert(`Ошибка при создании тарифов: ${err}`)
	}
}
export async function updateTariffCost(fiels: string | null, value: number) {
	try {
		const { group, car } = JSON.parse(
			localStorage.getItem('tariffCostUpdate') || ''
		)

		const carInfo: ICarGroup = car
		const updates = {
			start: group.start,
			end: group.end,
			display_name: carInfo.display_name,
			hour: carInfo.hour,
			month: carInfo.month,
			day: carInfo.day,
			first2hours: carInfo.first2hours,
			first10Minutes: carInfo.first10Minutes,
			startDate: group.startDate,
			endDate: group.endDate,
			[fiels || '']: value,
		}
		const tariffs = await pb
			.collection('car_groups')
			.update(carInfo.id, updates)
		return tariffs
	} catch (err) {
		alert(`Ошибка при создании тарифов: ${err}`)
	}
}
export async function updateTariff(startOfDay: Date, endOfDay: Date) {
	try {
		const startDate = new Date(startOfDay)
		const endDate = new Date(endOfDay)
		startDate.setHours(0, 0, 0, 0)
		endDate.setHours(0, 0, 0, 0)

		const startDateISO = formatDate(startDate)
		const endDateISO = formatDate(endDate)

		const start = getMomentStamp(startDate)
		const end = getMomentStamp(endDate)

		const saved = localStorage.getItem('selectedTariff')
		if (!saved) {
			throw new Error('Тариф не выбран')
		}

		const group = JSON.parse(saved)
		if (!group.cars || !Array.isArray(group.cars)) {
			throw new Error('У выбранного тарифа нет списка машин')
		}

		await Promise.all(
			group.cars.map(async (car: ICarGroup) => {
				const updates = {
					startDate: parseDate(startDateISO),
					endDate: parseDate(endDateISO),
					start,
					end,
					display_name: car.display_name,
					hour: car.hour,
					month: car.month,
					day: car.day,
					first2hours: car.first2hours,
					first10Minutes: car.first10Minutes,
				}


				return pb.collection('car_groups').update(car.id, updates)
			})
		)

		return true
	} catch (err) {
		alert(`Ошибка при обновлении тарифов: ${err}`)
		return false
	}
}
export async function deleteTariffCost(id: string) {
	try {
		return await pb.collection('car_groups').delete(id)
	} catch (err) {
		alert(`Ошибка при удалении тарифа: ${err}`)
		throw err
	}
}

export async function deleteTariffs() {
	try {
		const saved = localStorage.getItem('selectedTariff')
		if (!saved) {
			throw new Error('Тариф не выбран')
		}
		const group = JSON.parse(saved)
		if (!group.cars || !Array.isArray(group.cars)) {
			throw new Error('У выбранного тарифа нет списка машин')
		}
		await Promise.all(
			group.cars.map((car: ICarGroup) => deleteTariffCost(car.id))
		)
		return true
	} catch (err) {
		alert(`Ошибка при удалении тарифов: ${err}`)
		return false
	}
}
