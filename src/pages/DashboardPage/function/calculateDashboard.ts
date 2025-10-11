import { getMomentStamp, getTimeStamp } from 'get-moment-stamp'
import * as XLSX from 'xlsx'
import { getCarGroup, getCars, getCarsByType } from '../../../api/carsSessions'
import type {
	ICarGroup,
	ICars,
	ICarsInParking,
} from '../../../types/CarsInParking'
import { getMaxByCount } from '../../HistoryPage/HistoryPage'
// export function calculateSessionCost(
// 	session: {
// 		entryTime: Date | string
// 		exitTime: Date | string
// 		isBus: boolean
// 	},
// 	subscriptions: ICars[]
// ): number {
// 	const entry = new Date(session.entryTime)
// 	const exit = new Date(session.exitTime)

// 	// если приехал позже выезда (ошибка)
// 	if (exit <= entry) return 0

// 	// исходный интервал
// 	let paidIntervals: [Date, Date][] = [[entry, exit]]

// 	// вычитаем каждую подписку
// 	for (const sub of subscriptions) {
// 		const subStart = new Date(sub.start_Date)
// 		const subEnd = new Date(sub.end_Date)

// 		let newIntervals: [Date, Date][] = []
// 		for (const [pStart, pEnd] of paidIntervals) {
// 			// нет пересечения
// 			if (subEnd <= pStart || subStart >= pEnd) {
// 				newIntervals.push([pStart, pEnd])
// 				continue
// 			}
// 			// слева остаётся платный кусок
// 			if (subStart > pStart) {
// 				newIntervals.push([pStart, subStart])
// 			}
// 			// справа остаётся платный кусок
// 			if (subEnd < pEnd) {
// 				newIntervals.push([subEnd, pEnd])
// 			}
// 		}
// 		paidIntervals = newIntervals
// 	}

// 	// считаем общее платное время
// 	let totalHours = 0
// 	for (const [pStart, pEnd] of paidIntervals) {
// 		const diffMs = pEnd.getTime() - pStart.getTime()
// 		if (diffMs > 0) {
// 			totalHours += diffMs / (1000 * 60 * 60)
// 		}
// 	}

// 	// округляем в большую сторону
// 	const hours = Math.ceil(totalHours)

// 	if (hours <= 0) return 0

// 	// тариф
// 	if (session.isBus) {
// 		return hours <= 2 ? 25_000 : 25_000 + (hours - 2) * 25_000
// 	} else {
// 		return hours * 5_000
// 	}
// }

export type DashboardResult = {
	count: number
	sum: number
	uniqueCars: number
	avgCost: number
	totalDuration: number // в минутах
	avgDuration: number // в минутах
}
export interface ISubscriptionPurchase {
	plateNumber: string
	startDay: number
	endDay: number
	type: 'day' | 'month'
	price: number
	tariffId: string
}

export interface ISubscriptionsResult {
	total: number
	purchases: ISubscriptionPurchase[]
}

// type GroupStats = {
// 	count: number
// 	sum: number
// 	cars: Set<string>
// 	totalDuration: number
// }
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

// export async function calculateDashboard(dashboard: ICarsInParking[]) {
// 	const groups: Record<
// 		'other' | 'bus' | 'whiteList' | 'worker' | 'tenant',
// 		GroupStats
// 	> = {
// 		other: { count: 0, sum: 0, cars: new Set(), totalDuration: 0 },
// 		bus: { count: 0, sum: 0, cars: new Set(), totalDuration: 0 },
// 		whiteList: { count: 0, sum: 0, cars: new Set(), totalDuration: 0 },
// 		worker: { count: 0, sum: 0, cars: new Set(), totalDuration: 0 },
// 		tenant: { count: 0, sum: 0, cars: new Set(), totalDuration: 0 },
// 	}

// 	// объект для подсчета по часам
// 	const arrivalsByHour: Record<string, number> = {}
// 	for (let h = 0; h < 24; h++) arrivalsByHour[h.toString().padStart(2, '0')] = 0

// 	const results = await Promise.all(
// 		dashboard.map(async car => {
// 			// определяем час въезда
// 			const enterHour = Math.floor(car.enterMomentStamp / 60) // если есть entryMomentStamp
// 			const hourKey = enterHour.toString().padStart(2, '0')
// 			arrivalsByHour[hourKey]++

// 			const result = await getCarsByType('', '', car.plateNumber)
// 			const cost = calculateSessionCost(
// 				{
// 					entryTime: car.entryTime,
// 					exitTime: car.exitTime,
// 					isBus: car.isBus,
// 				},
// 				result
// 			)

