import { Box, Button, Typography } from '@mui/material'
import { FieldType } from 'react-declarative'
import type TypedField from 'react-declarative/model/TypedField'
import history from '../../../helpers/history'

export const header: TypedField[] = [
	{
		type: FieldType.Component,
		element: () => (
			<Box
				sx={{
					textAlign: 'center',
					borderBottom: '1px solid',
					borderColor: 'divider',
					pb: 2,
					position: 'relative',
				}}
			>
				<Button
					sx={{ position: 'absolute', top: 0, right: 0 }}
					onClick={e => {
						history.replace(`/cars_sessions`)
						e.stopPropagation()
						window.location.reload()
					}}
				>
					назад
				</Button>
				<Typography variant='h5' component='h2' sx={{ fontWeight: 600 }}>
					история
				</Typography>
			</Box>
		),
	},
]
