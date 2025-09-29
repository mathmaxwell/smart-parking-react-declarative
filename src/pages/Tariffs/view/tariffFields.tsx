import { Typography } from '@mui/material'
import { FieldType, type TypedField } from 'react-declarative'
import type { ICarGroup } from '../../../types/CarsInParking'

export const tariffFields: TypedField[] = [
	{
		type: FieldType.Component,
		element: () => {
			return (
				<>
					<Typography variant='body2' sx={{ textAlign: 'center' }}>
						{'selectPeriodForNewTariff'}
					</Typography>
				</>
			)
		},
	},
	{
		type: FieldType.Group,
		fieldRightMargin: '0',
		fields: [
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
		],
	},
]
export const tariffDateUpdateFields: TypedField[] = [
	{
		type: FieldType.Component,
		element: () => {
			return (
				<>
					<Typography variant='body2' sx={{ textAlign: 'center' }}>
						selectPeriodForNewTariff
					</Typography>
				</>
			)
		},
	},
	{
		type: FieldType.Group,
		fieldRightMargin: '0',
		fields: [
			{
				type: FieldType.Date,
				name: 'startDate',
				title: 'subscriptionFeeFrom',
				defaultValue: () => {
					const info = JSON.parse(localStorage.getItem('selectedTariff') || '')
					const today = new Date(info.start_Date)
					const day = String(today.getDate()).padStart(2, '0')
					const month = String(today.getMonth() + 1).padStart(2, '0')
					const year = today.getFullYear()
					return `${day}/${month}/${year}`
				},
			},
			{
				type: FieldType.Date,
				name: 'endDate',
				title: 'subscriptionEndDate',
				defaultValue: () => {
					const info = JSON.parse(localStorage.getItem('selectedTariff') || '')
					const today = new Date(info.end_Date)
					const day = String(today.getDate()).padStart(2, '0')
					const month = String(today.getMonth() + 1).padStart(2, '0')
					const year = today.getFullYear()
					return `${day}/${month}/${year}`
				},
			},
		],
	},
]
export const columns: (keyof ICarGroup)[] = [
	'first10Minutes',
	'from11To59for10',
	'after61',
	'first2hours',
	'from2Hour',
	'hour',
	'day',
	'month',
]
export const order: ['others', 'bus', 'worker', 'tenant', 'whiteList'] = [
	'others',
	'bus',
	'worker',
	'tenant',
	'whiteList',
]
const lang = localStorage.getItem('lang')
const translations =
	lang === 'uz'
		? { free: 'bepul', null: 'Oʻrnatilmagan', custom: 'Maxsus narx' }
		: lang === 'ru'
		? {
				free: 'бесплатно',
				null: 'Не установлено',
				custom: 'Индивидуальная стоимость',
		  }
		: { free: 'free', null: 'no set', custom: 'custom' }

export const tariffCostUpdateFields: TypedField[] = [
	{
		type: FieldType.Combo,
		name: 'valueType',
		title: 'valueType',
		itemList: Object.values(translations),
	},
	{
		type: FieldType.Text,
		name: 'customValue',
		title: 'price',
		inputType: 'number',
		isVisible: ({ valueType }) => valueType === translations.custom,
		isInvalid: ({ customValue, valueType }) => {
			if (valueType !== translations.custom) return null
			if (!customValue || customValue === '') {
				return 'requiredField'
			}
			if (Number(customValue) < 0) {
				return 'positiveNumberRequired'
			}
			return null
		},
	},
]
