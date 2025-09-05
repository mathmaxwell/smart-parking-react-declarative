import { Box, CircularProgress } from '@mui/material'

const Loader = () => (
	<Box
		sx={{
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			height: '100vh',
			width: '100vw',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: 9999,
			background: theme => theme.palette.background.paper,
		}}
	>
		<CircularProgress />
	</Box>
)

export default Loader
