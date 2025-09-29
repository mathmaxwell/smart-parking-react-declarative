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
		headerName: 'company_name',
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
		headerName: 'category',
		element: ({ type }) => {
			const [data, { loading }] = useAsyncValue(async () => {
				return await getTypesCarById(type)
			})
			if (loading) {
				return <>{'loading'}</>
			}
			if (data?.display_name === 'worker') return <>{'worker'}</>
			else if (data?.display_name === 'tenant') return <>{'tenant'}</>
			else if (data?.display_name === 'whiteList') return <>{'whiteList'}</>
			else {
				return <>{data?.display_name}</>
			}
		},
		width: () => '200px',
	},
	{
		type: ColumnType.Compute,
		headerName: 'subscription_start',
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
		headerName: 'subscription_end',
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
						{'subscriptionNote'}
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
			{ type: FieldType.Text, name: 'ownerName', title: 'companyName' },
			{
				type: FieldType.Combo,
				name: 'group',
				title: 'category',
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
							return 'worker'
						case 'tenant':
							return 'tenant'
						case 'whiteList':
							return 'whiteList'
						default:
							return ''
					}
				},
				defaultValue: '',
			},
			{
				type: FieldType.Date,
				name: 'startDate',
				title: 'subscriptionFeeFrom',
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
				title: 'subscriptionFeeFrom',
				defaultValue: '00:00',
			},
			{
				type: FieldType.Date,
				name: 'endDate',
				title: 'subscriptionEndDate',
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
				title: 'subscriptionEndDate',
				defaultValue: '23:59',
			},
		],
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
				label: 'add',
			},

			{
				action: 'download',
				label: 'download',
			},
			{
				action: 'delete',
				label: 'delete',
			},
		],
	},
]
