export const rect = (
	entityId: string = 'rect-unset-id',
	top: number = 10,
	left: number = 10,
	height: number = 125,
	width: number = 125,
	angle: number = 0,
	lineColor: string = 'cyan',
	label: string = '',
	imageSrc: string = '',
	backgroundColor: string = 'rgba(0, 0, 0, 0.5)'
): (string | number)[] => [
	'rect',
	entityId,
	top,
	left,
	height,
	width,
	angle,
	imageSrc,
	lineColor,
	label,
	backgroundColor,
]

export const roi = (
	top: number = 10,
	left: number = 10,
	right: number = 10,
	bottom: number = 10,
	lineColor: string = 'blue',
	backgroundColor: string = 'rgba(0, 0, 0, 0.5)'
): (string | number)[] => [
	'roi',
	top,
	left,
	right,
	bottom,
	lineColor,
	backgroundColor,
]
