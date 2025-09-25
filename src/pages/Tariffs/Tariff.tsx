import { FetchView, useActionModal, useConfirm } from 'react-declarative'
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
import {
	createTariffs,
	deleteTariffs,
	updateTariff,
	updateTariffCost,
} from '../../api/tariffs'
import {
	tariffDateUpdateFields,
	tariffFields,
	columns,
	order,
	tariffCostUpdateFields,
} from './view/tariffFields'
import { parseDate } from '../CarsSessions/view/function'

const Tariff = () => {
	const { pickData, render } = useActionModal({
		withActionButton: true,
		fields: tariffFields,
		onSubmit: async (data: any) => {
			createTariffs(
				parseDate(data.startDate) || new Date(),
				parseDate(data.endDate) || new Date()
			)

			window.location.reload()
			return true
		},
		submitLabel: 'save',
	})
	const { pickData: updateTariffCostModal, render: renderTariffCost } =
		useActionModal({
			withActionButton: true,
			fields: tariffCostUpdateFields,
			onSubmit: async (data: any) => {
				const lang = localStorage.getItem('lang')

				// словари для разных языков
				const valueMap: Record<
					string,
					{ free: string; null: string; custom: string }
				> = {
					uz: {
						free: 'bepul',
						null: 'Oʻrnatilmagan',
						custom: 'Maxsus narx',
					},
					ru: {
						free: 'бесплатно',
						null: 'Не установлено',
						custom: 'Индивидуальная стоимость',
					},
					en: {
						free: 'free',
						null: 'no set',
						custom: 'custom',
					},
				}

				const currentLang = valueMap[lang || 'en']

				let finalValue: number
				switch (data.valueType) {
					case currentLang.free:
						finalValue = -1
						break
					case currentLang.null:
						finalValue = 0
						break
					case currentLang.custom:
						finalValue = Number(data.customValue) || 0
						break
					default:
						finalValue = 0
				}

				const { displayValue } = JSON.parse(
					localStorage.getItem('tariffCostUpdate') || '{}'
				)

				updateTariffCost(displayValue, finalValue)
				window.location.reload()
				return true
			},

			submitLabel: 'save',
		})
	const { pickData: updateDateOfTariff, render: renderTariffDate } =
		useActionModal({
			withActionButton: true,
			fields: tariffDateUpdateFields,
			onSubmit: async (data: any) => {
				updateTariff(
					parseDate(data.startDate) || new Date(),
					parseDate(data.endDate) || new Date()
				)
				window.location.reload()
				return true
			},
			submitLabel: 'save',
		})

	const pickConfirm = useConfirm({
		title: 'areYouSureDeleteTariff',
		msg: 'canRecreateTariff',
		canCancel: true,
	})

	const handleDeleteTariff = async () => {
		const result = await pickConfirm().toPromise()
		if (result) {
			await deleteTariffs()
			window.location.reload()
		}
	}
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

													updateDateOfTariff()
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
													handleDeleteTariff()
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
																						JSON.stringify({
																							group: tariff,
																							car,
																							displayValue: col,
																						})
																					)
																					updateTariffCostModal()
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
			{renderTariffDate()}
			{renderTariffCost()}
		</>
	)
}

export default Tariff
