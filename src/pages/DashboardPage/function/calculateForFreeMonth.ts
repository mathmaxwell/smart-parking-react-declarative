import { getCarsByType } from '../../../api/carsSessions'
import type { ICars } from '../../../types/CarsInParking'

export interface Result {
	worker: { count: number; sum: number }
	tenant: { count: number; sum: number }
}

export async function calculateForFreeMonth(
	mounthFree: ICars[]
): Promise<Result> {
	const result: Result = {
		worker: { count: 0, sum: 0 },
		tenant: { count: 0, sum: 0 },
	}

	await Promise.all(
		mounthFree.map(async car => {
			const carsData = await getCarsByType(car.type, '', car.plateNumber)

			// Проверяем каждый полученный автомобиль
			carsData.forEach(item => {
				const typeName = item.expand?.type?.display_name
				if (typeName === 'worker') {
					result.worker.count += 1
					result.worker.sum += 100000
				} else if (typeName === 'tenant') {
					result.tenant.count += 1
					result.tenant.sum += 300000
				}
			})
		})
	)

	return result
}
