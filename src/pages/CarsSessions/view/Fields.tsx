import {
	ColumnType,
	FieldType,
	type IColumn,
	type TypedField,
} from 'react-declarative'
import { pb } from '../../../../pb'
import type { ICarsInParking, ICarsType } from '../../../types/CarsInParking'
import { Box, Button, Typography } from '@mui/material'
import { getDiff } from '../../../functions/carsInParking'
import { calculateForFree } from './function'
import type IListOperation from 'react-declarative/model/IListOperation'
import history from '../../../helpers/history'
import { toLower } from 'lodash'

// export const display_fields: TypedField[] = [
// 	{
// 		type: FieldType.Paper,
// 		fields: [
// 			{
// 				type: FieldType.Component,
// 				element: (session: ICarsInParking) => (
// 					<Box
// 						sx={{
// 							display: 'flex',
// 							alignItems: 'center',
// 							justifyContent: 'space-evenly',
// 							width: '100%',
// 							gap: 2,
// 							flexDirection: { xs: 'column', lg: 'row' },
// 						}}
// 					>
// 						<img
// 							src={pb.files.getURL(session, session.entryPhoto)}
// 							alt='entry'
// 							style={{
// 								minWidth: '300px',
// 								width: '100%',
// 								objectFit: 'cover',
// 								boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
// 							}}
// 						/>
// 						<img
// 							src={pb.files.getURL(session, session.exitPhoto)}
// 							alt='exit'
// 							style={{
// 								minWidth: '300px',
// 								width: '100%',
// 								objectFit: 'cover',
// 								boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
// 							}}
// 						/>
// 					</Box>
// 				),
// 			},
// 		],
// 	},
// 	{
// 		type: FieldType.Paper,
// 		fields: [
// 			{
// 				type: FieldType.Component,
// 				element: (session: ICarsInParking) => {
// 					const row = {
// 						isBus: session.isBus,
// 						entryTime: session.entryTime,
// 						exitTime: session.exitTime,
// 					}
// 					localStorage.setItem('indormation', JSON.stringify(row))
// 					const diffMins =
// 						((session?.exitTime
// 							? new Date(session.exitTime).getTime()
// 							: Date.now()) -
// 							(session?.entryTime
// 								? new Date(session.entryTime).getTime()
// 								: Date.now())) /
// 						1000 /
// 						60

