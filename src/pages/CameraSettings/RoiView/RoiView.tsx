import * as React from 'react'
import { forwardRef, useMemo } from 'react'

import Content from './components/Content'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import type { PaperProps } from '@mui/material/Paper'
import type ICord from './model/ICord'

import useActualCallback from './hooks/useActualCallback'
import useAsyncValue from './hooks/useAsyncValue'

import { CONTROL_RECT } from './js/area-selector'

import readSize from './utils/readSize'

interface IRoiViewProps
	extends Omit<
		PaperProps,
		keyof {
			onChange: never
			onClick: never
		}
	> {
	withNaturalSize?: boolean
	imageSize?: {
		naturalHeight: number
		naturalWidth: number
	}
	src: string
	readonly?: boolean
	cords: ICord[]
	onChange?: (cords: ICord[]) => void
	onClick?: (e: React.MouseEvent<HTMLDivElement>, id: string) => void
	onHover?: (e: React.MouseEvent<HTMLDivElement>, id: string) => void
	onLoadStart?: () => void
	onLoadEnd?: (isOk: boolean) => void
}

const RoiViewInternal = (
	{
		withNaturalSize = false,
		imageSize,
		className,
		src,
		cords: upperCords,
		readonly = false,
		onLoadStart,
		onLoadEnd,
		sx,
		onChange = () => undefined,
		onClick = () => undefined,
		onHover = () => undefined,
		...otherProps
	}: IRoiViewProps,
	ref: React.Ref<HTMLDivElement>
) => {
	const onChange$ = useActualCallback(onChange)
	const onClick$ = useActualCallback(onClick)
	const onHover$ = useActualCallback(onHover)

	const [value, { error }] = useAsyncValue(
		async () => {
			if (imageSize) {
				return imageSize
			}
			return await readSize(src)
		},
		{
			onLoadStart,
			onLoadEnd,
		}
	)

	const cords = useMemo(() => {
		let seen = new Set()
		return upperCords.filter(cord => {
			return seen.has(cord.id) ? false : seen.add(cord.id)
		})
	}, [upperCords])

	const renderInner = () => {
		if (value) {
			return (
				<Content
					cords={cords}
					naturalHeight={value.naturalHeight}
					naturalWidth={value.naturalWidth}
					onChange={onChange$}
					onClick={onClick$}
					onHover={onHover$}
					readonly={readonly}
					src={src}
				/>
			)
		} else if (error) {
			return <Typography>Error aquired while fetching image</Typography>
		} else {
			return <Typography>Loading...</Typography>
		}
	}

	return (
		<Paper
			ref={ref}
			sx={{
				...(readonly && {
					[`& .${CONTROL_RECT}`]: {
						display: 'none;',
					},
				}),
				display: 'flex',
				'& > *': {
					width: '100%',
				},
				'& .react-declarative__roiAreaRect': {
					color: 'white',
				},
				...(withNaturalSize && {
					height: imageSize ? imageSize.naturalHeight : value?.naturalHeight,
					width: imageSize ? imageSize.naturalWidth : value?.naturalWidth,
				}),
				...sx,
			}}
			className={className}
			{...otherProps}
		>
			{renderInner()}
		</Paper>
	)
}

export const RoiView = forwardRef<HTMLDivElement, IRoiViewProps>(
	RoiViewInternal
)

export default RoiView
