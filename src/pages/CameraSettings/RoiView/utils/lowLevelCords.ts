import { rect, roi } from '../js/rio'

import type ICord from '../model/ICord'

export const lowLevelCords = (
	cords: ICord[],
	naturalHeight = 100,
	naturalWidth = 100
) =>
	cords.map(({ id, type, height, width, top, left, color, label, angle }) =>
		type === 'rect'
			? rect(id, top, left, height, width, angle, color, label)
			: type === 'roi'
			? roi(
					top,
					left,
					naturalWidth - left - width,
					naturalHeight - top - height,
					color
			  )
			: (console.error('lowLevelCords invalid cord type', type) as never)
	)

export default lowLevelCords
