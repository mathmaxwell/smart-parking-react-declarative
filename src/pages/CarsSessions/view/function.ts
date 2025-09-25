import type {
	ICars,
	ICarsInParking,
	ICarsType,
} from '../../../types/CarsInParking'
import * as XLSX from 'xlsx'
export interface ISessionData {
	entryTime: string
	exitTime: string
	isBus: boolean
}

export function calculateForFree(billingInfo: ICarsType[]):
	| {
			start_Date: Date
			end_Date: Date
			display_name: string
			cost: number
			newSubscription: boolean
	  }
	| number {
	if (billingInfo.length === 0) {
		return calculateCostFromLocalStorage()
	}

	const now = new Date()

	// Активная подписка
	const active = billingInfo.find(
		item => new Date(item.start_Date) <= now && new Date(item.end_Date) >= now
	)

	if (active) {
		return {
			start_Date: active.start_Date,
			end_Date: active.end_Date,
			display_name: active.expand.type.display_name,
			cost: 0,
			newSubscription: false,
		}
	}

	// Последняя (или будущая) подписка
	const last = billingInfo.reduce((prev, curr) =>
		prev.end_Date > curr.end_Date ? prev : curr
	)

	// Проверка — будущая ли это подписка
	const isNew = new Date(last.start_Date) > now

	const extraCost = calculateCostFromLocalStorage(last.end_Date)
	return {
		start_Date: last.start_Date,
		end_Date: last.end_Date,
		display_name: last.expand.type.display_name,
		cost: extraCost,
		newSubscription: isNew,
	}
}

function calculateCostFromLocalStorage(subscriptionEnd?: Date): number {
	const raw = localStorage.getItem('indormation')
	if (!raw) return 0

	try {
		const { entryTime, exitTime, isBus } = JSON.parse(raw) as ISessionData

		const entry = new Date(entryTime)
		const exit = new Date(exitTime)

		let start = entry
		if (subscriptionEnd && subscriptionEnd > entry) {
			start = subscriptionEnd
		}

		const diffMs = exit.getTime() - start.getTime()
		if (diffMs <= 0) return 0

		const hours = Math.ceil(diffMs / (1000 * 60 * 60))

		if (isBus) {
			return hours <= 2 ? 25_000 : 25_000 + (hours - 2) * 25_000
		} else {
			return hours * 5_000
		}
	} catch {
		return 0
	}
}

export function calculateSessionCost(
	session: {
		entryTime: Date | string
		exitTime: Date | string
		isBus: boolean
	},
	subscriptions: ICars[]
): number {
	const entry = new Date(session.entryTime)
	const exit = new Date(session.exitTime)

	// если приехал позже выезда (ошибка)
	if (exit <= entry) return 0

	// исходный интервал
	let paidIntervals: [Date, Date][] = [[entry, exit]]

	// вычитаем каждую подписку
	for (const sub of subscriptions) {
		const subStart = new Date(sub.start_Date)
		const subEnd = new Date(sub.end_Date)

		let newIntervals: [Date, Date][] = []
		for (const [pStart, pEnd] of paidIntervals) {
			// нет пересечения
			if (subEnd <= pStart || subStart >= pEnd) {
				newIntervals.push([pStart, pEnd])
				continue
			}
			// слева остаётся платный кусок
			if (subStart > pStart) {
				newIntervals.push([pStart, subStart])
			}
			// справа остаётся платный кусок
			if (subEnd < pEnd) {
				newIntervals.push([subEnd, pEnd])
			}
		}
		paidIntervals = newIntervals
	}

	// считаем общее платное время
	let totalHours = 0
	for (const [pStart, pEnd] of paidIntervals) {
		const diffMs = pEnd.getTime() - pStart.getTime()
		if (diffMs > 0) {
			totalHours += diffMs / (1000 * 60 * 60)
		}
	}

	// округляем в большую сторону
	const hours = Math.ceil(totalHours)

	if (hours <= 0) return 0

	// тариф
	if (session.isBus) {
		return hours <= 2 ? 25_000 : 25_000 + (hours - 2) * 25_000
	} else {
		return hours * 5_000
	}
}

export function mergeDateTime(
	dateStr?: string,
	timeStr?: string
): Date | undefined {
	if (!dateStr) return undefined

	const [day, month, year] = dateStr.split('.').map(Number)
	if (!day || !month || !year) return undefined

	const date = new Date(year, month - 1, day)

	if (timeStr) {
		const [hours, minutes] = timeStr.split(':').map(Number)
		date.setHours(hours, minutes, 0, 0)
	} else {
		date.setHours(0, 0, 0, 0)
	}

	return date
}

function mapSession(session: ICarsInParking) {
	return {
		plateNumber: session.plateNumber,
		bus: session.isBus,
		entryTime: session.entryTime.toString().slice(0, 16),
		exitTime: session.exitTime.toString().slice(0, 16),
		// entryPhoto: session.entryPhoto
		// 	? pb.files.getURL(session, session.entryPhoto)
		// 	: '',
		// exitPhoto: session.exitPhoto
		// 	? pb.files.getURL(session, session.exitPhoto)
		// 	: '',
	}
}
function mapCars(session: ICars) {
	return {
		plateNumber: session.plateNumber,
		'имя владелца': session.ownerName || '-',
		startTime: session.start_Date.toString().slice(0, 16),
		endTime: session.end_Date.toString().slice(0, 16),
	}
}

export function downloadSessionsXLSX(
	sessions: ICarsInParking[],
	filename = 'sessions.xlsx'
) {
	if (!sessions || sessions.length === 0) return

	const filtered = sessions.map(mapSession)

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
export function downloadCarsXLSX(sessions: ICars[], filename = 'cars.xlsx') {
	if (!sessions || sessions.length === 0) return

	const filtered = sessions.map(mapCars)

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
export function toDate(dateStr: string, timeStr: string) {
	const [day, month, year] = dateStr.split('/').map(Number)
	const [hours, minutes] = timeStr.split(':').map(Number)
	return new Date(year, month - 1, day, hours, minutes)
}
export function formatNumber(value: number | string) {
	if (typeof value === 'number') {
		return new Intl.NumberFormat('ru-RU').format(value)
	}
	const num = Number(value)
	return isNaN(num) ? value : new Intl.NumberFormat('ru-RU').format(num)
}
export const formatDate = (d: Date) => {
	const day = String(d.getDate()).padStart(2, '0')
	const month = String(d.getMonth() + 1).padStart(2, '0')
	const year = d.getFullYear()
	return `${day}/${month}/${year}`
}
export function parseDate(dateStr: string): Date | undefined {
	if (!dateStr) return undefined
	const [dayStr, monthStr, yearStr] = dateStr.split('/')
	const day = Number(dayStr)
	const month = Number(monthStr)
	const year = Number(yearStr)
	if (
		!Number.isInteger(day) ||
		!Number.isInteger(month) ||
		!Number.isInteger(year)
	) {
		return undefined
	}
	if (day <= 0 || month <= 0 || month > 12) return undefined
	const date = new Date(Date.UTC(year, month - 1, day))
	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== month - 1 ||
		date.getUTCDate() !== day
	) {
		return undefined
	}

	return date
}
