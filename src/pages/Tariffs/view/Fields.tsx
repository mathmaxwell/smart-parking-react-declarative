import {
	ActionType,
	ColumnType,
	FieldType,
	useAsyncValue,
	type IListAction,
} from 'react-declarative'
import type IColumn from 'react-declarative/model/IColumn'
import type { ICarGroup, ICars } from '../../../types/CarsInParking'
import { Box, Typography } from '@mui/material'
import type TypedField from 'react-declarative/model/TypedField'
import type IListOperation from 'react-declarative/model/IListOperation'
import { getTypesCarById } from '../../../api/carsSessions'

export const columns: IColumn<{}, ICars>[] = [
	{
		type: ColumnType.Component,
		field: 'plateNumber',
		headerName: 'plateNumber',
		secondary: false,
		width: fullWidth => Math.max((fullWidth - 650) / 3, 200),
		isVisible: () => {
			return true
		},
		element: ({ plateNumber }) => (
			<Typography
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'start',
				}}
			>
				{plateNumber}
			</Typography>
		),
		sortable: false,
	},
	{
		type: ColumnType.Component,
		field: 'ownerName',
		headerName: 'название компании',
		secondary: false,
		width: fullWidth => Math.max((fullWidth - 650) / 3, 200),
		isVisible: () => {
			return true
		},
		element: ({ ownerName }) => (
			<Typography
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'start',
				}}
			>
				{ownerName || '-'}
			</Typography>
		),
		sortable: false,
	},
	{
		type: ColumnType.Compute,
		headerName: 'тип',
		element: ({ type }) => {
			const [data, { loading }] = useAsyncValue(async () => {
				return await getTypesCarById(type)
			})
			if (loading) {
				return <>загрузка</>
			}
			if (data?.display_name === 'worker') return <>Сотрудники (абонемент)</>
			else if (data?.display_name === 'tenant')
				return <>Арендаторы и прочие организации (абонемент)</>
			else if (data?.display_name === 'whiteList') return <>Белый список</>
			else {
				return <>{data?.display_name}</>
			}
		},
		width: () => '200px',
	},
	{
		type: ColumnType.Compute,
		headerName: 'начало подписки',
		primary: true,
		element: ({ start_Date }) => (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'start',
					justifyContent: 'center',
				}}
			>
				<Typography>
					{new Date(start_Date).toLocaleString().slice(0, 10)}
				</Typography>
				<Typography>
					{new Date(start_Date).toLocaleString().slice(11, 17)}
				</Typography>
			</Box>
		),
		width: () => '200px',
	},

	{
		type: ColumnType.Compute,
		headerName: 'конец подписки',
		primary: true,
		element: ({ end_Date }) => (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'start',
					justifyContent: 'center',
				}}
			>
				<Typography>
					{new Date(end_Date).toLocaleString().slice(0, 10)}
				</Typography>
				<Typography>
					{new Date(end_Date).toLocaleString().slice(11, 17)}
				</Typography>
			</Box>
		),
		width: () => '200px',
	},
]

export const display_fields: TypedField[] = [
	{
		type: FieldType.Component,
		element: () => {
			return (
				<>
					<Typography variant='body2' sx={{ textAlign: 'center' }}>
						Если вы создаете подписку, то машина с номером, который вы указали,
						не будет платить в указанный период
					</Typography>
				</>
			)
		},
	},
	{
		type: FieldType.Group,
		fieldRightMargin: '0',
		fields: [
			{ type: FieldType.Text, name: 'PlateNumber', title: 'plateNumber' },
			{ type: FieldType.Text, name: 'ownerName', title: 'название компании' },
			{
				type: FieldType.Combo,
				name: 'group',
				title: 'Категория',
				async itemList({ billingInfo }: { billingInfo: ICarGroup[] }) {
					const workerGroup = billingInfo.find(
						group => group.display_name === 'worker'
					)
					const tenantGroup = billingInfo.find(
						group => group.display_name === 'tenant'
					)
					const whiteListGroup = billingInfo.find(
						group => group.display_name === 'whiteList'
					)

					return [workerGroup?.id, tenantGroup?.id, whiteListGroup?.id].filter(
						(id): id is string => Boolean(id)
					)
				},
				async tr(current, { billingInfo }: { billingInfo: ICarGroup[] }) {
					const group = billingInfo.find(g => g.id === current)
					if (!group) return ''
					switch (group.display_name) {
						case 'worker':
							return 'Сотрудники (абонемент)'
						case 'tenant':
							return 'Арендаторы и прочие организации (абонемент)'
						case 'whiteList':
							return 'белый лист'
						default:
							return ''
					}
				},
				defaultValue: '',
			},
			{
				type: FieldType.Date,
				name: 'startDate',
				title: 'Абонентская оплата c',
				defaultValue: () => {
					const today = new Date()
					const day = String(today.getDate()).padStart(2, '0')
					const month = String(today.getMonth() + 1).padStart(2, '0')
					const year = today.getFullYear()
					return `${day}/${month}/${year}`
				},
			},
			{
				type: FieldType.Time,
				name: 'startTime',
				title: 'Абонентская оплата c',
				defaultValue: '00:00',
			},
			{
				type: FieldType.Date,
				name: 'endDate',
				title: 'Срок окончания подписки',
				defaultValue: () => {
					const today = new Date()
					const day = String(today.getDate()).padStart(2, '0')
					const month = String(today.getMonth() + 1).padStart(2, '0')
					const year = today.getFullYear()
					return `${day}/${month}/${year}`
				},
			},
			{
				type: FieldType.Time,
				name: 'endTime',
				title: 'Срок окончания подписки',
				defaultValue: '23:59',
			},
		],
	},

	{
		type: FieldType.Component,
		element: () => {
			return (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'start',
						gap: 1,
					}}
				>
					<Typography variant='body2' sx={{ textAlign: 'start' }}>
						Арендаторы и прочие организации (абонемент) - 300.000 сум за месяц
					</Typography>
					<Typography variant='body2' sx={{ textAlign: 'start' }}>
						Сотрудники (абонемент) - 100.000 сум за месяц
					</Typography>
					<Typography variant='body2' sx={{ textAlign: 'start' }}>
						белый лист - бесплатно
					</Typography>
				</Box>
			)
		},
	},
]
export const operations: IListOperation[] = [
	{
		action: 'download',
		label: 'download',
	},
	{
		action: 'delete',
		label: 'delete',
		isAvailable: async row => {
			console.log(row)
			return true
		},
	},
]
export const actions: IListAction[] = [
	{
		type: ActionType.Menu,
		options: [
			{
				action: 'add',
				label: 'добавить',
			},
			{
				action: 'delete',
				label: 'delete',
			},
			{
				action: 'download',
				label: 'download',
			},
		],
	},
]
