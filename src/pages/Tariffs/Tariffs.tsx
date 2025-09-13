import {
	ListTyped,
	SelectionMode,
	useActionModal,
	useConfirm,
} from 'react-declarative'
import type { ICars } from '../../types/CarsInParking'
import { filters } from '../CarsSessions/view/Fields'
import {
	createCars,
	deleteCars,
	getCars,
	getTypesCar,
} from '../../api/carsSessions'
import {
	downloadCarsXLSX,
	mergeDateTime,
	toDate,
} from '../CarsSessions/view/function'
import { useState } from 'react'
import type { RowId } from 'react-declarative/model/IRowData'
import { actions, columns, display_fields } from './view/Fields'

const Tariffs = () => {
	const pickConfirm = useConfirm({
		title: 'Вы уверены?',
		msg: 'Действие необратимо. Продолжить?',
	})

	const [searchPlateNumber, setSearchPlateNumber] = useState<string>('')

	const [selectedRows, setSelectedRows] = useState<RowId[]>([])
	const { pickData, render } = useActionModal({
		withActionButton: true,
		fields: display_fields,
		handler: async () => ({
			billingInfo: await getTypesCar(),
		}),
		onSubmit: async (data: any) => {
			await createCars(
				data.PlateNumber,
				data.ownerName,
				data.group,
				toDate(data.startDate, data.startTime),
				toDate(data.endDate, data.endTime)
			)
			window.location.reload()
			return true
		},
		submitLabel: 'СОХРАНИТЬ',
	})
	return (
		<>
			<ListTyped<
				{
					startDate: string
					endDate: string
					startTime: string
					endTime: string
				},
				ICars
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
					const perPage = limit
					const page = Math.floor(offset / limit) + 1
					const { items, totalItems } = await getCars(
						page,
						perPage,
						searchPlateNumber,
						mergeDateTime(start.toLocaleDateString(), startTime),
						mergeDateTime(end.toLocaleDateString(), endTime)
					)
					return {
						rows: items as ICars[],
						total: totalItems,
					}
				}}
				heightRequest={() => window.innerHeight - 80}
				selectionMode={SelectionMode.Multiple}
				selectedRows={selectedRows}
				actions={actions}
				onAction={async (...args) => {
					if (args[0] == 'add') {
						pickData()
					} else if (args[0] === 'download') {
						downloadCarsXLSX(args[1])
					} else if (args[0] === 'delete') {
						const confirm = await pickConfirm({
							msg: 'После удаления истории, ее нельзя будет восстановить',
						}).toPromise()
						if (!confirm) {
							return
						}
						Promise.all(
							args[1].map(session => {
								return deleteCars(session.id)
							})
						)
						window.location.reload()
						setSelectedRows([])
					}
				}}
				onSelectedRows={row => setSelectedRows(row)}
			/>
			{render()}
		</>
	)
}

export default Tariffs
