import {
	Async,
	ColumnType,
	FieldType,
	type IColumn,
	type TypedField,
} from 'react-declarative'
import { pb } from '../../../../pb'
import type { ICarsInParking } from '../../../types/CarsInParking'
import { Box, Typography } from '@mui/material'
import { getDiff } from '../../../functions/carsInParking'
import { getCarsByType } from '../../../api/carsSessions'

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
			{
				type: FieldType.Component,
				element: (session: ICarsInParking) => {
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
									flexWrap: 'wrap', // Allow wrapping for long text
								}}
							>
								<Typography variant='h6'>время входа:</Typography>
								<Typography variant='body1'>
									{session.entryTime.toString()}
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
									{session.exitTime.toString()}
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
			{
				type: FieldType.Component,
				element: (session: ICarsInParking) => (
					<Async payload={session}>
						{async () => {
							const result = await getCarsByType('', '', session.plateNumber)
							console.log('result', result)
							return <pre>{JSON.stringify(result, null, 2)}</pre>
						}}
					</Async>
				),
			},
			{
				type: FieldType.Component,
				element: ({ billingInfo }) => (
					<pre>{JSON.stringify(billingInfo, null, 2)}</pre>
				),
			},
		],

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
	},
]
export function mergeDateTime(
	dateStr?: string,
	timeStr?: string
): Date | undefined {
	if (!dateStr) return undefined
	const date = new Date(dateStr)
	if (timeStr) {
		const [hours, minutes] = timeStr.split(':').map(Number)
		date.setHours(hours, minutes, 0, 0)
	} else {
		date.setHours(0, 0, 0, 0)
	}

	return date
}
export const columns: IColumn<{}, ICarsInParking>[] = [
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
		type: ColumnType.Compute,
		headerName: 'entry time',
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
		headerName: 'entry photo',
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
		headerName: 'entry time',
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
		headerName: 'exit photo',
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
		headerName: 'Component',
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
