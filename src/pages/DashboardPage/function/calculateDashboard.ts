import { getMomentStamp, getTimeStamp } from 'get-moment-stamp'
import { getCarGroup, getCarsByType } from '../../../api/carsSessions'
import type {
	ICarGroup,
	ICars,
	ICarsInParking,
} from '../../../types/CarsInParking'
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
let cachedTariffs: ICarGroup[] | null = null
let cachePromise: Promise<ICarGroup[]> | null = null

export async function getTariffOfLocal() {
	if (cachedTariffs) {
		return cachedTariffs
	}
	if (cachePromise) {
		return cachePromise
	}

	cachePromise = getCarGroup()
		.then(result => {
			cachedTariffs = result
			return result
		})
		.finally(() => {
			cachePromise = null
		})

	return cachePromise
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

export function findSubscription(
	subscriptions: ICars[] | undefined,
	startDay: number,
	endDay: number,
	safeEntryTime: number,
	safeExitTime: number,
	isBus: boolean
) {
	// Рассчитываем абсолютное время въезда и выезда в минутах (от 1970 года)
	const sessionStart = startDay * 24 * 60 + safeEntryTime
	const sessionEnd = endDay * 24 * 60 + safeExitTime

	// Проверка корректности интервала
	if (sessionEnd < sessionStart) {
		return {
			isSubscription: false,
			minutes: 0,
			hours: 0,
			display_name: isBus ? 'bus' : 'others',
		}
	}

	// Если подписок нет или массив пустой, считаем платное время
	if (!subscriptions || subscriptions.length === 0) {
		const minutes = sessionEnd - sessionStart
		const hours = minutes <= 60 ? 1 : Math.ceil(minutes / 60)
		return {
			isSubscription: false,
			minutes,
			hours,
			display_name: isBus ? 'bus' : 'others',
		}
	}

	// Ищем подписку, полностью покрывающую сессию
	for (const sub of subscriptions) {
		const subStart = sub.startMomentStampDay * 24 * 60 + sub.startMomentStamp
		const subEnd = sub.endMomentStampDay * 24 * 60 + sub.endMomentStamp

		// Подписка покрывает всю сессию
		if (subStart <= sessionStart && subEnd >= sessionEnd) {
			const display_name =
				sub.expand?.type?.display_name ?? (isBus ? 'others' : 'others')
			return {
				isSubscription: true,
				minutes: 0,
				hours: 0,
				display_name,
			}
		}

		if (subEnd > sessionStart && subStart < sessionEnd) {
			// вариант 1: если подписка начинается позже въезда
			let paidStart = sessionStart
			let paidEnd = sessionEnd

			if (subStart > sessionStart) {
				// кусок до начала подписки платный
				paidStart = sessionStart
				paidEnd = Math.min(subStart, sessionEnd)
			}

			if (subEnd < sessionEnd) {
				// кусок после окончания подписки платный
				paidStart = Math.max(subEnd, sessionStart)
				paidEnd = sessionEnd
			}

			const minutes = Math.max(0, paidEnd - paidStart)
			const hours = minutes <= 60 && minutes > 0 ? 1 : Math.ceil(minutes / 60)

			const display_name =
				sub.expand?.type?.display_name ?? (isBus ? 'bus' : 'others')

			return {
				isSubscription: true,
				minutes,
				hours,
				display_name,
			}
		}
	}

	// Если подписка не покрывает полностью, считаем платное время
	// Частичное покрытие обрабатывается в calculateFeeWithSubscriptions
	const minutes = sessionEnd - sessionStart
	const hours = minutes <= 60 ? 1 : Math.ceil(minutes / 60)
	return {
		isSubscription: false,
		minutes,
		hours,
		display_name: isBus ? 'others' : 'others',
	}
}

export function findTariff(
	tariffs: ICarGroup[],
	startDay: number,
	display_name: ICarGroup['display_name']
): ICarGroup | undefined {
	// фильтруем только подходящие по типу

	const filtered = tariffs.filter(t => t.display_name === display_name)

	// сортируем по start (чтобы порядок был предсказуем)
	const sorted = [...filtered].sort((a, b) => a.start - b.start)

	for (const tariff of sorted) {
		const { start, end } = tariff

		// бесконечность
		if (end === 0 && startDay >= start) {
			return tariff
		}

		// стандартный диапазон
		if (start <= startDay && startDay <= end) {
			return tariff
		}

		// особый случай: если startDay совпадает с end (берём этот тариф)
		if (startDay === end) {
			return tariff
		}
	}

	return undefined
}

export function calculateFee(
	tarif: ICarGroup | undefined,
	info: {
		isSubscription: boolean
		minutes: number
		hours: number
		display_name: string
	}
): { display_name: ICarGroup['display_name']; cost: number } {
	if (!tarif) {
		return { display_name: 'others', cost: -10000 }
	}

	// === others ===
	if (tarif.display_name === 'others') {
		// минуты-ориентированные правила
		if (
			tarif.first10Minutes > 0 ||
			tarif.from11To59for10 > 0 ||
			tarif.after61 > 0 ||
			tarif.first10Minutes === -1 ||
			tarif.from11To59for10 === -1 ||
			tarif.after61 === -1
		) {
			let cost = 0
			const minutes = info.minutes

			// --- первые 10 минут ---
			if (minutes <= 10) {
				if (tarif.first10Minutes === -1) {
					return { display_name: 'others', cost: 0 }
				} else if (tarif.first10Minutes > 0) {
					return { display_name: 'others', cost: tarif.first10Minutes }
				} else {
					return { display_name: 'others', cost: 0 }
				}
			} else {
				if (tarif.first10Minutes > 0) {
					cost += tarif.first10Minutes
				}
			}

			// --- 11–59 минут ---
			if (minutes > 10 && minutes <= 60) {
				if (tarif.from11To59for10 > 0) {
					const blocks = Math.ceil((minutes - 10) / 10)
					cost += blocks * tarif.from11To59for10
				}
				return { display_name: 'others', cost }
			}

			// --- 61+ минут ---
			if (minutes > 60) {
				if (tarif.from11To59for10 > 0) {
					const blocks = Math.ceil((60 - 10) / 10) // максимум 5 блоков
					cost += blocks * tarif.from11To59for10
				}

				if (tarif.after61 > 0) {
					const blocks = Math.ceil((minutes - 60) / 60)
					cost += blocks * tarif.after61
				}
				return { display_name: 'others', cost }
			}

			// fallback (на случай, если никак не попали)
			return { display_name: 'others', cost }
		}

		// правила по первым 2 часам / далее по часам
		if (
			tarif.first2hours > 0 ||
			tarif.from2Hour > 0 ||
			tarif.first2hours === -1 ||
			tarif.from2Hour === -1
		) {
			let cost = 0
			const hours = info.hours

			// --- первые 2 часа ---
			if (hours <= 2) {
				if (tarif.first2hours === -1) {
					return { display_name: 'others', cost: 0 }
				} else if (tarif.first2hours > 0) {
					return { display_name: 'others', cost: tarif.first2hours }
				} else {
					return { display_name: 'others', cost: 0 }
				}
			} else {
				if (tarif.first2hours > 0) {
					cost += tarif.first2hours
				}
			}

			// --- часы после 2х ---
			if (hours > 2) {
				if (tarif.from2Hour > 0) {
					const extraHours = hours - 2
					cost += extraHours * tarif.from2Hour
				}
				return { display_name: 'others', cost }
			}

			return { display_name: 'others', cost }
		} else {
			return {
				display_name: 'others',
				cost: tarif.hour * info.hours,
			}
		}
	}

	// === bus — та же логика, что и для others ===
	else if (tarif.display_name === 'bus') {
		// минуты-ориентированные правила (если заданы)
		if (
			tarif.first10Minutes > 0 ||
			tarif.from11To59for10 > 0 ||
			tarif.after61 > 0 ||
			tarif.first10Minutes === -1 ||
			tarif.from11To59for10 === -1 ||
			tarif.after61 === -1
		) {
			let cost = 0
			const minutes = info.minutes

			// --- первые 10 минут ---
			if (minutes <= 10) {
				if (tarif.first10Minutes === -1) {
					return { display_name: 'bus', cost: 0 }
				} else if (tarif.first10Minutes > 0) {
					return { display_name: 'bus', cost: tarif.first10Minutes }
				} else {
					return { display_name: 'bus', cost: 0 }
				}
			} else {
				if (tarif.first10Minutes > 0) {
					cost += tarif.first10Minutes
				}
			}

			// --- 11–59 минут ---
			if (minutes > 10 && minutes <= 60) {
				if (tarif.from11To59for10 > 0) {
					const blocks = Math.ceil((minutes - 10) / 10)
					cost += blocks * tarif.from11To59for10
				}
				return { display_name: 'bus', cost }
			}

			// --- 61+ минут ---
			if (minutes > 60) {
				if (tarif.from11To59for10 > 0) {
					const blocks = Math.ceil((60 - 10) / 10)
					cost += blocks * tarif.from11To59for10
				}

				if (tarif.after61 > 0) {
					const blocks = Math.ceil((minutes - 60) / 60)
					cost += blocks * tarif.after61
				}
				return { display_name: 'bus', cost }
			}

			return { display_name: 'bus', cost }
		}

		// правила по первым 2 часам / далее по часам (если заданы)
		if (
			tarif.first2hours > 0 ||
			tarif.from2Hour > 0 ||
			tarif.first2hours === -1 ||
			tarif.from2Hour === -1
		) {
			let cost = 0
			const hours = info.hours

			// --- первые 2 часа ---
			if (hours <= 2) {
				if (tarif.first2hours === -1) {
					return { display_name: 'bus', cost: 0 }
				} else if (tarif.first2hours > 0) {
					return { display_name: 'bus', cost: tarif.first2hours }
				} else {
					return { display_name: 'bus', cost: 0 }
				}
			} else {
				if (tarif.first2hours > 0) {
					cost += tarif.first2hours
				}
			}

			// --- часы после 2х ---
			if (hours > 2) {
				if (tarif.from2Hour > 0) {
					const extraHours = hours - 2
					cost += extraHours * tarif.from2Hour
				}
				return { display_name: 'bus', cost }
			}

			return { display_name: 'bus', cost }
		} else {
			return {
				display_name: 'bus',
				cost: tarif.hour * info.hours,
			}
		}
	}

	// === tenant / worker / whiteList / fallback ===
	else if (tarif.display_name === 'tenant') {
		return {
			display_name: 'tenant',
			cost: info.isSubscription ? 0 : tarif.hour * info.hours,
		}
	} else if (tarif.display_name === 'worker') {
		return {
			display_name: 'worker',
			cost: info.isSubscription ? 0 : tarif.hour * info.hours,
		}
	} else if (tarif.display_name === 'whiteList') {
		return {
			display_name: 'whiteList',
			cost: 0,
		}
	} else {
		return {
			display_name: 'others',
			cost: -10000,
		}
	}
}

export async function calculateFeeWithSubscriptions(
	session: {
		entryTime: Date | string
		exitTime: Date | string
		isBus: boolean
	},
	subscriptions: ICars[] | undefined
): Promise<{
	display_name: 'others' | 'whiteList' | 'bus' | 'tenant' | 'worker'
	cost: number
}> {
	// Обнуляем время для работы с днями
	const safeEntryTime = new Date(session.entryTime)
	safeEntryTime.setHours(0, 0, 0, 0)
	const safeExitTime = new Date(session.exitTime)
	safeExitTime.setHours(0, 0, 0, 0)

	// Дни с 1970 года
	const startDay = getMomentStamp(safeEntryTime)
	const endDay = getMomentStamp(safeExitTime)
	// Минуты с 00:00 для входа и выхода
	const startMinute = getTimeStamp(new Date(session.entryTime))
	const endMinute = getTimeStamp(new Date(session.exitTime))
	const tariffs: ICarGroup[] = await getTariffOfLocal()

	const info = findSubscription(
		subscriptions,
		startDay,
		endDay,
		startMinute,
		endMinute,
		session.isBus
	)

	const tarif =
		info === undefined
			? session.isBus
				? findTariff(tariffs, startDay, 'bus')
				: findTariff(tariffs, startDay, 'others')
			: session.isBus
			? findTariff(tariffs, startDay, info.display_name as 'bus')
			: findTariff(
					tariffs,
					startDay,
					info.display_name as
						| 'others'
						| 'whiteList'
						| 'bus'
						| 'tenant'
						| 'worker'
			  )
	return calculateFee(tarif, info)
}
export async function processDashboard(dashboard: ICarsInParking[]) {
	const stats = {
		bus: { count: 0, sum: 0 },
		others: { count: 0, sum: 0 },
		whiteList: { count: 0, sum: 0 },
		worker: { count: 0, sum: 0 },
		tenant: { count: 0, sum: 0 },
	}

	for (const car of dashboard) {
		const typeData = await getCarsByType('', '', car.plateNumber)

		const fee = await calculateFeeWithSubscriptions(
			{
				entryTime: car.entryTime,
				exitTime: car.exitTime,
				isBus: car.isBus,
			},
			typeData
		)

		const type = fee.display_name

		if (!stats[type]) continue

		stats[type].count++
		if (fee.cost) stats[type].sum += fee.cost
	}

	return stats
}