// 			const duration =
// 				(new Date(car.exitTime).getTime() - new Date(car.entryTime).getTime()) /
// 				1000 /
// 				60

// 			let group: keyof typeof groups = 'other'
// 			if (result.length === 0) {
// 				group = car.isBus ? 'bus' : 'other'
// 			} else {
// 				const type = result[0].expand?.type?.display_name
// 				if (type === 'whiteList' || type === 'worker' || type === 'tenant') {
// 					group = type
// 				} else {
// 					group = car.isBus ? 'bus' : 'other'
// 				}
// 			}

// 			return { car, cost, duration, group }
// 		})
// 	)

// 	for (let { car, cost, duration, group } of results) {
// 		groups[group].count++
// 		groups[group].sum += cost
// 		groups[group].cars.add(car.plateNumber)
// 		groups[group].totalDuration += duration
// 	}

// 	const format = (g: GroupStats): DashboardResult => ({
// 		count: g.count,
// 		sum: g.sum,
// 		uniqueCars: g.cars.size,
// 		avgCost: g.count ? g.sum / g.count : 0,
// 		totalDuration: Math.round(g.totalDuration),
// 		avgDuration: g.count ? Math.round(g.totalDuration / g.count) : 0,
// 	})

// 	return {
// 		other: format(groups.other),
// 		bus: format(groups.bus),
// 		whiteList: format(groups.whiteList),
// 		worker: format(groups.worker),
// 		tenant: format(groups.tenant),
// 		arrivalsByHour, // вот это новое поле
// 	}
// }

