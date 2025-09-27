import { FetchView, One } from 'react-declarative'
import { header } from './view/Fields'
import { getAllParkingSessions, getCars } from '../../api/carsSessions'
import {
	calculateSubscriptionsCost,
	processDashboard,
} from '../DashboardPage/function/calculateDashboard'
import { Box, Card, CardContent, Typography } from '@mui/material'
import type { DashboardResult } from '../../types/CarsInParking'

function getMaxByCount(result: DashboardResult) {
	const [name, values] = Object.entries(result).reduce((max, current) =>
		current[1].count > max[1].count ? current : max
	)

	return { ...values, name }
}
const HistoryPage = ({ plateNumber }: { plateNumber: string }) => {
	return (
		<>
			<One fields={header} />
			<FetchView
				state={async () => {
					const sessions = await getAllParkingSessions(
						undefined,
						undefined,
						plateNumber
					)
					const result = await processDashboard(sessions)

					const max = getMaxByCount(result)

					const infoSubs = await calculateSubscriptionsCost({
						plateNumber: plateNumber,
						typeName: max.name,
					})

					return { sessions, max, infoSubs }
				}}
			>
				{async dashboard => {
					return (
						<>
							<Box>
								<Card
									sx={{
										borderRadius: 3,
										boxShadow: {
											xs: '0 2px 10px rgba(0, 0, 0, 0.1)',
											sm: '0 4px 20px rgba(0, 0, 0, 0.15)',
										},
										bgcolor: theme =>
											theme.palette.mode === 'dark'
												? 'linear-gradient(135deg, #1e293b 0%, #2d3748 100%)'
												: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
										color: theme =>
											theme.palette.mode === 'dark' ? '#e2e8f0' : '#1a237e',
										p: 3,
										transition: 'transform 0.3s ease, box-shadow 0.3s ease',
										'&:hover': {
											transform: 'translateY(-5px)',
											boxShadow: {
												xs: '0 4px 15px rgba(0, 0, 0, 0.15)',
												sm: '0 6px 25px rgba(0, 0, 0, 0.2)',
											},
										},
									}}
								>
									<CardContent>
										<Typography
											variant='h4'
											sx={{
												textAlign: 'center',
												my: 3,
												fontWeight: 600,
												color: theme =>
													theme.palette.mode === 'dark' ? '#e2e8f0' : '#1a237e',
											}}
										>
											{dashboard.max.name}
										</Typography>

										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												flexWrap: 'wrap',
												gap: 2,
											}}
										>
											<Box
												sx={{
													flex: 1,
													minWidth: 150,
													p: 2,
													borderRadius: 2,
													bgcolor: theme =>
														theme.palette.mode === 'dark'
															? '#334155'
															: '#e8f0fe',
													textAlign: 'center',
													transition: 'background-color 0.3s ease',
													'&:hover': {
														bgcolor: theme =>
															theme.palette.mode === 'dark'
																? '#475569'
																: '#d1e0ff',
													},
												}}
											>
												<Typography
													variant='h6'
													sx={{
														color: theme =>
															theme.palette.mode === 'dark'
																? '#cbd5e1'
																: '#424242',
														fontWeight: 500,
													}}
												>
													Номерной знак
												</Typography>
												<Typography
													variant='h5'
													sx={{
														color: theme =>
															theme.palette.mode === 'dark'
																? '#60a5fa'
																: '#1e88e5',
														fontWeight: 700,
														mt: 1,
													}}
												>
													{plateNumber.toUpperCase()}
												</Typography>
											</Box>
											<Box
												sx={{
													flex: 1,
													minWidth: 150,
													p: 2,
													borderRadius: 2,
													bgcolor: theme =>
														theme.palette.mode === 'dark'
															? '#334155'
															: '#e3f2fd',
													textAlign: 'center',
													transition: 'background-color 0.3s ease',
													'&:hover': {
														bgcolor: theme =>
															theme.palette.mode === 'dark'
																? '#475569'
																: '#c8e6f5',
													},
												}}
											>
												<Typography
													variant='h6'
													sx={{
														color: theme =>
															theme.palette.mode === 'dark'
																? '#cbd5e1'
																: '#424242',
														fontWeight: 500,
													}}
												>
													Прибытия
												</Typography>
												<Typography
													variant='h5'
													sx={{
														color: theme =>
															theme.palette.mode === 'dark'
																? '#38bdf8'
																: '#0288d1',
														fontWeight: 700,
														mt: 1,
													}}
												>
													{dashboard.max.count}
												</Typography>
											</Box>
											<Box
												sx={{
													flex: 1,
													minWidth: 150,
													p: 2,
													borderRadius: 2,
													bgcolor: theme =>
														theme.palette.mode === 'dark'
															? '#334155'
															: '#e0f7fa',
													textAlign: 'center',
													transition: 'background-color 0.3s ease',
													'&:hover': {
														bgcolor: theme =>
															theme.palette.mode === 'dark'
																? '#475569'
																: '#b2ebf2',
													},
												}}
											>
												<Typography
													variant='h6'
													sx={{
														color: theme =>
															theme.palette.mode === 'dark'
																? '#cbd5e1'
																: '#424242',
														fontWeight: 500,
													}}
												>
													Платежи
												</Typography>
												<Typography
													variant='h5'
													sx={{
														color: theme =>
															theme.palette.mode === 'dark'
																? '#4dd0e1'
																: '#0277bd',
														fontWeight: 700,
														mt: 1,
													}}
												>
													{dashboard.max.sum + dashboard.infoSubs.total}
												</Typography>
											</Box>
											<Box
												sx={{
													flex: 1,
													minWidth: 150,
													p: 2,
													borderRadius: 2,
													bgcolor: theme =>
														theme.palette.mode === 'dark'
															? '#334155'
															: '#e0f7fa',
													textAlign: 'center',
													transition: 'background-color 0.3s ease',
													'&:hover': {
														bgcolor: theme =>
															theme.palette.mode === 'dark'
																? '#475569'
																: '#b2ebf2',
													},
												}}
											>
												<Typography
													variant='h6'
													sx={{
														color: theme =>
															theme.palette.mode === 'dark'
																? '#cbd5e1'
																: '#424242',
														fontWeight: 500,
													}}
												>
													подписки
												</Typography>
												<Typography
													variant='h5'
													sx={{
														color: theme =>
															theme.palette.mode === 'dark'
																? '#4dd0e1'
																: '#0277bd',
														fontWeight: 700,
														mt: 1,
													}}
												>
													{dashboard.infoSubs.purchases.length}
												</Typography>
											</Box>
										</Box>
									</CardContent>
								</Card>
							</Box>
						</>
					)
				}}
			</FetchView>
		</>
	)
}

export default HistoryPage
