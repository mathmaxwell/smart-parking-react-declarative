import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

export const UserInfo = () => (
	<Grid container spacing={1}>
		<Grid item>
			<Avatar
				alt='Anonymous'
				imgProps={{
					crossOrigin: 'anonymous',
				}}
			/>
		</Grid>
		<Grid item xs>
			<Stack justifyContent='center' height='100%'>
				<Typography>Admin</Typography>
			</Stack>
		</Grid>
	</Grid>
)

export default UserInfo
