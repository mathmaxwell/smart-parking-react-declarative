import {
	ListTyped,
	useActionModal,
	useActualRef,
	type ISize,
} from 'react-declarative'
import type { ICarsInParking } from '../../types/CarsInParking'
import { getCarsByType, getParkingSessions } from '../../api/carsSessions'
import { useState } from 'react'
import { columns, display_fields, filters, mergeDateTime } from './view/Fields'

const CarsSessions = () => {
	const [selectedRow, setSelectedRow] = useActualRef<ICarsInParking | null>(
		null
	)

	const { pickData, render } = useActionModal({
		sizeRequest: (size: ISize) => {
			return {
				height: size.height * 0.7,
				width: size.width * 0.8,
			}
		},
		fields: display_fields,
		handler: async () => ({
			...selectedRow.current,
			billingInfo: await getCarsByType(
				'',
				'',
				selectedRow.current?.plateNumber
			),
		}),
	})

	const [searchPlateNumber, setSearchPlateNumber] = useState<string>('')

	return (
		<>
			<ListTyped<
				{
					startDate: string
					endDate: string
					startTime: string
					endTime: string
				},
				ICarsInParking
			>
				// withMobile
				withSearch
				onSearchChange={e => setSearchPlateNumber(e)}
				filters={filters}
				columns={columns}
				handler={async (
					{ startDate, endDate, startTime, endTime },
					{ limit, offset }
				) => {
					const perPage = limit
					const page = Math.floor(offset / limit) + 1
					const { items, totalItems } = await getParkingSessions(
						page,
						perPage,
						searchPlateNumber,
						mergeDateTime(new Date(startDate).toLocaleDateString(), startTime),
						mergeDateTime(new Date(endDate).toLocaleDateString(), endTime)
					)
					return {
						rows: items as ICarsInParking[],
						total: totalItems,
					}
				}}
				heightRequest={() => window.innerHeight - 80}
				onRowClick={row => {
					setSelectedRow(row)
					pickData()
				}}
			/>
			{render()}
		</>
	)
}

export default CarsSessions
