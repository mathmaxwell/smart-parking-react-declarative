import { Typography } from '@mui/material'
import { FieldType, type TypedField } from 'react-declarative'

export const tariffFields: TypedField[] = [
	{
		type: FieldType.Component,
		element: () => {
			return (
				<>
					<Typography variant='body2' sx={{ textAlign: 'center' }}>
						subscriptionNote
					</Typography>
				</>
			)
		},
	},
	{
		type: FieldType.Group,
		fieldRightMargin: '0',
		fields: [
			{ type: FieldType.Text, name: 'PlateNumber', title: 'plateNumber' },
			{ type: FieldType.Text, name: 'ownerName', title: 'companyName' },

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
				type: FieldType.Time,
				name: 'startTime',
				title: 'subscriptionFeeFrom',
				defaultValue: '00:00',
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
			{
				type: FieldType.Time,
				name: 'endTime',
				title: 'subscriptionEndDate',
				defaultValue: '23:59',
			},
		],
	},
]
