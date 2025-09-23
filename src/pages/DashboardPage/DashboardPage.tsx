import { FetchView, One } from 'react-declarative'
import { getAllParkingSessions } from '../../api/carsSessions'
import { useState } from 'react'
import { formatDate, toDate } from '../CarsSessions/view/function'
import { filters } from './view/DashboardFields'
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import { processDashboard } from './function/calculateDashboard'

const DashboardPage = () => {
	const [filterData, setFilterData] = useState({
		startDate: new Date().toLocaleDateString('en-GB'),
		startTime: '00:00',
		endDate: new Date().toLocaleDateString('en-GB'),
		endTime: '23:59',
	})

	return (
		<>
			<One
				fields={filters}
				data={filterData}
				onChange={setFilterData}
				onClick={e => {
					if (e !== 'week' && e !== 'today' && e !== 'month' && e !== 'year') {
						return
					}
					const now = new Date()
					let start = new Date(now)
					let end = new Date(now)
					if (e === 'today') {
						start.setHours(0, 0, 0, 0)
						end.setHours(23, 59, 59, 999)
					} else if (e === 'week') {
						start.setDate(now.getDate() - 7)
						start.setHours(0, 0, 0, 0)
						end.setHours(23, 59, 59, 999)
					} else if (e === 'month') {
						start.setMonth(now.getMonth() - 1)
						start.setHours(0, 0, 0, 0)
						end.setHours(23, 59, 59, 999)
					} else if (e === 'year') {
						start.setFullYear(now.getFullYear() - 1)
						start.setHours(0, 0, 0, 0)
						end.setHours(23, 59, 59, 999)
					}
					setFilterData({
						startDate: formatDate(start),
						startTime: '00:00',
						endDate: formatDate(end),
						endTime: '23:59',
					})
				}}
			/>
			<FetchView
				payload={filterData}
				state={async () => {
					const response = await getAllParkingSessions(
						toDate(filterData.startDate, filterData.startTime),
						toDate(filterData.endDate, filterData.endTime)
					)
					return response
				}}
			>
				{async dashboard => {
					const result = await processDashboard(dashboard)
					return (
						<TableContainer component={Paper} sx={{ mt: 1 }}>
							<Table sx={{ minWidth: 650 }} aria-label='summary table'>
								<TableHead>
									<TableRow>
										<TableCell>
											<Typography variant='h6'>category</Typography>
										</TableCell>
										<TableCell align='right'>
											<Typography variant='h6'>howManyTimesArrived</Typography>
										</TableCell>
										<TableCell align='right'>
											<Typography variant='h6'>totalSum</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{/* Итог */}
									<TableRow>
										<TableCell component='th' scope='row'>
											<Typography variant='h6'>total</Typography>
										</TableCell>
										<TableCell align='right'>
											<Typography variant='h6'>
												{result?.bus.count +
													result?.others.count +
													result?.tenant.count +
													result?.worker.count +
													result?.whiteList.count}
											</Typography>
										</TableCell>
										<TableCell align='right'>
											<Typography variant='h6'>
												{result?.bus.sum +
													result?.others.sum +
													result?.tenant.sum +
													result?.worker.sum +
													result?.whiteList.sum}
											</Typography>
										</TableCell>
									</TableRow>
									{/* Автобусы */}
									<TableRow>
										<TableCell component='th' scope='row'>
											<Typography>bus</Typography>
										</TableCell>
										<TableCell align='right'>{result?.bus.count}</TableCell>
										<TableCell align='right'>{result?.bus.sum}</TableCell>
									</TableRow>

									{/* Другие */}
									<TableRow>
										<TableCell component='th' scope='row'>
											<Typography>others</Typography>
										</TableCell>
										<TableCell align='right'>{result?.others.count}</TableCell>
										<TableCell align='right'>{result?.others.sum}</TableCell>
									</TableRow>

									{/* Работники */}
									<TableRow>
										<TableCell component='th' scope='row'>
											<Typography>worker</Typography>
										</TableCell>
										<TableCell align='right'>{result?.worker.count}</TableCell>
										<TableCell align='right'>{result?.worker.sum}</TableCell>
									</TableRow>

									{/* Арендаторы */}
									<TableRow>
										<TableCell component='th' scope='row'>
											<Typography>tenant</Typography>
										</TableCell>
										<TableCell align='right'>{result?.tenant.count}</TableCell>
										<TableCell align='right'>{result?.tenant.sum}</TableCell>
									</TableRow>
									{/* Белый список */}
									<TableRow>
										<TableCell component='th' scope='row'>
											<Typography>whiteList</Typography>
										</TableCell>
										<TableCell align='right'>
											{result?.whiteList.count}
										</TableCell>
										<TableCell align='right'>-</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					)
				}}
			</FetchView>
		</>
	)
}

export default DashboardPage
