import {
	iterateDocuments,
	ListTyped,
	pickDocuments,
	SelectionMode,
	useActionModal,
	useActualRef,
	useConfirm,
	type ISize,
	type RowId,
} from 'react-declarative'
import type { ICarsInParking } from '../../types/CarsInParking'
import {
	deleteParkingSessions,
	getCarsByType,
	getParkingSessions,
} from '../../api/carsSessions'
import { useState } from 'react'
import { columns, display_fields, filters, operations } from './view/Fields'
import { downloadSessionsXLSX, mergeDateTime } from './view/function'
const CarsSessions = () => {
	const [selectedRow, setSelectedRow] = useActualRef<ICarsInParking | null>(
		null
	)
	const [selectedRows, setSelectedRows] = useState<RowId[]>([])
	const { pickData, render } = useActionModal({
		withActionButton: false,
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

	const pickConfirm = useConfirm({
		title: 'Вы уверены?',
		msg: 'Действие необратимо. Продолжить?',
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
					const [dayStart, monthStart, yearStart] = startDate
						.split('/')
						.map(Number)
					const start = new Date(yearStart, monthStart - 1, dayStart)
					const [dayEnd, monthEnd, yearEnd] = endDate.split('/').map(Number)
					const end = new Date(yearEnd, monthEnd - 1, dayEnd)

					const next = pickDocuments(limit, offset)
					const iterator = iterateDocuments({
						createRequest: async ({ limit, page }) => {
							const { items } = await getParkingSessions(
								page,
								limit,
								searchPlateNumber,
								mergeDateTime(start.toLocaleDateString(), startTime),
								mergeDateTime(end.toLocaleDateString(), endTime)
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
					for await (const rows of iterator) {
						if (next(rows).done) {
							break
						}
					}
					const { rows } = next([])
					return {
						rows: rows as ICarsInParking[],
						total: null,
					}
				}}
				heightRequest={() => window.innerHeight - 80}
				onRowClick={row => {
					setSelectedRow(row)
					pickData()
				}}
				selectionMode={SelectionMode.Multiple}
				selectedRows={selectedRows}
				onSelectedRows={row => setSelectedRows(row)}
				operations={operations}
				onOperation={async (...args) => {
					if (args[0] == 'delete') {
						const confirm = await pickConfirm({
							msg: 'После удаления истории, ее нельзя будет восстановить',
						}).toPromise()
						if (!confirm) {
							return
						}
						Promise.all(
							args[1].map(session => {
								return deleteParkingSessions(session.id)
							})
						)
						window.location.reload()
						setSelectedRows([])
					} else if (args[0] == 'download') {
						downloadSessionsXLSX(args[1])
					}
				}}
			/>

			{render()}
		</>
	)
}

export default CarsSessions
