import type ICord from './model/ICord'

export interface IXYCords {
	x: number
	y: number
}

export interface ICords {
	'top-left': IXYCords
	'top-right': IXYCords
	'bottom-left': IXYCords
	'bottom-right': IXYCords
}
export interface ICordsOfBack {
	id: string
	cords: ICords
}
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
