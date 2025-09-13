import { getCarsByType } from '../../../api/carsSessions'
import type { ICarsInParking } from '../../../types/CarsInParking'
import { calculateSessionCost } from '../../CarsSessions/view/function'

export type DashboardResult = {
	count: number
	sum: number
	uniqueCars: number
	avgCost: number
	totalDuration: number // в минутах
	avgDuration: number // в минутах
}

type GroupStats = {
	count: number
	sum: number
	cars: Set<string>
	totalDuration: number
}

export async function calculateDashboard(dashboard: ICarsInParking[]) {
	const groups: Record<
		'other' | 'bus' | 'whiteList' | 'worker' | 'tenant',
		GroupStats
	> = {
		other: { count: 0, sum: 0, cars: new Set(), totalDuration: 0 },
		bus: { count: 0, sum: 0, cars: new Set(), totalDuration: 0 },
		whiteList: { count: 0, sum: 0, cars: new Set(), totalDuration: 0 },
		worker: { count: 0, sum: 0, cars: new Set(), totalDuration: 0 },
		tenant: { count: 0, sum: 0, cars: new Set(), totalDuration: 0 },
	}

	// объект для подсчета по часам
	const arrivalsByHour: Record<string, number> = {}
	for (let h = 0; h < 24; h++) arrivalsByHour[h.toString().padStart(2, '0')] = 0

	const results = await Promise.all(
		dashboard.map(async car => {
			// определяем час въезда
			const enterHour = Math.floor(car.enterMomentStamp / 60) // если есть entryMomentStamp
			const hourKey = enterHour.toString().padStart(2, '0')
			arrivalsByHour[hourKey]++

			const result = await getCarsByType('', '', car.plateNumber)
			const cost = calculateSessionCost(
				{
					entryTime: car.entryTime,
					exitTime: car.exitTime,
					isBus: car.isBus,
				},
				result
			)

			const duration =
				(new Date(car.exitTime).getTime() - new Date(car.entryTime).getTime()) /
				1000 /
				60

			let group: keyof typeof groups = 'other'
			if (result.length === 0) {
				group = car.isBus ? 'bus' : 'other'
			} else {
				const type = result[0].expand?.type?.display_name
				if (type === 'whiteList' || type === 'worker' || type === 'tenant') {
					group = type
				} else {
					group = car.isBus ? 'bus' : 'other'
				}
			}

			return { car, cost, duration, group }
		})
	)

	for (let { car, cost, duration, group } of results) {
		groups[group].count++
		groups[group].sum += cost
		groups[group].cars.add(car.plateNumber)
		groups[group].totalDuration += duration
	}

	const format = (g: GroupStats): DashboardResult => ({
		count: g.count,
		sum: g.sum,
		uniqueCars: g.cars.size,
		avgCost: g.count ? g.sum / g.count : 0,
		totalDuration: Math.round(g.totalDuration),
		avgDuration: g.count ? Math.round(g.totalDuration / g.count) : 0,
	})

	return {
		other: format(groups.other),
		bus: format(groups.bus),
		whiteList: format(groups.whiteList),
		worker: format(groups.worker),
		tenant: format(groups.tenant),
		arrivalsByHour, // вот это новое поле
	}
}
