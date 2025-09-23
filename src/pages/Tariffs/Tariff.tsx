import { FetchView, useActionModal } from 'react-declarative'
import { getCarGroup } from '../../api/carsSessions'
import {
	Box,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import type { ICarGroup } from '../../types/CarsInParking'
import { createTariffs } from '../../api/tariffs'
import { tariffFields } from './view/TariffFields'
const columns: (keyof ICarGroup)[] = [
	'first10Minutes',
	'from11To59for10',
	'after61',
	'first2hours',
	'from2Hour',
	'hour',
	'day',
	'month',
]
const order: ['others', 'bus', 'worker', 'tenant', 'whiteList'] = [
	'others',
	'bus',
	'worker',
	'tenant',
	'whiteList',
]
const Tariff = () => {
	const { pickData, render } = useActionModal({
		withActionButton: true,
		fields: tariffFields,
		onSubmit: async (data: any) => {
			await createTariffs(data.start, data.end)
			window.location.reload()
			return true
		},
		submitLabel: 'save',
	})
	return (
		<>
			<FetchView
				state={async () => {
					const result = await getCarGroup()
					return result
				}}
			>
				{result => {
					const groupedCarGroups = result.reduce((acc, car) => {
						const key = `${car.start}-${car.end}`
						if (!acc[key]) {
							acc[key] = {
								start: car.start,
								end: car.end,
								cars: [],
								start_Date: car.startDate,
								end_Date: car.endDate,
							}
						}
						acc[key].cars.push(car)
						return acc
					}, {} as Record<string, { start: number; end: number; cars: ICarGroup[]; start_Date: Date; end_Date: Date }>)

					const groupedArray = Object.values(groupedCarGroups)
					return (
						<>
							<Box
								sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}
							>
								<Button
									onClick={() => {
										pickData()
									}}
									variant='contained'
								>
									addTariff
								</Button>
							</Box>
							{groupedArray.map(tariff => (
								<Box key={tariff.start}>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
										}}
									>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'start',
												justifyContent: 'space-between',
												flexWrap: 'wrap',
												flexDirection: 'column',
											}}
										>
											<Typography variant='subtitle1'>
												{'start date'}:{' '}
												{tariff.start_Date.toString().slice(0, 10)}
											</Typography>
											<Typography variant='subtitle1' sx={{ mb: 1 }}>
												{'end date'}: {tariff.end_Date.toString().slice(0, 10)}
											</Typography>
										</Box>
										<Box sx={{ display: 'flex', gap: 1 }}>
											<Button
												variant='outlined'
												onClick={() => {
													localStorage.setItem(
														'selectedTariff',
														JSON.stringify(tariff)
													)
												}}
											>
												editTariff
											</Button>
											<Button
												variant='outlined'
												onClick={() => {
													localStorage.setItem(
														'selectedTariff',
														JSON.stringify(tariff)
													)
												}}
											>
												deleteTariff
											</Button>
										</Box>
									</Box>
									<TableContainer
										sx={{
											boxShadow: 10,
											border: '1px solid black',
											overflowX: 'auto',
										}}
										component={Paper}
									>
										<Table
											sx={{ minWidth: 650 }}
											aria-label={`tariff table ${tariff.start}-${tariff.end}`}
										>
											<TableHead>
												<TableRow>
													<TableCell>allTypesCar</TableCell>
													{columns.map(col => (
														<TableCell key={col} align='center'>
															{col}
														</TableCell>
													))}
												</TableRow>
											</TableHead>
											<TableBody>
												{tariff.cars
													.filter(car => car.display_name !== 'whiteList')
													.sort((a, b) => {
														const indexA = order.indexOf(a.display_name)
														const indexB = order.indexOf(b.display_name)
														return (
															(indexA === -1 ? order.length : indexA) -
															(indexB === -1 ? order.length : indexB)
														)
													})
													.map(car => {
														if (car.display_name === 'whiteList') return null
														return (
															<TableRow key={car.id}>
																<TableCell
																	component='th'
																	scope='row'
																	style={{ whiteSpace: 'pre-line' }}
																>
																	{car.display_name}
																</TableCell>
																{columns.map(col => {
																	const value = car[col] as number | string
																	let displayValue: string | number = '-'
																	if (value === -1) displayValue = 'free'
																	else if (value && value !== 0)
																		displayValue = value
																	return (
																		<TableCell align='center' key={col}>
																			<Button
																				onClick={() => {
																					localStorage.setItem(
																						'tariffCostUpdate',
																						JSON.stringify({ tariff, car })
																					)
																				}}
																			>
																				{displayValue}
																			</Button>
																		</TableCell>
																	)
																})}
																<TableCell></TableCell>
															</TableRow>
														)
													})}
											</TableBody>
										</Table>
									</TableContainer>
								</Box>
							))}
						</>
					)
				}}
			</FetchView>
			{render()}
		</>
	)
}

export default Tariff
