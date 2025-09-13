import { FieldType, randomString, RoiView, type ICord } from 'react-declarative'
import type TypedField from 'react-declarative/model/TypedField'
import { pb } from '../../../../pb'
import type { ICords } from '../RoiView/functions'
import { Button } from '@mui/material'
import { updateCords } from '../../../api/carsSessions'
export function toICords(cords: ICord[]): ICords {
	if (!cords.length) return {} as ICords
	const first = cords[0]
	return {
		'bottom-left': {
			x: first.left,
			y: first.top + first.height,
		},
		'bottom-right': {
			x: first.left + first.width,
			y: first.top + first.height,
		},
		'top-left': { x: first.left, y: first.top },
		'top-right': {
			x: first.left + first.width,
			y: first.top,
		},
	}
}
const handleChange = (changed: ICord[], id: string) => {
	const transformed = toICords(changed)
	localStorage.setItem('smartCameraCords', JSON.stringify({ transformed, id }))
}

export const fields: TypedField[] = [
	{
		type: FieldType.Paper,
		fields: [
			{
				type: FieldType.Component,
				element: () => {
					return (
						<>
							После изменения сохраните, чтобы не потерять изменения. После
							сохранения изменений камера будет распознавать номера машин только
							в отмеченной области.
						</>
					)
				},
			},
		],
	},
	{
		type: FieldType.Component,
		element: (photo: any) => {
			return (
				<>
					<RoiView
						src={pb.files.getURL(
							photo.photo.photo.items[0],
							photo.photo.photo.items[0].entryPhoto
						)}
						onChange={changed => {
							handleChange(changed, photo.photo.cords.items[0].id)
						}}
						cords={[
							{
								type: 'rect',
								id: randomString(),
								top: photo.photo.cords.items[0].cords?.['top-left']?.y ?? 50,
								left:
									photo.photo.cords.items[0].cords?.['bottom-left']?.x ?? 50,
								height:
									(photo.photo.cords.items[0].cords?.['bottom-left']?.y ?? 50) -
									(photo.photo.cords.items[0].cords?.['top-left']?.y ?? 50),
								width:
									(photo.photo.cords.items[0].cords?.['top-right']?.x ?? 50) -
									(photo.photo.cords.items[0].cords?.['top-left']?.x ?? 50),
								color: '#EFE771',
								label: 'Площадь',
								angle: 0,
							},
						]}
					/>
				</>
			)
		},
	},
	{
		type: FieldType.Component,
		element: () => {
			return (
				<Button
					fullWidth
					variant='contained'
					onClick={() => {
						updateCords()
						alert('сохронено')
					}}
				>
					Сохранить
				</Button>
			)
		},
	},
]