// 					const diffHours = Math.floor(diffMins / 60)
// 					const diffMinutes = Math.floor(diffMins % 60)
// 					return (
// 						<Box>
// 							<Box
// 								sx={{
// 									display: 'flex',
// 									gap: 1,
// 									alignItems: 'center',
// 									justifyContent: 'center',
// 									flexWrap: 'wrap',
// 								}}
// 							>
// 								<Typography variant='h6'>время входа:</Typography>
// 								<Typography variant='body1'>
// 									{new Date(session.entryTime).toLocaleString().slice(0, 17)}
// 								</Typography>
// 							</Box>
// 							<Box
// 								sx={{
// 									display: 'flex',
// 									alignItems: 'center',
// 									justifyContent: 'center',
// 									flexWrap: 'wrap',
// 									gap: 1,
// 								}}
// 							>
// 								<Typography variant='h6'>время выхода: </Typography>
// 								<Typography variant='body1'>
// 									{new Date(session.exitTime).toLocaleString().slice(0, 17)}
// 								</Typography>
// 							</Box>
// 							<Box
// 								sx={{
// 									display: 'flex',
// 									gap: 1,
// 									alignItems: 'center',
// 									justifyContent: 'center',
// 									flexWrap: 'wrap',
// 								}}
// 							>
// 								<Typography variant='h6'>обшое время:</Typography>
// 								<Typography variant='body1'>
// 									{`${diffHours} ч ${diffMinutes} м`}
// 								</Typography>
// 							</Box>
// 							<Button
// 								onClick={() => {
// 									localStorage.setItem('plateNumber', session.plateNumber)
// 									history.push('/history')
// 								}}
// 							>
// 								showHistory
// 							</Button>
// 						</Box>
// 					)
// 				},
// 			},
// 		],
// 	},
// 	{
// 		type: FieldType.Paper,
// 		fields: [
// 			{
// 				type: FieldType.Component,
// 				element: ({ billingInfo }: { billingInfo: ICarsType[] }) => {
// 					const result = calculateForFree(billingInfo)
// 					if (typeof result === 'number') {
// 						return (
// 							<Typography
// 								sx={{ textAlign: 'center' }}
// 							>{`должен заплптить ${result} сум`}</Typography>
// 						)
// 					}
// 					if (result.cost === 0) {
// 						return (
// 							<Typography
// 								sx={{ textAlign: 'center' }}
// 							>{`у него подписка до ${new Date(result.end_Date)
// 								.toLocaleString()
// 								.slice(0, 17)}`}</Typography>
// 						)
// 					} else {
// 						if (!result.newSubscription) {
// 							return (
// 								<Typography
// 									sx={{ textAlign: 'center' }}
// 								>{`подписка закончилась в ${new Date(result.end_Date)
// 									.toLocaleString()
// 									.slice(0, 17)} и он должен заплатить ${
// 									result.cost
// 								} сум`}</Typography>
// 							)
// 						} else {
// 							return (
// 								<Typography
// 									sx={{ textAlign: 'center' }}
// 								>{`У него нет активной подписки, следующая подписка начинается в ${new Date(
// 									result.start_Date
// 								)
// 									.toLocaleString()
// 									.slice(0, 17)} и он должен заплатить ${
// 									result.cost
// 								} сум`}</Typography>
// 							)
// 						}
// 					}
// 				},
// 			},
// 		],
// 	},
// ]
export const display_fields: TypedField[] = [
	{
		type: FieldType.Component,
		element: () => (
			<Box
				sx={{
					textAlign: 'center',
					borderBottom: '1px solid',
					borderColor: 'divider',
					pb: 2,
				}}
			>
				<Typography variant='h5' component='h2' sx={{ fontWeight: 600 }}>
					Информация о сессии
				</Typography>
			</Box>
		),
	},

	{
		type: FieldType.Paper,
		sx: {
			borderRadius: 2,
			boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
		},
		fields: [
			{
				type: FieldType.Component,
				element: (session: ICarsInParking) => (
					<Box>
						{/* <Typography
							variant='h6'
							sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}
						>
							Фотографии
						</Typography> */}
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
								gap: 1,
								width: '100%',
							}}
						>
							<Box sx={{ textAlign: 'center' }}>
								{/* <Typography
									variant='subtitle2'
									sx={{ mb: 1, color: 'text.secondary' }}
								>
									Въезд
								</Typography> */}
								<Box
									component='img'
									src={pb.files.getURL(session, session.entryPhoto)}
									alt='entry'
									sx={{
										width: '100%',
										maxWidth: '100%',
										height: 'auto',
										objectFit: 'cover',
										boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
									}}
								/>
							</Box>
							<Box sx={{ textAlign: 'center' }}>
								{/* <Typography
									variant='subtitle2'
									sx={{ mb: 1, color: 'text.secondary' }}
								>
									Выезд
								</Typography> */}
								<Box
									component='img'
									src={pb.files.getURL(session, session.exitPhoto)}
									alt='exit'
									sx={{
										width: '100%',
										maxWidth: '100%',
										height: 'auto',
										objectFit: 'cover',
										boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
									}}
								/>
							</Box>
						</Box>
					</Box>
				),
			},
		],
	},

	// Секция с временной информацией
	{
		type: FieldType.Paper,
		sx: {
			my: 2,
			borderRadius: 2,
			boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
		},
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
						<Box>
							{/* <Typography
								variant='h6'
								sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}
							>
								Временная информация
							</Typography> */}

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
										Время входа:
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
										Время выхода:
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
										backgroundColor: 'info.light',
										borderRadius: 1,
										color: 'info.contrastText',
									}}
								>
									<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
										Общее время:
									</Typography>
									<Typography variant='body1' sx={{ fontWeight: 600 }}>
										{`${diffHours} ч ${diffMinutes} м`}
									</Typography>
								</Box>
							</Box>

							{/* <Box sx={{ mt: 3, textAlign: 'center' }}>
								<Button
									variant='contained'
									size='large'
									sx={{
										px: 4,
										py: 1.5,
										borderRadius: 2,
										textTransform: 'none',
										fontSize: '1.1rem',
										fontWeight: 600,
										boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
										'&:hover': {
											boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
										},
									}}
									onClick={() => {
										localStorage.setItem('plateNumber', session.plateNumber)
										history.push('/history')
									}}
								>
									Показать историю
								</Button>
							</Box> */}
						</Box>
					)
				},
			},
		],
	},

	// Секция с информацией о платеже
	{
		type: FieldType.Paper,
		sx: {
			borderRadius: 2,
			boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
		},
		fields: [
			{
				type: FieldType.Component,
				element: ({ billingInfo }: { billingInfo: ICarsType[] }) => {
					const result = calculateForFree(billingInfo)

					const getPaymentInfo = () => {
						if (typeof result === 'number') {
							return {
								text: `Должен заплатить ${result} сум`,
								color: 'white',
								bgColor: 'error.light',
							}
						}

						if (result.cost === 0) {
							return {
								text: `Подписка активна до ${new Date(result.end_Date)
									.toLocaleString()
									.slice(0, 17)}`,
								color: 'white',
								bgColor: 'success.light',
							}
						}

						if (!result.newSubscription) {
							return {
								text: `Подписка закончилась ${new Date(result.end_Date)
									.toLocaleString()
									.slice(0, 17)}. К доплате: ${result.cost} сум`,
								color: 'white',
								bgColor: 'warning.light',
							}
						}

						return {
							text: `Нет активной подписки. Следующая начинается ${new Date(
								result.start_Date
							)
								.toLocaleString()
								.slice(0, 17)}. К доплате: ${result.cost} сум`,
							color: 'white',
							bgColor: 'info.light',
						}
					}
					const paymentInfo = getPaymentInfo()
					return (
						<Box
							sx={{
								p: 3,
								backgroundColor: paymentInfo.bgColor,
								borderRadius: 2,
								textAlign: 'center',
								border: `1px solid ${paymentInfo.color}`,
							}}
						>
							<Typography
								variant='body1'
								sx={{
									color: paymentInfo.color,
									fontWeight: 500,
									fontSize: '1.1rem',
								}}
							>
								{paymentInfo.text}
							</Typography>
						</Box>
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
		width: () => '150px',
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
		width: () => '150px',
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
		width: () => '150px',
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
		width: () => '150px',
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
						showHistory
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
