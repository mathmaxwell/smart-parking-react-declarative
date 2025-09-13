import {
	ColumnType,
	FieldType,
	type IColumn,
	type TypedField,
} from 'react-declarative'
import { pb } from '../../../../pb'
import type { ICarsInParking, ICarsType } from '../../../types/CarsInParking'
import { Box, Typography } from '@mui/material'
import { getDiff } from '../../../functions/carsInParking'
import { calculateForFree } from './function'
import type IListOperation from 'react-declarative/model/IListOperation'

export const display_fields: TypedField[] = [
	{
		type: FieldType.Paper,
		fields: [
			{
				type: FieldType.Component,
				element: (session: ICarsInParking) => (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-evenly',
							width: '100%',
							gap: 2,
							flexDirection: { xs: 'column', lg: 'row' },
						}}
					>
						<img
							src={pb.files.getURL(session, session.entryPhoto)}
							alt='entry'
							style={{
								minWidth: '300px',
								width: '100%',
								objectFit: 'cover',
								boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
							}}
						/>
						<img
							src={pb.files.getURL(session, session.exitPhoto)}
							alt='exit'
							style={{
								minWidth: '300px',
								width: '100%',
								objectFit: 'cover',
								boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
							}}
						/>
					</Box>
				),
			},
		],
	},
	{
		type: FieldType.Paper,
		fields: [
			{
				type: FieldType.Component,
				element: (session: ICarsInParking) => {
					const row = {
						isBus: session.isBus,
						entryTime: session.entryTime,
						exitTime: session.exitTime,
					}
					localStorage.setItem('indormation', JSON.stringify(row))
					const diffMins =
						((session?.exitTime
							? new Date(session.exitTime).getTime()
							: Date.now()) -
							(session?.entryTime
								? new Date(session.entryTime).getTime()
								: Date.now())) /
						1000 /
						60

					const diffHours = Math.floor(diffMins / 60)
					const diffMinutes = Math.floor(diffMins % 60)
					return (
						<Box>
							<Box
								sx={{
									display: 'flex',
									gap: 1,
									alignItems: 'center',
									justifyContent: 'center',
									flexWrap: 'wrap',
								}}
							>
								<Typography variant='h6'>время входа:</Typography>
								<Typography variant='body1'>
									{new Date(session.entryTime).toLocaleString().slice(0, 17)}
								</Typography>
							</Box>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexWrap: 'wrap',
									gap: 1,
								}}
							>
								<Typography variant='h6'>время выхода: </Typography>
								<Typography variant='body1'>
									{new Date(session.exitTime).toLocaleString().slice(0, 17)}
								</Typography>
							</Box>
							<Box
								sx={{
									display: 'flex',
									gap: 1,
									alignItems: 'center',
									justifyContent: 'center',
									flexWrap: 'wrap',
								}}
							>
								<Typography variant='h6'>обшое время:</Typography>
								<Typography variant='body1'>
									{`${diffHours} ч ${diffMinutes} м`}
								</Typography>
							</Box>
						</Box>
					)
				},
			},
		],
	},
	{
		type: FieldType.Paper,
		fields: [
			{
				type: FieldType.Component,
				element: ({ billingInfo }: { billingInfo: ICarsType[] }) => {
					const result = calculateForFree(billingInfo)
					if (typeof result === 'number') {
						return (
							<Typography
								sx={{ textAlign: 'center' }}
							>{`должен заплптить ${result} сум`}</Typography>
						)
					}
					if (result.cost === 0) {
						return (
							<Typography
								sx={{ textAlign: 'center' }}
							>{`у него подписка до ${new Date(result.end_Date)
								.toLocaleString()
								.slice(0, 17)}`}</Typography>
						)
					} else {
						if (!result.newSubscription) {
							return (
								<Typography
									sx={{ textAlign: 'center' }}
								>{`подписка закончилась в ${new Date(result.end_Date)
									.toLocaleString()
									.slice(0, 17)} и он должен заплатить ${
									result.cost
								} сум`}</Typography>
							)
						} else {
							return (
								<Typography
									sx={{ textAlign: 'center' }}
								>{`У него нет активной подписки, следующая подписка начинается в ${new Date(
									result.start_Date
								)
									.toLocaleString()
									.slice(0, 17)} и он должен заплатить ${
									result.cost
								} сум`}</Typography>
							)
						}
					}
				},
			},
		],
	},
]
// {
// 	type: FieldType.Component,
// 	element: (session: ICarsInParking) => (
// 		<Async payload={session}>
// 			{async () => {
// 				const result = await getCarsByType('', '', session.plateNumber)
// 				console.log('result', result)
// 				return <pre>{JSON.stringify(result, null, 2)}</pre>
// 			}}
// 		</Async>
// 	),
// },

