import { Card, CardContent, Typography, Box } from '@mui/material'
import { formatNumber } from '../CarsSessions/view/function'

interface DashboardCardProps {
	title: string
	value: number | string
	icon: React.ReactNode
	subtitle?: string
	secondaryValue?: string | number
	mounthCount?: string | number
}

function DashboardCard({
	title,
	value,
	subtitle,
	secondaryValue,
	icon,
	mounthCount,
}: DashboardCardProps) {
	return (
		<Card
			sx={{
				height: 320,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				borderRadius: 5,
				boxShadow: 3,
				textAlign: 'center',
				p: 2,
			}}
		>
			<Box sx={{ color: 'primary.main' }}>{icon}</Box>
			<CardContent
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					p: 0,
				}}
			>
				<Typography variant='h6' fontWeight='medium' gutterBottom>
					{title}
				</Typography>

				{/* Сумма */}
				<Typography variant='h5' fontWeight='bold' sx={{ mb: 1 }}>
					Сумма: {formatNumber(value)} сум
				</Typography>

				{/* Визиты */}
				{secondaryValue !== undefined && (
					<Typography
						variant='h6'
						fontWeight='medium'
						color='text.secondary'
						sx={{ mb: 1 }}
					>
						количество: {secondaryValue}
					</Typography>
				)}
				{mounthCount !== undefined && (
					<Typography
						variant='h6'
						fontWeight='medium'
						color='text.secondary'
						sx={{ mb: 1 }}
					>
						количество покупок: {mounthCount}
					</Typography>
				)}
				{/* Подпись */}
				{subtitle && (
					<Typography
						variant='body2'
						color='text.secondary'
						sx={{ textWrap: 'nowrap' }}
					>
						{subtitle}
					</Typography>
				)}
			</CardContent>
		</Card>
	)
}

export default DashboardCard
