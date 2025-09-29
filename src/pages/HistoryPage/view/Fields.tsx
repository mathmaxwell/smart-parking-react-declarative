import { Box, IconButton, Typography } from '@mui/material'
import { FieldType } from 'react-declarative'
import type TypedField from 'react-declarative/model/TypedField'
import history from '../../../helpers/history'
import UndoIcon from '@mui/icons-material/Undo'
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
				<IconButton
					sx={{ position: 'absolute', top: 0, left: 0 }}
					onClick={e => {
						history.replace(`/cars_sessions`)
						e.stopPropagation()
						window.location.reload()
					}}
				>
					<UndoIcon />
					{'back'}
				</IconButton>
				<Typography variant='h5' component='h2' sx={{ fontWeight: 600 }}>
					{'history'}
				</Typography>
			</Box>
		),
	},
]
