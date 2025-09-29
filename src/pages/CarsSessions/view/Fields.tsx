import {
	ColumnType,
	FieldType,
	type IColumn,
	type TypedField,
} from 'react-declarative'
import { pb } from '../../../../pb'
import type { ICarsInParking } from '../../../types/CarsInParking'
import { Box, Button, Typography } from '@mui/material'
import { getDiff } from '../../../functions/carsInParking'
import type IListOperation from 'react-declarative/model/IListOperation'
import history from '../../../helpers/history'

export const display_fields: TypedField[] = [
	{
		type: FieldType.Paper,
		fields: [
			{
				type: FieldType.Component,
				element: (session: ICarsInParking) => (
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
							gap: 1,
							width: '100%',
						}}
					>
						<Box sx={{ textAlign: 'center' }}>
							<Box
								component='img'
								src={pb.files.getURL(session, session.entryPhoto)}
								alt='entry'
								sx={{
									width: '100%',
									maxWidth: '100%',
									height: { xs: 'auto', lg: '408px' },
									objectFit: 'cover',
									boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
									maxHeight: '408px',
								}}
							/>
						</Box>
						<Box sx={{ textAlign: 'center' }}>
							<Box
								component='img'
								src={pb.files.getURL(session, session.exitPhoto)}
								alt='exit'
								sx={{
									width: '100%',
									maxWidth: '100%',
									height: { xs: 'auto', lg: '408px' },
									objectFit: 'cover',
									boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
									maxHeight: '408px',
								}}
							/>
						</Box>
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
					localStorage.setItem('information', JSON.stringify(row))
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
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									p: 2,
									backgroundColor: 'success.light',
									borderRadius: 1,
									color: 'success.contrastText',
								}}
							>
								<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
									{'entryTime'}:
								</Typography>
								<Typography variant='body1' sx={{ fontWeight: 600 }}>
									{new Date(session.entryTime).toLocaleString().slice(0, 17)}
								</Typography>
							</Box>

							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									p: 2,
									backgroundColor: 'error.light',
									borderRadius: 1,
									color: 'error.contrastText',
								}}
							>
								<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
									{'exitTime'}:
								</Typography>
								<Typography variant='body1' sx={{ fontWeight: 600 }}>
									{new Date(session.exitTime).toLocaleString().slice(0, 17)}
								</Typography>
							</Box>

							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									p: 2,
									backgroundColor: 'info.main',
									borderRadius: 1,
									color: 'info.contrastText',
								}}
							>
								<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
									{'totalTime'}:
								</Typography>
								<Typography variant='body1' sx={{ fontWeight: 600 }}>
									{`${diffHours} `}
									{'hour'}
									{` ${diffMinutes} `}
									{'minute'}
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
				element: costInfo => {
					return (
						<>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									p: 2,
									backgroundColor: 'info.light',
									borderRadius: 2,
									color: 'info.contrastText',

									gap: 2,
								}}
							>
								<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
									{costInfo.costInfo.display_name}
								</Typography>
								<Typography variant='body1' sx={{ fontWeight: 600 }}>
									{costInfo.costInfo.cost} {'som'}
								</Typography>
							</Box>
						</>
					)
				},
			},
		],
	},
]

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
		headerName: 'entryTime',
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
		width: () => '150px',
	},
	{
		type: ColumnType.Compute,
		headerName: 'entryPhoto',
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
		width: () => '150px',
	},
	{
		type: ColumnType.Compute,
		headerName: 'exitTime',
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
		width: () => '150px',
	},
	{
		type: ColumnType.Compute,
		headerName: 'exitPhoto',
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
		width: () => '150px',
	},
	{
		type: ColumnType.Component,
		headerName: 'time',
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
		width: () => '150px',
	},
	{
		type: ColumnType.Component,
		headerName: 'history',
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
					<Button
						onClick={e => {
							history.replace(
								`/cars_sessions/${session.plateNumber.toLocaleLowerCase()}`
							)
							e.stopPropagation()
							window.location.reload()
						}}
					>
						{'showHistory'}
					</Button>
				</Box>
			)
		},
		width: () => '150px',
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
			// return `${day}/${month}/${year}`
			return `${day}/${month}/${'2024'}`
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
