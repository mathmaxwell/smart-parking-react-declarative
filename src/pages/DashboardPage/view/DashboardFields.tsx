import { FieldType } from 'react-declarative'
import type TypedField from 'react-declarative/model/TypedField'

export const filters: TypedField[] = [
	{
		type: FieldType.Paper,
		fields: [
			{
				type: FieldType.Group,
				phoneColumns: '12',
				tabletColumns: '12',
				desktopColumns: '6',
				fieldRightMargin: '4',
				fields: [
					{
						type: FieldType.Group,
						phoneColumns: '12',
						tabletColumns: '12',
						desktopColumns: '6',

						fields: [
							{
								type: FieldType.Date,
								name: 'startDate',
								title: 'start date',
							},
							{
								type: FieldType.Time,
								name: 'startTime',
								title: 'start time',
								defaultValue: '00:00',
							},
						],
					},
					{
						type: FieldType.Group,
						phoneColumns: '12',
						tabletColumns: '12',
						desktopColumns: '6',
						fields: [
							{
								type: FieldType.Date,
								name: 'endDate',
								title: 'end date',
							},
							{
								type: FieldType.Time,
								name: 'endTime',
								title: 'end time',
								defaultValue: '23:59',
							},
						],
					},
				],
			},
			{
				type: FieldType.Group,
				phoneColumns: '12',
				tabletColumns: '12',
				desktopColumns: '6',

				fields: [
					{
						type: FieldType.Group,
						columns: '6',
						fieldRightMargin: '1',
						fields: [
							{
								type: FieldType.Button,
								name: 'today',
								title: 'forToday',
							},
							{
								type: FieldType.Button,
								name: 'week',
								title: 'forAWeek',
							},
						],
					},
					{
						type: FieldType.Group,
						columns: '6',
						fields: [
							{
								type: FieldType.Button,
								name: 'month',
								title: 'за месяц',
							},
							{
								type: FieldType.Button,
								name: 'year',
								title: 'forAYear',
							},
						],
					},
				],
			},
		],
	},
]