export async function findSubscription(
	subscriptions: ICars[] | undefined,
	startDay: number,
	endDay: number,
	safeEntryTime: number,
	safeExitTime: number,
	isBus: boolean
) {
	const sessionStart = startDay * 24 * 60 + safeEntryTime
	const sessionEnd = endDay * 24 * 60 + safeExitTime

	if (sessionEnd < sessionStart) {
		return {
			isSubscription: false,
			minutes: 0,
			hours: 0,
			display_name: isBus ? 'bus' : 'others',
		}
	}

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

	for (const sub of subscriptions) {
		const subStart = sub.startMomentStampDay * 24 * 60 + sub.startMomentStamp
		const subEnd = sub.endMomentStampDay * 24 * 60 + sub.endMomentStamp

		if (subStart <= sessionStart && subEnd >= sessionEnd) {
			const name = await getCarsByType(sub.type)

			const display_name =
				name[0].expand?.type?.display_name ?? (isBus ? 'others' : 'others')

			return {
				isSubscription: true,
				minutes: 0,
				hours: 0,
				display_name,
				subscriptionEndDay: sub.end_Date, // 👈 добавили дату окончания подписки
			}
		}

		if (subEnd > sessionStart && subStart < sessionEnd) {
			let paidStart = sessionStart
			let paidEnd = sessionEnd

			if (subStart > sessionStart) {
				paidStart = sessionStart
				paidEnd = Math.min(subStart, sessionEnd)
			}

			if (subEnd < sessionEnd) {
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
				subscriptionEndDay: sub.end_Date, // 👈 тоже добавили
			}
		}
	}

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
			let cost = 0
			const hours = info.hours

			// если больше 5 часов — считаем как день
			if (hours > 5) {
				const days = Math.floor(hours / 24)
				const remainingHours = hours % 24

				cost += days * tarif.day

				// если остаток меньше 5 часов — добавляем по часам
				// если остаток больше 5 — это ещё один день
				if (remainingHours > 5) {
					cost += tarif.day
				} else if (remainingHours > 0) {
					cost += tarif.hour * remainingHours
				}
			} else {
				cost = tarif.hour * hours
			}

			return {
				display_name: 'bus',
				cost,
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

	const info = await findSubscription(
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

export async function calculateSubscriptionsCost({
	plateNumber,
	typeName,
}: {
	plateNumber: string
	typeName: string
}): Promise<ISubscriptionsResult> {
	const tariffs: ICarGroup[] = await getTariffOfLocal()
	const type = await getCars(1, 200, plateNumber)
	const subscriptions = type.items

	const result: ISubscriptionPurchase[] = []

	for (const sub of subscriptions) {
		const { startMomentStampDay, endMomentStampDay } = sub

		// ищем подходящий тариф
		const tariff = tariffs.find(
			t =>
				t.start <= startMomentStampDay &&
				t.end > startMomentStampDay &&
				t.display_name === typeName
		)

		if (!tariff) continue // если тариф не найден, пропускаем

		// считаем длительность подписки
		const duration = endMomentStampDay - startMomentStampDay

		// если 0–2 дня → это дневной тариф, иначе месячный
		const isDay = duration <= 2

		const purchase: ISubscriptionPurchase = {
			plateNumber,
			startDay: startMomentStampDay,
			endDay: endMomentStampDay,
			type: isDay ? 'day' : 'month',
			price: isDay ? tariff.day : tariff.month,
			tariffId: tariff.id,
		}

		result.push(purchase)
	}

	// считаем общую сумму
	const total = result.reduce((sum, r) => sum + r.price, 0)

	return { total, purchases: result }
}
async function mapSession(session: ICarsInParking) {
	const lang = localStorage.getItem('lang') || 'ru'
	const locale = lang === 'eng' ? 'en' : lang
	let result = await processDashboard([session])
	let big = getMaxByCount(result)
	const typeData = await getCarsByType('', '', session.plateNumber)
	const subs = await findSubscription(
		typeData,
		session.enterMomentStampDay,
		session.exitMomentStampDay,
		session.enterMomentStamp,
		session.exitMomentStamp,
		session.isBus
	)
	let subEndDate
	if (subs.subscriptionEndDay === undefined) {
		subEndDate = '-'
	} else {
		subEndDate = new Date(subs.subscriptionEndDay).toLocaleString(locale)
	}
	const yesNo: any = {
		ru: ['нет', 'да'],
		eng: ['no', 'yes'],
		uz: ["yo'q", 'ha'],
	}
	const labels: any = {
		plateNumber: {
			ru: 'Номер машины',
			uz: 'Mashina raqami',
			eng: 'Plate Number',
		},
		isBus: {
			ru: 'Автобус',
			uz: 'Avtobus',
			eng: 'Is Bus',
		},
		entryTime: {
			ru: 'Время въезда',
			uz: 'Kirish vaqti',
			eng: 'Entry Time',
		},
		exitTime: {
			ru: 'Время выезда',
			uz: 'Chiqish vaqti',
			eng: 'Exit Time',
		},
		category: {
			ru: 'Категория',
			uz: 'Kategoriya',
			eng: 'Category',
		},
		payment: {
			ru: 'Оплата',
			uz: "To'lov",
			eng: 'Payment',
		},
		subEndDate: {
			ru: 'Дата окончания подписки',
			uz: 'Obuna tugash sanasi',
			eng: 'Subscription End Date',
		},
		others: {
			ru: 'Пассажиры (сопровождающие/встречающие)',
			uz: 'Yo‘lovchilar (kuzatuvchi/kutib oluvchi)',
			eng: 'Passengers (accompanying/meeting)',
		},
		bus: {
			ru: 'Туристические автобусы, микроавтобусы, минивэны',
			uz: 'Turistik avtobuslar, mikroavtobuslar, minivenlar',
			eng: 'Tourist buses, minibuses, minivans',
		},
		worker: {
			ru: 'Работники (абонемент)',
			uz: 'Hodimlar (abonement)',
			eng: 'Workers (subscription)',
		},
		tenant: {
			ru: 'Арендаторы и другие организации (абонемент)',
			uz: 'Ijarachilar va boshqa tashkilotlar (abonement)',
			eng: 'Tenants and other organizations (subscription)',
		},
		whiteList: {
			ru: 'белый список',
			uz: `oq ro'yxat`,
			eng: 'white list',
		},
	}

	return {
		[labels.plateNumber[lang]]: session.plateNumber,
		[labels.isBus[lang]]: yesNo[lang][session.isBus ? 1 : 0],
		[labels.entryTime[lang]]: new Date(session.entryTime)
			.toLocaleString(locale)
			.slice(0, 17),
		[labels.exitTime[lang]]: new Date(session.exitTime)
			.toLocaleString(locale)
			.slice(0, 17),
		[labels.category[lang]]: labels[big.name][lang],
		[labels.payment[lang]]: big.sum,
		[labels.subEndDate[lang]]: subEndDate,
	}
}

export async function downloadSessionsXLSX(
	sessions: ICarsInParking[],
	filename = 'sessions.xlsx'
) {
	if (!sessions || sessions.length === 0) return
	const filtered = await Promise.all(sessions.map(mapSession))
	const ws = XLSX.utils.json_to_sheet(filtered)
	const wb = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(wb, ws, 'Sessions')
	const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
	const blob = new Blob([wbout], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	})
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	a.click()
	URL.revokeObjectURL(url)
}