// compute: (data: ICarsInParking) => JSON.stringify(data.plateNumber),
// element: (data: ICarsInParking) => (
// 	<img
// 		src={pb.files.getURL(data, data.exitPhoto)}
// 		alt='entry'
// 		height={60}
// 		width={60}
// 		style={{
// 			objectFit: 'cover',
// 			boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
// 		}}
// 	/>
// ),

export const columns: IColumn<{}, ICarsInParking>[] = [
	{
		type: ColumnType.Component,
		field: 'plateNumber',
		headerName: 'номер машины',
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
		type: ColumnType.Compute,
		headerName: 'время входа',
		primary: true,
		element: ({ entryTime }) => (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'start',
					justifyContent: 'center',
				}}
			>
				<Typography>
					{new Date(entryTime).toLocaleString().slice(0, 10)}
				</Typography>
				<Typography>
					{new Date(entryTime).toLocaleString().slice(11, 17)}
				</Typography>
			</Box>
		),
		width: () => '200px',
	},
	{
		type: ColumnType.Compute,
		headerName: 'фотография входа',
		primary: true,
		element: session => (
			<img
				src={pb.files.getURL(session, session.entryPhoto)}
				alt='entry'
				height={60}
				width={60}
				style={{
					objectFit: 'cover',
					boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
				}}
			/>
		),
		width: () => '200px',
	},
	{
		type: ColumnType.Compute,
		headerName: 'время выхода',
		primary: true,
		element: ({ exitTime }) => (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'start',
					justifyContent: 'center',
				}}
			>
				<Typography>
					{new Date(exitTime).toLocaleString().slice(0, 10)}
				</Typography>
				<Typography>
					{new Date(exitTime).toLocaleString().slice(11, 17)}
				</Typography>
			</Box>
		),
		width: () => '200px',
	},
	{
		type: ColumnType.Compute,
		headerName: 'фотография выхода',
		primary: true,
		element: session => (
			<img
				src={pb.files.getURL(session, session.exitPhoto)}
				alt='entry'
				height={60}
				width={60}
				style={{
					objectFit: 'cover',
					boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
				}}
			/>
		),
		width: () => '200px',
	},
	{
		type: ColumnType.Component,
		headerName: 'время',
		element: session => {
			return (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'start',
						gap: 1,
					}}
				>
					<Typography sx={{ textWrap: 'nowrap' }}>{`${
						getDiff(session.entryTime, session.exitTime)[0]
					} ч `}</Typography>
					<Typography sx={{ textWrap: 'nowrap' }}>{`${
						getDiff(session.entryTime, session.exitTime)[1]
					} м`}</Typography>
				</Box>
			)
		},
		width: () => '200px',
	},
]
export const filters: TypedField[] = [
	{
		type: FieldType.Date,
		name: 'startDate',
		title: 'start date',
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
		title: 'start time',
		defaultValue: '00:00',
	},
	{
		type: FieldType.Date,
		name: 'endDate',
		title: 'end date',
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
		title: 'end time',
		defaultValue: '23:59',
	},
]
export const operations: IListOperation[] = [
	{
		action: 'download',
		label: 'скачать',
	},
	{
		action: 'delete',
		label: 'удалить',
		isAvailable: async row => {
			console.log(row)
			return true
		},
	},
]
